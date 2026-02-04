import Navbar from '../../../../components/vendor/Navbar'
import { Sidebar } from '../../../../components/common/Sidebar'
import { VENDOR_NAV_LINKS, VENDOR_SETTINGS_LINKS } from '../../../../utils/constants'
import { InnerSideBar } from '../../../../components/common/InnerSideBar'
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Banknote, Dot, Edit, LucideBanknote, PiggyBankIcon } from 'lucide-react';

interface InvoiceSettings {
    gstin: string;              // GSTIN number
    pan: string;                // PAN number
    businessName: string;       // Registered business name
    prefix: string;             // Invoice prefix (e.g., "INV")
    year: number;               // Invoice year (e.g., 2026)
    startSequence: number;      // Starting sequence number
    preview: string;            // Example preview (e.g., "INV-2026-00001")
    signatureUrl?: string;      // Optional signature image path
    termsAndNotes?: string;     // Optional invoice notes
}
interface BankAccount {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    primary: boolean;
}
const invoiceSettings: InvoiceSettings = { gstin: "24ABCDE1234F1Z5", pan: "ABCDE1234F", businessName: "TechWorld Innovations Pvt Ltd", prefix: "INV", year: 2026, startSequence: 467, preview: "INV-2026-00001", signatureUrl: "/uploads/signature.png", termsAndNotes: "Thank you for your business. Goods once sold will not be taken back. Authorized Signature" };
const bankAccounts: BankAccount[] = [{ bankName: "HDFC Bank", accountNumber: "XXXX-XXXX-8821", ifsc: "HDFC0001234", primary: true }];

export function BillingAndBanking() {
    const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
    const { register, getValues } = useForm({
        defaultValues: invoiceSettings
    })
    return (
        <>
            <Navbar title="Global Settings" />
            <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
            <main className={`  mr-6 pt-3  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
                <InnerSideBar links={VENDOR_SETTINGS_LINKS} style={isSidebarOpen ? 'ml-50' : 'ml-24'} />
                <form className="vendor_settings_content ml-70 mt-6  p-4 bg-white  ">

                    <section className='py-4 px-4 border-2 border-gray-200   gap-6 rounded-2xl mb-6'>
                        <header className='flex justify-between items-center'>
                            <span>
                                <h1 className='text-2xl font-bold'>Tax Identity</h1>
                                <p className='text-sm text-gray-500'>Manage your GSTIN and PAN details.</p>
                            </span>
                            {invoiceSettings.gstin && (
                                <div className='bg-green-50 border-2 rounded-2xl font-bold border-green-500 text-green-500 py-2 px-6'>
                                    Active (Regular)
                                </div>
                            )}
                        </header>
                        <span className='flex gap-12 my-6'>
                            <div className='flex-1 flex flex-col '>
                                <label htmlFor="gstin">GSTIN Number</label>
                                <input type="text" value={getValues("gstin")} id="gstin" className='form_input mt-2' {...register("gstin")} />
                            </div>
                            <div className='flex-1 flex flex-col  '>
                                <label htmlFor="pan">PAN Number</label>
                                <input type="text" value={getValues("pan")} id="pan" className='form_input mt-2' {...register("pan")} />
                            </div>
                        </span>

                        <div className='flex flex-col  '>
                            <label htmlFor="businessName">Registered Business Name</label>
                            <input type="text" value={getValues("businessName")} id="businessName" className='form_input mt-2' {...register("businessName")} />
                        </div>


                    </section>
                    <section className='py-4 px-4 border-2 border-gray-200   gap-6 rounded-2xl my-6 '>
                        <header className='flex justify-between items-center'>

                            <h1 className='text-2xl font-bold'>Invoice Customization</h1>
                        </header>

                        <span className='flex justify-between gap-12'>


                            <div className='my-6 flex flex-col gap-2 flex-1'>
                                <label className='font-bold' htmlFor="invoice prefix">Invoice Prefix</label>
                                <span className='flex'>
                                    <input type="text" value={getValues("prefix")} id="invoice prefix" className='form_input   rounded-r-none pl-4 ' {...register("prefix")} />
                                    <span className='form_input text-2xl rounded-none text-gray-500 border-2 border-gray-300 px-2 py-2    text-center w-24'>-</span>
                                    <select id="" className='form_input  rounded-l-none  w-full' {...register("year")}>
                                        <option value={2023} selected={getValues("year") === 2023}>2023</option>
                                        <option value={2024} selected={getValues("year") === 2024}>2024</option>
                                        <option value={2025} selected={getValues("year") === 2025}>2025</option>
                                        <option value={2026} selected={getValues("year") === 2026}>2026</option>
                                    </select>
                                </span>
                                <p className='text-gray-500'>Preview: {getValues("prefix")}-{getValues("year")}</p>
                            </div>
                            <div className='my-6 flex flex-col gap-2 flex-1 w-full '>
                                <label className='font-bold' htmlFor="start sequence">Starting Sequence Number</label>
                                <input type="number" value={getValues("startSequence")} id="start sequence" className='form_input mt-3 w-full ' {...register("startSequence")} />
                            </div>
                        </span>
                        <div className='flex flex-col gap-2 my-6 '>
                            <label htmlFor="Authorized Signature" className='font-bold'>Authorized Signature</label>
                            <input type="file" id="Authorized Signature" className='form_input mt-2  ' {...register("signatureUrl")} />
                        </div>
                        <div className='my-6 flex flex-col gap-2 '>
                            <label htmlFor="terms and notes" className='font-bold'>Invoice Terms & Notes</label>
                            <textarea id="terms and notes" rows={4} className='form_input mt-2 w-full ' {...register("termsAndNotes")}>{getValues("termsAndNotes")}</textarea>

                        </div>
                        <div className='align-right mt-6 flex justify-end'>
                            <input type="submit" value={'Save Changes'} className='py-2 px-4 bg-blue-500 text-white rounded-lg hover:border-blue-300' />
                        </div>
                    </section>
                    <section className=' border-2 border-gray-300 rounded-2xl p-4 my-6 '>

                        <header className='flex justify-between items-center mb-6'>
                            <span>
                                <h1 className='text-2xl font-bold'>Bank Accounts</h1>
                                <p className='text-sm text-gray-500'>Manage your bank accounts for payouts.</p>
                            </span>
                            <button className='py-2 px-4  bg-blue-500 text-white rounded-lg' >+ Add Account</button>
                        </header>
                        {
                            bankAccounts.map((account, index) => (

                                <div key={index} className={`flex justify-between items-center  border-2  ${account.primary ? 'border-blue-500 ' : 'border-gray-300'} px-6 py-4 mb-4 rounded-lg`}>
                                    <span className='flex items-center gap-2'>

                                    <span className='p-2 border-blue-500 bg-blue-50 rounded-lg border '>

                                        <Banknote  />
                                    </span>

                                        <div>
                                            <h2 className="text-xl font-bold mb-2">{account.bankName}</h2>
                                            <p className="flex text-gray-500"> {account.accountNumber} <Dot />
                                                 IFSC: {account.ifsc}</p>
                                        </div>
                                    </span>
                                    {account.primary && (
                                        <span className="py-2 px-4 rounded-xl text-sm font-semibold text-green-600  border-green-500 bg-green-100 mb-2 inline-block">Primary Account</span>
                                    )}

                                    <button className="p-2 "><Edit /> </button>


                                </div>



                            )
                            )
                        }
                    </section>


                </form>
            </main>
        </>
    )
}
