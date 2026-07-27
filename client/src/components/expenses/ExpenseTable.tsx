import { Edit, Trash2 } from 'lucide-react';
import type { Expense } from '../../api/expense';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
};

export default function ExpenseTable({ expenses, onEdit, onDelete }: Props) {
  if (expenses.length === 0) {
    return <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center text-slate-500">No expenses found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Reference</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {expenses.map((exp) => (
            <tr key={exp.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{exp.description}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {exp.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">{formatCurrency(exp.amount)}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{format(new Date(exp.date), 'dd/MM/yyyy')}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{exp.reference || '—'}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => onEdit(exp)} className="mr-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(exp.id)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}