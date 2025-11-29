import { GoogleGenAI } from "@google/genai";
import { Student, Assignment, Grade, AttendanceRecord, ClassGroup } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStudentFeedback = async (
  student: Student,
  clazz: ClassGroup,
  assignments: Assignment[],
  grades: Grade[],
  attendance: AttendanceRecord[]
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Error: API Key is missing. Please check your configuration.";

  // Aggregate Data
  const studentGrades = grades.filter(g => g.studentId === student.id);
  const totalPoints = assignments.reduce((acc, curr) => acc + curr.maxPoints, 0);
  const earnedPoints = studentGrades.reduce((acc, curr) => acc + curr.score, 0);
  const average = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const absences = studentAttendance.filter(a => a.status === 'Absent').length;
  const lates = studentAttendance.filter(a => a.status === 'Late').length;

  const prompt = `
    Role: You are an encouraging but rigorous Computer Science teacher.
    Task: Write a short, constructive paragraph (max 100 words) for a progress report.
    
    Student: ${student.name}
    Class: ${clazz.name} (${clazz.section})
    
    Performance Data:
    - Average Score: ${average.toFixed(1)}%
    - Assignments Completed: ${studentGrades.length}/${assignments.length}
    - Attendance: ${absences} Absences, ${lates} Lates
    
    Instructions:
    - Highlight strengths if average is high, or specific areas for improvement if low.
    - Mention attendance if it's an issue (more than 2 absences/lates).
    - Use professional, academic tone but remain accessible.
    - Do not include placeholders. Write the final feedback text directly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Could not generate feedback.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating feedback. Please try again later.";
  }
};