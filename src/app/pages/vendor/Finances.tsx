 
import { Pagination } from "../../../components/common/Pagination";
import { useState } from "react";
import Navbar from "../../../components/vendor/Navbar";
 
import { Download } from "lucide-react";
/**
 * Interface representing a single GST Invoice record.
 */
interface GstInvoice {
    id: number;
    date: string;           // ISO 8601 format (YYYY-MM-DD)
    invoice_no: string;
    order_ref: string;
    taxable_value: number;  // Floating point number for currency
    total_tax: number;      // Floating point number for currency
    currency: string;       // ISO Currency Code
    download_available: boolean;
}

/**
 * Array of GST Invoices
 */
const gst_invoices: GstInvoice[] = [
    {
        id: 1,
        date: "2026-01-16",
        invoice_no: "INV-2026-0000000001",
        order_ref: "#ORD-00000009921",
        taxable_value: 2117.80,
        total_tax: 381.20,
        currency: "INR",
        download_available: true
    },
    {
        id: 2,
        date: "2026-01-15",
        invoice_no: "INV-2026-0000000004",
        order_ref: "#ORD-00000005921",
        taxable_value: 758.93,
        total_tax: 91.07,
        currency: "INR",
        download_available: true
    },
    {
        id: 3,
        date: "2026-01-14",
        invoice_no: "INV-2026-0000000003",
        order_ref: "#ORD-00000044921",
        taxable_value: 1540.00,
        total_tax: 277.20,
        currency: "INR",
        download_available: true
    },
    {
        id: 4,
        date: "2026-01-13",
        invoice_no: "INV-2026-0000000006",
        order_ref: "#ORD-00000009455",
        taxable_value: 3210.50,
        total_tax: 577.89,
        currency: "INR",
        download_available: true
    },
    {
        id: 5,
        date: "2026-01-12",
        invoice_no: "INV-2026-0000000045",
        order_ref: "#ORD-00000009451",
        taxable_value: 4500.00,
        total_tax: 810.00,
        currency: "INR",
        download_available: true
    },
    {
        id: 6,
        date: "2026-01-11",
        invoice_no: "INV-2026-0000000035",
        order_ref: "#ORD-00000065656",
        taxable_value: 2117.80,
        total_tax: 381.20,
        currency: "INR",
        download_available: true
    },
    {
        id: 7,
        date: "2026-01-10",
        invoice_no: "INV-2026-0000000036",
        order_ref: "#ORD-00005755645",
        taxable_value: 2117.80,
        total_tax: 381.20,
        currency: "INR",
        download_available: true
    },
    {
        id: 8,
        date: "2026-01-09",
        invoice_no: "INV-2026-0000000466",
        order_ref: "#ORD-00056565623",
        taxable_value: 2117.80,
        total_tax: 381.20,
        currency: "INR",
        download_available: true
    }
];
export function Finances() {
    
    const [count, setCount] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(gst_invoices.length / pageSize);
    const currentPage = count;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData: typeof gst_invoices = gst_invoices.slice(startIndex, endIndex);
    console.log(currentData)
    return (
        <>
            <Navbar title="Finances" />
            
            <main className={`  `}>
                <div className="flex gap-6 my-6 justify-end">
                    {/* <button className="rounded-xl border-2 border-gray-300 text-gray-700 px-4 py-2">Transfer Stock</button> */}
                    <button className="flex gap-4 items-center rounded-xl bg-blue-500 text-white px-4 py-2"><Download />Download GSTR-1    </button>
                </div>

                <div className="stats flex gap-6  justify-start flex-wrap mb-6  ">
                    <div className="stat lg:w-86   lg:pb-6 ">
                        <div className="stat_title   ">Total Earnings</div>
                        <div className="stat_value ">₹ 1,20,000</div>
                        <div className="stat_desc text-gray-600  ">Include CGST, SGST, IGST</div>
                    </div>
                    <div className="stat lg:w-86   lg:pb-6">
                        <div className="stat_title   ">Pending Settlements</div>
                        <div className="stat_value ">₹ 4,000</div>
                        <div className="stat_desc text-gray-600  ">Include CGST, SGST, IGST</div>
                    </div>
                    <div className="stat  lg:w-86 lg:pb-6 ">
                        <div className="stat_title   ">GST Registration</div>
                        <div className="stat_value ">24ABCDE1234FIZ5</div>
                        <div className="stat_desc text-green-600  ">Status: Active (Regular)</div>
                    </div>
                </div>
                <div
                    className="my-6 relative flex w-full h-full overflow-scroll  bg-white border rounded-2xl bg-clip-border border-gray-300 flex-col">
                    <h1 className="text-lg font-bold py-4 px-12">GST INVOICES</h1>
                    <table className="w-full  table-auto min-w-max  ">

                        <thead className=" |w-full " >
                            <tr className="text-left bg-gray-200 ">
                                <th className="py-4 pr-8 border-b   border-gray-400 text-center">DATE</th>
                                <th className="pl-4 border-b   border-gray-400">INVOICE NO</th>
                                <th className="pr-10 border-b  border-gray-400 text-center">ORDER REF</th>
                                <th className="py-4 border-b   border-gray-400">TAXABLE VALUE</th>
                                <th className="py-4 border-b   border-gray-400">TOTAL TAX</th>
                                <th className="py-4 border-b   border-gray-400 text-center">DOWNLOAD</th>

                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {
                                currentData.map((item, index) => (
                                    <>
                                        <tr key={index} className={`hover:bg-gray-100 ${item?.id && (item.id === currentData[currentData.length - 1].id ? 'border-b-0' : 'border-b border-gray-400')} border-b border-gray-400   `}>
                                            <td className={`py-4  text-center `}>  {item.date} </td>
                                            <td className={`py-4 w-56  `}>{item.invoice_no}</td>
                                            <td className={`py-4  text-center `}>
                                                {item.order_ref}
                                            </td>
                                            <td className={`py-4  `}> ₹ {item.taxable_value}</td>
                                            <td className={`py-4  `}> ₹ {item.total_tax}</td>
                                            <td className={`py-4 flex  justify-center  `}>
                                                {
                                                    item.download_available === true ? <button className=" min-w-24 bg-green-100 border-2 border-green-500 cursor-pointer   text-green-800 py-1 px-3 rounded-lg text-sm flex items-center gap-2">
                                                        <Download /> PDF
                                                    </button> :
                                                        <button className="min-w-24 cursor-pointer bg-red-100 border-2 border-red-500   text-red-800 py-1 px-3 rounded-lg text-sm">Unavailable</button>
                                                }
                                            </td>

                                        </tr>
                                    </>
                                ))
                            }
                        </tbody >

                    </table>
                </div>
                <span className="w-full flex justify-between items-center ">
                    <p className="text-stone-500">Showing {currentData.length} of {gst_invoices.length} products</p>
                    <Pagination setCount={setCount} count={count} totalPages={totalPages} style="relative right-0 w-54" />
                </span>
            </main>
        </>
    )
}
