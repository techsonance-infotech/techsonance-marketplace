import SegmentForm from "@/components/vendor/SegmentForm";

 
export default function NewSegmentPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Audience Segment</h1>
      <p className="text-sm text-gray-500 mb-6">Define criteria to automatically group matching customers.</p>
      <SegmentForm />
    </div>
  );
}