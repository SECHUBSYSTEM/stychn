"use client";

import { useState } from "react";
import Image from "next/image";

interface NavigationSidebarProps {
  activePage?: string;
}

export default function NavigationSidebar({
  activePage = "login",
}: NavigationSidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuth = activePage === "login" || activePage === "signup";
  const bgClass = isAuth ? "bg-white" : "bg-[#D3C7B0]";

  // Check if current page is in How To Tile section
  const isHowToActive =
    activePage === "how-to" ||
    activePage === "easy-steps" ||
    activePage === "attributes";

  const navItems = [
    {
      label: "Login/Sign Up",
      href: "/auth?login=true",
      active: activePage === "login" || activePage === "signup",
    },
    {
      label: "How To Tile",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Easy Steps",
          href: "/how-to/easy-steps",
          active: activePage === "easy-steps",
        },
        {
          label: "Attributes",
          href: "/how-to/attributes",
          active: activePage === "attributes",
        },
      ],
      active: isHowToActive,
    },
    {
      label: "Tiling Tool",
      href: "/tiling-tool",
      active: activePage === "tiling-tool",
    },
    { label: "Tokens", href: "/tokens", active: activePage === "tokens" },
    {
      label: "Instructions",
      href: "/instructions",
      active: activePage === "instructions",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-warm-brown text-white">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 ${bgClass} text-center flex flex-col items-center py-8 font-plus-jakarta-sans z-20 overflow-hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-warm-brown hover:text-opacity-80">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 mt-8 md:mt-0">
          <Image
            src="/logo.png"
            alt="Stychn Logo"
            width={160}
            height={160}
            className="mb-2"
            priority
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col justify-center items-center w-full px-4">
          <ul className="space-y-6 w-full">
            {navItems.map((item, index) => (
              <li key={index} className="w-full">
                <div className="relative w-full flex flex-col items-center justify-center">
                  <a
                    href={item.href}
                    className={`block w-full text-center text-warm-brown hover:text-opacity-80 transition-colors font-plus-jakarta-sans py-2 ${
                      item.active ? "font-bold" : ""
                    }`}
                    onClick={
                      item.hasDropdown
                        ? (e) => {
                            e.preventDefault();
                            setDropdownOpen(!dropdownOpen);
                          }
                        : () => {
                            // Close mobile menu when link is clicked
                            setMobileMenuOpen(false);
                          }
                    }>
                    <span className="inline-flex items-center justify-center gap-2">
                      {item.label}
                      {item.hasDropdown && (
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </span>
                  </a>

                  {/* Dropdown menu */}
                  {item.hasDropdown && dropdownOpen && (
                    <div className="mt-2 space-y-2 w-full">
                      {item.dropdownItems?.map(
                        (dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownIndex}
                            href={dropdownItem.href}
                            className={`block w-full text-center text-warm-brown hover:text-opacity-80 transition-colors text-sm py-1 font-plus-jakarta-sans ${
                              dropdownItem.active ? "font-bold" : ""
                            }`}
                            onClick={() => setMobileMenuOpen(false)}>
                            {dropdownItem.label}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
