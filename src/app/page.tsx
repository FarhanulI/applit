"use client";

import {
  CheckCircle,
  Star,
  Users,
  FileText,
  Zap,
  Globe,
  Award,
  ArrowRight,
  Upload,
  Target,
} from "lucide-react";
import { Pricing } from "./dashboard/_components/pricing";
import UploadSuccessPopup from "@/modals/uploadFileSuccessModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { stringify } from "querystring";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "German Format Standards",
      description:
        "Your CV will be corrected to meet strict German professional formatting requirements and cultural expectations.",
      color: "text-emerald-600",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Professional Translation",
      description:
        "Expert German translation to ensure your CV communicates your qualifications effectively to German employers.",
      color: "text-blue-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Unlimited Updates",
      description:
        "Make changes and get unlimited revisions to your corrected CV. Perfect your application over time.",
      color: "text-purple-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "ATS Optimization",
      description:
        "Optimize your CV for Applicant Tracking Systems used by German companies to ensure it gets seen.",
      color: "text-orange-600",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional CV Correction Service
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your CV professionally corrected with our comprehensive 4-step
            process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-center"
            >
              <div
                className={`inline-flex p-4 rounded-xl bg-gray-50 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      title: "Upload Your CV",
      description: "Upload your existing CV in any format (PDF, Word, etc.)",
    },
    {
      step: "2",
      title: "Professional Review",
      description: "Our experts review and correct your CV to German standards",
    },
    {
      step: "3",
      title: "Get Your Corrected CV",
      description:
        "Receive your professionally corrected CV with detailed feedback",
    },
    {
      step: "4",
      title: "Unlimited Revisions",
      description: "Make changes and get unlimited updates whenever needed",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple 4-step process to get your CV professionally corrected
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-30"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Anna Schmidt",
      role: "Marketing Manager",
      company: "Deutsche Bank",
      content:
        "The CV correction service transformed my application. The German formatting and professional translation made all the difference!",
      avatar: "AS",
      rating: 5,
    },
    {
      name: "Roberto Silva",
      role: "Software Developer",
      company: "Volkswagen",
      content:
        "Outstanding service! My corrected CV got past all ATS systems and I received multiple interview invitations within weeks.",
      avatar: "RS",
      rating: 5,
    },
    {
      name: "Lisa Chen",
      role: "Project Manager",
      company: "Siemens",
      content:
        "The unlimited revisions feature is amazing. I kept updating my CV and they corrected it every time. Highly recommended!",
      avatar: "LC",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how our CV correction service helped professionals land jobs in
            Germany
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Perfect Your CV?
        </h2>
        <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
          Get your CV professionally corrected to German standards with
          unlimited revisions for just €29.99
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Your CV Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300">
            See Before & After Examples
          </button>
        </div>

        <p className="text-emerald-100 text-sm mt-6">
          One-time payment €29.99 • Unlimited revisions • German standards
          guaranteed
        </p>
      </div>
    </section>
  );
};

export default function Home() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [fileName, setFileName] = useState("");
  
  return (
    <>
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-20 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
              <Target className="w-4 h-4 mr-2" />
              Professional CV Correction Service
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Get Your CV Professionally
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                {" "}
                Corrected
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your existing CV to meet German professional standards.
              Expert correction, professional translation, and ATS optimization
              - all in one service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div className="relative">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    console.log({ files: e.target.files });
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();

                      reader.onload = function (event) {
                        const base64 = event.target?.result;

                        // Save base64 string in sessionStorage
                        sessionStorage.setItem("cvFileBase64", base64 as string);
                        sessionStorage.setItem("cvFileName", file.name);

                        console.log("File saved to sessionStorage");
                        setFileName(file.name);
                        setShowPopup(true);
                      };

                      reader.readAsDataURL(file); // Converts file to base64 string
                    }
                  }}
                />
                <label
                  htmlFor="cv-upload"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center cursor-pointer"
                >
                  Upload Your CV & Start
                  <ArrowRight className="w-5 h-5 ml-2" />
                </label>
              </div>

              <UploadSuccessPopup
                onClose={() => setShowPopup(false)}
                isOpen={showPopup}
                fileName={fileName}
                onRegister={() => router.push("/auth/sign-up")}
              />

              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                See Sample Corrections
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                One-time Payment €29.99
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                Unlimited Updates & Revisions
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                German Format Standards
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <HowItWorksSection />

      <Pricing />

      <TestimonialsSection />
      <CTASection />
    </>
  );
}
