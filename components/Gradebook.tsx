import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

const Gradebook: React.FC = () => {
  const { classes, students, assignments, grades, updateGrade, addAssignment } = useAppContext();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  
  // New Assignment State
  const [showAddAssign, setShowAddAssign] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignPoints, setNewAssignPoints] = useState('100');

  const activeStudents = students.filter(s => s.classId === selectedClassId);
  const activeAssignments = assignments.filter(a => a.classId === selectedClassId);

  const getStudentGrade = (studentId: string, assignmentId: string) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId)?.score || '';
  };

  const handleGradeChange = (studentId: string, assignmentId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateGrade({ studentId, assignmentId, score: numValue });
    }
  };

  const calculateAverage = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId && activeAssignments.some(a => a.id === g.assignmentId));
    let totalEarned = 0;
    let totalMax = 0;

    studentGrades.forEach(g => {
      const assign = assignments.find(a => a.id === g.assignmentId);
      if (assign) {
        totalEarned += g.score;
        totalMax += assign.maxPoints;
      }
    });

    return totalMax > 0 ? ((totalEarned / totalMax) * 100).toFixed(1) : 'N/A';
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignTitle && newAssignPoints) {
      addAssignment({
        id: '',
        classId: selectedClassId,
        title: newAssignTitle,
        maxPoints: parseInt(newAssignPoints),
        date: new Date().toISOString().split('T')[0]
      });
      setNewAssignTitle('');
      setShowAddAssign(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gradebook</h2>
          <p className="text-slate-400">Manage assignments and scores.</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-blue-500"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button 
            onClick={() => setShowAddAssign(!showAddAssign)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Plus size={16} /> New Assignment
          </button>
        </div>
      </header>

      {showAddAssign && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 animate-in slide-in-from-top-4 fade-in duration-200">
          <h4 className="text-sm font-bold text-white mb-3">Create New Assignment</h4>
          <form onSubmit={handleAddAssignment} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Title</label>
              <input 
                value={newAssignTitle} 
                onChange={e => setNewAssignTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                placeholder="Unit Test 1"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs text-slate-500 mb-1">Max Points</label>
              <input 
                type="number"
                value={newAssignPoints} 
                onChange={e => setNewAssignPoints(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
              />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium">
              Save
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-xs text-slate-400 font-medium uppercase border-b border-slate-700">
                <th className="sticky left-0 bg-slate-900 z-10 px-6 py-4 border-r border-slate-700 min-w-[200px]">Student Name</th>
                <th className="px-4 py-4 min-w-[100px] text-center bg-slate-900/80 border-r border-slate-700 text-blue-400">Average</th>
                {activeAssignments.map(a => (
                  <th key={a.id} className="px-4 py-4 min-w-[120px] text-center border-r border-slate-700 group relative">
                    <div className="truncate w-full" title={a.title}>{a.title}</div>
                    <div className="text-[10px] text-slate-600 font-mono mt-1">/{a.maxPoints} pts</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm text-slate-300">
              {activeStudents.map(student => {
                const avg = calculateAverage(student.id);
                let avgColor = 'text-slate-300';
                if (avg !== 'N/A') {
                  const numAvg = parseFloat(avg);
                  if (numAvg >= 90) avgColor = 'text-emerald-400';
                  else if (numAvg < 70) avgColor = 'text-red-400';
                  else if (numAvg < 80) avgColor = 'text-yellow-400';
                }

                return (
                  <tr key={student.id} className="hover:bg-slate-700/20">
                    <td className="sticky left-0 bg-slate-800 px-6 py-3 border-r border-slate-700 font-medium text-slate-200">
                      {student.name}
                    </td>
                    <td className={`px-4 py-3 text-center border-r border-slate-700 font-mono font-bold ${avgColor}`}>
                      {avg}%
                    </td>
                    {activeAssignments.map(a => (
                      <td key={a.id} className="px-2 py-2 text-center border-r border-slate-700 p-0">
                        <input
                          type="number"
                          value={getStudentGrade(student.id, a.id)}
                          onChange={(e) => handleGradeChange(student.id, a.id, e.target.value)}
                          className="w-full h-full bg-transparent text-center focus:bg-slate-900 focus:outline-none focus:text-blue-400 font-mono text-slate-300"
                          placeholder="-"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
              {activeStudents.length === 0 && (
                <tr>
                  <td colSpan={activeAssignments.length + 2} className="px-6 py-8 text-center text-slate-500 italic">
                    No students in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gradebook;