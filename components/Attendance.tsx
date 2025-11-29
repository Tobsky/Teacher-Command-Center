import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AttendanceStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const Attendance: React.FC = () => {
  const { classes, students, attendance, updateAttendance } = useAppContext();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const activeStudents = students.filter(s => s.classId === selectedClassId);

  const getStatus = (studentId: string): AttendanceStatus | null => {
    const record = attendance.find(
      r => r.date === selectedDate && r.classId === selectedClassId && r.studentId === studentId
    );
    return record ? record.status : null;
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    updateAttendance({
      id: '', // Handled by context
      date: selectedDate,
      classId: selectedClassId,
      studentId,
      status
    });
  };

  const getStatusColor = (status: AttendanceStatus | null) => {
    switch (status) {
      case 'Present': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'Absent': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Late': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Excused': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Attendance</h2>
          <p className="text-slate-400">Track daily student presence.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 flex items-center">
             <input 
               type="date" 
               value={selectedDate}
               onChange={(e) => setSelectedDate(e.target.value)}
               className="bg-transparent text-white text-sm outline-none px-2 font-mono"
             />
          </div>
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-blue-500"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
          </select>
        </div>
      </header>

      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeStudents.length > 0 ? activeStudents.map(student => {
              const currentStatus = getStatus(student.id);
              return (
                <div key={student.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{student.name}</p>
                      <p className="text-xs text-slate-500 font-mono">ID: {student.id.substr(0,4)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {(['Present', 'Absent', 'Late', 'Excused'] as AttendanceStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(student.id, status)}
                        className={`text-xs py-1.5 rounded border transition-all
                          ${currentStatus === status 
                            ? getStatusColor(status) 
                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}
                      >
                        {status.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                No students in this class.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;