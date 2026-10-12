import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Key, Lock, Mail, Phone, 
  Check, X, AlertCircle, Plus 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/initialData';
import { UserRole } from '../types';

export const UsersManagementView: React.FC = () => {
  const { currentUser, switchRole } = useApp();

  const permissionsMatrix: { module: string; roles: UserRole[] }[] = [
    { module: 'Executive Dashboard', roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER', 'CASHIER', 'STAFF'] },
    { module: 'Pharmacy & FEFO Catalog', roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER', 'STAFF'] },
    { module: 'Cosmetics & Beauty Matrix', roles: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER', 'CASHIER', 'STAFF'] },
    { module: 'Expiry Radar & Quarantine', roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'] },
    { module: 'Point of Sale (POS)', roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER'] },
    { module: 'Sales & Receipts Ledger', roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER', 'INVENTORY_MANAGER'] },
    { module: 'Purchasing & Batch Inflow', roles: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER'] },
    { module: 'Suppliers Directory', roles: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER'] },
    { module: 'Customers & Loyalty', roles: ['SUPER_ADMIN', 'ADMIN', 'CASHIER', 'PHARMACIST'] },
    { module: 'Enterprise Reports', roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'] },
    { module: 'Gemini AI Assistant', roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER', 'CASHIER', 'STAFF'] },
    { module: 'User Management & RBAC', roles: ['SUPER_ADMIN'] },
    { module: 'Audit Trail Logs', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { module: 'System Settings', roles: ['SUPER_ADMIN', 'ADMIN'] },
  ];

  const allRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER', 'CASHIER', 'STAFF'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              User Management & Role Permissions (RBAC)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              Security Governance
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Super Admin control panel for team credentials, access tier policies, and session protection.
          </p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <h3 className="font-heading font-bold text-lg text-slate-900">
          Authorized System Personnel ({INITIAL_USERS.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_USERS.map(u => {
            const isSelf = currentUser?.id === u.id;

            return (
              <div 
                key={u.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelf ? 'bg-teal-50/50 border-teal-300 ring-2 ring-teal-100' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold">
                      {u.role.replace('_', ' ')}
                    </span>
                    {isSelf && (
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                        Active Profile
                      </span>
                    )}
                  </div>

                  <div className="mt-3 font-bold text-slate-900 text-sm">{u.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{u.email}</div>
                  {u.phone && <div className="text-[11px] text-slate-400 mt-0.5">{u.phone}</div>}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => switchRole(u.role)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    Switch to this Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Enterprise RBAC Permissions Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Role-Based Access Control mapping verified modules to permissible user roles.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">System Module</th>
                {allRoles.map(r => (
                  <th key={r} className="py-3 px-2 text-center">{r.replace('_', ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{item.module}</td>
                  {allRoles.map(role => {
                    const hasAccess = item.roles.includes(role);
                    return (
                      <td key={role} className="py-2.5 px-2 text-center">
                        {hasAccess ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
