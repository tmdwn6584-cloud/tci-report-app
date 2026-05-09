"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, BarChart2, BookOpen, Crown } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsAdmin(sessionStorage.getItem("isAdmin") === "true");

    // Listen for custom login event
    const handleAdminChange = () => {
      setIsAdmin(sessionStorage.getItem("isAdmin") === "true");
    };
    window.addEventListener("adminLoginStatusChanged", handleAdminChange);
    return () => window.removeEventListener("adminLoginStatusChanged", handleAdminChange);
  }, []);

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/guide", label: "가이드", icon: BookOpen },
    { href: "/test", label: "검사하기", icon: ClipboardList },
    { href: "/result", label: "결과보기", icon: BarChart2 },
  ];

  if (isAdmin) {
    navItems.push({ href: "/admin", label: "관리자 (데이터)", icon: ClipboardList });
  }

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-100 flex flex-col justify-between h-screen fixed left-0 top-0 z-50">
      <div>
        <div className="h-20 flex items-center px-8 border-b border-gray-50 mb-6">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <span className="text-purple-600 text-2xl">✤</span> TCI LAB
          </div>
        </div>
        
        <nav className="flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === "/result" && pathname.startsWith("/result"));
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-purple-50 text-purple-700 font-medium" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mb-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 text-center border border-purple-100/50 shadow-sm">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Crown className="w-5 h-5 text-purple-500" />
          </div>
          <h4 className="text-sm font-bold text-purple-900 mb-1">프리미엄 리포트</h4>
          <p className="text-xs text-purple-700/70 mb-4">더 깊은 분석과<br/>맞춤 조언을 받아보세요.</p>
          <button className="w-full bg-white text-purple-600 text-xs font-semibold py-2 rounded-lg border border-purple-100 shadow-sm hover:shadow transition-all">
            업그레이드 하기 →
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-400">이 검사는 TCI를 기반으로 제작되었습니다.</p>
          <button className="mt-2 bg-gray-50 text-gray-500 text-xs px-4 py-1.5 rounded-full border border-gray-200">TCI란?</button>
        </div>
      </div>
    </aside>
  );
}
