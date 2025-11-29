import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Users, ChevronRight } from 'lucide-react';

const ClassManager: React.FC = () => {
  const { classes, students, addClass, deleteClass, addStudent, deleteStudent } = useAppContext();
  
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  
  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassSection, setNewClassSection] = useState('');
  const [newClassTime, setNewClassTime] = useState('');

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName && newClassSection) {
      addClass({ id: '', name: newClassName, section: newClassSection, schedule: newClassTime || 'TBA' });
      setNewClassName('');
      setNewClassSection('');
      setNewClassTime('');
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName && selectedClassId) {
      addStudent({ id: '', name: newStudentName, email: newStudentEmail || 'no-email', classId: selectedClassId });
      setNewStudentName('');
      setNewStudentEmail('');
    }
  };

  const activeClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-4rem)] h-auto">
      {/* Left Column: Class List */}
      <div className="w-full md:w-1/3 flex flex-col h-96 md:h-full shrink-0">
        <h2 className="text-2xl font-bold text-white mb-4">Classes</h2>
        
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 overflow-y-auto flex-1 space-y-2">
            {classes.map(cls => (
              <div 
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`p-4 rounded-lg cursor-pointer border transition-all
                  ${selectedClassId === cls.id 
                    ? 'bg-blue-600/10 border-blue-500/50' 
                    : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${selectedClassId === cls.id ? 'text-blue-400' : 'text-slate-200'}`}>{cls.name}</h3>
                    <p className="text-xs text-slate-500">{cls.section} • {cls.schedule}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Users size={12} /> {students.filter(s => s.classId === cls.id).length} Students
                    </p>
                  </div>
                  {selectedClassId === cls.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteClass(cls.id); setSelectedClassId(null); }}
                      className="text-slate-600 hover:text-red-400 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Add New Class</h4>
            <form onSubmit={handleCreateClass} className="space-y-2">
              <input 
                placeholder="Class Name" 
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
              />
              <div className="flex gap-2">
                <input 
                  placeholder="Section" 
                  value={newClassSection}
                  onChange={e => setNewClassSection(e.target.value)}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                />
                <input 
                  placeholder="Time" 
                  value={newClassTime}
                  onChange={e => setNewClassTime(e.target.value)}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded flex items-center justify-center gap-2">
                <Plus size={16} /> Create Class
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Student Roster */}
      <div className="w-full md:w-2/3 flex flex-col h-[600px] md:h-full">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 truncate">
          <span className="text-slate-500 hidden sm:inline">Roster:</span>
          {activeClass ? activeClass.name : 'Select a Class'}
        </h2>

        {activeClass ? (
          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-900/30 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Student List ({classStudents.length})</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400 min-w-[300px]">
                <thead className="bg-slate-900/50 text-xs uppercase font-medium text-slate-500">
                  <tr>
                    <th className="px-4 md:px-6 py-3">Name</th>
                    <th className="px-4 md:px-6 py-3">Email</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {classStudents.length > 0 ? classStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-700/30">
                      <td className="px-4 md:px-6 py-3 font-medium text-slate-200">{student.name}</td>
                      <td className="px-4 md:px-6 py-3 font-mono text-xs hidden sm:table-cell">{student.email}</td>
                      <td className="px-4 md:px-6 py-3 font-mono text-xs sm:hidden block truncate max-w-[120px]">{student.email}</td>
                      <td className="px-4 md:px-6 py-3 text-right">
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">
                        No students enrolled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-900/50 border-t border-slate-700">
              <form onSubmit={handleAddStudent} className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Student Name</label>
                  <input 
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Email</label>
                  <input 
                    value={newStudentEmail}
                    onChange={e => setNewStudentEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center justify-center gap-2">
                  <Plus size={16} /> <span className="sm:hidden">Add</span> <span className="hidden sm:inline">Add Student</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
            <Users size={48} className="mb-4 opacity-50" />
            <p>Select a class to manage the roster.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManager;