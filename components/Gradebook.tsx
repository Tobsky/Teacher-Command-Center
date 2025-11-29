import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, X, User, Edit2, Trash2, CheckCircle } from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import { Student, Assignment } from '../types';

const Gradebook: React.FC = () => {
  const { classes, students, assignments, grades, updateGrade, addAssignment, updateAssignment, deleteAssignment } = useAppContext();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  
  // New Assignment State
  const [showAddAssign, setShowAddAssign] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignPoints, setNewAssignPoints] = useState('100');

  // Edit Assignment State
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editAssignTitle, setEditAssignTitle] = useState('');
  const [editAssignPoints, setEditAssignPoints] = useState('');
  const [editAssignCompleted, setEditAssignCompleted] = useState(false);

  // Student Detail Modal State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
        date: new Date().toISOString().split('T')[0],
        completed: false
      });
      setNewAssignTitle('');
      setShowAddAssign(false);
    }
  };

  const handleEditClick = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditAssignTitle(assignment.title);
    setEditAssignPoints(assignment.maxPoints.toString());
    setEditAssignCompleted(assignment.completed);
  };

  const handleUpdateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment && editAssignTitle && editAssignPoints) {
      updateAssignment({
        ...editingAssignment,
        title: editAssignTitle,
        maxPoints: parseInt(editAssignPoints),
        completed: editAssignCompleted
      });
      setEditingAssignment(null);
    }
  };

  const handleDeleteAssignment = () => {
    if (editingAssignment) {
      if (window.confirm("Are you sure you want to delete this assignment? All associated grades will be lost.")) {
        deleteAssignment(editingAssignment.id);
        setEditingAssignment(null);
      }
    }
  };

  // Helper to generate chart data for selected student
  const getStudentPerformanceData = () => {
    if (!selectedStudent) return [];
    
    // Get all assignments for this student's class, sorted by date
    const classAssignments = assignments
      .filter(a => a.classId === selectedStudent.classId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return classAssignments.map(assign => {
      const grade = grades.find(g => g.studentId === selectedStudent.id && g.assignmentId === assign.id);
      const score = grade ? grade.score : 0;
      const percentage = assign.maxPoints > 0 ? (score / assign.maxPoints) * 100 : 0;
      
      return {
        label: new Date(assign.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
        value: parseFloat(percentage.toFixed(1)),
        subLabel: assign.title
      };
    }).filter(d => d.value > 0 || true); 
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
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

      {/* Add Assignment Form */}
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

      {/* Grade Table */}
      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-xs text-slate-400 font-medium uppercase border-b border-slate-700">
                <th className="sticky left-0 bg-slate-900 z-10 px-6 py-4 border-r border-slate-700 min-w-[200px]">Student Name</th>
                <th className="px-4 py-4 min-w-[100px] text-center bg-slate-900/80 border-r border-slate-700 text-blue-400">Average</th>
                {activeAssignments.map(a => (
                  <th 
                    key={a.id} 
                    onClick={() => handleEditClick(a)}
                    className={`px-4 py-4 min-w-[120px] text-center border-r border-slate-700 group relative cursor-pointer transition-colors
                      ${a.completed ? 'bg-emerald-900/20 hover:bg-emerald-900/30' : 'hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                       <span className={`truncate max-w-[100px] ${a.completed ? 'text-emerald-400 font-semibold' : ''}`} title={a.title}>{a.title}</span>
                       {a.completed && <CheckCircle size={12} className="text-emerald-400" />}
                       <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-slate-500" />
                    </div>
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
                  <tr key={student.id} className="hover:bg-slate-700/20 group">
                    <td className="sticky left-0 bg-slate-800 px-6 py-3 border-r border-slate-700 font-medium text-slate-200">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="hover:text-blue-400 hover:underline flex items-center gap-2 text-left w-full"
                      >
                         {student.name}
                      </button>
                    </td>
                    <td className={`px-4 py-3 text-center border-r border-slate-700 font-mono font-bold ${avgColor}`}>
                      {avg}%
                    </td>
                    {activeAssignments.map(a => (
                      <td key={a.id} className={`px-2 py-2 text-center border-r border-slate-700 p-0 ${a.completed ? 'bg-slate-900/50' : ''}`}>
                        <input
                          type="number"
                          value={getStudentGrade(student.id, a.id)}
                          onChange={(e) => handleGradeChange(student.id, a.id, e.target.value)}
                          className={`w-full h-full bg-transparent text-center focus:bg-slate-900 focus:outline-none focus:text-blue-400 font-mono text-slate-300
                            ${a.completed ? 'opacity-70' : ''}`}
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

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit Assignment</h3>
              <button 
                onClick={() => setEditingAssignment(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Title</label>
                <input 
                  value={editAssignTitle} 
                  onChange={e => setEditAssignTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Max Points</label>
                  <input 
                    type="number"
                    value={editAssignPoints} 
                    onChange={e => setEditAssignPoints(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
                    <input 
                      type="checkbox"
                      checked={editAssignCompleted}
                      onChange={e => setEditAssignCompleted(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-800"
                    />
                    <span className="text-sm text-slate-300 select-none">Mark Completed</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button 
                  type="button" 
                  onClick={handleDeleteAssignment}
                  className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <User className="text-blue-400" /> {selectedStudent.name}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{selectedStudent.email} • ID: {selectedStudent.id}</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <PerformanceChart 
                data={getStudentPerformanceData()}
                title="Performance Timeline"
                subtitle={`Grade history for ${selectedStudent.name}`}
                color="#34d399" // Emerald-400
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-xs uppercase font-bold">Current Average</span>
                  <div className="text-3xl font-bold text-emerald-400 mt-1">{calculateAverage(selectedStudent.id)}%</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-xs uppercase font-bold">Assignments Submitted</span>
                  <div className="text-3xl font-bold text-blue-400 mt-1">
                    {getStudentPerformanceData().filter(d => d.value > 0).length} / {activeAssignments.length}
                  </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-xs uppercase font-bold">Class Rank</span>
                  <div className="text-3xl font-bold text-purple-400 mt-1">Top 15%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gradebook;