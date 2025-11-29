import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateStudentFeedback } from '../services/geminiService';
import { Sparkles, Loader2, Copy } from 'lucide-react';

const SmartFeedback: React.FC = () => {
  const { classes, students, assignments, grades, attendance } = useAppContext();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const activeStudents = students.filter(s => s.classId === selectedClassId);

  const handleGenerate = async () => {
    if (!selectedStudentId) return;

    const student = students.find(s => s.id === selectedStudentId);
    const clazz = classes.find(c => c.id === selectedClassId);
    
    if (student && clazz) {
      setLoading(true);
      setFeedback('');
      const result = await generateStudentFeedback(student, clazz, assignments, grades, attendance);
      setFeedback(result);
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="text-purple-400" /> Smart Feedback Generator
        </h2>
        <p className="text-slate-400">Generate AI-powered progress report comments based on student data.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Selection Panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">1. Select Student</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Class</label>
              <select 
                value={selectedClassId}
                onChange={(e) => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded px-3 py-2 outline-none focus:border-blue-500"
              >
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Student</label>
              <select 
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={!selectedClassId}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded px-3 py-2 outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">-- Choose Student --</option>
                {activeStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedStudentId || loading}
              className={`w-full py-3 rounded font-medium flex items-center justify-center gap-2 transition-all
                ${!selectedStudentId || loading 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? 'Analyzing Data...' : 'Generate Feedback'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">2. Generated Report</h3>
          
          <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 p-6 relative">
            {feedback ? (
              <>
                <p className="text-slate-300 leading-relaxed font-serif text-lg">{feedback}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(feedback)}
                  className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded border border-slate-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Select a student and click Generate to see the magic.</p>
                <p className="text-xs text-slate-700 mt-2 max-w-md text-center">
                  The AI analyzes grades, attendance patterns, and class info to write a personalized comment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFeedback;