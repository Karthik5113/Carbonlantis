import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Key,
  Copy,
  Check,
  Search,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Anchor,
  Radio,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Filter,
  Download,
  Share2
} from 'lucide-react';

export type OperatorUserRole = 'AquaDrone user' | 'AquaNode user' | 'RiverNode user';

export interface ManagedUser {
  id: string; // e.g., "CLAD202606005"
  name: string;
  role: OperatorUserRole;
  password: string;
  joinYear: number;
  joinMonth: number; // 1 - 12
  serialNumber: number;
  createdAt: string;
  status: 'Active' | 'Inactive';
}

// Prefix mappings based on role
export const getRolePrefix = (role: OperatorUserRole): string => {
  switch (role) {
    case 'AquaDrone user':
      return 'CLAD';
    case 'AquaNode user':
      return 'CLAN';
    case 'RiverNode user':
      return 'CLRN';
    default:
      return 'CLUSR';
  }
};

// Generates UserID: <PREFIX><YEAR><MONTH_2_DIGITS><SERIAL_3_DIGITS>
export const generateUserId = (
  role: OperatorUserRole,
  year: number,
  month: number,
  serial: number
): string => {
  const prefix = getRolePrefix(role);
  const yearStr = String(year);
  const monthStr = String(month).padStart(2, '0');
  const serialStr = String(serial).padStart(3, '0');
  return `${prefix}${yearStr}${monthStr}${serialStr}`;
};

// Generates a secure readable password
export const generateSecurePassword = (): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%&*';

  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];

  const allChars = upper + lower + digits + symbols;
  for (let i = 0; i < 6; i++) {
    pwd += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle characters
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Initial realistic users matching the prompt's examples
const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'CLAD202606001',
    name: 'Priya Sharma',
    role: 'AquaDrone user',
    password: 'AqDr#2026!9a',
    joinYear: 2026,
    joinMonth: 6,
    serialNumber: 1,
    createdAt: '2026-06-04',
    status: 'Active'
  },
  {
    id: 'CLAN202606002',
    name: 'Dr. Elena Vance',
    role: 'AquaNode user',
    password: 'AqNd$77x!Pk',
    joinYear: 2026,
    joinMonth: 6,
    serialNumber: 2,
    createdAt: '2026-06-12',
    status: 'Active'
  },
  {
    id: 'CLRN202607003',
    name: 'Alex Thorne',
    role: 'RiverNode user',
    password: 'Riv#2026@8t',
    joinYear: 2026,
    joinMonth: 7,
    serialNumber: 3,
    createdAt: '2026-07-02',
    status: 'Active'
  },
  {
    id: 'CLAD202608004',
    name: 'Marcus Chen',
    role: 'AquaDrone user',
    password: 'Drn*88m!Xy',
    joinYear: 2026,
    joinMonth: 8,
    serialNumber: 4,
    createdAt: '2026-08-01',
    status: 'Active'
  },
  {
    id: 'CLAD202606005',
    name: 'Vikram Rao',
    role: 'AquaDrone user',
    password: 'Vkr#6005!z',
    joinYear: 2026,
    joinMonth: 6,
    serialNumber: 5,
    createdAt: '2026-06-25',
    status: 'Active'
  },
  {
    id: 'CLAD202608006',
    name: 'Ananya Sen',
    role: 'AquaDrone user',
    password: 'Ans$8006#k',
    joinYear: 2026,
    joinMonth: 8,
    serialNumber: 6,
    createdAt: '2026-08-14',
    status: 'Active'
  },
  {
    id: 'CLRN202611007',
    name: 'Rajesh Verma',
    role: 'RiverNode user',
    password: 'Rvr!1107^w',
    joinYear: 2026,
    joinMonth: 11,
    serialNumber: 7,
    createdAt: '2026-11-01',
    status: 'Active'
  }
];

export const UserManagementTab: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | OperatorUserRole>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
  const [newlyCreatedUser, setNewlyCreatedUser] = useState<ManagedUser | null>(null);

  // Password visibility set (stores user IDs whose passwords are shown)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<OperatorUserRole>('AquaDrone user');
  const [formYear, setFormYear] = useState<number>(2026);
  const [formMonth, setFormMonth] = useState<number>(11); // Current month: November
  const [formSerial, setFormSerial] = useState<number>(8); // Auto increment
  const [formPassword, setFormPassword] = useState<string>(generateSecurePassword());
  const [isCustomPassword, setIsCustomPassword] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<OperatorUserRole>('AquaDrone user');
  const [editPassword, setEditPassword] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [syncIdPrefix, setSyncIdPrefix] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  // Preview generated ID in Create Form
  const previewGeneratedId = useMemo(() => {
    return generateUserId(formRole, formYear, formMonth, formSerial);
  }, [formRole, formYear, formMonth, formSerial]);

  // Open Create Modal with next serial
  const handleOpenCreateModal = () => {
    const nextSerial = users.length > 0 ? Math.max(...users.map((u) => u.serialNumber)) + 1 : 1;
    setFormName('');
    setFormRole('AquaDrone user');
    setFormYear(2026);
    setFormMonth(11);
    setFormSerial(nextSerial);
    setFormPassword(generateSecurePassword());
    setIsCustomPassword(false);
    setIsCreateModalOpen(true);
  };

  // Create user handler
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter the user name.');
      return;
    }

    const generatedId = generateUserId(formRole, formYear, formMonth, formSerial);

    // Check if ID already exists
    if (users.some((u) => u.id === generatedId)) {
      showToast(`User ID ${generatedId} already exists! Please choose a different serial.`);
      return;
    }

    const newUser: ManagedUser = {
      id: generatedId,
      name: formName.trim(),
      role: formRole,
      password: formPassword,
      joinYear: formYear,
      joinMonth: formMonth,
      serialNumber: formSerial,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
    setNewlyCreatedUser(newUser);
    showToast(`User ${newUser.name} created with ID: ${newUser.id}`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: ManagedUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditPassword(user.password);
    setEditStatus(user.status);
    setSyncIdPrefix(true);
  };

  // Save Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editName.trim()) {
      showToast('Please enter the user name.');
      return;
    }

    let updatedId = editingUser.id;
    // If sync prefix is enabled and role changed, update prefix
    if (syncIdPrefix && editRole !== editingUser.role) {
      updatedId = generateUserId(
        editRole,
        editingUser.joinYear,
        editingUser.joinMonth,
        editingUser.serialNumber
      );
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            id: updatedId,
            name: editName.trim(),
            role: editRole,
            password: editPassword,
            status: editStatus
          };
        }
        return u;
      })
    );

    setEditingUser(null);
    showToast(`User ${editName} updated successfully.`);
  };

  // Delete User handler
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    showToast(`User ${deletingUser.name} (${deletingUser.id}) deleted.`);
    setDeletingUser(null);
  };

  // Toggle user status
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
          showToast(`User ${u.id} is now ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const aquaDrone = users.filter((u) => u.role === 'AquaDrone user').length;
    const aquaNode = users.filter((u) => u.role === 'AquaNode user').length;
    const riverNode = users.filter((u) => u.role === 'RiverNode user').length;
    return { total, aquaDrone, aquaNode, riverNode };
  }, [users]);

  // Format credential string for operator distribution
  const getFullCredentialText = (u: ManagedUser) => {
    return `----------------------------------------
CARBONLANTIS OPERATOR CREDENTIALS
----------------------------------------
Name:        ${u.name}
Role:        ${u.role}
User ID:     ${u.id}
Password:    ${u.password}
Portal URL:  https://carbonlantis.com/login
----------------------------------------
Please change your password after initial login.`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create field operators, generate automated User IDs & passwords, and manage platform credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New User</span>
        </button>
      </div>

      {/* Role Summary Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          onClick={() => {
            setRoleFilter('All');
            setSearchQuery('');
            setStatusFilter('All');
            showToast('Showing all registered operators');
          }}
          className={`bg-white rounded-xl border p-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
            roleFilter === 'All' && !searchQuery && statusFilter === 'All'
              ? 'border-slate-700 ring-2 ring-slate-200 bg-slate-50/70'
              : 'border-slate-200/90 hover:border-slate-400'
          }`}
          title="Click to view all operators"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Operators
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                ALL
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* AquaDrone Users */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'AquaDrone user' ? 'All' : 'AquaDrone user')}
          className={`bg-white rounded-xl border p-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
            roleFilter === 'AquaDrone user'
              ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20'
              : 'border-slate-200/90 hover:border-blue-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                AquaDrone Users
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                CLAD
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-0.5">{stats.aquaDrone}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Anchor className="w-5 h-5" />
          </div>
        </div>

        {/* AquaNode Users */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'AquaNode user' ? 'All' : 'AquaNode user')}
          className={`bg-white rounded-xl border p-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
            roleFilter === 'AquaNode user'
              ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20'
              : 'border-slate-200/90 hover:border-emerald-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                AquaNode Users
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                CLAN
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-0.5">{stats.aquaNode}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        {/* RiverNode Users */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'RiverNode user' ? 'All' : 'RiverNode user')}
          className={`bg-white rounded-xl border p-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
            roleFilter === 'RiverNode user'
              ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20'
              : 'border-slate-200/90 hover:border-amber-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                RiverNode Users
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                CLRN
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-0.5">{stats.riverNode}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Structured Users Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by User Name or User ID (e.g. CLAD202606005)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-blue-600 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {(['All', 'AquaDrone user', 'AquaNode user', 'RiverNode user'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  roleFilter === r
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r === 'All' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">User Name</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Generated Password</th>
                <th className="py-3.5 px-4">Joining Date</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No users match the selected filters</p>
                    <p className="text-[11px] mt-0.5">Try clearing the search or create a new user.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isPwdVisible = visiblePasswords.has(user.id);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md text-[11px] tracking-wide">
                            {user.id}
                          </span>
                          <button
                            type="button"
                            title="Copy User ID"
                            onClick={() => copyToClipboard(user.id, 'User ID')}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* User Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{user.name}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Serial #{String(user.serialNumber).padStart(3, '0')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {user.role === 'AquaDrone user' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Anchor className="w-3 h-3" />
                            <span>AquaDrone user</span>
                          </span>
                        )}
                        {user.role === 'AquaNode user' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Radio className="w-3 h-3" />
                            <span>AquaNode user</span>
                          </span>
                        )}
                        {user.role === 'RiverNode user' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Compass className="w-3 h-3" />
                            <span>RiverNode user</span>
                          </span>
                        )}
                      </td>

                      {/* Password */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded text-slate-700 select-all">
                            {isPwdVisible ? user.password : '••••••••••••'}
                          </span>
                          <button
                            type="button"
                            title={isPwdVisible ? 'Hide Password' : 'Show Password'}
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            {isPwdVisible ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            title="Copy Password"
                            onClick={() => copyToClipboard(user.password, 'Password')}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Joining Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                        {MONTH_NAMES[user.joinMonth - 1]} {user.joinYear}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                            user.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                          ></span>
                          <span>{user.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Share Credentials */}
                          <button
                            type="button"
                            title="Copy Full Credentials"
                            onClick={() =>
                              copyToClipboard(
                                getFullCredentialText(user),
                                `Credentials for ${user.name}`
                              )
                            }
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User */}
                          <button
                            type="button"
                            title="Edit User"
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          <button
                            type="button"
                            title="Delete User"
                            onClick={() => setDeletingUser(user)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredUsers.length}</strong> of{' '}
            <strong className="text-slate-800">{users.length}</strong> registered operators
          </span>
          <span className="font-mono">
            Format: [Prefix][YYYY][MM][Serial] (e.g. CLAD202606005)
          </span>
        </div>
      </div>

      {/* ========================================================
          MODAL: CREATE NEW USER & GENERATE CREDENTIALS
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create New Operator</h3>
                  <p className="text-xs text-slate-500">
                    Generate User ID and secure credentials automatically
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
              {/* User Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Operator Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Patel"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Operator Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { role: 'AquaDrone user', prefix: 'CLAD', icon: Anchor, color: 'border-blue-300 bg-blue-50/50 text-blue-800' },
                      { role: 'AquaNode user', prefix: 'CLAN', icon: Radio, color: 'border-emerald-300 bg-emerald-50/50 text-emerald-800' },
                      { role: 'RiverNode user', prefix: 'CLRN', icon: Compass, color: 'border-amber-300 bg-amber-50/50 text-amber-900' }
                    ] as const
                  ).map((item) => {
                    const isSelected = formRole === item.role;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setFormRole(item.role)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? `${item.color} ring-2 ring-blue-500/50 font-bold`
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <IconComp className="w-4 h-4" />
                          <span className="font-mono text-[10px] font-bold px-1 rounded bg-white/80">
                            {item.prefix}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold">{item.role}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Joining Month & Year & Serial */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Joining Month
                  </label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                  >
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={m} value={idx + 1}>
                        {String(idx + 1).padStart(2, '0')} - {m.slice(0, 3)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Joining Year
                  </label>
                  <input
                    type="number"
                    min="2024"
                    max="2035"
                    value={formYear}
                    onChange={(e) => setFormYear(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Serial #
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formSerial}
                    onChange={(e) => setFormSerial(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Dynamic User ID Preview Card */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Generated User ID Preview
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">Format Standard</span>
                </div>
                <div className="text-lg font-mono font-bold text-emerald-400 tracking-wider">
                  {previewGeneratedId}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1.5">
                  <span>Prefix: <strong>{getRolePrefix(formRole)}</strong></span>
                  <span>•</span>
                  <span>Year: <strong>{formYear}</strong></span>
                  <span>•</span>
                  <span>Month: <strong>{String(formMonth).padStart(2, '0')}</strong></span>
                  <span>•</span>
                  <span>Serial: <strong>{String(formSerial).padStart(3, '0')}</strong></span>
                </div>
              </div>

              {/* Generated Password Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider">
                    Generated Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormPassword(generateSecurePassword());
                      setIsCustomPassword(false);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={(e) => {
                      setFormPassword(e.target.value);
                      setIsCustomPassword(true);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-blue-600 outline-none bg-slate-50"
                  />
                  <button
                    type="button"
                    title="Copy Password"
                    onClick={() => copyToClipboard(formPassword, 'Generated Password')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-blue-600 p-1 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  High-entropy password generated for initial handover. User can change it upon first login.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create User & Generate Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: NEWLY CREATED CREDENTIALS CARD
         ======================================================== */}
      {newlyCreatedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-xs animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h3 className="text-base font-bold text-center text-slate-900">
              User Credentials Created Successfully!
            </h3>
            <p className="text-slate-500 text-center text-[11px] mt-1 mb-5">
              Copy and provide these credentials directly to the field operator.
            </p>

            <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 text-[10px] font-sans uppercase tracking-wider">
                  Operator Name
                </span>
                <span className="font-sans font-bold text-slate-900 text-xs">
                  {newlyCreatedUser.name}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 text-[10px] font-sans uppercase tracking-wider">
                  Assigned Role
                </span>
                <span className="font-sans font-semibold text-blue-700 text-[11px]">
                  {newlyCreatedUser.role}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div>
                  <span className="text-slate-500 text-[10px] font-sans uppercase tracking-wider block">
                    User ID
                  </span>
                  <span className="font-bold text-slate-900 text-sm tracking-wide">
                    {newlyCreatedUser.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(newlyCreatedUser.id, 'User ID')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 font-sans text-[11px] font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] font-sans uppercase tracking-wider block">
                    Initial Password
                  </span>
                  <span className="font-bold text-emerald-700 text-sm tracking-wide select-all">
                    {newlyCreatedUser.password}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(newlyCreatedUser.password, 'Password')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 font-sans text-[11px] font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    getFullCredentialText(newlyCreatedUser),
                    `Full credentials for ${newlyCreatedUser.name}`
                  )
                }
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy All Credentials to Clipboard</span>
              </button>

              <button
                type="button"
                onClick={() => setNewlyCreatedUser(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT USER
         ======================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Operator</h3>
                  <p className="text-xs text-slate-500">Update operator details or credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current User ID
                </label>
                <div className="font-mono text-sm font-bold text-slate-900 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                  {syncIdPrefix && editRole !== editingUser.role
                    ? generateUserId(
                        editRole,
                        editingUser.joinYear,
                        editingUser.joinMonth,
                        editingUser.serialNumber
                      )
                    : editingUser.id}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Operator Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Operator Role *
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as OperatorUserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                >
                  <option value="AquaDrone user">AquaDrone user (CLAD)</option>
                  <option value="AquaNode user">AquaNode user (CLAN)</option>
                  <option value="RiverNode user">RiverNode user (CLRN)</option>
                </select>
                {editRole !== editingUser.role && (
                  <label className="flex items-center gap-2 mt-2 text-slate-600 text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncIdPrefix}
                      onChange={(e) => setSyncIdPrefix(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>
                      Update User ID prefix to match new role ({getRolePrefix(editRole)})
                    </span>
                  </label>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider">
                    Password / Reset
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditPassword(generateSecurePassword())}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Status
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={editStatus === 'Active'}
                      onChange={() => setEditStatus('Active')}
                      className="text-blue-600"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={editStatus === 'Inactive'}
                      onChange={() => setEditStatus('Inactive')}
                      className="text-blue-600"
                    />
                    <span>Inactive (Suspended)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DELETE USER CONFIRMATION
         ======================================================== */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-xs">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-center text-slate-900">
              Confirm Operator Deletion
            </h3>
            <p className="text-slate-500 text-center text-[11px] mt-1 mb-4">
              Are you sure you want to permanently delete user{' '}
              <strong className="text-slate-900">{deletingUser.name}</strong> (
              <span className="font-mono text-slate-700 font-semibold">{deletingUser.id}</span>)?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
