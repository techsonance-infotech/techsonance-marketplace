import { useSelector } from "react-redux";
import { Navbar } from "../../../components/admin/Navbar";
import { Sidebar } from "../../../components/admin/Sidebar";
import { down_arrow, file_icon, internet_icon } from "../../../utils/constants";
import { useState } from "react";
import { File } from "lucide-react";
interface BusinessProfile {
    business_name: string;
    owner_name: string;
    owner_email: string;
    submission_date: string;
    status: 'verified' | 'pending' | 'rejected';
}

interface SubmittedDocument {
    file_name: string;
    size: string;
    uploaded_at: string;
}

interface InstanceDetails {
    requested_subdomain: string;
    domain_extension: string;
    dns_check: 'passed' | 'failed';
}

interface VendorApplication {
    business_profile: BusinessProfile;
    submitted_documents: SubmittedDocument[];
    instance_details: InstanceDetails;
}

// The final array type
type VendorApplicationList = VendorApplication[];
const vendorApplications: VendorApplicationList = [
    {
        business_profile: {
            business_name: "starlight logistics",
            owner_name: "marcus vance",
            owner_email: "vance.logistics@provider.net",
            submission_date: "january 22, 2026",
            status: "verified"
        },
        submitted_documents: [
            {
                file_name: "fleet_insurance_2026.pdf",
                size: "4.2 mb",
                uploaded_at: "10 minutes ago"
            },
            {
                file_name: "operational_permit.pdf",
                size: "1.1 mb",
                uploaded_at: "12 minutes ago"
            }
        ],
        instance_details: {
            requested_subdomain: "starlight-track",
            domain_extension: ".platform.com",
            dns_check: "passed"
        }
    },
    {
        business_profile: {
            business_name: "urban green catering",
            owner_name: "elena rodriguez",
            owner_email: "elena@urbangreen.co",
            submission_date: "january 25, 2026",
            status: "pending"
        },
        submitted_documents: [
            {
                file_name: "health_dept_cert.pdf",
                size: "2.8 mb",
                uploaded_at: "1 day ago"
            },
            {
                file_name: "vendor_agreement.pdf",
                size: "1.9 mb",
                uploaded_at: "1 day ago"
            }
        ],
        instance_details: {
            requested_subdomain: "urbangreen",
            domain_extension: ".platform.com",
            dns_check: "passed"
        }
    },
    {
        business_profile: {
            business_name: "quantum code labs",
            owner_name: "hiroshi tanaka",
            owner_email: "h.tanaka@quantumlabs.io",
            submission_date: "january 27, 2026",
            status: "verified"
        },
        submitted_documents: [
            {
                file_name: "ip_declaration.pdf",
                size: "0.5 mb",
                uploaded_at: "45 minutes ago"
            },
            {
                file_name: "articles_of_assoc.pdf",
                size: "3.3 mb",
                uploaded_at: "50 minutes ago"
            }
        ],
        instance_details: {
            requested_subdomain: "q-code-labs",
            domain_extension: ".platform.com",
            dns_check: "passed"
        }
    }
]

export function ApproveVendor() {
    const { isAdminSliderOpen } = useSelector((state: any) => state.adminSlider);
    const [isOpen, setIsOpen] = useState<number | null>(null);
    return (
        <>
            <Navbar title="Vendors Applications" />
            <Sidebar />
            <main className={`admin_approveVendor mr-6  ${isAdminSliderOpen ? 'ml-50 ' : 'ml-24 '}`}>
                <div>
                    {vendorApplications.map((application, index) => (
                        <section key={index} className="border border-gray-400 my-6 rounded-xl">
                            <div onClick={() => setIsOpen(isOpen === index ? null : index)} className={`${isOpen === index ? ' border-b' : ''} px-4 py-2 flex justify-between items-center`}  >
                                <p className="text-xl font-bold">
                                    Application Request from {application.business_profile.business_name}
                                </p>
                                <button >
                                    <img src={down_arrow} className={`${isOpen === index ? '' : 'rotate-180'}`} alt="dropdown Arrow" />
                                </button>

                            </div>
                            {isOpen === index && (
                                <>
                                    <div className="border border-gray-200 p-4   border-b-0">
                                        <span className="flex justify-between p-4 border border-gray-400 rounded-2xl mb-0">
                                            <div className="leftSection px-4">
                                                <h1 className="text-xl font-bold ">Business Profile</h1>
                                                <p className="my-4 flex flex-col"><span className="font-semibold text-gray-500">BUSINESS NAME</span> {application.business_profile.business_name}</p>
                                                <p className="my-4 flex flex-col"><span className="font-semibold text-gray-500">OWNER NAME</span> {application.business_profile.owner_name}</p>
                                                <p className="my-4 flex flex-col"><span className="font-semibold text-gray-500">OWNER EMAIL</span> {application.business_profile.owner_email}</p>
                                            </div>
                                            <div className="rightSection px-4">
                                                <p className="text-right">{application.business_profile.submission_date}</p>
                                                <div className="w-full flex justify-start   flex-col gap-6 bg-gray-100 my-4 border py-4 px-6 rounded-lg   items-center">
                                                    <span className="flex w-full  gap-6">


                                                        <img src={internet_icon} className="w-8 h-8" alt="Internet Icon" />
                                                        <p className="text-lg  font-bold">

                                                            Instance Domain Assignment
                                                        </p>
                                                    </span>
                                                    <label htmlFor="Requested Subdomain" className="font-semibold w-full text-gray-500">Requested Subdomain
                                                    </label>
                                                    <span className="flex ">


                                                        <p className="text-xl bg-white border  min-w-64 border-gray-400 p-4 py-2 rounded-l-lg ">{application.instance_details.requested_subdomain}</p>
                                                        <p className="text-xl border border-gray-400 p-4 py-2 rounded-r-lg bg-gray-200">.platform.com</p>
                                                    </span>
                                                    <label htmlFor="dns check" className="w-full font-semibold flex gap-6 items-center text-gray-500">
                                                        <input type="checkbox" className="w-6 h-6 bg-white " />
                                                        DNS check passed. Domain is available.</label>
                                                </div>
                                            </div>

                                        </span>
                                        <span className="flex gap-6 justify-between items-baseline">

                                            <div className=" flex-2 p-4 border-2 border-gray-300 rounded-xl ">
                                                <h1 className="text-xl font-bold px-4">Submitted Documents</h1>
                                                <div className="flex flex-col gap-6  ">
                                                    {application.submitted_documents.map((doc, docIndex) => (

                                                        <div key={docIndex} className={`  ${docIndex == application.submitted_documents.length - 1 ? '' : 'border-b  border-gray-300'}   p-4 flex   gap-10`}>
                                                            <span className="flex gap-2 items-center">
                                                                <File size={32} />
                                                                {/* <img src={file_icon} alt="" className="w-6 h-6"/>                                                    */}
                                                                <p className="font-semibold">{doc.file_name}</p>
                                                            </span>
                                                            <p className="text-gray-500">Size: {doc.size}</p>
                                                            <p className="text-blue-500 underline cursor-pointer">
                                                                view
                                                            </p>
                                                        </div>

                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-1 flex-col gap-6 border-2 border-gray-300 rounded-xl mt-6 px-8 py-4 ">
                                                <h1 className="font-bold text-2xl">Validation Actions</h1>
                                                <p>By approving, a dedicated database instance will be
                                                    provisioned for
                                                    <span className="ml-1 font-black">


                                                        {application.instance_details.requested_subdomain}
                                                    </span></p>

                                                <button className="rounded-lg font-medium text-white bg-black py-2 px-4">Verify & Approve Vendor</button>
                                                <button className="rounded-lg font-medium bg-red-50 text-red-500 py-2 px-4">Reject</button>
                                            </div>
                                        </span>

                                    </div>
                                </>
                            )
                            }
                        </section>)
                    )}
                </div>
            </main>

        </>
    )
}