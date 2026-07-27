import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    MapPin,
    User,
    ShieldCheck,
    Phone,
    Mail,
    Check,
} from "lucide-react";

import { createWarehouse } from "../../api/warehouse";

export default function CreateWarehouse() {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] = useState({

        name: "",

        code: "",

        description: "",

        address: "",

        city: "",

        state: "",

        country: "Nigeria",

        phone: "",

        email: "",

        managerName: "",

        isPrimary: false,

        adminPassword: "",

    });

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    }

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        try {

            setLoading(true);

            /*
                Later this password will be
                verified first.

                await verifyPassword(...)
            */

            await createWarehouse({
                ...form,
            });

            navigate("/warehouses");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="mx-auto max-w-6xl space-y-8 text-slate-900">

            <Link
                to="/warehouses"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
                <ArrowLeft size={18}/>
                Back to Warehouses
            </Link>

            {/* Hero */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">

                    Warehouse Administration

                </p>

                <h1 className="mt-2 text-4xl font-bold text-white">

                    Create Warehouse

                </h1>

                <p className="mt-3 max-w-3xl text-slate-400">

                    Register a warehouse that will
                    receive inventory, process goods
                    receipts and support logistics
                    across your organization.

                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >

                {/* General */}

                <div className="rounded-3xl border bg-white p-8 text-slate-900">

                    <div className="mb-8 flex items-center gap-3">

                        <Building2 className="text-indigo-600"/>

                        <div>

                            <h2 className="font-bold text-xl text-slate-900">

                                General Information

                            </h2>

                            <p className="text-slate-500">

                                Basic warehouse details.

                            </p>

                        </div>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2 text-slate-900">

                        <Input
                            label="Warehouse Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Warehouse Code"
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            required
                        />

                        <div className="md:col-span-2 ">

                            <label className="mb-2 block font-medium">

                                Description

                            </label>

                            <textarea

                                rows={4}

                                name="description"

                                value={form.description}

                                onChange={handleChange}

                                className="w-full rounded-xl border p-3"

                            />

                        </div>

                    </div>

                </div>

                {/* Location */}

                <div className="rounded-3xl border bg-white p-8 text-slate-900">

                    <div className="mb-8 flex items-center gap-3">

                        <MapPin className="text-indigo-600"/>

                        <h2 className="font-bold text-xl">

                            Location

                        </h2>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <Input
                            label="Address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />

                        <Input
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                        />

                        <Input
                            label="State"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                        />

                        <Input
                            label="Country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                {/* Contact */}

                <div className="rounded-3xl border bg-white p-8 text-slate-900">

                    <div className="mb-8 flex items-center gap-3">

                        <User className="text-indigo-600"/>

                        <h2 className="font-bold text-xl">

                            Contact

                        </h2>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <Input
                            icon={<User size={18}/>}
                            label="Manager"
                            name="managerName"
                            value={form.managerName}
                            onChange={handleChange}
                        />

                        <Input
                            icon={<Phone size={18}/>}
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <div className="md:col-span-2">

                            <Input
                                icon={<Mail size={18}/>}
                                label="Email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                </div>

                {/* Security */}

                <div className="rounded-3xl border bg-white p-8 text-slate-900">

                    <div className="mb-8 flex items-center gap-3">

                        <ShieldCheck className="text-indigo-600"/>

                        <h2 className="font-bold text-xl">

                            Administrator Verification

                        </h2>

                    </div>

                    <Input

                        type="password"

                        label="Administrator Password"

                        name="adminPassword"

                        value={form.adminPassword}

                        onChange={handleChange}

                        required

                    />

                    <p className="mt-3 text-sm text-slate-500">

                        Creating a warehouse requires
                        administrator verification.

                    </p>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-4">

                    <Link

                        to="/warehouses"

                        className="rounded-xl border px-6 py-3"

                    >

                        Cancel

                    </Link>

                    <button

                        disabled={loading}

                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700"

                    >

                        <Check size={18}/>

                        {loading
                            ? "Creating..."
                            : "Create Warehouse"}

                    </button>

                </div>

            </form>

        </div>

    );

}

/* ---------- Reusable Input ---------- */

type InputProps = {

    label: string;

    name: string;

    value: string;

    onChange: (
        e: React.ChangeEvent<any>
    ) => void;

    type?: string;

    icon?: React.ReactNode;

    required?: boolean;

};

function Input({

    label,

    icon,

    ...props

}: InputProps) {

    return (

        <div>

            <label className="mb-2 block font-medium">

                {label}

            </label>

            <div className="relative">

                {icon && (

                    <div className="absolute left-3 top-3 text-slate-400">

                        {icon}

                    </div>

                )}

                <input

                    {...props}

                    className={`w-full rounded-xl border border-slate-300 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
                        icon
                            ? "pl-11 pr-4"
                            : "px-4"
                    }`}

                />

            </div>

        </div>

    );

}