// src/pages/Settings.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../api/axios'; // ✅ ADDED

const THEMES = ['LIGHT', 'DARK', 'SYSTEM'];
const FONT_SIZES = ['SMALL', 'MEDIUM', 'LARGE'];
const TABLE_DENSITY = ['COMFORTABLE', 'COMPACT', 'SPACIOUS'];

type Tab = 'general' | 'appearance' | 'profile' | 'security';

export default function Settings() {
  const { user } = useAuth();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [activeTab, setActiveTab] = useState<Tab>('general');

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="rounded-2xl border bg-white p-12 text-center">No settings found.</div>;
  }

  const handleUpdate = (key: keyof typeof settings, value: any) => {
    updateSettings.mutate({ [key]: value });
  };

  return (
    <div className="space-y-8 text-slate-900">
      <PageHeader title="Settings" subtitle="Manage your company and personal preferences" />

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6">
          {(['general', 'appearance', 'profile', 'security'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {activeTab === 'general' && <GeneralTab settings={settings} onUpdate={handleUpdate} />}
        {activeTab === 'appearance' && <AppearanceTab settings={settings} onUpdate={handleUpdate} />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}

// ----- Tab Components -----

function GeneralTab({ settings, onUpdate }: any) {
  return (
    <div className="space-y-6 text-slate-900">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Company Name"
          value={settings.companyName}
          onChange={(e) => onUpdate('companyName', e.target.value)}
        />
        <Input
          label="Industry"
          value={settings.industry || ''}
          onChange={(e) => onUpdate('industry', e.target.value)}
        />
        <Input
          label="Registration Number"
          value={settings.registrationNumber || ''}
          onChange={(e) => onUpdate('registrationNumber', e.target.value)}
        />
        <Input
          label="Tax Number"
          value={settings.taxNumber || ''}
          onChange={(e) => onUpdate('taxNumber', e.target.value)}
        />
        <Input
          label="Email"
          value={settings.email || ''}
          onChange={(e) => onUpdate('email', e.target.value)}
        />
        <Input
          label="Phone"
          value={settings.phone || ''}
          onChange={(e) => onUpdate('phone', e.target.value)}
        />
        <Input
          label="Website"
          value={settings.website || ''}
          onChange={(e) => onUpdate('website', e.target.value)}
        />
        <Input
          label="Address"
          value={settings.address || ''}
          onChange={(e) => onUpdate('address', e.target.value)}
        />
        <Input
          label="City"
          value={settings.city || ''}
          onChange={(e) => onUpdate('city', e.target.value)}
        />
        <Input
          label="State"
          value={settings.state || ''}
          onChange={(e) => onUpdate('state', e.target.value)}
        />
        <Input
          label="Country"
          value={settings.country || ''}
          onChange={(e) => onUpdate('country', e.target.value)}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Finance</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Currency"
            value={settings.currency}
            onChange={(e) => onUpdate('currency', e.target.value)}
          />
          <Input
            label="Currency Symbol"
            value={settings.currencySymbol}
            onChange={(e) => onUpdate('currencySymbol', e.target.value)}
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            value={settings.tax}
            onChange={(e) => onUpdate('tax', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Decimal Places"
            type="number"
            value={settings.decimalPlaces}
            onChange={(e) => onUpdate('decimalPlaces', parseInt(e.target.value) || 2)}
          />
          <Input
            label="Quote Prefix"
            value={settings.quotePrefix}
            onChange={(e) => onUpdate('quotePrefix', e.target.value)}
          />
          <Input
            label="Invoice Prefix"
            value={settings.invoicePrefix}
            onChange={(e) => onUpdate('invoicePrefix', e.target.value)}
          />
          <Input
            label="Payment Prefix"
            value={settings.paymentPrefix}
            onChange={(e) => onUpdate('paymentPrefix', e.target.value)}
          />
          <Input
            label="Expense Prefix"
            value={settings.expensePrefix}
            onChange={(e) => onUpdate('expensePrefix', e.target.value)}
          />
          <Input
            label="Quote Validity (days)"
            type="number"
            value={settings.quoteValidity}
            onChange={(e) => onUpdate('quoteValidity', parseInt(e.target.value) || 30)}
          />
          <Input
            label="Invoice Due Days"
            type="number"
            value={settings.invoiceDueDays}
            onChange={(e) => onUpdate('invoiceDueDays', parseInt(e.target.value) || 30)}
          />
        </div>
      </div>
    </div>
  );
}

function AppearanceTab({ settings, onUpdate }: any) {
  return (
    <div className="space-y-6 text-slate-900">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => onUpdate('theme', e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
          >
            {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Primary Color</label>
          <Input
            type="color"
            value={settings.primaryColor}
            onChange={(e) => onUpdate('primaryColor', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Font Size</label>
          <select
            value={settings.fontSize}
            onChange={(e) => onUpdate('fontSize', e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
          >
            {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Table Density</label>
          <select
            value={settings.tableDensity}
            onChange={(e) => onUpdate('tableDensity', e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
          >
            {TABLE_DENSITY.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={settings.compactMode}
            onChange={(e) => onUpdate('compactMode', e.target.checked)}
          />
          Compact Mode
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={settings.sidebarCollapsed}
            onChange={(e) => onUpdate('sidebarCollapsed', e.target.checked)}
          />
          Sidebar Collapsed
        </label>
      </div>
    </div>
  );
}

function ProfileTab({ user }: any) {
  if (!user) return <p className="text-slate-500">User not logged in.</p>;
  return (
    <div className="space-y-4 text-slate-900">
      <div className="flex items-center gap-4">
        {user.profileImage ? (
          <img src={user.profileImage} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-4xl text-indigo-600">
            {user.firstName?.[0]}
          </div>
        )}
        <div>
          <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="text-sm text-slate-500">Role: {user.role?.displayName || user.role}</p>
        </div>
      </div>
      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-slate-500">Employee Number: {user.employeeNumber}</p>
        <p className="text-sm text-slate-500">Phone: {user.phone || '—'}</p>
        <p className="text-sm text-slate-500">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="mt-4">
        <Button variant="secondary">Update Profile Picture</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.patch('/users/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
      <Input
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Changing...' : 'Change Password'}
      </Button>
      {message && (
        <p className={`text-sm ${message.includes('successfully') ? 'text-emerald-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}