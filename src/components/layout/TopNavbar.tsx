"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/lib/utils";

function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear session cookie by calling the API route
      await fetch("/api/auth/session/signout", { method: "POST" });
      toast({ title: "Logged out successfully." });
      router.push("/");
    } catch (error) {
      toast({ title: "Failed to log out.", variant: "destructive" });
    }
  };

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Get Started</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/50 neon-glow-primary">
            <AvatarImage
              src={user.photoURL ?? undefined}
              alt={user.displayName ?? "User avatar"}
            />
            <AvatarFallback>
              {user.email ? (
                user.email[0].toUpperCase()
              ) : (
                <UserIcon className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card">
        <DropdownMenuLabel>{user.email || "My Account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Features</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { user } = useUser();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // This logic is for the full-screen mobile menu on the landing page
  if (!user) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0 glass-card">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          </SheetHeader>
          <UnauthenticatedMobileNav onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  // This is the hamburger for the dashboard view on mobile
  return (
    <Button
      variant="ghost"
      size="icon"
      className="sm:hidden"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function UnauthenticatedMobileNav({
  onLinkClick,
}: {
  onLinkClick: () => void;
}) {
  return (
    <nav className="grid gap-6 text-lg font-medium p-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold text-primary"
        onClick={onLinkClick}
      >
        <Image src="/logo.jpg" width={32} height={32} alt="Logo" />
        <span className="text-foreground">Engineers Edge AI</span>
      </Link>
      <Link
        href="/dashboard/interview"
        className="text-muted-foreground hover:text-foreground"
        onClick={onLinkClick}
      >
        Demo
      </Link>
      <Link
        href="/login"
        className="text-muted-foreground hover:text-foreground"
        onClick={onLinkClick}
      >
        Get Started
      </Link>
    </nav>
  );
}

interface TopNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function TopNavbar({
  sidebarOpen,
  setSidebarOpen,
}: TopNavbarProps) {
  const { isUserLoading, user } = useUser();

  return (
    <header
      className={cn(
        "fixed top-4 left-0 right-0 z-40 mx-auto flex h-16 max-w-[90%] items-center justify-between gap-4 px-4 sm:px-6",
        "glass-card border-white/10"
      )}
    >
      <div className="flex items-center gap-2">
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
        <Link href="/" className="group flex items-center gap-2 font-semibold">
          <Image
            src="/logo.jpg"
            width={36}
            height={36}
            alt="Logo"
            className="transition-all group-hover:scale-110"
          />
          <span className="font-headline text-xl text-foreground hidden sm:inline-block">
            Engineers Edge
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {!isUserLoading && <UserNav />}
        <MobileNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
    </header>
  );
}
