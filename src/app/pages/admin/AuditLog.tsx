
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navbar } from "../../../components/admin/Navbar";
import { Sidebar } from "../../../components/common/Sidebar";
import { ADMIN_NAV_LINKS, searchImgDark } from "../../../utils/constants";
import { Pagination } from "../../../components/common/Pagination";

import { Calendar } from "../../../components/ui/calendar"
import { ChevronDown, ChevronUp } from "lucide-react";
export interface AuditLogEntry {
    id: number;
    timestamp: string;
    actor: string;
    tenant: string;
    actionType: 'Active' | 'Inactive' | 'Pending' | 'Suspended'; // Expanded types for realism
    targetEntity: string;
    details: string;
    ipAddress: string;
}

const data: AuditLogEntry[] = [
    {
        "id": 1,
        "timestamp": "Oct 24, 14:45:12",
        "actor": "akash jain",
        "tenant": "System(Global)",
        "actionType": "Active",
        "targetEntity": "Vendor #882",
        "details": "View JSON",
        "ipAddress": "192.168.1.12"
    },
    {
        "id": 2,
        "timestamp": "Oct 24, 14:38:05",
        "actor": "sarah connor",
        "tenant": "TechWorld Inc.",
        "actionType": "Pending",
        "targetEntity": "Payment Gateway",
        "details": "View JSON",
        "ipAddress": "10.0.0.45"
    },
    {
        "id": 3,
        "timestamp": "Oct 24, 14:32:01",
        "actor": "Super Admin",
        "tenant": "System(Global)",
        "actionType": "Active",
        "targetEntity": "User: john.smith",
        "details": "View JSON",
        "ipAddress": "192.168.1.1"
    },
    {
        "id": 4,
        "timestamp": "Oct 24, 13:15:00",
        "actor": "System Bot",
        "tenant": "System(Global)",
        "actionType": "Inactive",
        "targetEntity": "API Key: pk_live_...",
        "details": "View JSON",
        "ipAddress": "127.0.0.1"
    },
    {
        "id": 5,
        "timestamp": "Oct 24, 11:20:44",
        "actor": "akash jain",
        "tenant": "ShoesWorld Inc.",
        "actionType": "Active",
        "targetEntity": "Domain: shoes.com",
        "details": "View JSON",
        "ipAddress": "192.168.1.12"
    },
    {
        "id": 6,
        "timestamp": "Oct 24, 09:45:22",
        "actor": "Super Admin",
        "tenant": "System(Global)",
        "actionType": "Suspended",
        "targetEntity": "Vendor #901",
        "details": "View JSON",
        "ipAddress": "192.168.1.1"
    },
    {
        "id": 7,
        "timestamp": "Oct 23, 18:30:10",
        "actor": "david rose",
        "tenant": "FashionHub Inc.",
        "actionType": "Active",
        "targetEntity": "User: david.r",
        "details": "View JSON",
        "ipAddress": "172.16.0.23"
    },
    {
        "id": 8,
        "timestamp": "Oct 23, 16:12:00",
        "actor": "Super Admin",
        "tenant": "System(Global)",
        "actionType": "Active",
        "targetEntity": "Vendor #882",
        "details": "View JSON",
        "ipAddress": "192.168.1.1"
    },
    {
        "id": 9,
        "timestamp": "Oct 23, 14:05:33",
        "actor": "john smith",
        "tenant": "System(Global)",
        "actionType": "Inactive",
        "targetEntity": "Session #4451",
        "details": "View JSON",
        "ipAddress": "192.168.1.55"
    },
    {
        "id": 10,
        "timestamp": "Oct 23, 09:00:01",
        "actor": "Automated Job",
        "tenant": "System(Global)",
        "actionType": "Active",
        "targetEntity": "Daily Backup",
        "details": "View JSON",
        "ipAddress": "10.0.0.1"
    }
];
export function AuditLog() {
 
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<AuditLogEntry[]>(data);
    const { theme } = useSelector((state: any) => state.adminTheme);
    const [count, setCount] = useState(1);
    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setIsOpen(false);
    }
    const pageSize = 5;
    const totalPages = Math.ceil(logs.length / pageSize);
    const currentPage = count;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = logs.slice(startIndex, endIndex);
    console.log(currentData)
    return (
        <>
            <Navbar title={"Audit Log"} />
             
            <main className={`admin_vendorManagement `}>
                <header className="flex justify-between items-center my-6">
                    <h1 className="font-bold text-2xl " >Manage Vendor domains, and platform access.</h1>

                </header>
                <div className={"border-2 justify-between rounded-lg flex border-gray-400  items-center px-4 py-2 gap-4   bg-white  filter  " + (theme == 'light' ? '' : 'invert')}>
                    <span className="border flex   flex-3 items-center justify-between gap-0 border-gray-400 px-4 rounded-lg ">
                        <button className="rounded-full w-8 h-8"><img className="w-6 h-6" src={searchImgDark} alt="search icon" /></button>
                        <input type="text" className="  text-xl py-2 px-4 w-full " placeholder="Search by name,email or domain" />
                    </span>
                    <span className="flex  gap-4">
                        <select className="vendor_filter" name="status" id="status">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <select className="vendor_filter" name="sort_by" id="sort_by">
                            <option value="date_newest">Newest</option>
                            <option value="date_oldest">Oldest</option>
                        </select>
                        {
                            isOpen ? <button onClick={() => setIsOpen(false)} className="vendor_filter bg-blue-100 text-blue-600"> {date ? date.toDateString() : "Select Date"}<ChevronUp size={40} strokeWidth={3} absoluteStrokeWidth /> </button> :
                                <button onClick={() => setIsOpen(true)} className="vendor_filter  "> {date ? date.toDateString() : "Select Date"}<ChevronDown size={40} strokeWidth={3} absoluteStrokeWidth />  </button>
                        }
                        {isOpen && (<Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            className="rounded-md border shadow-sm absolute z-20"
                            captionLayout='dropdown'

                        />)}


                    </span>
                </div>
                <div
                    className="my-6 relative flex flex-col w-full h-full overflow-scroll  bg-white border rounded-xl bg-clip-border">

                    <table className="w-full text-left table-auto min-w-max  ">
                        <thead  >
                            <tr className="">
                                <th className="p-4 border-b   border-gray-400">TIMESTAMP</th>
                                <th className="p-4 border-b   border-gray-400">ACTOR(USER)</th>
                                <th className="p-4 border-b   border-gray-400">COMPANY</th>
                                <th className="p-4 border-b   border-gray-400">ACTION TYPE</th>
                                <th className="p-4 border-b   border-gray-400">TARGET ENTITY</th>
                                <th className="p-4 border-b   border-gray-400">DETAILS</th>
                                <th className="p-4 border-b   border-gray-400">IP ADDRESS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentData.map((log) => (
                                    <>
                                        <tr key={log.id} className={`hover:bg-gray-100  border-b border-gray-400   `}>
                                            <td className={`p-4   `}>{log.timestamp}</td>
                                            <td className={`p-4  `}>{log.actor}</td>
                                            <td className={`p-4  `}>{log.tenant}</td>
                                            <td className={`p-4  `}>
                                                <span className={`py-1 px-3 text-nowrap-sm   items-center ${log.actionType === "Active" ? "bg-green-100 text-green-500" : log.actionType === "Pending" ? "bg-yellow-100 text-yellow-500" : "bg-gray-100 text-gray-500"}  `} >{log.actionType}</span>
                                            </td>
                                            <td className={`p-4  `}>{log.targetEntity}</td>
                                            <td className={`p-4  `}><a href="#" className="text-blue-600 underline">View JSON</a></td>
                                            <td className={`p-4   `}>{log.ipAddress}</td>

                                        </tr>
                                    </>
                                ))
                            }
                        </tbody >

                    </table>
                </div>
                <span className="flex justify-end">
                    <Pagination setCount={setCount} count={count} totalPages={totalPages} style="relative right-0 w-54" />
                </span>
            </main>
        </>
    )
}