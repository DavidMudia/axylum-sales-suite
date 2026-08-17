// src/pages/Customers.tsx

import { useState, useMemo } from 'react';
import {
  Plus,
  Users,
  UserCheck,
  UserX,
  Ban,
  Wallet,
  Search,
} from 'lucide-react';

import { useDebounce } from '../hooks/useDebounce';

import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';

import CustomerTable from '../components/customers/CustomerTable';
import CustomerDrawer from '../components/customers/CustomerDrawer';

import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useCustomerStats,
} from '../hooks/useCustomers';

import { useAuth } from '../context/AuthContext';

import type { Customer } from '../api/customer';

import { PERMISSIONS } from '../constants/permissions';
import { formatCurrency } from '../utils/currency';

export default function Customers() {
  const { hasPermission } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | Permission
  |--------------------------------------------------------------------------
  */

  if (!hasPermission(PERMISSIONS.CUSTOMER.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-red-700 sm:text-xl">
          Access Denied
        </h2>

        <p className="mt-2 text-sm text-red-600 sm:text-base">
          You don't have permission to view customers.
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useCustomers(
    debouncedSearch,
    page
  );

  const { data: stats, isLoading: statsLoading } =
    useCustomerStats();

  const customers = useMemo(
    () => data?.data ?? [],
    [data]
  );

  /*
  |--------------------------------------------------------------------------
  | Mutations
  |--------------------------------------------------------------------------
  */

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);

    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingCustomer) return;

    await updateMutation.mutateAsync({
      id: editingCustomer.id,
      data: formData,
    });

    setDrawerOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this customer?'
      )
    ) {
      return;
    }

    await deleteMutation.mutateAsync(id);
  };

  const openEditDrawer = (customer: Customer) => {
    setEditingCustomer(customer);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCustomer(null);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="mx-auto w-full max-w-[1700px] space-y-6 text-slate-900 sm:space-y-8">

      {/* ================================================================ */}
      {/* PAGE HEADER */}
      {/* ================================================================ */}

      <section className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">

        <PageHeader
          title="Customers"
          subtitle="Manage customer relationships and outstanding balances."
        />

        <PermissionGate
          permission={PERMISSIONS.CUSTOMER.CREATE}
        >
          <Button
            onClick={() => {
              setEditingCustomer(null);
              setDrawerOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus size={18} />
            New Customer
          </Button>
        </PermissionGate>

      </section>


      {/* ================================================================ */}
      {/* CUSTOMER STATS */}
      {/* ================================================================ */}

      {!statsLoading && stats && (
        <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
                <Users size={19} />
              </div>

            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
              Total Customers
            </p>

            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {stats.totalCustomers}
            </h3>

          </div>


          {/* Active */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
              <UserCheck size={19} />
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
              Active
            </p>

            <h3 className="mt-1 text-xl font-bold text-emerald-600 sm:text-2xl">
              {stats.activeCustomers}
            </h3>

          </div>


          {/* Inactive */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:h-10 sm:w-10">
              <UserX size={19} />
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
              Inactive
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-500 sm:text-2xl">
              {stats.inactiveCustomers}
            </h3>

          </div>


          {/* Blocked */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 sm:h-10 sm:w-10">
              <Ban size={19} />
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
              Blocked
            </p>

            <h3 className="mt-1 text-xl font-bold text-red-500 sm:text-2xl">
              {stats.blockedCustomers}
            </h3>

          </div>


          {/* Outstanding */}

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-1">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
              <Wallet size={19} />
            </div>

            <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
              Outstanding
            </p>

            <h3 className="mt-1 truncate text-xl font-bold text-indigo-600 sm:text-2xl">
              {formatCurrency(stats.totalOutstanding)}
            </h3>

          </div>

        </section>
      )}


      {/* ================================================================ */}
      {/* SEARCH */}
      {/* ================================================================ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="relative w-full">

          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search customers, companies, phone or email..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />

        </div>

      </section>


      {/* ================================================================ */}
      {/* CUSTOMER LIST */}
      {/* ================================================================ */}

      <section>

        {isLoading ? (

          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm sm:py-24">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

            <p className="mt-4 text-sm text-slate-500 sm:text-base">
              Loading customers...
            </p>

          </div>

        ) : (

          <CustomerTable
            customers={customers}
            onEdit={openEditDrawer}
            onDelete={handleDelete}
          />

        )}

      </section>


      {/* ================================================================ */}
      {/* PAGINATION */}
      {/* ================================================================ */}

      <Pagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        total={data?.pagination.total ?? 0}
        limit={data?.pagination.limit ?? 20}
        onPageChange={setPage}
      />


      {/* ================================================================ */}
      {/* CUSTOMER DRAWER */}
      {/* ================================================================ */}

      <CustomerDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingCustomer}
        onSubmit={
          editingCustomer
            ? handleUpdate
            : handleCreate
        }
        isSubmitting={isSubmitting}
      />

    </div>
  );
}