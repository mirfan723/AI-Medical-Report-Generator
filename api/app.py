from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import tempfile
import json
from PIL import Image
import pytesseract
import io
from fpdf import FPDF
import requests
from datetime import datetime
import zipfile
import shutil
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_chroma import Chroma
from langchain_core.documents import Document
from datasets import load_dataset
import PyPDF2
app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = tempfile.gettempdir()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload size

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp', 'webp'}
MODEL_EXTENSIONS = {'zip'}

# Model directory
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# Initialize LLM and embeddings
model = OllamaLLM(model="mistral")
embeddings = OllamaEmbeddings(model="nomic-embed-text")
# Initialize vector stores
db_location = os.path.join(MODEL_DIR, "chroma_langchain_db")

# Check if the database directory exists
if not os.path.exists(db_location):
    print("Creating new vector database...")
    # Load datasets
    df_1 = load_dataset("leowei31/MIMIC_IV_lab_test_individual", split="train").to_pandas()
    df_2 = load_dataset("ruslanmv/ai-medical-chatbot", split="train").to_pandas()
    
    # Process first dataset
    documents_1 = []
    ids_1 = []
    for i, row in df_1.iterrows():
        documents_1.append(Document(page_content=row["input"], metadata={"source": row["target"]}))
        ids_1.append(f"mimic_{i}")
    
    # Process second dataset
    documents_2 = []
    ids_2 = []
    for i, row in df_2.iterrows():
        documents_2.append(Document(
            page_content=f"Symptoms: {row['Patient']}\nDoctor's Notes: {row['Doctor']}",
            metadata={"query": row["Description"], "patient_notes": row["Patient"], "Doctor": row["Doctor"]}
        ))
        ids_2.append(f"chatbot_{i}")
    
    # Create vector stores and add documents
    vector_store_1 = Chroma(
        collection_name="mimic_iv_lab_test_individual",
        embedding_function=embeddings,
        persist_directory=db_location,
    )
    vector_store_1.add_documents(documents=documents_1, ids=ids_1)
    
    vector_store_2 = Chroma(
        collection_name="ai_medical_chatbot",
        embedding_function=embeddings,
        persist_directory=db_location,
    )
    vector_store_2.add_documents(documents=documents_2, ids=ids_2)
else:
    print("Loading existing vector database...")
    # Load existing vector stores
    vector_store_1 = Chroma(
        collection_name="mimic_iv_lab_test_individual",
        embedding_function=embeddings,
        persist_directory=db_location,
    )
    
    vector_store_2 = Chroma(
        collection_name="ai_medical_chatbot",
        embedding_function=embeddings,
        persist_directory=db_location,
    )

# Create retrievers
retriever_1 = vector_store_1.as_retriever(search_kwargs={"k": 3})
retriever_2 = vector_store_2.as_retriever(search_kwargs={"k": 3})

# Setup prompt template
template = """
You are an expert medical assistant. Based on the following patient data and retrieved medical documents, generate a detailed, structured medical report in SOAP format.

Patient Input:
{patient_input}

Relevant Medical Information:
{retrieved_context_1}
{retrieved_context_2}

Please provide the report with these sections:

Subjective:
- Patient's symptoms and complaints

Assessment:
- Possible diagnoses or clinical impressions

Plan:
- Recommended tests, treatments, and next steps

Write clearly and professionally.
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/api/upload-model', methods=['POST'])
def upload_model():
    """Upload and extract a model zip file"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename, MODEL_EXTENSIONS):
        try:
            # Save zip file temporarily
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(temp_path)
            
            # Clear existing model directory
            shutil.rmtree(MODEL_DIR)
            os.makedirs(MODEL_DIR)
            
            # Extract zip to model directory
            with zipfile.ZipFile(temp_path, 'r') as zip_ref:
                zip_ref.extractall(MODEL_DIR)
            
            # Clean up temp file
            os.unlink(temp_path)
            
            return jsonify({
                'success': True,
                'message': 'Model uploaded and extracted successfully'
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    
    return jsonify({'success': False, 'error': 'File type not allowed'}), 400

@app.route('/api/ocr', methods=['POST'])
def process_image():
    """Process an uploaded image and extract text using OCR"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename, ALLOWED_EXTENSIONS):
        try:
            # Save the file temporarily
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Process the image with OCR
            image = Image.open(filepath)
            text = pytesseract.image_to_string(image)
            
            # Clean up the file
            os.unlink(filepath)
            
            return jsonify({
                'success': True,
                'text': text
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    
    return jsonify({'success': False, 'error': 'File type not allowed'}), 400

@app.route('/api/diagnosis', methods=['POST'])
def get_diagnosis():
    """Get diagnosis prediction based on extracted text"""
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'success': False, 'error': 'No text provided'}), 400
        
        extracted_text = data['text']
        
        # Retrieve relevant documents
        retrieved_docs_1 = retriever_1.invoke(extracted_text)
        retrieved_docs_2 = retriever_2.invoke(extracted_text)
        
        # Generate diagnosis using the model
        result = chain.invoke({
            "patient_input": extracted_text,
            "retrieved_context_1": retrieved_docs_1,
            "retrieved_context_2": retrieved_docs_2
        })
        print("yippee",result)
        
        # Parse the result into the expected format
        # This is a simplified parsing - you might need to adjust based on actual output
        diagnosis_result = {
            'disease': 'Medical Condition (AI Analysis)',
            'confidence': 0.89,  # You might want to extract this from the model
            'severity': 'moderate',
            'treatment': result,  # The full SOAP format output
            'precautions': [
                'Follow the recommended treatment plan',
                'Monitor symptoms closely',
                'Schedule follow-up appointments as advised',
                'Report any significant changes in condition'
            ],
            'additionalInfo': 'This diagnosis is based on AI analysis of your medical report and similar cases.'
        }
        
        return jsonify({**diagnosis_result, 'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    """Generate a PDF report from diagnosis data"""
    try:
        data = request.json
        
        if not data or 'diagnosisData' not in data or 'extractedText' not in data:
            return jsonify({'success': False, 'error': 'Missing required data'}), 400
        
        diagnosis_data = data['diagnosisData']
        extracted_text = data['extractedText']
        
        # Create a PDF
        pdf = FPDF()
        pdf.add_page()
        
        # Add title
        pdf.set_font('Arial', 'B', 16)
        pdf.cell(0, 10, 'Medical Diagnosis Report', 0, 1, 'C')
        
        # Add date
        pdf.set_font('Arial', '', 10)
        pdf.cell(0, 10, f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 0, 1, 'R')
        
        # Add diagnosis
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Diagnosis:', 0, 1)
        pdf.set_font('Arial', '', 12)
        pdf.multi_cell(0, 10, f"{diagnosis_data['disease']} (Confidence: {int(diagnosis_data['confidence']*100)}%)")
        
        # Add severity
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Severity:', 0, 1)
        pdf.set_font('Arial', '', 12)
        pdf.multi_cell(0, 10, diagnosis_data['severity'].capitalize())
        
        # Add treatment
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Recommended Treatment:', 0, 1)
        pdf.set_font('Arial', '', 12)
        pdf.multi_cell(0, 10, diagnosis_data['treatment'])
        
        # Add precautions
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Precautions:', 0, 1)
        pdf.set_font('Arial', '', 12)
        for precaution in diagnosis_data['precautions']:
            pdf.multi_cell(0, 10, f"• {precaution}")
        
        # Add extracted text
        pdf.add_page()
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Extracted Text from Report:', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.multi_cell(0, 10, extracted_text)
        
        # Add disclaimer
        pdf.set_font('Arial', 'I', 8)
        pdf.cell(0, 10, 'DISCLAIMER: This AI-generated diagnosis is for informational purposes only', 0, 1)
        pdf.cell(0, 10, 'and should not replace professional medical advice.', 0, 1)
        
        # Save PDF to a temporary file
        temp_pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], 'diagnosis_report.pdf')
        pdf.output(temp_pdf_path)
        
        # Send the file
        return send_file(
            temp_pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='diagnosis_report.pdf'
        )
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
# Add this new API endpoint
PDF_EXTENSIONS = {'pdf'}

# Add these helper functions to your code
def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Process each page
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n\n"
        
        # Clean up any excessive whitespace
        text = " ".join(text.split())
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def process_medical_text(text):
    """Process extracted text to identify key medical information"""
    # This is a simple example - in a real app, you might use NLP to extract entities,
    # classify text into medical categories, etc.
    
    # For now, we'll just do some basic formatting and cleaning
    lines = text.split('\n')
    formatted_text = ""
    
    for line in lines:
        line = line.strip()
        if line:
            # Look for common medical report headers and emphasize them
            lower_line = line.lower()
            if any(keyword in lower_line for keyword in ['diagnosis', 'assessment', 'history', 'medication', 'symptoms', 'vitals', 'lab results']):
                formatted_text += f"### {line} ###\n"
            else:
                formatted_text += f"{line}\n"
    
    return formatted_text
@app.route('/api/process-pdf', methods=['POST'])
def process_pdf():
    """Process an uploaded PDF and extract text"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename, PDF_EXTENSIONS):
        try:
            # Save the file temporarily
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Extract text from PDF
            raw_text = extract_text_from_pdf(filepath)
            
            # Process the extracted text to format it for medical analysis
            processed_text = process_medical_text(raw_text)
            
            # Clean up the file
            os.unlink(filepath)
            
            # Return both raw and processed text
            return jsonify({
                'success': True,
                'text': raw_text
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    
    return jsonify({'success': False, 'error': 'File type not allowed'}), 400
if __name__ == '__main__':
    app.run(debug=True)