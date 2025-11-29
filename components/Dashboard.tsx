import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckSquare, Clock, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { AppView } from '../types';
import PerformanceChart from './PerformanceChart';

const Dashboard: React.FC = () => {
  const { todos, toggleTodo, addTodo, deleteTodo, setCurrentView, classes, assignments, grades } = useAppContext();
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const pendingGradingCount = assignments.reduce((acc, assign) => {
    // A simplified check: just counting assignments that might need attention
    return acc + 1; 
  }, 0);

  // Calculate today's attendance summary (mock logic for "Today")
  const today = new Date().toISOString().split('T')[0];

  // --- Prepare Data for Chart ---
  // Sort assignments by date
  const sortedAssignments = [...assignments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate average grade for each assignment across all students
  const chartData = sortedAssignments.map(assign => {
    const assignGrades = grades.filter(g => g.assignmentId === assign.id);
    const totalPoints = assignGrades.reduce((acc, curr) => acc + curr.score, 0);
    const count = assignGrades.length;
    
    // Normalize to percentage
    const avgScore = count > 0 ? (totalPoints / count) : 0;
    const percentage = assign.maxPoints > 0 ? (avgScore / assign.maxPoints) * 100 : 0;

    return {
      label: new Date(assign.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: parseFloat(percentage.toFixed(1)),
      subLabel: assign.title
    };
  }).filter(d => d.value > 0); // Only show assignments with grades
  
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Welcome back, Professor. Here is today's overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Quick Stats Widget */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="text-blue-400" size={20} /> Today's Schedule
            </h3>
            <span className="text-xs font-mono text-slate-500">{today}</span>
          </div>
          <div className="space-y-3">
            {classes.length > 0 ? classes.map(cls => (
              <div key={cls.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded border border-slate-700/50">
                <div>
                  <p className="text-sm font-medium text-slate-200">{cls.name}</p>
                  <p className="text-xs text-slate-500">{cls.section}</p>
                </div>
                <span className="text-xs font-mono bg-slate-800 text-blue-300 px-2 py-1 rounded">
                  {cls.schedule}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 italic">No classes scheduled.</p>
            )}
            <button 
              onClick={() => setCurrentView(AppView.ATTENDANCE)}
              className="w-full mt-2 text-xs text-center text-blue-400 hover:text-blue-300 hover:underline"
            >
              Take Attendance &rarr;
            </button>
          </div>
        </div>

        {/* Pending Grading Widget */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <GraduationCap className="text-purple-400" size={20} /> Pending Grading
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-4xl font-bold text-white mb-1">{assignments.length}</div>
            <p className="text-sm text-slate-400">Total Assignments</p>
            <div className="text-xs text-slate-500 mt-2 text-center px-4">
              {grades.length} grades recorded so far.
            </div>
            <button 
              onClick={() => setCurrentView(AppView.GRADEBOOK)}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
            >
              Go to Gradebook
            </button>
          </div>
        </div>

        {/* Todo List Widget */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckSquare className="text-emerald-400" size={20} /> Quick Tasks
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-48 space-y-2 mb-4 pr-1">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-start gap-3 group">
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors
                    ${todo.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-400'}`}
                >
                  {todo.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </button>
                <span className={`text-sm flex-1 ${todo.completed ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                  {todo.text}
                </span>
                <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-2 mt-auto">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new task..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
            <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded">
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Class Performance Infographic */}
      <div className="mt-6">
        <PerformanceChart 
          data={chartData} 
          title="Global Class Performance" 
          subtitle="Average assignment scores over time across all classes."
          color="#818cf8" // Indigo-400
        />
      </div>
    </div>
  );
};

export default Dashboard;
