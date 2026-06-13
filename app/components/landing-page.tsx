import React from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Mic, Podcast, Sun, Moon, MessageSquare, FileText, Sparkles } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";

const navigationItems = [
  { label: "About", href: "#about" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function LandingPage() {
  return (
    <div className="bg-notuly-light dark:bg-background w-full min-h-screen relative">
      {/* Background Pattern SVG */}
      <div
        className="absolute inset-0 opacity-60 "
        style={{
          backgroundImage: `url('/assets/images/img_bg_landing_page.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* Navigation */}
      <nav className="flex w-full max-w-5xl mx-auto items-center justify-between px-4 py-3 absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/10 dark:bg-gray-900/40 backdrop-blur-md rounded-full shadow-lg z-50">
        {/* Logo */}
        <div className="inline-flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#034391] to-[#0256b8] rounded-xl flex items-center justify-center shadow-lg">
            <Podcast className="w-6 h-6 text-white" />
          </div>
          <div className="font-bold text-gray-900 dark:text-white text-2xl font-jakarta">Notuly</div>
        </div>

        {/* Center Navigation */}
        <div className="hidden lg:inline-flex items-center gap-8">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="font-medium text-gray-700 dark:text-white/80 text-sm hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:underline underline-offset-4 font-jakarta"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="inline-flex items-center gap-3">
          <ThemeToggle />
          <Button className="px-6 py-2.5 bg-gradient-to-r from-[#034391] to-[#0256b8] hover:from-[#023068] hover:to-[#014a8f] rounded-full text-white font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl font-jakarta">
            <Link to="/login" className="no-underline text-white">
              Login
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center gap-6 absolute top-[167px] left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        <div className="inline-flex flex-col items-center gap-3">
          <Badge className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-[#E9E9E9] dark:bg-muted/80 backdrop-blur-sm rounded-full text-notuly-text-primary dark:text-muted-foreground hover:bg-[#E9E9E9]/80 dark:hover:bg-muted border-none">
            <img className="w-8 h-8" alt="Shield Icon" src="/assets/icons/ic_shield.svg" />
            <span className="font-medium text-notuly-text-primary dark:text-muted-foreground text-base font-jakarta">
              Smart Notes, Smart Meeting
            </span>
          </Badge>

          <div className="inline-flex flex-col items-center gap-4">
            <h1 className="w-full max-w-4xl font-bold text-notuly-text-primary dark:text-foreground text-3xl md:text-5xl lg:text-[54px] text-center leading-tight md:leading-[67px] font-jakarta px-4">
              Revolutionizing Communication for a Better Tomorrow, Today
            </h1>

            <p className="w-full max-w-md font-normal text-notuly-text-secondary dark:text-muted-foreground text-base text-center font-jakarta px-4">
              AI-powered service that transcribes and summarizes speeches or
              meetings, transforming spoken words into clear and structured
              minutes.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center justify-center gap-4">
          <Button className="inline-flex items-center justify-center gap-2.5 px-6 md:px-8 py-4 md:py-6 bg-[#034391] rounded-full shadow-lg text-white font-medium text-base hover:bg-[#034391]/90 font-jakarta">
            <Link to="/dashboard" className="no-underline text-white">
              Get Started
            </Link>
          </Button>
        </div>
      </main>

      {/* Floating Feature Cards - Hidden on Mobile */}
      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
        {/* Card 1 - Speech Recognition */}
        <div className="absolute top-32 left-8 md:left-16 lg:left-24 transform rotate-12 hover:rotate-6 transition-transform duration-500 pointer-events-auto">
          <div className="w-48 h-32 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(3,67,145,0.3)] dark:shadow-[0_8px_32px_rgba(52,142,251,0.2)] p-4 transform perspective-1000 rotateX-12 rotateY-12 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-blue-500/10 dark:from-[#034391]/30 dark:to-[#034391]/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Mic className="w-5 h-5 text-blue-600 dark:text-[#348EFB]" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white font-jakarta">Speech to Text</h3>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-jakarta leading-relaxed">
              Convert speech into accurate text transcription with AI precision
            </p>
          </div>
        </div>

        {/* Card 2 - AI Summary */}
        <div className="absolute top-20 right-8 md:right-16 lg:right-24 transform -rotate-12 hover:-rotate-6 transition-transform duration-500 pointer-events-auto">
          <div className="w-48 h-32 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(3,67,145,0.25)] dark:shadow-[0_8px_32px_rgba(52,142,251,0.15)] p-4 transform perspective-1000 rotateX-12 rotateY--12 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400/30 to-purple-500/10 dark:from-[#034391]/25 dark:to-[#034391]/8 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-[#348EFB]" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white font-jakarta">AI Summary</h3>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-jakarta leading-relaxed">
              Generate intelligent summaries from meeting transcriptions
            </p>
          </div>
        </div>

        {/* Card 3 - Smart Notes */}
        <div className="absolute bottom-16 left-8 md:left-16 lg:left-32 transform rotate-6 hover:rotate-3 transition-transform duration-500 pointer-events-auto">
          <div className="w-48 h-32 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(3,67,145,0.2)] dark:shadow-[0_8px_32px_rgba(52,142,251,0.1)] p-4 transform perspective-1000 rotateX-12 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-green-500/10 dark:from-[#034391]/20 dark:to-[#034391]/5 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-5 h-5 text-green-600 dark:text-[#348EFB]" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white font-jakarta">Smart Notes</h3>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-jakarta leading-relaxed">
              Transform conversations into structured meeting notes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}