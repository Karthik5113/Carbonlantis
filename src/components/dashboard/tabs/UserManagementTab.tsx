import React, { useState } from 'react';
import {
  Users,
  Shield,
  Key,
  Lock,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Search
} from 'lucide-react';
import { userAccountsData, activityLogsData } from '../../../data/dashboardData';
import { UserAccount, ActivityLogItem } from '../../../types';

export const UserManagementTab: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(userAccountsData);
  const [searchUser, setSearchUser] = useState<string>('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Field Dosing Engineer');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: newEmail.split('@')[0],
      email: newEmail,
      role: newRole as any,
      clearanceLevel: 'Level 2: Platform Telemetry & Pump Modulation',
      status: 'Invited',
      twoFactorEnabled: false,
      lastActive: 'Never',
      assignedCatchment: 'Godavari Delta Pilot'
    };

    setUsers([newUser, ...users]);
    setNewEmail('');
    setInviteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Security Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>Authorized Accounts</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-sans">{users.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium">All sessions encrypted via TLS 1.3</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>MFA Enforcement</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-sans">100%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Hardware FIDO2 / TOTP active</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>Clearance Levels</span>
            <Key className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-sans">4 Tiers</div>
          <div className="text-[11px] text-slate-500">RBAC role-based policy matrix</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>Auth Breaches</span>
            <Lock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-sans">0</div>
          <div className="text-[11px] text-emerald-600 font-medium">Zero unauthorized attempts in 30d</div>
        </div>
      </div>

      {/* 2. User Accounts Directory Table */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
                Authorized Platform User Accounts
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                {filteredUsers.length} Users
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Operators, field chemists, accredited verifiers & administrative credentials
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 outline-none w-44"
              />
            </div>

            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Provision User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Operator Name & Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Clearance Scope</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">MFA</th>
                <th className="py-3 px-4 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="block text-slate-900 font-bold leading-tight">{u.name}</strong>
                    <span className="font-mono text-[10px] text-slate-400">{u.email}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{u.role}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{u.clearanceLevel}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                      u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {u.twoFactorEnabled ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">
                        Enforced
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Roles & Permissions Policy Matrix */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
              Role-Based Access Control (RBAC) Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">OAuth2 / JWT Claims</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="block text-slate-900 font-bold mb-1">Enterprise Admin</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-2">
              Full root configuration, Django API secrets, user provisioning & global safety limits.
            </p>
            <span className="text-[9.5px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
              Level 4: Superuser
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="block text-slate-900 font-bold mb-1">Lead MRV Scientist</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-2">
              Carbonate equilibrium calculations, sensor calibrations & registry report publishing.
            </p>
            <span className="text-[9.5px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
              Level 3: Full Catchment
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="block text-slate-900 font-bold mb-1">Field Dosing Engineer</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-2">
              Peristaltic pump speed modulation, slurry mixing, and vessel waypoint navigation.
            </p>
            <span className="text-[9.5px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold">
              Level 2: Fleet Control
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <strong className="block text-slate-900 font-bold mb-1">Accredited Verifier</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-2">
              Read-only immutable raw telemetry stream, cryptographic block audit & export signing.
            </p>
            <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              Auditor: Read-Only
            </span>
          </div>
        </div>
      </div>

      {/* 4. Activity & Security Audit Logs */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
              Immutable Activity & Audit Log
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">WORM-compliant event stream</span>
        </div>

        <div className="space-y-2.5">
          {activityLogsData.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <strong className="text-slate-900 font-bold">{log.userName}</strong>
                  <span className="text-slate-400 font-mono text-[10px]">• {log.timestamp}</span>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                    {log.status}
                  </span>
                </div>
                <div className="text-slate-600">{log.action}</div>
              </div>

              <div className="text-right font-mono text-[11px] text-slate-400 shrink-0">
                <div>Resource: <strong className="text-slate-600 font-sans">{log.resource}</strong></div>
                <div>IP: {log.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provision User Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-popover border border-carbon-border">
            <h3 className="text-base font-bold text-slate-900 mb-1">Provision New MRV Platform User</h3>
            <p className="text-xs text-slate-500 mb-4">
              Send an encrypted invitation link with designated RBAC role and station clearance.
            </p>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="scientist@carbonlantis.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                >
                  <option value="Lead MRV Scientist">Lead MRV Scientist</option>
                  <option value="Field Dosing Engineer">Field Dosing Engineer</option>
                  <option value="Accredited Verifier">Accredited Verifier</option>
                  <option value="Enterprise Administrator">Enterprise Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A1628] hover:bg-blue-900 text-white"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

