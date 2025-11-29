import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Copy, Plus, Trash2, Code2 } from 'lucide-react';

const SnippetBank: React.FC = () => {
  const { snippets, addSnippet, deleteSnippet } = useAppContext();
  
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('java');
  const [code, setCode] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && code) {
      addSnippet({ id: '', title, language: lang, code, tags: [] });
      setTitle('');
      setCode('');
      setShowForm(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Snippet Bank</h2>
          <p className="text-slate-400">Store reusable code and rubric comments.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> New Snippet
        </button>
      </header>

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-4">Add New Snippet</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Title</label>
                <input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  placeholder="e.g. Java Scanner Boilerplate"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Language</label>
                <select 
                  value={lang} 
                  onChange={e => setLang(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="text">Plain Text</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Code / Text</label>
              <textarea 
                value={code} 
                onChange={e => setCode(e.target.value)}
                rows={6}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono focus:border-blue-500 outline-none"
                placeholder="// Code goes here..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded text-sm font-medium"
              >
                Save Snippet
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map(snippet => (
          <div key={snippet.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col hover:border-slate-600 transition-colors">
            <div className="p-4 bg-slate-900/30 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-blue-400" />
                <h4 className="font-semibold text-slate-200 text-sm">{snippet.title}</h4>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {snippet.language}
              </span>
            </div>
            <div className="flex-1 p-0 relative group">
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap h-40">
                {snippet.code}
              </pre>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => copyToClipboard(snippet.code)}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded shadow-sm"
                  title="Copy to clipboard"
                >
                  <Copy size={14} />
                </button>
                <button 
                  onClick={() => deleteSnippet(snippet.id)}
                  className="p-1.5 bg-slate-700 hover:bg-red-900 text-red-400 rounded shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {snippets.length === 0 && !showForm && (
          <div className="col-span-full py-12 text-center text-slate-500 italic border border-dashed border-slate-700 rounded-xl">
            Snippet bank is empty. Add commonly used code or rubric text.
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetBank;