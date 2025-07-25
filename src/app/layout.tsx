import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Stychn",
  description: "Convert large sewing and craft patterns into printable tiles.",
  viewport: "width=device-width, initial-scale=1.0",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <script
          src="https://unpkg.com/react@18.2.0/umd/react.development.js"
          crossOrigin="anonymous"
          async
        />
        <script
          src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"
          crossOrigin="anonymous"
          async
        />
        <script
          src="https://unpkg.com/@babel/standalone@7.22.5/babel.min.js"
          async
        />
        <script
          src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"
          async
        />
        <script
          src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"
          async
        />
        <script
          src="https://unpkg.com/@svgdotjs/svg.js@3.1.2/dist/svg.min.js"
          integrity="sha384-l2jM0tI0A3iX+9D2aU9n0q5g6jV0f6k5g6jV0f6k5g6jV"
          crossOrigin="anonymous"
          defer
        />
        <script
          src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"
          async
        />
      </head>
      <body className="font-plus-jakarta-sans">
        <AuthProvider>
          <div id="root">{children}</div>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onerror = function(msg, url, lineNo, columnNo, error) {
                console.error('Script Error:', {
                  message: msg,
                  url: url,
                  line: lineNo,
                  column: columnNo,
                  error: error
                });
                return false;
              };
              if (typeof pdfjsLib !== 'undefined') {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
