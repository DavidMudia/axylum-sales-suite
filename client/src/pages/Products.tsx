// src/pages/Products.tsx
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import ProductTable from '../components/products/ProductTable';
import ProductDrawer from '../components/products/ProductDrawer';
import { useProducts, useCreateProduct} from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { hasPermission } = useAuth();

  if (!hasPermission('inventory.read')) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view products.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useProducts(debouncedSearch, page);
  const products = useMemo(() => data?.data ?? [], [data]);

  const createMutation = useCreateProduct();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const isSubmitting = createMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Products" subtitle="Manage inventory, pricing and product catalogue." />
        <PermissionGate permission="inventory.create">
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> New Product
          </Button>
        </PermissionGate>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select className="rounded-xl border border-slate-300 px-4">
            <option>All Categories</option>
          </select>
          <select className="rounded-xl border border-slate-300 px-4">
            <option>All Brands</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading products...</div>
      ) : (
        <ProductTable products={products} />
      )}

      <Pagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        total={data?.pagination.total ?? 0}
        limit={data?.pagination.limit ?? 20}
        onPageChange={setPage}
      />

      <ProductDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={null}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}