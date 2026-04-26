'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVendorReturnById, updateReturnStatus } from '@/utils/vendorApiClient';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';
import Image from 'next/image';
import { ReturnStatus } from '@/utils/Types';

export default function BackOrderDetailPage({
    params
}: {
    params: { vendorId: string, returnId: string }
}) {
    const router = useRouter();
    const [requestData, setRequestData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // State for updating
    const [newStatus, setNewStatus] = useState<ReturnStatus | ''>('');
    const [vendorNote, setVendorNote] = useState('');
    const [updating, setUpdating] = useState(false);
    const [domain, setDomain] = useState<string>('');

    useEffect(() => {
        setDomain(window.location.hostname);
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!domain) return;
            try {
                setLoading(true);
                const data = await getVendorReturnById(params.returnId, domain);
                setRequestData(data);
                setNewStatus(data.status as ReturnStatus);
                setVendorNote(data.store_owner_note || '');
            } catch (error) {
                toast.error('Failed to load request details');
                router.back();
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [domain, params.returnId, router]);

    const handleUpdateSubmit = async () => {
        if (!newStatus) return toast.error('Please select a status');

        if ((newStatus === ReturnStatus.REJECTED || newStatus === ReturnStatus.QC_FAILED) && !vendorNote) {
            return toast.error('A note is required for rejections or QC failures');
        }

        setUpdating(true);
        try {
            await updateReturnStatus(params.returnId, domain, {
                status: newStatus,
                store_owner_note: vendorNote,
            });
            toast.success('Status updated successfully');
            router.push(`/vendor/${params.vendorId}/orders/backOrder`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !requestData) return <div className="p-8 flex justify-center"><LoaderSpinner /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Button variant="outline" className="mb-6" onClick={() => router.back()}>
                &larr; Back to List
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Details & Evidence */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-md shadow">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Customer Request Details</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Request Type</p>
                                <p className="font-semibold text-lg">{requestData.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current Status</p>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {requestData.status}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Reason</p>
                                <p className="font-medium text-gray-800">{requestData.reason}</p>
                            </div>
                        </div>

                        {requestData.customer_note && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Customer Comments</p>
                                <div className="p-3 bg-gray-50 rounded border text-sm text-gray-700">
                                    {requestData.customer_note}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-md shadow">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Evidence Uploaded</h2>
                        {(!requestData.evidence_images || requestData.evidence_images.length === 0) ? (
                            <p className="text-gray-500 text-sm">No evidence photos provided by the customer.</p>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {requestData.evidence_images.map((url: string, index: number) => (
                                    <div key={index} className="relative w-32 h-32 border rounded overflow-hidden">
                                        <img
                                            src={url}
                                            alt={`Evidence ${index + 1}`}
                                            className="object-cover w-full h-full hover:scale-110 transition-transform cursor-pointer"
                                            onClick={() => window.open(url, '_blank')} // Simple open in new tab
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="bg-white p-6 rounded-md shadow h-fit sticky top-6">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2">Action / Resolution</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Update Status</label>
                        <select
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as ReturnStatus)}
                        >
                            {Object.values(ReturnStatus).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Internal / Customer Note</label>
                        <p className="text-xs text-gray-500 mb-2">Required if Rejecting or failing Quality Check.</p>
                        <textarea
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            value={vendorNote}
                            onChange={(e) => setVendorNote(e.target.value)}
                            placeholder="Provide reason for rejection or update details..."
                        />
                    </div>

                    <Button
                        onClick={handleUpdateSubmit}
                        disabled={updating || newStatus === requestData.status}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {updating ? 'Saving...' : 'Confirm Update'}
                    </Button>
                </div>
            </div>
        </div>
    );
}