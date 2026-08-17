// src/pages/Waybills.tsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  Clock3,
  Truck,
  CheckCircle2,
} from 'lucide-react';

import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import WaybillTable from '../components/waybills/WaybillTable';

import {
  useWaybills,
  useWaybillStats,
} from '../hooks/useWaybills';

import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../constants/permissions';

export default function Waybills() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.WAYBILL.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-red-700 sm:text-xl">
          Access Denied
        </h2>

        <p className="mt-2 text-sm text-red-600 sm:text-base">
          You don't have permission to view waybills.
        </p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useWaybills(
    debouncedSearch,
    statusFilter,
    page
  );

  const {
    data: stats,
    isLoading: statsLoading,
  } = useWaybillStats();

  const { waybills, pagination } = useMemo(() => {
    if (!data) {
      return {
        waybills: [],
        pagination: {
          totalPages: 1,
          total: 0,
          limit: 20,
        },
      };
    }

    if (Array.isArray(data)) {
      return {
        waybills: data,
        pagination: {
          totalPages: 1,
          total: data.length,
          limit: data.length,
        },
      };
    }

    return {
      waybills: data.data ?? [],
      pagination:
        data.pagination ?? {
          totalPages: 1,
          total: 0,
          limit: 20,
        },
    };
  }, [data]);

  return (
    <div className="space-y-5 text-slate-900 sm:space-y-7">

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <PageHeader
            title="Waybills"
            subtitle="Manage delivery waybills for customer orders."
          />
        </div>

        <PermissionGate
          permission={PERMISSIONS.WAYBILL.CREATE}
        >
          <Button
            onClick={() => navigate('/waybills/new')}
            className="shrink-0"
          >
            <Plus size={17} />

            <span className="hidden sm:inline">
              New Waybill
            </span>

            <span className="sm:hidden">
              New
            </span>
          </Button>
        </PermissionGate>
      </div>


      {/* =========================================
          SUMMARY STATS
      ========================================== */}

      {!statsLoading && stats && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

            <div className="flex items-center justify-between">
              <FileText
                size={18}
                className="text-indigo-600"
              />

              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                Total
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-slate-900">
              {stats.totalWaybills}
            </h3>

          </div>


          {/* Pending */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

            <div className="flex items-center justify-between">
              <Clock3
                size={18}
                className="text-yellow-600"
              />

              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                Pending
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-yellow-600">
              {stats.pending}
            </h3>

          </div>


          {/* In Transit */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

            <div className="flex items-center justify-between">
              <Truck
                size={18}
                className="text-blue-600"
              />

              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                In Transit
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-blue-600">
              {stats.inTransit}
            </h3>

          </div>


          {/* Delivered */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

            <div className="flex items-center justify-between">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />

              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                Delivered
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-emerald-600">
              {stats.delivered}
            </h3>

          </div>

        </div>
      )}


      {/* =========================================
          SEARCH + FILTERS
      ========================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="grid gap-3 lg:grid-cols-3">

          <Input
            placeholder="Search waybill or destination..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-2.5
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100
            "
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="LOADING">
              Loading
            </option>

            <option value="IN_TRANSIT">
              In Transit
            </option>

            <option value="DELIVERED">
              Delivered
            </option>

            <option value="RETURNED">
              Returned
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

        </div>

      </div>


      {/* =========================================
          WAYBILL LIST
      ========================================== */}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center sm:py-20">

          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading waybills...
          </p>

        </div>
      ) : (
        <WaybillTable
          waybills={waybills}
        />
      )}


      {/* =========================================
          PAGINATION
      ========================================== */}

      <Pagination
        page={page}
        totalPages={pagination.totalPages ?? 1}
        total={pagination.total ?? 0}
        limit={pagination.limit ?? 20}
        onPageChange={setPage}
      />

    </div>
  );
}