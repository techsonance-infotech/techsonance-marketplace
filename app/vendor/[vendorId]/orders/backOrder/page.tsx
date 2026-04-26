'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getVendorReturnRequests } from '@/utils/vendorApiClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';

export default function BackOrdersListPage({ params }: { params: { vendorId: string } }) {
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [domain, setDomain] = useState<string>('');

    useEffect(() => {
    }, []);

    useEffect(() => {
        const fetchReturns = async () => {
            if (!domain) return;
            try {
                setLoading(true);
                const data = await getVendorReturnRequests(domain);
                setReturns(data);
            } catch (error) {
                toast.error('Failed to load return requests');
            } finally {
                setLoading(false);
            }
        };
        fetchReturns();
    }, [domain]);

    if (loading) return <div className="p-8 flex justify-center"><LoaderSpinner /></div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Back Orders</h1>
            <p className="text-gray-500 mb-6">Manage customer return and replacement requests.</p>

            <div className="bg-white rounded-md shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {returns.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No active requests.</TableCell></TableRow>
                        ) : (
                            returns.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.type}</TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                                            {req.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/vendor/${params.vendorId}/orders/backOrder/${req.id}`}>
                                            <Button variant="outline" size="sm">Review Details</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}