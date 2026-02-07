import { Navbar } from "../../../components/admin/Navbar";
import { Sidebar } from "../../../components/common/Sidebar";
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import "./index.css"
import { SendHorizontal } from "lucide-react";
import { ADMIN_NAV_LINKS } from "../../../utils/constants";
// --- MOCK DATA (Simulating your JSON DB) ---
const MOCK_TICKETS = [
    {
        id: "TK-1024",
        title: "Payment Gateway Error",
        company: "ShoesWorld Inc.",
        email: "admin@shoesworld.com",
        status: "active",
        time: "2m ago",
        messages: [
            { id: 1, sender: "John Doe", role: "Vendor Admin", text: "Hi, we are trying to process payments but getting a 500 error on checkout. It says 'API Key Invalid'. Can you check?", time: "10:30 AM", type: "vendor" },
            { id: 2, sender: "System Bot", role: "Bot", text: "Thank you for reaching out. A Super Admin has been notified and will review your configuration shortly.", time: "10:31 AM", type: "system" },
            { id: 3, sender: "You", role: "Super Admin", text: "Hello John, I checked your configuration. It seems your API Secret Key was rotated yesterday. Please update it in Settings > Payments.", time: "10:45 AM", type: "super_admin" },
            { id: 4, sender: "John Doe", role: "Vendor Admin", text: "Ah, I missed that. Updating it now... verify in a moment.", time: "10:48 AM", type: "vendor" }
        ]
    },
    {
        id: "TK-1025",
        title: "Domain Verification Failed",
        company: "TechWorld Inc.",
        email: "support@techworld.com",
        status: "pending",
        time: "15m ago",

        messages: []
    },
    {
        id: "TK-1026",
        title: "Request for Limit Increase",
        company: "FashionHub Inc.",
        email: "billing@fashionhub.com",
        status: "closed",
        time: "1h ago",

        messages: []
    }
];
const MessageBubble = ({ message }) => {

    const isAdmin = message.type === "super_admin";
    const isSystem = message.type === "system";
    const isVendor = message.type === "vendor";
    console.log(isAdmin, isSystem, isVendor)
    return (

        <div className={`message_bubble_container w-full    flex my-4 px-10 justify-${isVendor ? 'start' : 'end'} `} >

            <div>
                <div className={`message_bubble rounded-2xl  py-6 px-8 max-w-xl min-w-md   ${isVendor ? 'bg-gray-200 float-left   text-black rounded-tl-none ' : isSystem ? 'bg-blue-100 text-black rounded-tr-none float-right' : isAdmin ? 'bg-blue-100 text-black rounded-tr-none float-right ' : 'bg-gray-200 text-black'} `} >
                    <div className="message_header flex items-center mb-2 justify-between">
                        <p>
                            {isVendor && <span className="font-bold">{message.sender} </span>}
                            {isSystem && <span className="font-bold"> {message.sender} </span>}
                            {isAdmin && <span className="font-bold"> {message.sender} </span>}
                        </p>
                        <p className="text-sm text-gray-600 ">{message.time}</p>
                    </div>
                    <p className="text-balance font-medium">
                        {message.text}
                    </p>
                </div> </div>

        </div>


    )
}
// 2. Ticket List Component
const TicketList = ({ tickets, onSelect, activeId }) => {
    const [filterTickets, setFilterTickets] = useState<[]>(tickets);
    return (
        <section className="flex flex-col    ">
            <div className="header w-full flex flex-col bg-gray-100 pb-2 pt-4 pl-4 pr-2 ">
                <h1 className="font-bold">
                    Active Tickets({tickets.length})
                </h1>
                <input type='search' className="form_input  py-1" placeholder="Filter Status..." />
            </div>
            <div className="ticket_list_container pl-4 ">
                {
                    filterTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className={`ticket_card pl-4 my-1 py-2 pr-2 w-[300px] ${activeId === ticket.id ? 'active_ticket_card border-l-4 border-l-green-500' : 'bg-gray-100 hover:bg-gray-200'} `}
                            onClick={() => onSelect(ticket)}
                        >
                            <div className="ticket_card_header flex justify-between items-center mb-2 text-sm">
                                <h2 className="ticket_title">{ticket.id}</h2>
                                <span className="ticket_time text-gray-500">{ticket.time}</span>
                            </div>
                            <p className="ticket_company">{ticket.title}</p>
                            <div className="ticket_status flex items-center gap-2 mt-2">
                                <span className={`status_indicator  text-sm  rounded-full h-2 w-2 shadow-md ${ticket.status == 'active' ? 'bg-green-500 shadow-green-500/50' : ticket.status == 'pending' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-gray-500 shadow-gray-500/50'}`}  ></span>
                                <span className="status_text capitalize">{ticket.company}</span>
                            </div>

                        </div>

                    ))
                }
            </div>
        </section>
    );
};

// 3. Chat Window Component
const ChatWindow = ({ ticket }) => {
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState(ticket.messages || []);

    // Update messages when the selected ticket changes
    useEffect(() => {
        setMessages(ticket.messages || []);
    }, [ticket]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        // Simulate optimistic UI update
        const newMessage = {
            id: Date.now(),
            sender: "You",
            role: "Super Admin",
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "super_admin"
        };

        setMessages([...messages, newMessage]);
        setInputText("");

        // In a real app, here you would do: 
        // fetch(`/api/tickets/${ticket.id}/messages`, { method: 'POST', body: ... })

    };

    return (
        <>
            <section className="w-full  ">
                <div className="chat_window_header bg-gray-100 flex justify-between items-center px-6 py-4 pb-6  border-b-4 border-gray-100">
                    <span>

                        <h1 className="text-lg font-bold ">{ticket.title}</h1>
                        <p className="text-sm text-gray-500 ">{ticket.company} - {ticket.email}</p>
                    </span>
                    <div className="chat_window_header_right flex items-center gap-4 md:flex-wrap sm:flex-wrap">
                        <button className="sm:py-2 px-4 bg-green-100 border-2 border-green-500 rounded-xl text-green-600 font-bold" >Mark Resolved </button>
                        <button className={`py-2 px-4 bg-red-100 border-2 ${ticket.status === 'active' ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'} font-bold rounded-xl `}>Close Ticket </button>

                    </div>

                </div>
                {
                    ticket.messages?.length > 0 &&

                    ticket.messages.map((message, index) => {
                        const isAdmin = message.type === "super_admin";
                        const isSystem = message.type === "system";
                        const isVendor = message.type === "vendor";
                        return (
                            <div key={index} className=''>

                                <MessageBubble message={message} key={index} />
                            </div>
                        )
                    })
                }
                <div className="chat_input_container bg-gray-100 flex w-full  border-t-2 border-gray-200  px-6 py-4   items-center gap-4 ">
                    <input type="text" placeholder="Type your reply here..." onChange={(e) => setInputText(e.target.value)} value={inputText} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="form_input flex-1" />
                    <button onClick={() => handleSend()} className="form_input bg-blue-500 text-white py-2 px-4 rounded-xl   flex items-center gap-2">Send <SendHorizontal size={40} strokeWidth={3} absoluteStrokeWidth />  </button>
                </div>
            </section>
        </>
    );
};
export function SupportTickets() {
    const [selectedTicket, setSelectedTicket] = useState(MOCK_TICKETS[0]);
 
    return (
        <>
            <Navbar title="Support Tickets" />
        

            <main className={`flex  `}>
                {/* 2. Ticket List Panel */}
                <TicketList
                    tickets={MOCK_TICKETS}
                    activeId={selectedTicket.id}
                    onSelect={setSelectedTicket}
                />
                {/* 3. Main Chat Panel */}
                <ChatWindow ticket={selectedTicket} />

            </main>
        </>)
}