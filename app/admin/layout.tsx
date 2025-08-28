// FILE: app/admin/layout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  DocumentMagnifyingGlassIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  HomeIcon,
  CogIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "User Management", href: "/admin/users", icon: UserGroupIcon },
  { name: "Signals Management", href: "/admin/signals", icon: ChartBarIcon },
  { name: "Product Management", href: "/admin/products", icon: ShoppingBagIcon },
  { name: "Content Moderation", href: "/admin/moderation", icon: DocumentMagnifyingGlassIcon },
  { name: "Forum Moderation", href: "/admin/forum/moderation", icon: ChatBubbleLeftRightIcon },
  { name: "Webhook Logs", href: "/admin/webhooks", icon: DocumentTextIcon },
  { name: "Forum Monetization", href: "/admin/forum/monetization", icon: CurrencyDollarIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Payments", href: "/admin/payments", icon: CreditCardIcon },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: UserGroupIcon },
  { name: "Site Settings", href: "/admin/settings", icon: CogIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is admin
  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <ShieldCheckIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`${
                        pathname === item.href
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      pathname === item.href
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
