import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  X,
  Search,
  Check,
  Activity,
  Layers
} from 'lucide-react';

export default function UserManagementTab({ 
  users = [], 
  modules = [], 
  onRefresh,
  activeUserId,
  onSwitchActiveUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingAccessUser, setEditingAccessUser] = useState(null);
  const [viewingUserStats, setViewingUserStats] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Add User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    accessibleModules: ['all'],
    notes: ''
  });

  // Filter users
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add user submit
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddUserModalOpen(false);
        setToastMsg(`User '${data.user.name}' created with custom module access.`);
        setTimeout(() => setToastMsg(''), 3000);
        if (onRefresh) onRefresh();
      } else {
        setErrorMsg(data.message || 'Failed to create user');
      }
    } catch (e) {
      setErrorMsg('Error connecting to server.');
    }
  };

  // Toggle module access in permissions modal
  const handleToggleModuleForUser = (modId) => {
    if (!editingAccessUser) return;
    let current = [...(editingAccessUser.accessibleModules || [])];

    if (modId === 'all') {
      if (current.includes('all')) {
        current = [];
      } else {
        current = ['all'];
      }
    } else {
      current = current.filter(m => m !== 'all');
      if (current.includes(modId)) {
        current = current.filter(m => m !== modId);
      } else {
        current.push(modId);
      }
    }

    setEditingAccessUser(prev => ({ ...prev, accessibleModules: current }));
  };

  // Save module permissions
  const handleSavePermissions = async () => {
    if (!editingAccessUser) return;
    try {
      const res = await fetch(`/api/admin/users/${editingAccessUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessibleModules: editingAccessUser.accessibleModules
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingAccessUser(null);
        setToastMsg(`Permissions updated for ${data.user.name}.`);
        setTimeout(() => setToastMsg(''), 3000);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Failed to update permissions.');
      }
    } catch (e) {
      alert('Error updating user.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`User "${userName}" deleted.`);
        setTimeout(() => setToastMsg(''), 3000);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Failed to delete user.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#212938] pb-4">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            User Management & Module Access Control
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Grant or restrict specific module privileges per user and track individual learning utilization
          </p>
        </div>

        <button
          onClick={() => {
            setNewUserForm({
              name: '',
              email: '',
              role: 'student',
              accessibleModules: ['all'],
              notes: ''
            });
            setErrorMsg('');
            setIsAddUserModalOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30 flex items-center gap-1.5 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="p-3.5 rounded-xl bg-[#161c26] border border-[#232c3d] flex items-center text-xs">
        <Search className="w-4 h-4 text-gray-500 mr-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name, email, or role..."
          className="w-full bg-transparent text-gray-200 focus:outline-none text-xs"
        />
      </div>

      {/* Users Table */}
      <div className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-[#212938]">
                <th className="pb-2.5 font-semibold">User</th>
                <th className="pb-2.5 font-semibold">Role</th>
                <th className="pb-2.5 font-semibold">Accessible Modules</th>
                <th className="pb-2.5 font-semibold">Submissions</th>
                <th className="pb-2.5 font-semibold">Problems Solved</th>
                <th className="pb-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2535]">
              {filteredUsers.map((u) => {
                const isAllAccess = u.accessibleModules?.includes('all');
                const accessCount = isAllAccess 
                  ? 'All Modules (Unrestricted)' 
                  : `${u.accessibleModules?.length || 0} Modules Assigned`;

                const isActiveSimulated = activeUserId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-[#1a2130] transition-colors">
                    {/* User info */}
                    <td className="py-3 font-medium text-gray-200">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs">
                          {u.name[0] || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-gray-100">{u.name}</span>
                            {isActiveSimulated && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.2 rounded border border-blue-500/30">
                                ACTIVE IN ARENA
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Accessible Modules */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                          isAllAccess 
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold'
                            : 'bg-[#121620] text-gray-300 border-[#252f42]'
                        }`}>
                          {accessCount}
                        </span>

                        <button
                          onClick={() => setEditingAccessUser({ ...u })}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium underline cursor-pointer"
                        >
                          Edit Access
                        </button>
                      </div>
                    </td>

                    {/* Submissions */}
                    <td className="py-3 font-mono text-gray-300">
                      {u.totalSubmissions || 0}
                    </td>

                    {/* Solved Count */}
                    <td className="py-3 font-mono font-semibold text-emerald-400">
                      {u.solvedCount || 0} Solved
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {onSwitchActiveUser && (
                          <button
                            onClick={() => onSwitchActiveUser(u.id)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                              isActiveSimulated 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-[#1d2535] text-gray-300 hover:bg-[#253045]'
                            }`}
                            title="Simulate / Test Student Experience in Arena"
                          >
                            {isActiveSimulated ? 'Testing Now' : 'Simulate User'}
                          </button>
                        )}

                        <button
                          onClick={() => setViewingUserStats(u)}
                          className="p-1 rounded hover:bg-[#202838] text-gray-400 hover:text-blue-400 transition-colors"
                          title="View Utilization Details"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>

                        {u.id !== 'usr_admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1 rounded hover:bg-[#202838] text-gray-400 hover:text-rose-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: ADD USER ================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#151a24] border border-[#2b3547] rounded-xl shadow-2xl overflow-hidden text-gray-200">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#10141c] border-b border-[#222a38]">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Add New Mentee / User
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="m-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ankit Gupta"
                    className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ankit@college.edu"
                    className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  User Role
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="student">Student / Mentee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Module Access Allocation
                </label>
                <div className="p-3 rounded-lg bg-[#10141c] border border-[#263145] space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center space-x-2 text-blue-400 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserForm.accessibleModules.includes('all')}
                      onChange={(e) => {
                        setNewUserForm(prev => ({
                          ...prev,
                          accessibleModules: e.target.checked ? ['all'] : []
                        }));
                      }}
                      className="rounded bg-[#1a2232] border-gray-600 text-blue-600"
                    />
                    <span>Grant All Modules (Unrestricted Access)</span>
                  </label>

                  {!newUserForm.accessibleModules.includes('all') && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1f2638]">
                      {modules.map((m) => {
                        const checked = newUserForm.accessibleModules.includes(m.id);
                        return (
                          <label key={m.id} className="flex items-center space-x-2 cursor-pointer text-gray-300">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                let cur = [...newUserForm.accessibleModules];
                                if (e.target.checked) cur.push(m.id);
                                else cur = cur.filter(x => x !== m.id);
                                setNewUserForm(prev => ({ ...prev, accessibleModules: cur }));
                              }}
                              className="rounded bg-[#1a2232] border-gray-600 text-blue-600"
                            />
                            <span className="truncate">{m.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#1e2535] text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT MODULE PERMISSIONS ================= */}
      {editingAccessUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#151a24] border border-[#2b3547] rounded-xl shadow-2xl overflow-hidden text-gray-200">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#10141c] border-b border-[#222a38]">
              <div>
                <h3 className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  Edit Module Permissions
                </h3>
                <p className="text-[11px] text-gray-400">
                  Assigning module privileges for: <strong className="text-gray-200">{editingAccessUser.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingAccessUser(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-[#10141c] rounded-lg border border-[#252f42] flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-200 block">Grant All Modules</span>
                  <span className="text-[10px] text-gray-500">Unrestricted access to all present & future topics</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingAccessUser.accessibleModules?.includes('all')}
                  onChange={() => handleToggleModuleForUser('all')}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              {!editingAccessUser.accessibleModules?.includes('all') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-400 text-[11px] font-semibold uppercase">
                    <span>Individual Modules</span>
                    <span>{editingAccessUser.accessibleModules?.length || 0} selected</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 rounded bg-[#10141c] border border-[#202737]">
                    {modules.map((m) => {
                      const isChecked = editingAccessUser.accessibleModules?.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleToggleModuleForUser(m.id)}
                          className={`p-2 rounded border cursor-pointer flex items-center justify-between transition-colors ${
                            isChecked
                              ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-semibold'
                              : 'bg-[#141924] border-[#222a3a] text-gray-400 hover:bg-[#1a2130]'
                          }`}
                        >
                          <span className="truncate">{m.name}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#202737]">
                <button
                  type="button"
                  onClick={() => setEditingAccessUser(null)}
                  className="px-4 py-2 rounded-lg bg-[#1e2535] text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Access Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: VIEW USER UTILIZATION STATS ================= */}
      {viewingUserStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#151a24] border border-[#2b3547] rounded-xl shadow-2xl overflow-hidden text-gray-200">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#10141c] border-b border-[#222a38]">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                User Utilization & Learning Metrics
              </h3>
              <button
                onClick={() => setViewingUserStats(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#10141c] border border-[#202737]">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base">
                  {viewingUserStats.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-100 text-sm">{viewingUserStats.name}</div>
                  <div className="text-[11px] text-gray-400">{viewingUserStats.email}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Role: {viewingUserStats.role.toUpperCase()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#10141c] border border-[#202737]">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Total Code Runs</span>
                  <span className="text-lg font-bold text-gray-200">{viewingUserStats.totalSubmissions || 0}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#10141c] border border-[#202737]">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Problems Solved</span>
                  <span className="text-lg font-bold text-emerald-400">{viewingUserStats.solvedCount || 0}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase block mb-1">
                  Active Module Permissions:
                </span>
                <div className="p-2.5 rounded bg-[#10141c] border border-[#202737] max-h-28 overflow-y-auto space-y-1">
                  {viewingUserStats.accessibleModules?.includes('all') ? (
                    <span className="text-emerald-400 font-semibold block">All Modules (Unrestricted)</span>
                  ) : (
                    viewingUserStats.accessibleModules?.map(mId => (
                      <span key={mId} className="inline-block px-2 py-0.5 rounded bg-[#1a2232] text-gray-300 text-[10px] mr-1.5 mb-1 border border-[#273248]">
                        {modules.find(m => m.id === mId)?.name || mId}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="text-right pt-2 border-t border-[#202737]">
                <button
                  onClick={() => setViewingUserStats(null)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

