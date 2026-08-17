// src/components/customers/CustomerTable.tsx

import {
  Edit,
  Trash2,
  Eye,
  Phone,
  Building2,
  CalendarDays,
  Wallet,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import type { Customer } from '../../api/customer';

import { statusColor } from '../../utils/statusColor';
import { formatCurrency } from '../../utils/currency';

type Props = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
};

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: Props) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm sm:py-24">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Building2 size={22} />
        </div>

        <p className="mt-4 text-base font-medium text-slate-700">
          No customers found
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search or add a new customer.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ================================================================ */}
      {/* DESKTOP TABLE */}
      {/* ================================================================ */}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">

        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-slate-200">

            {/* Header */}

            <thead className="bg-slate-50">

              <tr>

                <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Company
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Outstanding
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>


            {/* Body */}

            <tbody className="divide-y divide-slate-100 bg-white">

              {customers.map((customer) => (

                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-slate-50/80"
                >

                  {/* Customer */}

                  <td className="px-6 py-5">

                    <Link
                      to={`/customers/${customer.id}`}
                      className="group flex items-center gap-3"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                        {customer.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-600">
                          {customer.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Customer #{customer.id}
                        </p>

                      </div>

                    </Link>

                  </td>


                  {/* Company */}

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-2 text-sm text-slate-600">

                      <Building2
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <span>
                        {customer.companyName || 'Individual'}
                      </span>

                    </div>

                  </td>


                  {/* Phone */}

                  <td className="px-6 py-5">

                    {customer.phone ? (

                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <Phone
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        <span>{customer.phone}</span>

                      </div>

                    ) : (

                      <span className="text-sm text-slate-400">
                        —
                      </span>

                    )}

                  </td>


                  {/* Balance */}

                  <td className="px-6 py-5">

                    <p
                      className={`text-sm font-semibold ${
                        customer.outstandingBalance > 0
                          ? 'text-red-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {formatCurrency(
                        customer.outstandingBalance
                      )}
                    </p>

                  </td>


                  {/* Status */}

                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>

                  </td>


                  {/* Created */}

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                      <CalendarDays
                        size={15}
                        className="text-slate-400"
                      />

                      {new Date(
                        customer.createdAt
                      ).toLocaleDateString()}

                    </div>

                  </td>


                  {/* Actions */}

                  <td className="px-6 py-5">

                    <div className="flex items-center justify-end gap-1">

                      <Link
                        to={`/customers/${customer.id}`}
                        title="View customer"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Eye size={17} />
                      </Link>

                      <button
                        type="button"
                        title="Edit customer"
                        onClick={() =>
                          onEdit(customer)
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        title="Delete customer"
                        onClick={() =>
                          onDelete(customer.id)
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================================================================ */}
      {/* MOBILE CUSTOMER CARDS */}
      {/* ================================================================ */}

      <div className="space-y-3 md:hidden">

        {customers.map((customer) => (

          <div
            key={customer.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >

            {/* Top */}

            <div className="flex items-start justify-between gap-3">

              <Link
                to={`/customers/${customer.id}`}
                className="flex min-w-0 items-center gap-3"
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                  {customer.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">

                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {customer.name}
                  </h3>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {customer.companyName ||
                      'Individual customer'}
                  </p>

                </div>

              </Link>


              {/* Status */}

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor(
                  customer.status
                )}`}
              >
                {customer.status}
              </span>

            </div>


            {/* Details */}

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">

              {/* Phone */}

              <div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">

                  <Phone size={13} />

                  <span>Phone</span>

                </div>

                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                  {customer.phone || 'Not provided'}
                </p>

              </div>


              {/* Balance */}

              <div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">

                  <Wallet size={13} />

                  <span>Outstanding</span>

                </div>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    customer.outstandingBalance > 0
                      ? 'text-red-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {formatCurrency(
                    customer.outstandingBalance
                  )}
                </p>

              </div>

            </div>


            {/* Bottom */}

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

              <div className="flex items-center gap-1.5 text-xs text-slate-400">

                <CalendarDays size={13} />

                {new Date(
                  customer.createdAt
                ).toLocaleDateString()}

              </div>


              <div className="flex items-center gap-1">

                <Link
                  to={`/customers/${customer.id}`}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  title="View customer"
                >
                  <Eye size={17} />
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    onEdit(customer)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  title="Edit customer"
                >
                  <Edit size={17} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(customer.id)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete customer"
                >
                  <Trash2 size={17} />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>
    </>
  );
}