import React from 'react'
import Navbar from '../../../../components/vendor/Navbar'

import { VENDOR_NAV_LINKS, VENDOR_SETTINGS_LINKS } from '../../../../utils/constants'
import { Sidebar } from '../../../../components/common/Sidebar'
import { InnerSideBar } from '../../../../components/common/InnerSideBar'
import { useSelector } from 'react-redux'
interface LocationType {
    id: string;              // Unique identifier (e.g., WH001, HUB001)
    name: string;            // Display name (e.g., "Main Warehouse (Surat)")
    type: "Warehouse" | "Hub"; // Type of location
    address: string;         // Street/area address
    city: string;            // City name
    state: string;           // State/region
    default: boolean;        // Marks if this is the default location
    contactPerson?: string;  // Optional contact person
    phone?: string;          // Optional phone number
}

const locations: LocationType[] = [
    {
        "id": "WH001",
        "name": "Main Warehouse (Surat)",
        "type": "Warehouse",
        "address": "123, Ring Road, Industrial Area",
        "city": "Surat",
        "state": "Gujarat",
        "default": true,
        "contactPerson": "Rajesh Patel",
        "phone": "+91-9876543210"
    },
    {
        "id": "HUB001",
        "name": "North Hub (Delhi)",
        "type": "Hub",
        "address": "Okhla Industrial Estate",
        "city": "Delhi",
        "state": "Delhi",
        "default": false,
        "contactPerson": "Anil Sharma",
        "phone": "+91-9123456780"
    }
]



export function Locations() {
    const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
    const [locationList, setLocationList] = React.useState<LocationType[]>(locations);
    const [selectedLocation, setSelectedLocation] = React.useState<LocationType | null>(null);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [isAdding, setIsAdding] = React.useState<boolean>(false);
    const deleteLocation = (id: string) => {
        const updatedLocations = locationList.filter(location => location.id !== id);
        setLocationList(updatedLocations);
    }
    return (
        <>
            <Navbar title="Global Settings" />
            <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
            <main className={`  mr-6 pt-3  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
                <InnerSideBar links={VENDOR_SETTINGS_LINKS} style={isSidebarOpen ? 'ml-50' : 'ml-24'} />
                <section className="vendor_settings_content ml-70 mt-6 p-6 bg-white rounded-lg border-2 border-gray-300 ">

                    <div className=' flex justify-between items-center mb-6'>
                        <h1>Pickup Locations</h1>
                        <button className='px-6 py-2 border-2 border-gray-300 rounded-lg' onClick={() => setIsAdding(true)}>+ Add new</button>
                    </div>

                    {
                        locationList.map((location) => (
                            <div key={location.id} className={`my-6 hover:border-blue-500 hover:bg-blue-50 border-2  ${location.default ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} px-6 py-4 mb-4 rounded-lg`}>
                                {location.default && (
                                    <span className="py-2 px-4 rounded-xl text-sm font-semibold text-blue-600  border-blue-500 bg-blue-100 mb-2 inline-block">Default Location</span>
                                )}
                                <h2 className="text-xl font-bold mb-2">{location.name} ({location.type})</h2>
                                <p className="mb-1">{location.address}, {location.city}, {location.state}</p>
                                {location.contactPerson && <p className="mb-1">Contact Person: {location.contactPerson}</p>}
                                {location.phone && <p className="mb-1">Phone: {location.phone}</p>}
                                <div className="mt-4 flex gap-4">
                                    <button className="px-4 py-2 min-w-24 bg-blue-200 text-blue-600 font-semibold rounded-lg" onClick={() => { setSelectedLocation(location); setIsEditing(true); }}>Edit</button>
                                    <button onClick={() => deleteLocation(location.id)} className="px-4 py-2 min-w-24 bg-red-200 text-red-600 font-semibold rounded-lg">Delete</button>
                                </div>
                            </div>
                        )
                        )
                    }
                </section>

            </main>
        </>
    )
}
