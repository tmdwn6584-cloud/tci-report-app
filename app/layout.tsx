import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "TCI LAB - 프리미엄 성향 리포트",
  description: "당신은 왜 그런 감정 흐름 안에서 살아왔는지 설명합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#fdfbf7] flex flex-col md:flex-row overflow-x-hidden w-full max-w-[100vw]">
        <Sidebar />
        <main className="flex-1 md:ml-64 mb-16 md:mb-0 min-h-screen w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
