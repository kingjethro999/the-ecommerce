"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ShoppingCart,
  Bell,
  Heart,
  Search,
  Code2,
  Menu,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  TrendingUp,
  Home,
  Tag,
  HelpingHand,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

import { useQuery } from "@tanstack/react-query";
import { getNavDepartments } from "@/actions/departments";
import { useCartStore } from "@/store/useCart";
import { UserDropdownMenu } from "../UserDropdown";
import SearchInput from "./SearchInput";

// Type definitions
export interface NavProps {
  searchQuery?: string;
  userId?: string | null;
}

export interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface ProductSuggestion {
  id: string;
  title: string;
  slug: string;
  image?: string;
  category?: string;
}

// Logo Component
function Logo({
  variant = "light",
  size = "md",
  full = true,
  href = "/",
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  href?: string;
}) {
  if (variant === "light") {
    return (
      <Link href={href} className="flex items-center space-x-2">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={178}
          height={72}
          className="w-28"
        />
      </Link>
    );
  } else {
    return (
      <Link href={"/"} className="flex items-center space-x-2">
        <div className="bg-white rounded-full p-1">
          <span className="text-blue-800 font-bold text-xl">
            <Code2 />
          </span>
        </div>
        <span className="font-bold text-xl">Simple UI</span>
      </Link>
    );
  }
}

// User Dropdown Component

// Search Input Component

// Simplified Category Navigation Component (only departments)
function CategoryNav() {
  const {
    data: departments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getNavDepartments,
  });

  return (
    <nav className="relative border-b border-black/10 bg-[#f5c704] text-black">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between">
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">
                Error loading categories: {error.message}
              </p>
            </div>
          )}
          {isLoading ? (
            // Skeleton loader for departments
            <div className="flex items-center gap-8 py-2 pr-16">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-md" />
              ))}
            </div>
          ) : (
            departments &&
            departments.length > 0 && (
              <ScrollArea className="w-full rounded-md  whitespace-nowrap flex items-center gap-8 overflow-x-auto py-2  pr-16">
                {departments.map((department) => (
                  <Link
                    key={department.id}
                    href={`/d/${department.slug}`}
                    className={cn(
                      "relative text-sm pr-4  whitespace-nowrap hover:text-black/70 transition-colors pb-2"
                    )}
                  >
                    {department.title}
                  </Link>
                ))}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

// Bottom Tab Navigation Component for Mobile
function BottomTabNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#204462] text-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        <Link href="/" className="flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/categories" className="flex flex-col items-center">
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Categories</span>
        </Link>
        <Link href="/deals" className="flex flex-col items-center">
          <Tag className="h-6 w-6" />
          <span className="text-xs mt-1">Deals</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}

function Cart({ cartCount }: { cartCount: number }) {
  return (
    <Link href="/cart" className="relative">
      <span className="sr-only">Cart</span>
      <div>
        <ShoppingCart className="h-6 w-6" />
      </div>
      <span
        key={cartCount}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5c704] text-xs text-black"
      >
        {cartCount}
      </span>
    </Link>
  );
}

// Main Header Component
function HomeHeader({ searchQuery, userId }: NavProps) {
  // In a real app, this would come from a store
  const { items } = useCartStore();
  const { isSignedIn, user, isLoaded } = useUser();
  const userData = {
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "",
  };
  return (
    <header className="w-full bg-[#204462] text-white fixed top-0 z-40 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-8 justify-center">
            {/* Logo */}
            <Logo />

            {/* Search Bar */}
            <div className="w-[50%] gap-3">
              <SearchInput initialQuery={searchQuery} />
            </div>

            {/* Right Section */}
            <div className="flex h-5 items-center space-x-4 text-sm">
              <Button variant={"ghost"} asChild>
                <Link href="/help">
                  <span className="text-sm h-auto p-0 font-semibold ">
                    Help
                  </span>
                  <HelpCircle className="h-4 w-4 text-[#f5c704]" />
                </Link>
              </Button>

              <Separator orientation="vertical" />
              <Cart cartCount={items.length} />
              <Separator orientation="vertical" />
              <div className="md:flex hidden">
                {/* {isLoaded && isSignedIn ? (
                  
                ) : (
                  <p>Loading...</p>
                )} */}
                {!isSignedIn ? (
                  <div className="flex items-center gap-3">
                    <Button href="/sign-in" className="" variant="ghost">
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      className="text-black hover:text-black/70"
                      href="/sign-up"
                    >
                      Signup
                    </Button>
                  </div>
                ) : (
                  <UserDropdownMenu user={userData} />
                )}
                {/* {userId ? (
                  // <UserButton />
                  <UserDropdownMenu
                    email="testemail@gmail.com"
                    username="JB"
                    avatarUrl=""
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Button className="" variant="ghost" asChild>
                      <Link href="/sign-in">Login</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-black hover:text-black/70"
                      asChild
                    >
                      <Link href="/sign-up">Signup</Link>
                    </Button>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>

        <CategoryNav />
      </div>

      {/* Mobile Header */}
      <div className="block md:hidden">
        <div className="flex flex-col relative">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Menu className="h-6 w-6 text-gray-700" />
              </motion.div>
              <Logo />
            </div>
            <div className="flex items-center gap-4">
              <Cart cartCount={items.length} />
              {isLoaded && isSignedIn ? (
                <UserDropdownMenu user={userData} />
              ) : (
                <p>Loading...</p>
              )}
              {/* {userId ? (
                <UserDropdownMenu user={userData} />
              ) : (
                <Button size={"sm"} className="" variant="ghost" asChild>
                  <Link href="/sign-in">Login</Link>
                </Button>
              )} */}
              {!isSignedIn && (
                <Button size={"sm"} className="" variant="ghost" asChild>
                  <Link href="/sign-in">Login</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="px-4 py-2">
            <SearchInput initialQuery={searchQuery} />
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation for Mobile */}
      <BottomTabNavigation />
    </header>
  );
}

// Main component that brings everything together
export default function ShopNavigation({ userId }: { userId: string | null }) {
  return (
    <div className="bg-mainPrimary">
      <HomeHeader searchQuery="" userId={userId} />
    </div>
  );
}
