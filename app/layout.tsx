import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "TCI 감정의 좌표 - 감정 흐름 분석 서비스",
  description: "당신의 감정 흐름을 우아하게 읽어드리는 TCI 감정의 좌표 리포트입니다.",
  openGraph: {
    title: "TCI 감정의 좌표 - 감정 흐름 분석 서비스",
    description: "감정의 미세한 흐름을 섬세하게 분석하고, 나만의 감정 지도를 완성해보세요.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TCI 감정의 좌표 - 감정 흐름 분석 서비스",
    description: "감정의 미세한 흐름을 섬세하게 분석하고, 나만의 감정 지도를 완성해보세요.",
    images: ["/og-image.png"],
  },
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
