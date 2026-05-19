'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, IndianRupee, ShoppingBag, Percent, TrendingDown } from 'lucide-react';
import { vendorApiClient } from '@/utils/vendorApiClient'; // Using your existing API client
import { addDays, format } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalysisBoard({ domain }: { domain: string }) {
  const [dateRange, setDateRange] = useState({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
  });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Calling the NestJS endpoint we created
        const response = await vendorApiClient.get('/vendors/analytics/dashboard', {
          headers: { 'company-domain': domain },
          params: {
            startDate: dateRange.startDate.toISOString(),
            endDate: dateRange.endDate.toISOString(),
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (domain) fetchAnalytics();
  }, [dateRange, domain]);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <div>Failed to load dashboard data.</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Dashboard Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
        <div className="flex items-center gap-4">
          {/* Note: Integrate your preferred Shadcn DatePicker component here to update dateRange state */}
          <div className="text-sm text-muted-foreground border p-2 rounded-md">
            {format(dateRange.startDate, 'MMM d, yyyy')} - {format(dateRange.endDate, 'MMM d, yyyy')}
          </div>
          
          <Button onClick={() => exportDashboardToPDF('dashboard-report', `Report_${domain}.pdf`)} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Printable Area Begins */}
      <div id="dashboard-report" className="flex flex-col gap-6 bg-background p-2 rounded-lg">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Gross Revenue" value={`₹${data.summary.grossRevenue.toLocaleString()}`} icon={<IndianRupee className="text-blue-500" />} />
          <MetricCard title="Net Earnings" value={`₹${data.summary.netEarnings.toLocaleString()}`} icon={<IndianRupee className="text-emerald-500"/>} />
          <MetricCard title="Total Orders" value={data.summary.totalOrders} icon={<ShoppingBag className="text-purple-500" />} />
          <MetricCard title="Tax Collected" value={`₹${data.summary.taxCollected.toLocaleString()}`} icon={<Percent className="text-amber-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Dual-axis Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue & Order Volume Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tickFormatter={(val) => `₹${val}`} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value, name) => [name === 'revenue' ? `₹${value}` : value, name === 'revenue' ? 'Revenue' : 'Orders']} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={3} name="Order Volume" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Profit & Loss Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-4 pt-4">
               <div className="flex justify-between items-center border-b pb-3">
                 <span className="text-muted-foreground font-medium">Gross Sales</span>
                 <span className="font-semibold text-lg">₹{data.summary.grossRevenue.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center border-b pb-3 text-destructive">
                 <span className="flex items-center gap-2"><TrendingDown className="h-4 w-4"/> Platform Fees</span>
                 <span>- ₹{data.summary.platformFees.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center border-b pb-3 text-destructive">
                 <span className="flex items-center gap-2"><TrendingDown className="h-4 w-4"/> Taxes (GST)</span>
                 <span>- ₹{data.summary.taxCollected.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center border-b pb-3 text-destructive">
                 <span className="flex items-center gap-2"><TrendingDown className="h-4 w-4"/> Refunds Processed</span>
                 <span>- ₹{data.summary.refunds.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pt-3">
                 <span className="text-xl font-bold">Net Profit</span>
                 <span className="text-xl font-bold text-emerald-600">₹{data.summary.netEarnings.toLocaleString()}</span>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Variants (SKU)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProducts} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(val) => `₹${val}`} />
                  <YAxis dataKey="sku" type="category" width={100} tick={{ fontSize: 12 }} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} formatter={(val) => `₹${val}`} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.categoryPerformance.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => `₹${val}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-5 w-5 bg-muted/50 rounded-full flex items-center justify-center p-1">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-pulse">
       <div className="flex justify-between items-center">
         <Skeleton className="h-10 w-48" />
         <Skeleton className="h-10 w-[300px]" />
       </div>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Skeleton className="col-span-2 h-[450px] rounded-xl" />
         <Skeleton className="col-span-1 h-[450px] rounded-xl" />
       </div>
    </div>
  );
}