import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
export const ManageUsers = () => {
    const { addToast } = useNotification();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.getAdminUsers({
                role: roleFilter === 'all' ? undefined : roleFilter,
                search: search.trim() || undefined
            });
            if (res.success) {
                setUsers(res.users || []);
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);
    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete user "${name}"?`))
            return;
        try {
            await api.deleteUser(id);
            addToast(`User ${name} removed from system`, 'success');
            fetchUsers();
        }
        catch (err) {
            addToast(err.message || 'Error deleting user', 'error');
        }
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Manage Users</h1>
        <p className="text-xs text-slate-500">View and manage all registered donors, patients, hospitals, and staff</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <form onSubmit={e => { e.preventDefault(); fetchUsers(); }} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-red-500"/>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase">Role:</span>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
            <option value="all">All Roles</option>
            <option value="donor">Donors</option>
            <option value="patient">Patients</option>
            <option value="hospital">Hospitals</option>
            <option value="blood_bank">Blood Banks</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map(u => (<tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center">
                      {(u.name || 'U')[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="capitalize px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-mono">{u.phone}</td>
                  <td className="p-4 text-slate-400">Recently</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition" title="Delete User">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
