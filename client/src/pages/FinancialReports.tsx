// src/pages/FinancialReport.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth } from 'date-fns';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useWarehouses } from '../hooks/useWarehouses';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/currency';
import { getFinancialReport } from '../api/reports';
import type { Warehouse } from '../api/warehouse';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#fb7185', '#f97316', '#eab308', '#22d3ee'];

type Tab =
  | 'kpis'
  | 'pl'
  | 'balancesheet'
  | 'cashflow'
  | 'expenses'
  | 'receivables'
  | 'payables'
  | 'profitanalysis'
  | 'budget'
  | 'breakeven'
  | 'cashforecast'
  | 'ratios';

export default function FinancialReport() {
  const today = new Date();
  const firstDay = startOfMonth(today);
  const [startDate, setStartDate] = useState(format(firstDay, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(today, 'yyyy-MM-dd'));
  const [branchId, setBranchId] = useState<number | ''>('');
  const [activeTab, setActiveTab] = useState<Tab>('kpis');

  const { data: warehouses } = useWarehouses();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['financial-report', { startDate, endDate, branchId }],
    queryFn: () =>
      getFinancialReport({
        startDate,
        endDate,
        branchId: branchId || undefined,
      }),
    enabled: !!startDate && !!endDate,
  });

  const handleGenerate = () => refetch();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'kpis', label: 'KPIs' },
    { key: 'pl', label: 'P&L' },
    { key: 'balancesheet', label: 'Balance Sheet' },
    { key: 'cashflow', label: 'Cash Flow' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'receivables', label: 'Receivables' },
    { key: 'payables', label: 'Payables' },
    { key: 'profitanalysis', label: 'Profit Analysis' },
    { key: 'budget', label: 'Budget vs Actual' },
    { key: 'breakeven', label: 'Break-even' },
    { key: 'cashforecast', label: 'Cash Forecast' },
    { key: 'ratios', label: 'Ratios' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Financial Report" subtitle="Comprehensive financial health overview" />

      {/* Filters */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-900">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-slate-700">Branch</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(Number(e.target.value) || '')}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">All</option>
              {warehouses?.data?.map((w: Warehouse) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleGenerate}>Generate Report</Button>
        </div>
      </div>

      {data && (
        <>
          <div className="border-b border-slate-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-8">
            {activeTab === 'kpis' && <KPIsTab data={data} />}
            {activeTab === 'pl' && <PLTab data={data} />}
            {activeTab === 'balancesheet' && <BalanceSheetTab data={data} />}
            {activeTab === 'cashflow' && <CashFlowTab data={data} />}
            {activeTab === 'expenses' && <ExpensesTab data={data} />}
            {activeTab === 'receivables' && <ReceivablesTab data={data} />}
            {activeTab === 'payables' && <PayablesTab data={data} />}
            {activeTab === 'profitanalysis' && <ProfitAnalysisTab data={data} />}
            {activeTab === 'budget' && <BudgetTab data={data} />}
            {activeTab === 'breakeven' && <BreakEvenTab data={data} />}
            {activeTab === 'cashforecast' && <CashForecastTab data={data} />}
            {activeTab === 'ratios' && <RatiosTab data={data} />}
          </div>
        </>
      )}
    </div>
  );
}

// ----- Tab Components -----

function KPIsTab({ data }: any) {
  const { kpis } = data;
  const items = [
    { label: 'Revenue', value: kpis.revenue },
    { label: 'Expenses', value: kpis.expenses },
    { label: 'Gross Profit', value: kpis.grossProfit },
    { label: 'Operating Profit', value: kpis.operatingProfit },
    { label: 'Net Profit', value: kpis.netProfit },
    { label: 'Cash Flow', value: kpis.cashFlow },
    { label: 'Bank Balance', value: kpis.bankBalance },
    { label: 'Receivables', value: kpis.receivables },
    { label: 'Payables', value: kpis.payables },
    { label: 'Tax', value: kpis.tax },
    { label: 'Working Capital', value: kpis.workingCapital },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 text-slate-900">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{item.label}</p>
          <h3 className="text-2xl font-bold">{formatCurrency(item.value)}</h3>
        </div>
      ))}
    </div>
  );
}

function PLTab({ data }: any) {
  const { profitAndLoss } = data;
  const items = [
    { label: 'Revenue', value: profitAndLoss.revenue },
    { label: 'COGS', value: profitAndLoss.cogs },
    { label: 'Gross Profit', value: profitAndLoss.grossProfit },
    { label: 'Expenses', value: profitAndLoss.expenses },
    { label: 'Operating Profit', value: profitAndLoss.operatingProfit },
    { label: 'Tax', value: profitAndLoss.tax },
    { label: 'Net Profit', value: profitAndLoss.netProfit },
  ];
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-900">
      <h3 className="text-sm font-semibold text-slate-500 mb-4">Profit & Loss Statement</h3>
      <dl className="space-y-2 text-sm">
        {items.map((item, idx) => (
          <div key={item.label} className={`flex justify-between ${idx === items.length - 1 ? 'border-t pt-2 font-bold' : ''}`}>
            <dt>{item.label}</dt>
            <dd>{formatCurrency(item.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function BalanceSheetTab({ data }: any) {
  const { balanceSheet } = data;
  const { assets, liabilities, equity } = balanceSheet;
  return (
    <div className="grid gap-6 md:grid-cols-3 text-slate-900">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Assets</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt>Cash</dt><dd>{formatCurrency(assets.cash)}</dd></div>
          <div className="flex justify-between"><dt>Receivables</dt><dd>{formatCurrency(assets.receivables)}</dd></div>
          <div className="flex justify-between"><dt>Inventory</dt><dd>{formatCurrency(assets.inventory)}</dd></div>
          <div className="flex justify-between border-t pt-2 font-bold"><dt>Total Assets</dt><dd>{formatCurrency(assets.total)}</dd></div>
        </dl>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Liabilities</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt>Payables</dt><dd>{formatCurrency(liabilities.payables)}</dd></div>
          <div className="flex justify-between"><dt>Tax</dt><dd>{formatCurrency(liabilities.tax)}</dd></div>
          <div className="flex justify-between border-t pt-2 font-bold"><dt>Total Liabilities</dt><dd>{formatCurrency(liabilities.total)}</dd></div>
        </dl>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Equity</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt>Equity</dt><dd>{formatCurrency(equity)}</dd></div>
          <div className="flex justify-between border-t pt-2 font-bold"><dt>Total Equity</dt><dd>{formatCurrency(equity)}</dd></div>
        </dl>
      </div>
    </div>
  );
}

function CashFlowTab({ data }: any) {
  const { cashFlow } = data;
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-900">
      <h3 className="text-sm font-semibold text-slate-500 mb-4">Cash Flow Statement</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt>Operating Cash Flow</dt><dd>{formatCurrency(cashFlow.operating)}</dd></div>
        <div className="flex justify-between"><dt>Investing Cash Flow</dt><dd>{formatCurrency(cashFlow.investing)}</dd></div>
        <div className="flex justify-between"><dt>Financing Cash Flow</dt><dd>{formatCurrency(cashFlow.financing)}</dd></div>
        <div className="flex justify-between border-t pt-2 font-bold"><dt>Net Cash Flow</dt><dd>{formatCurrency(cashFlow.net)}</dd></div>
      </dl>
    </div>
  );
}

function ExpensesTab({ data }: any) {
  const { expenseAnalysis } = data;
  return (
    <div className="grid gap-6 md:grid-cols-2 text-slate-900">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Expenses by Category</h3>
        <ul className="space-y-2">
          {expenseAnalysis.map((item: any) => (
            <li key={item.name} className="flex justify-between border-b pb-1">
              <span>{item.name}</span>
              <span>{formatCurrency(item.value)}</span>
            </li>
          ))}
          {expenseAnalysis.length === 0 && <p className="text-slate-500">No expense data</p>}
        </ul>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Expense Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseAnalysis}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {expenseAnalysis.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ReceivablesTab({ data }: any) {
  const { receivables } = data;
  return (
    <div className="grid gap-6 md:grid-cols-2 text-slate-900">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Receivables Aging</h3>
        <ul className="space-y-2">
          {receivables.aging.map((item: any) => (
            <li key={item.label} className="flex justify-between border-b pb-1">
              <span>{item.label} days</span>
              <span>{formatCurrency(item.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-2">
          <div className="flex justify-between font-bold">
            <span>Total Receivables</span>
            <span>{formatCurrency(receivables.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Risk Score</span>
            <span className={receivables.riskScore > 30 ? 'text-red-600' : 'text-emerald-600'}>
              {receivables.riskScore.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Aging Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={receivables.aging}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Bar dataKey="amount" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PayablesTab({ data }: any) {
  const { payables } = data;
  return (
    <div className="grid gap-6 md:grid-cols-2 text-slate-900">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Payables Aging</h3>
        <ul className="space-y-2">
          {payables.aging.map((item: any) => (
            <li key={item.label} className="flex justify-between border-b pb-1">
              <span>{item.label} days</span>
              <span>{formatCurrency(item.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-2">
          <div className="flex justify-between font-bold">
            <span>Total Payables</span>
            <span>{formatCurrency(payables.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cash Needed (0-30 days)</span>
            <span className="text-red-600">{formatCurrency(payables.cashNeeded)}</span>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Aging Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payables.aging}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Bar dataKey="amount" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ProfitAnalysisTab({ data }: any) {
  const { profitAnalysis } = data;
  const sections = [
    { key: 'byProduct', label: 'By Product', data: profitAnalysis.byProduct },
    { key: 'byCustomer', label: 'By Customer', data: profitAnalysis.byCustomer },
    { key: 'byBranch', label: 'By Branch', data: profitAnalysis.byBranch },
  ];
  return (
    <div className="space-y-6 text-slate-900">
      {sections.map((section) => (
        <div key={section.key} className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-4">{section.label}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Revenue</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {section.data.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-2 text-slate-500">No data</td></tr>
                )}
                {section.data.map((item: any) => (
                  <tr key={item.name}>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{formatCurrency(item.revenue)}</td>
                    <td className="px-4 py-2">{formatCurrency(item.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetTab({ data }: any) {
  const { budgetVsActual } = data;
  if (!budgetVsActual || budgetVsActual.length === 0) {
    return <div className="rounded-2xl border bg-white p-6 text-center text-slate-500">No budget data available</div>;
  }
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Revenue: Budget vs Actual</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Legend />
              <Bar dataKey="budgetRevenue" fill="#94a3b8" name="Budget Revenue" />
              <Bar dataKey="actualRevenue" fill="#6366f1" name="Actual Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Profit: Budget vs Actual</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Legend />
              <Bar dataKey="budgetProfit" fill="#94a3b8" name="Budget Profit" />
              <Bar dataKey="actualProfit" fill="#22c55e" name="Actual Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function BreakEvenTab({ data }: any) {
  const { breakEven } = data;
  return (
    <div className="grid gap-6 md:grid-cols-2 text-slate-900">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Break-even Analysis</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Break-even Revenue</dt>
            <dd className="font-bold">{formatCurrency(breakEven.breakEvenRevenue)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Required Sales</dt>
            <dd>{formatCurrency(breakEven.requiredSales)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Gross Margin</dt>
            <dd>{(breakEven.margin * 100).toFixed(1)}%</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="text-lg font-semibold">Break-even Point</p>
          <p className="text-4xl font-bold text-indigo-600">{formatCurrency(breakEven.breakEvenRevenue)}</p>
          <p className="text-sm mt-2">Monthly sales needed to cover costs</p>
        </div>
      </div>
    </div>
  );
}

function CashForecastTab({ data }: any) {
  const { cashForecast } = data;
  const items = Object.entries(cashForecast).map(([period, amount]) => ({
    period,
    amount: amount as number,
  }));
  return (
    <div className="grid gap-6 md:grid-cols-3 text-slate-900">
      {items.map((item) => (
        <div key={item.period} className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Cash Forecast</p>
          <p className="text-sm text-slate-500">{item.period}</p>
          <h3 className="text-2xl font-bold">{formatCurrency(item.amount)}</h3>
        </div>
      ))}
    </div>
  );
}

function RatiosTab({ data }: any) {
  const { ratios } = data;
  const items = [
    { label: 'Gross Margin', value: ratios.grossMargin, format: 'percent' },
    { label: 'Net Margin', value: ratios.netMargin, format: 'percent' },
    { label: 'Current Ratio', value: ratios.currentRatio, format: 'number' },
    { label: 'Quick Ratio', value: ratios.quickRatio, format: 'number' },
    { label: 'Debt Ratio', value: ratios.debtRatio, format: 'percent' },
    { label: 'Inventory Turnover', value: ratios.inventoryTurnover, format: 'number' },
    { label: 'Asset Turnover', value: ratios.assetTurnover, format: 'number' },
    { label: 'ROA', value: ratios.roa, format: 'percent' },
    { label: 'ROE', value: ratios.roe, format: 'percent' },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 text-slate-900">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{item.label}</p>
          <h3 className="text-2xl font-bold">
            {item.format === 'percent'
              ? `${(item.value * 100).toFixed(1)}%`
              : item.value.toFixed(2)}
          </h3>
        </div>
      ))}
    </div>
  );
}