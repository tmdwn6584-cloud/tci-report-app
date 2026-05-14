import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "TCI LAB - 프리미엄 성향 리포트",
  description: "감정의 흐름을 말해주는 프리미엄 TCI 리포트로 나를 더 깊이 이해하세요.",
  openGraph: {
    title: "TCI LAB - 감정 흐름 리포트",
    description: "감정 패턴과 성향을 시각화하는 프리미엄 분석 리포트로 나를 발견하세요.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TCI LAB - 감정 흐름 리포트",
    description: "감정 패턴과 성향을 시각화하는 프리미엄 분석 리포트로 나를 발견하세요.",
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
