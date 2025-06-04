import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Stethoscope, Lock, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16 md:py-24">
        <div className="container-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                AI-Powered Medical Report Analysis
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-50">
                Upload your medical reports and get instant AI diagnosis and treatment recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/diagnosis" 
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Start Diagnosis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a 
                  href="#how-it-works" 
                  className="inline-flex items-center px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-primary-600 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img 
                src="https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Medical professional with tablet" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50" id="how-it-works">
        <div className="container-lg">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              How It Works
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform simplifies medical report analysis in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-10 w-10 text-primary-500" />,
                title: "Upload Your Report",
                description: "Simply drag & drop your medical report image into our secure platform.",
                delay: 0
              },
              {
                icon: <Stethoscope className="h-10 w-10 text-secondary-500" />,
                title: "AI Analysis",
                description: "Our advanced AI extracts and analyzes the medical data from your report.",
                delay: 0.2
              },
              {
                icon: <FileText className="h-10 w-10 text-accent-500" />,
                title: "Get Your Diagnosis",
                description: "Receive a detailed diagnosis with treatment options and next steps.",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="bg-white rounded-lg p-6 shadow-md text-center"
              >
                <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="container-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits of AI Diagnosis</h2>
              <ul className="space-y-4">
                {[
                  "Get immediate insights without waiting for appointments",
                  "Receive objective analysis based on thousands of similar cases",
                  "Export and share results easily with your healthcare provider",
                  "Understand complex medical terminology with simplified explanations",
                  "Take control of your health with actionable recommendations"
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="mr-3 mt-1 text-green-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <Link 
                  to="/diagnosis" 
                  className="btn btn-primary"
                >
                  Start Your Analysis
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Doctor reviewing digital medical data" 
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Security Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-lg">
          <div className="text-center mb-12">
            <Lock className="h-12 w-12 text-accent-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Data Security Is Our Priority</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We use industry-leading security practices to ensure your medical data remains private and protected
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "End-to-End Encryption",
                description: "All your medical reports are encrypted during transmission and storage."
              },
              {
                title: "Data Privacy",
                description: "We don't store your medical data after processing unless you explicitly choose to save it."
              },
              {
                title: "HIPAA Compliance",
                description: "Our platform adheres to healthcare industry security standards and regulations."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-3 text-accent-300">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-accent-500 to-accent-700 text-white">
        <div className="container-sm text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Get Your AI Medical Diagnosis?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8 text-accent-50"
          >
            Take the first step towards understanding your medical reports better.
            Our AI is ready to assist you 24/7.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              to="/diagnosis" 
              className="inline-flex items-center px-8 py-4 bg-white text-accent-700 rounded-md font-medium text-lg hover:bg-gray-100 transition-colors"
            >
              Start Diagnosis Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;