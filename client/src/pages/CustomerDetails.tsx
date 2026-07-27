// src/pages/CustomerDetails.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomers';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import { formatCurrency } from '../utils/currency';

type Tab = 'quotes' | 'orders' | 'invoices' | 'payments' | 'refunds';

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomer(Number(id));
  const [activeTab, setActiveTab] = useState<Tab>('quotes');

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!customer) {
    return <div className="rounded-2xl border bg-white p-12 text-center">Customer not found.</div>;
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'quotes', label: 'Quotes', count: customer.quotes?.length || 0 },
    { key: 'orders', label: 'Sales Orders', count: customer.salesOrders?.length || 0 },
    { key: 'invoices', label: 'Invoices', count: customer.invoices?.length || 0 },
    { key: 'payments', label: 'Payments', count: customer.payments?.length || 0 },
    { key: 'refunds', label: 'Refunds', count: customer.refunds?.length || 0 },
  ];

  const renderContent = () => {
    const dataMap = {
      quotes: customer.quotes || [],
      orders: customer.salesOrders || [],
      invoices: customer.invoices || [],
      payments: customer.payments || [],
      refunds: customer.refunds || [],
    };
    const items = dataMap[activeTab] as any[];

    if (items.length === 0) {
      return <div className="py-8 text-center text-slate-500">No {activeTab} found.</div>;
    }

    return (
      <ul className="divide-y divide-slate-200">
        {items.map((item) => (
          <li key={item.id} className="py-3 flex justify-between items-center">
            <Link
              to={`/${activeTab}/${item.id}`}
              className="text-indigo-600 hover:underline"
            >
              {item.quoteNumber || item.orderNumber || item.invoiceNumber || item.paymentNumber || item.refundNumber || `#${item.id}`}
            </Link>
            <span className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title={customer.name}
          subtitle={customer.companyName || 'Individual'}
        />
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(customer.status)}`}
        >
          {customer.status}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Contact Information</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Customer Number</dt>
              <dd className="font-medium">{customer.customerNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium">{customer.email || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium">{customer.phone || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Address</dt>
              <dd className="font-medium">
                {[customer.address, customer.city, customer.state, customer.country].filter(Boolean).join(', ') || '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Notes</dt>
              <dd className="font-medium">{customer.notes || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Financial Summary</h3>
          <div className="mt-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Outstanding Balance</p>
              <p className="text-3xl font-bold text-indigo-600">{formatCurrency(customer.outstandingBalance)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Tabs */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-4">{renderContent()}</div>
      </div>
    </div>
  );
}