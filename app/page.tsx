import {
  Calendar,
  Mail,
  BarChart,
  FileText,
  Clock,
  Brain,
  MessageSquare,
  Sparkles,
  BarChart3,
  Home as HomeIcon,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Calendar Management",
    description:
      "AI-powered scheduling and appointment management. Never miss a client meeting or property showing again.",
    icon: Calendar,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    href: "/calendar",
  },
  {
    title: "Email Assistant",
    description:
      "Smart inbox organization, AI-powered drafting, and follow-up reminders. Stay on top of client communications effortlessly.",
    icon: Mail,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    href: "/email",
  },
  {
    title: "Market Analysis",
    description:
      "Real-time property market trends from Redfin and Zillow. Make data-driven decisions with comprehensive market insights.",
    icon: BarChart,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    href: "/market-analysis",
  },
  {
    title: "Client Reports",
    description:
      "Generate beautiful, data-rich property comparison reports with visualizations that impress your clients and close deals faster.",
    icon: FileText,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    href: "/reports",
  },
  {
    title: "Document Management",
    description:
      "Securely store, organize, and share real estate documents with clients using Google Drive integration.",
    icon: FileText,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    href: "/documents",
  },
];

const benefits = [
  {
    title: "Save 10+ Hours Weekly",
    description: "Automate repetitive tasks and focus on what matters most - building client relationships and closing deals.",
    icon: Clock,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "AI-Powered Insights",
    description: "Leverage advanced AI to analyze market trends, predict property values, and identify opportunities for your clients.",
    icon: Brain,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Personalized Client Communication",
    description: "Create tailored, professional communications that resonate with clients and showcase your expertise.",
    icon: MessageSquare,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    title: "Competitive Edge",
    description: "Stay ahead of the competition with cutting-edge tools that help you provide exceptional service to your clients.",
    icon: Sparkles,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-10 text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center">
              <HomeIcon className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI-Powered{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Real Estate Assistant
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your real estate business with AI tools that handle time-consuming tasks, 
              analyze market trends, and create impressive client reports.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Tools for Real Estate Professionals
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  href={feature.href}
                  key={index}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Our AI Assistant Benefits Your Business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${benefit.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${benefit.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-0 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            Join thousands of real estate professionals leveraging AI to save time, 
            impress clients, and close more deals.
          </p>
          <Link 
            href="/dashboard" 
            className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
