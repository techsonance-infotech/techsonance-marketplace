"use client";
import { BASE_API_URL } from "@/constants/constants";
import { useEffect, useState } from "react";


const fetchRoles = async () => {
    const response = await fetch(`${BASE_API_URL}roles/all`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch roles');
    }
    return response.json();
};
const fetchPermissions = async () => {
    const response = await fetch(`${BASE_API_URL}permissions`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch permissions');
    }
    return response.json();
};
const createRole = async (role: string) => {
    const response = await fetch(`${BASE_API_URL}roles/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({role}),
    });
    console.log(response);
    if (!response.ok) {
        throw new Error('Failed to create role');
    }
    return response.json();
};

const createPermission = async (permissionName: string) => {
    const response = await fetch(`${BASE_API_URL}permission/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionName }),
    });
    if (!response.ok) {
        throw new Error('Failed to create permission');
    }
    return response.json();
}
const handleAssignPermission = async ({ roleId, permissionId }: { roleId: string; permissionId: string }) => {
    const res = await fetch(`${BASE_API_URL}roles/permission-to-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, permissionId }),
    });
    if (res.ok) alert('Permission assigned successfully!');
};
// Types matching your Drizzle schema
interface Role {
    id: string;
    role_name: string;
}

interface Permission {
    id: string;
    permission_name: string;
}

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [newRole, setNewRole] = useState('');
    const [newPermission, setNewPermission] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedPermission, setSelectedPermission] = useState('');

    // useEffect(async () => {
    //     fetchPermissions()
    //         .then(data => setPermissions(permissionsData => [...permissionsData, ...data]))
    //         .catch(err => console.error('Error fetching permissions:', err));
    // }, []);

    useEffect(() => {
        const getRoles = async () => {
            try {
                const rolesData = await fetchRoles();
                console.log(rolesData);
                setRoles(rolesData);
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            }
        };
        getRoles();
        const getPermissions = async () => {
            try {
                const permissionsData = await fetchPermissions();
                console.log(permissionsData);
                setPermissions(permissionsData);
            } catch (error) {
                console.error("Failed to fetch permissions:", error);
            }
        };
        getPermissions();
    }, []);

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createRole(newRole)
        if (res.status === 201) setNewRole('');
    };

    const handleCreatePermission = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createPermission(newPermission);
        if (res.ok) setNewPermission('');
    };



    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-8 text-gray-800">RBAC Management Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Role Creation */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Manage Roles</h2>
                    <form onSubmit={handleCreateRole} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="e.target.value (e.g. MODERATOR)"
                            className="border p-2 rounded flex-grow"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Add Role
                        </button>
                    </form>
                    {/* List Roles Here */}
                </div>

                {/* Permission Creation */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Manage Permissions</h2>
                    <form onSubmit={handleCreatePermission} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newPermission}
                            onChange={(e) => setNewPermission(e.target.value)}
                            placeholder="Permission Name (e.g. view_reports)"
                            className="border p-2 rounded flex-grow"
                        />
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Add Permission
                        </button>
                    </form>
                    {/* List Permissions Here */}
                </div>

                {/* Permission Assignment */}
                <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Assign Permissions to Roles</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            className="border p-2 rounded flex-grow"
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">Select a Role</option>
                            {
                                roles.map((r) => (<option key={r.id} value={r.id}>{r.role_name}</option>))
                            }
                        </select>

                        <select
                            className="border p-2 rounded flex-grow"
                            onChange={(e) => setSelectedPermission(e.target.value)}
                        >
                            <option value="">Select a Permission</option>
                            {permissions.map((p) => (<option key={p.id} value={p.id}>{p.permission_name}</option>))}
                        </select>

                        <button
                            onClick={() => handleAssignPermission({ roleId: selectedRole, permissionId: selectedPermission })}
                            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                        >
                            Link Permission to Role
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
