import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClassGroup, Student, Assignment, Grade, AttendanceRecord, Snippet, Todo, AppView } from '../types';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  classes: ClassGroup[];
  students: Student[];
  assignments: Assignment[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  snippets: Snippet[];
  todos: Todo[];
  
  addClass: (cls: ClassGroup) => void;
  deleteClass: (id: string) => void;
  addStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  updateGrade: (grade: Grade) => void;
  updateAttendance: (record: AttendanceRecord) => void;
  addSnippet: (snippet: Snippet) => void;
  deleteSnippet: (id: string) => void;
  toggleTodo: (id: string) => void;
  addTodo: (text: string) => void;
  deleteTodo: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dummy Data Generators
const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_CLASSES: ClassGroup[] = [
  { id: 'c1', name: 'AP Computer Science A', section: 'Period 1', schedule: '08:00 AM' },
  { id: 'c2', name: 'Intro to Python', section: 'Period 3', schedule: '10:30 AM' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Chen', email: 'alice@school.edu', classId: 'c1' },
  { id: 's2', name: 'Bob Smith', email: 'bob@school.edu', classId: 'c1' },
  { id: 's3', name: 'Charlie Davis', email: 'charlie@school.edu', classId: 'c1' },
  { id: 's4', name: 'Diana Prince', email: 'diana@school.edu', classId: 'c2' },
  { id: 's5', name: 'Evan Wright', email: 'evan@school.edu', classId: 'c2' },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', classId: 'c1', title: 'Unit 1: Java Basics', maxPoints: 100, date: '2023-09-15', completed: true },
  { id: 'a2', classId: 'c1', title: 'Unit 2: Objects', maxPoints: 50, date: '2023-10-01', completed: false },
  { id: 'a3', classId: 'c2', title: 'Python Loops', maxPoints: 20, date: '2023-09-20', completed: true },
];

const INITIAL_GRADES: Grade[] = [
  { studentId: 's1', assignmentId: 'a1', score: 95 },
  { studentId: 's1', assignmentId: 'a2', score: 48 },
  { studentId: 's2', assignmentId: 'a1', score: 82 },
  { studentId: 's3', assignmentId: 'a1', score: 70 },
  { studentId: 's4', assignmentId: 'a3', score: 18 },
];

const INITIAL_SNIPPETS: Snippet[] = [
  { id: 'sn1', title: 'Java Main Method', language: 'java', tags: ['boilerplate'], code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello world!");\n    }\n}' },
  { id: 'sn2', title: 'Python File Read', language: 'python', tags: ['io'], code: 'with open("file.txt", "r") as f:\n    content = f.read()\n    print(content)' },
];

const INITIAL_TODOS: Todo[] = [
  { id: 't1', text: 'Grade AP CSA Unit 2 Exams', completed: false },
  { id: 't2', text: 'Email parents about field trip', completed: true },
  { id: 't3', text: 'Update Python syllabus', completed: false },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from local storage or defaults
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    const saved = localStorage.getItem('tcc_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('tcc_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('tcc_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('tcc_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('tcc_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const saved = localStorage.getItem('tcc_snippets');
    return saved ? JSON.parse(saved) : INITIAL_SNIPPETS;
  });

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('tcc_todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('tcc_classes', JSON.stringify(classes)), [classes]);
  useEffect(() => localStorage.setItem('tcc_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('tcc_assignments', JSON.stringify(assignments)), [assignments]);
  useEffect(() => localStorage.setItem('tcc_grades', JSON.stringify(grades)), [grades]);
  useEffect(() => localStorage.setItem('tcc_attendance', JSON.stringify(attendance)), [attendance]);
  useEffect(() => localStorage.setItem('tcc_snippets', JSON.stringify(snippets)), [snippets]);
  useEffect(() => localStorage.setItem('tcc_todos', JSON.stringify(todos)), [todos]);

  // Actions
  const addClass = (cls: ClassGroup) => setClasses([...classes, { ...cls, id: generateId() }]);
  const deleteClass = (id: string) => setClasses(classes.filter(c => c.id !== id));
  
  const addStudent = (student: Student) => setStudents([...students, { ...student, id: generateId() }]);
  const deleteStudent = (id: string) => setStudents(students.filter(s => s.id !== id));
  
  const addAssignment = (assignment: Assignment) => setAssignments([...assignments, { ...assignment, id: generateId() }]);
  
  const updateAssignment = (updated: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    // Cleanup associated grades
    setGrades(prev => prev.filter(g => g.assignmentId !== id));
  };
  
  const updateGrade = (newGrade: Grade) => {
    setGrades(prev => {
      const existing = prev.find(g => g.studentId === newGrade.studentId && g.assignmentId === newGrade.assignmentId);
      if (existing) {
        return prev.map(g => (g.studentId === newGrade.studentId && g.assignmentId === newGrade.assignmentId) ? newGrade : g);
      }
      return [...prev, newGrade];
    });
  };

  const updateAttendance = (record: AttendanceRecord) => {
    setAttendance(prev => {
      // Check if record exists for this day/student/class
      const existingIndex = prev.findIndex(r => r.date === record.date && r.studentId === record.studentId && r.classId === record.classId);
      if (existingIndex >= 0) {
        const newAtt = [...prev];
        newAtt[existingIndex] = record;
        return newAtt;
      }
      return [...prev, { ...record, id: generateId() }];
    });
  };

  const addSnippet = (snippet: Snippet) => setSnippets([...snippets, { ...snippet, id: generateId() }]);
  const deleteSnippet = (id: string) => setSnippets(snippets.filter(s => s.id !== id));
  
  const toggleTodo = (id: string) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const addTodo = (text: string) => setTodos([...todos, { id: generateId(), text, completed: false }]);
  const deleteTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      classes, students, assignments, grades, attendance, snippets, todos,
      addClass, deleteClass, addStudent, deleteStudent, 
      addAssignment, updateAssignment, deleteAssignment,
      updateGrade, updateAttendance, addSnippet, deleteSnippet,
      toggleTodo, addTodo, deleteTodo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};