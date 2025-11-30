'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  FileText,
  MessageSquare,
  Users,
  User,
  BrainCircuit,
  ClipboardCheck,
  BookOpen,
  LayoutList,
  Terminal,
  NotebookPen,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard/jobs', icon: Briefcase, label: 'Job Matching' },
  { href: '/dashboard/resume', icon: FileText, label: 'Resume Builder' },
  { href: '/dashboard/interview', icon: MessageSquare, label: 'Interview Sim' },
  { href: '/dashboard/networking', icon: Users, label: 'Networking' },
  { href: '/dashboard/quiz', icon: BrainCircuit, label: 'Tech Quiz' },
  { href: '/dashboard/aptitude', icon: ClipboardCheck, label: 'Aptitude Test' },
  { href: '/dashboard/courses', icon: BookOpen, label: 'Courses' },
  { href: '/dashboard/projects', icon: LayoutList, label: 'Project Suggestions' },
  { href: '/dashboard/notes', icon: NotebookPen, label: 'Notes' },
  { href: '/dashboard/coding-assistant', icon: Terminal, label: 'AI Coding Assistant' },
];

const bottomNavItems = [{ href: '/dashboard/profile', icon: User, label: 'Profile' }];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed top-0 bottom-0 left-0 z-50 w-64 flex-col sm:flex transition-transform duration-300 ease-in-out",
      "glass-card border-r border-white/10 rounded-none rounded-r-2xl",
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      <nav className="flex h-full flex-col gap-4 px-4 py-5">
        <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="group flex h-9 shrink-0 items-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
            >
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
            </Button>
        </div>
        

        <div className="flex-1 space-y-1">
          
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-foreground relative',
                pathname.startsWith(item.href) && 'text-foreground'
              )}
            >
               <div className={cn(
                  'absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 scale-y-0 rounded-r-full bg-accent transition-transform duration-300 group-hover:scale-y-100',
                  pathname.startsWith(item.href) && 'scale-y-100'
               )} />
              <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  pathname.startsWith(item.href) && 'text-accent'
              )} />
              <span className='group-hover:translate-x-1 transition-transform duration-300'>{item.label}</span>
            </Link>
          ))}
        </div>

        <div>
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                pathname.startsWith(item.href) &&
                  'text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
