// app/vendor/[vendorId]/analysis/page.tsx

import VendorDashboard from '@/components/vendor/AnalysisBoard';
import { getDomain } from '@/lib/get-domain'; 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | Techsonance Marketplace',
  description: 'View your store performance, revenue, and order analytics.',
};

export default async function VendorAnalysisPage({ 
  params 
}: { 
  params: { vendorId: string } 
}) {  
  return (
    <div className="flex-1 w-full h-full bg-muted/10">
      {/* Pass the domain to the client component we built previously */}
      <AnalysisBoard  />
    </div>
  );
}