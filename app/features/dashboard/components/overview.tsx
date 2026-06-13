import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Upload,
  Database,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "~/components/ui/button";

export function DashboardOverview() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const mainSteps = [
    {
      number: "1",
      title: "Upload Transkrip Rapat",
      description: "Upload file transkrip meeting atau rapat Anda dalam format teks atau PDF",
      icon: Upload,
      color: "blue",
      detail: "Sistem kami mendukung berbagai format dokumen dan dapat memproses transkrip dalam jumlah besar"
    },
    {
      number: "2",
      title: "Simpan di Vector Database",
      description: "Transkrip diubah menjadi vector embeddings dan disimpan untuk pencarian cepat",
      icon: Database,
      color: "purple",
      detail: "Menggunakan AI untuk mengubah teks menjadi representasi numerik yang dapat dicari secara semantik"
    },
    {
      number: "3",
      title: "Tanya Chatbot AI",
      description: "Ajukan pertanyaan apapun tentang transkrip, dapatkan jawaban dari AI",
      icon: MessageSquare,
      color: "green",
      detail: "Chatbot RAG mengambil konteks relevan dari database dan menghasilkan jawaban yang akurat"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-500",
        light: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        gradient: "from-blue-500 to-blue-600"
      },
      purple: {
        bg: "bg-purple-500",
        light: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        gradient: "from-purple-500 to-purple-600"
      },
      green: {
        bg: "bg-green-500",
        light: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
        gradient: "from-green-500 to-green-600"
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Welcome back to Notuly
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Your RAG-powered AI assistant for meeting transcripts. Upload, analyze, and get insights in seconds.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/transcripts/upload" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Transcript
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Upload meeting transcripts to get started
                  </p>
                </div>
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>

          <Link to="/ai/new" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    AI Assistant
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Ask questions about your transcripts
                  </p>
                </div>
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Main Flow - 3 Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How it works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainSteps.map((step, index) => {
              const colors = getColorClasses(step.color);
              const isActive = currentStep === index;

              return (
                <div key={index} className="relative">
                  <div
                    className={`
                      relative bg-white dark:bg-gray-800 rounded-2xl p-6 transition-all duration-500
                      ${isActive ? `shadow-xl scale-105` : 'shadow-md'}
                    `}
                  >
                    {/* Step Number Badge */}
                    <div className={`
                      absolute -top-4 left-6
                      w-10 h-10 rounded-full ${colors.bg} text-white
                      flex items-center justify-center text-lg font-bold shadow-lg
                      transition-transform duration-500
                    `}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`
                      mt-6 mb-4 flex justify-center
                      transition-transform duration-500
                    `}>
                      <div className={`p-4 rounded-xl ${colors.light} dark:bg-${colors.bg.split('-')[1]}-900/20`}>
                        <step.icon className={`w-8 h-8 ${colors.text} dark:text-${colors.bg.split('-')[1]}-400`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-3">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                      <div className={`
                        mt-4 p-3 rounded-lg text-xs ${colors.light} dark:bg-gray-700/50
                        ${isActive ? 'opacity-100' : 'opacity-70'}
                        transition-opacity duration-500
                      `}>
                        <p className={`${colors.text} dark:text-gray-300`}>
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow between steps */}
                  {index < mainSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className={`
                        w-6 h-6
                        ${currentStep > index ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}
                        transition-colors duration-500
                      `} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-2">
          {mainSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`
                h-2.5 rounded-full transition-all duration-500
                ${index === currentStep ? 'w-10 bg-blue-600 dark:bg-blue-500' : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}
              `}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Multiple Formats</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Support for text, PDF, and more</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Fast Processing</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Get results in seconds</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">AI Powered</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Advanced RAG technology</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to get started?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Upload your first transcript and discover the power of AI-assisted meeting analysis
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/transcripts/upload">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold inline-flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Now
              </Button>
            </Link>
            <Link to="/ai/new">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Try AI Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}