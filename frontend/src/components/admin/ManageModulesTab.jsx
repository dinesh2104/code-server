import React, { useState } from 'react';
import { 
  FolderPlus, 
  Trash2, 
  Edit2, 
  FolderKanban, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';

export default function ManageModulesTab({ modules = [], onRefresh }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: 'Layers' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenCreate = () => {
    setEditingModule(null);
    setFormData({ name: '', description: '', icon: 'Layers' });
    setErrorMsg('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (mod) => {
    setEditingModule(mod);
    setFormData({ name: mod.name, description: mod.description || '', icon: mod.icon || 'Layers' });
    setErrorMsg('');
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const url = editingModule 
        ? `/api/admin/modules/${editingModule.id}`
        : '/api/admin/modules';
      
      const method = editingModule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setToastMsg(editingModule ? 'Module updated successfully!' : 'New module created successfully!');
        setTimeout(() => setToastMsg(''), 3000);
        if (onRefresh) onRefresh();
      } else {
        setErrorMsg(data.message || 'Operation failed');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (moduleId, moduleName) => {
    if (!window.confirm(`Are you sure you want to delete module "${moduleName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`Module "${moduleName}" deleted.`);
        setTimeout(() => setToastMsg(''), 3000);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Failed to delete module.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#212938] pb-4">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-400" />
            Manage DSA Modules & Tracks
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Organize the curriculum into distinct algorithm and data structure modules
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30 flex items-center gap-1.5 transition-all"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ Create New Module</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div 
            key={mod.id}
            className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] hover:border-[#2f3b52] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-100">{mod.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#11151e] border border-[#212a3a] text-blue-300">
                  {mod.count || 0} Questions
                </span>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2 mt-1 mb-4 leading-relaxed">
                {mod.description || `Module for mastering ${mod.name} techniques and algorithmic patterns.`}
              </p>
            </div>

            <div className="pt-3 border-t border-[#202737] flex items-center justify-between text-xs">
              <span className="text-[10px] text-gray-500 font-mono">
                ID: {mod.id}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(mod)}
                  className="p-1 rounded hover:bg-[#202838] text-gray-400 hover:text-blue-400 transition-colors"
                  title="Edit Module"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(mod.id, mod.name)}
                  className="p-1 rounded hover:bg-[#202838] text-gray-400 hover:text-rose-400 transition-colors"
                  title="Delete Module"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#151a24] border border-[#2b3547] rounded-xl shadow-2xl overflow-hidden text-gray-200">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#10141c] border-b border-[#222a38]">
              <h3 className="text-sm font-bold text-gray-100">
                {editingModule ? 'Edit Module' : 'Create New DSA Module'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
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

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Module Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Tries & Advanced Strings"
                  className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary of concepts covered in this module..."
                  className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#1e2535] text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  {isSubmitting ? 'Saving...' : editingModule ? 'Save Changes' : 'Create Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

