"use client";
import NavigationSidebar from "@/components/NavigationSidebar";
import PageHeader from "@/components/PageHeader";
import { usePathname } from "next/navigation";

export default function HowToLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine active page based on pathname
  let activePage = "how-to";
  if (pathname?.includes("easy-steps")) {
    activePage = "easy-steps";
  } else if (pathname?.includes("attributes")) {
    activePage = "attributes";
  }

  return (
    <div className="min-h-screen bg-[#F5E8C7]">
      <NavigationSidebar activePage={activePage} />
      <div className="md:ml-80 min-h-screen flex flex-col">
        <PageHeader />
        <main className="flex-1 bg-[#F9FAFB] px-4 md:px-12 py-6 md:py-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
