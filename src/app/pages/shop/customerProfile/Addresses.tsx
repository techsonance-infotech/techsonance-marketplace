import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { Pen, Trash2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useForm } from "react-hook-form";
import type { UserProfile } from "../../../../utils/Types";
import { useEffect, useState } from "react";
import { createAddress, deleteAddress, updateAddress, setDefaultAddress } from "../../../../features/auth/authSlice";

const addressTypes = ['home', 'work', 'other'];

const AddressForm = ({ user, addressId, operation, formToggle }: {
    user: UserProfile,
    addressId?: string,
    operation: 'edit' | 'add',
    formToggle: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const existingAddress = user.addresses.find(addr => addr.address_id.toString() === addressId);
    const dispatch = useDispatch();

    const { register, reset, handleSubmit } = useForm({
        defaultValues: existingAddress && operation === 'edit' ? {
            address_id: existingAddress.address_id,
            address_for: existingAddress.address_for,
            address_line1: existingAddress.address_line1,
            city: existingAddress.city,
            state: existingAddress.state,
            country: existingAddress.country,
            phone: existingAddress.phone,
            postal_code: existingAddress.postal_code,
            is_default: existingAddress.is_default
        } : {
            address_for: 'home',
            address_line1: '',
            city: '',
            state: '',
            country: '',
            phone: '',
            postal_code: '',
            is_default: false
        }
    });

    useEffect(() => {
        if (operation === 'edit' && existingAddress) {
            reset(existingAddress);
        } else if (operation === 'add') {
            reset({
                address_for: 'home',
                address_line1: '',
                city: '',
                state: '',
                country: '',
                phone: '',
                postal_code: '',
                is_default: false
            });
        }
    }, [addressId, operation, existingAddress, reset]);

    const onSubmitHandler = (data: any) => {
        console.log('Form submitted:', { operation, data });

        if (operation === 'edit') {
            const updatedAddress = {
                ...data,
                address_id: existingAddress?.address_id, // Keep existing ID
            };
            console.log('Dispatching updateAddress:', updatedAddress);
            dispatch(updateAddress(updatedAddress));
        } else {
            const newAddress = {
                ...data,
                address_id: Date.now(), // Generate new ID
            };
            console.log('Dispatching createAddress:', newAddress);
            dispatch(createAddress(newAddress));
        }

        formToggle(false);
    };

    return (
        <section className="absolute z-20 bg-primary p-6 rounded-lg shadow-lg w-full transition-transform duration-300 ease-in-out">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {operation === 'edit' ? 'Edit Address' : 'Add New Address'}
                </h1>
                <button onClick={() => formToggle(false)} className="bg-red-100 p-1 rounded-full text-gray-600 hover:text-gray-900">
                    <DynamicIcon name="x" className="text-red-500" size={24} />
                </button>
            </header>

            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Address Type</label>
                        <select {...register('address_for')} className="mt-1 block w-full border-gray-300 rounded-md border-2 py-3 px-6 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Address Type</option>
                            {addressTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input type="text" {...register('address_line1')} className="mt-1 block w-full border-gray-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-6" />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">City</label>
                        <input type="text" {...register('city')} className="mt-1 block w-full border-gray-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-6" />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">State</label>
                        <input type="text" {...register('state')} className="mt-1 block w-full border-gray-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-6" />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Country</label>
                        <input type="text" {...register('country')} className="mt-1 block w-full border-gray-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-6" />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Postal Code</label>
                        <input type="text" {...register('postal_code')} className="mt-1 block w-full border-gray-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-6" />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" {...register('phone')} className="mt-1 block w-full border-gray-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-6" />
                    </div>
                    <div className="flex items-center mt-4">
                        <input type="checkbox" {...register('is_default')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label className="ml-2 block text-lg text-gray-700">Set as default address</label>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                    <button type="button" onClick={() => reset()} className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                        Reset
                    </button>
                </div>
            </form>
        </section>
    );
};

export function Addresses() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [formVisible, setFormVisible] = useState(false);
    const [formOperation, setFormOperation] = useState<'edit' | 'add'>('add');
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const handleDelete = (addressId: number) => {
        console.log('Delete button clicked for address_id:', addressId);
        dispatch(deleteAddress(addressId)); // Pass just the ID number
    };

    const handleSetDefault = (addressId: number) => {
        console.log('Set default button clicked for address_id:', addressId);
        dispatch(setDefaultAddress(addressId));
    };

    return (
        <section className="mb-[36vh] relative w-full">
            {user && formVisible && (
                <AddressForm
                    user={user}
                    addressId={selectedAddressId || undefined}
                    operation={formOperation}
                    formToggle={setFormVisible}
                />
            )}

            <header className="flex items-center justify-between w-full mb-6">
                <h1 className="font-bold text-2xl text-gray-900">My Addresses</h1>
                <button
                    className="px-6 py-2 border-2 text-primary bg-primary-foreground border-gray-800 rounded-lg cursor-pointer hover:border-gray-400 font-medium"
                    onClick={() => {
                        console.log('Add new address button clicked');
                        setFormOperation('add');
                        setSelectedAddressId(null);
                        setFormVisible(true);
                    }}
                >
                    + Add New Address
                </button>
            </header>

            {user?.addresses.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {user.addresses.map((address) => (
                        <div
                            key={address.address_id}
                            className={`w-full border-2 rounded-lg px-4 pt-6 pb-4 text-gray-600 ${address.is_default ? 'border-blue-300 relative' : 'border-gray-200'
                                }`}
                        >
                            {address.is_default && (
                                <span className="absolute top-0 right-0 bg-blue-500 border border-blue-500 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md">
                                    Default
                                </span>
                            )}

                            <div className="w-full flex gap-8 justify-start items-start">
                                <div className={`h-12 w-12 ${address.is_default ? 'bg-blue-300' : 'bg-gray-300'} rounded-3xl flex justify-center items-center`}>
                                    <DynamicIcon
                                        name={`${address.address_for === 'home' ? 'house' : 'hotel'}`}
                                        size={32}
                                        className={`${address.is_default ? 'text-blue-500' : 'text-gray-500'}`}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-primary-foreground">
                                        {address.address_for.charAt(0).toUpperCase() + address.address_for.slice(1)} Address
                                    </h1>
                                    <p className="text-lg font-medium">{address.address_line1}</p>
                                    <p className="text-lg font-medium">{address.city}, {address.state} {address.postal_code}</p>
                                    <p className="text-lg font-medium">{address.country}</p>
                                    <p className="text-lg font-medium text-primary-foreground">Phone: {address.phone}</p>
                                </div>
                            </div>

                            <div className="flex mt-4 items-end justify-start gap-12">
                                <button
                                    className="py-2 font-bold text-blue-500 cursor-pointer rounded-lg flex items-center gap-2"
                                    onClick={() => {
                                        console.log('Edit button clicked for address_id:', address.address_id);
                                        setSelectedAddressId(address.address_id.toString());
                                        setFormOperation('edit');
                                        setFormVisible(true);
                                    }}
                                >
                                    <Pen />
                                    Edit
                                </button>
                                <button
                                    className="font-bold py-2 text-red-500 cursor-pointer flex items-center gap-2"
                                    onClick={() => handleDelete(address.address_id)}
                                >
                                    <Trash2 />
                                    Delete
                                </button>
                                {!address.is_default && (
                                    <button
                                        className="py-2 cursor-pointer rounded-lg flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600"
                                        onClick={() => handleSetDefault(address.address_id)}
                                    >
                                        SET AS DEFAULT
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No addresses found.</p>
            )}
        </section>
    );
}