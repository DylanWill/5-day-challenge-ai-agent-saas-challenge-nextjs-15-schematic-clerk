"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Calendar, BarChart3, FileText, Mail, Home as HomeIcon, Brain, LayoutDashboard, Settings } from "lucide-react";

function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 left-0 right-0 px-4 md:px-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center">
                <HomeIcon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                RealEstateAI
              </h1>
            </Link>

            <nav className="hidden md:flex ml-10 space-x-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                  isActive("/")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/calendar"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                  isActive("/calendar")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </Link>
              <Link
                href="/email"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                  isActive("/email")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Emails</span>
              </Link>
              <Link
                href="/market-analysis"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                  isActive("/market-analysis")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Market Analysis</span>
              </Link>
              <Link
                href="/documents"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                  isActive("/documents")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </Link>
              <Link
                href="/reports"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                  isActive("/reports")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reports</span>
              </Link>
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link href="/manage-plan">
                <Button
                  variant="outline"
                  className="mr-4 bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
                >
                  Manage Plan
                </Button>
              </Link>

              <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full border bg-blue-100 border-blue-200">
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
