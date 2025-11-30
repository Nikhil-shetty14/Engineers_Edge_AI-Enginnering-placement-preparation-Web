'use client';
import { useUser } from '@/firebase';
import { ArrowUpRight, Briefcase, FileText, MessageSquare, Users } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const chartData = [
  { name: "Jan", total: Math.floor(Math.random() * 200) + 100 },
  { name: "Feb", total: Math.floor(Math.random() * 200) + 100 },
  { name: "Mar", total: Math.floor(Math.random() * 200) + 100 },
  { name: "Apr", total: Math.floor(Math.random() * 200) + 100 },
  { name: "May", total: Math.floor(Math.random() * 200) + 100 },
  { name: "Jun", total: Math.floor(Math.random() * 200) + 100 },
  { name: "Jul", total: Math.floor(Math.random() * 200) + 100 },
]

export default function DashboardPage() {
  const { user } = useUser();
  const userName = user?.displayName?.split(' ')[0] || 'User';

  return (
    <div className="w-full">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome Back, {userName}</h1>
            <p className="text-muted-foreground">Here's a snapshot of your AI-powered career progress.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Jobs Matched</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+5 since last week</p>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resumes Generated</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">+2 since last week</p>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews Practiced</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">+1 since last week</p>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Connections</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Networking suggestions</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
            <Card className="xl:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
             <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  You have 3 new job matches.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                    <Briefcase className='h-6 w-6 text-primary' />
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">New Job Match: Senior React Developer</p>
                        <p className="text-sm text-muted-foreground">at TechCorp Inc.</p>
                    </div>
                    <Link href="/dashboard/jobs" className="ml-auto">
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                </div>
                 <div className="flex items-center gap-4">
                    <FileText className='h-6 w-6 text-primary' />
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Resume optimized for "AI Engineer"</p>
                        <p className="text-sm text-muted-foreground">Generated 2 variants</p>
                    </div>
                     <Link href="/dashboard/resume" className="ml-auto">
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                </div>
                 <div className="flex items-center gap-4">
                    <MessageSquare className='h-6 w-6 text-primary' />
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Completed System Design Interview</p>
                        <p className="text-sm text-muted-foreground">Score: 8/10</p>
                    </div>
                     <Link href="/dashboard/interview" className="ml-auto">
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                </div>
              </CardContent>
            </Card>
        </div>
    </div>
  );
}
