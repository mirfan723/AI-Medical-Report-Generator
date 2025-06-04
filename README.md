# AI Medical Diagnosis Application

This application uses OCR technology and AI to analyze medical reports and provide diagnoses with treatment recommendations.

## Features

- Upload medical report images
- Extract text using OCR technology
- Process medical data with AI models
- Generate detailed diagnosis and treatment plans
- Export results as PDF
- Responsive design for all devices

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Flask Python API
- **OCR**: pytesseract
- **PDF Generation**: jsPDF (client-side) and FPDF (server-side)
- **API Integration**: Hugging Face models

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Tesseract OCR installed on your system

### Setup

1. **Install frontend dependencies**

```bash
npm install
```

2. **Install backend dependencies**

```bash
cd api
pip install -r requirements.txt
```

3. **Start the development server**

```bash
npm start
```

This command will start both the React frontend and Flask backend concurrently.

## Installation Requirements

### Tesseract OCR

- **Windows**: Download and install the [Tesseract installer](https://github.com/UB-Mannheim/tesseract/wiki)
- **macOS**: `brew install tesseract`
- **Linux**: `sudo apt-get install tesseract-ocr`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
HUGGINGFACE_API_KEY=your_api_key_here
```

## License

MIT