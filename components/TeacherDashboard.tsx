import React, { useState } from 'react';
import { Student, ActivityType, ACTIVITY_POINTS, ACTIVITY_LABELS, PointLog, WINNING_SCORE, GradeLevel, Project } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { generateEncouragement } from '../services/geminiService';
import { Trophy, Wand2, Search, X, Save } from 'lucide-react';

interface Props {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
}

export const TeacherDashboard: React.FC<Props> = ({ students, onUpdateStudent }) => {
  const [filterName, setFilterName] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('ALL');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<{ id: string, msg: string } | null>(null);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedStudentForProject, setSelectedStudentForProject] = useState<Student | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const handleActivityClick = (student: Student, activity: ActivityType) => {
    if (activity === ActivityType.PROJECT) {
      // Open modal for project details
      setSelectedStudentForProject(student);
      setProjectTitle('');
      setProjectDesc('');
      setIsProjectModalOpen(true);
    } else {
      // Add points directly for other activities
      handleAddPoints(student, activity);
    }
  };

  const handleAddPoints = (student: Student, activity: ActivityType, projectData?: Project) => {
    const pointsToAdd = ACTIVITY_POINTS[activity];
    
    const newLog: PointLog = {
      id: uuidv4(),
      activityType: activity,
      points: pointsToAdd,
      timestamp: Date.now(),
    };

    const newTotal = student.totalPoints + pointsToAdd;
    const hasWonNow = newTotal >= WINNING_SCORE && !student.hasWon;

    const updatedStudent: Student = {
      ...student,
      totalPoints: newTotal,
      logs: [newLog, ...student.logs],
      projects: projectData ? [projectData, ...(student.projects || [])] : (student.projects || []),
      hasWon: student.hasWon || hasWonNow,
    };

    onUpdateStudent(updatedStudent);

    if (hasWonNow) {
      alert(`🎉 مبروك! الطالبة ${student.name} وصلت إلى ${newTotal} نقطة وفازت بالآيباد!`);
    }
  };

  const handleSaveProject = () => {
    if (!selectedStudentForProject) return;
    if (!projectTitle.trim()) {
      alert('الرجاء كتابة عنوان المشروع');
      return;
    }

    const newProject: Project = {
      id: uuidv4(),
      title: projectTitle,
      description: projectDesc,
      timestamp: Date.now(),
    };

    handleAddPoints(selectedStudentForProject, ActivityType.PROJECT, newProject);
    setIsProjectModalOpen(false);
    setSelectedStudentForProject(null);
  };

  const handleGenerateFeedback = async (student: Student) => {
    setLoadingAI(student.id);
    setAiMessage(null);
    const msg = await generateEncouragement(student.name, student.totalPoints);
    setAiMessage({ id: student.id, msg });
    setLoadingAI(null);
  };

  const filteredStudents = students.filter(s => {
    const nameMatch = s.name.toLowerCase().includes(filterName.toLowerCase());
    const gradeMatch = filterGrade === 'ALL' || s.grade === filterGrade;
    return nameMatch && gradeMatch;
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           لوحة تحكم المعلمة 👩‍🏫
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
             <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
             <input 
              type="text" 
              placeholder="بحث بالاسم..." 
              className="pr-10 pl-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 outline-none"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
             />
          </div>
          <select 
            className="border rounded-lg px-3 py-2 bg-white"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="ALL">الكل</option>
            <option value={GradeLevel.GRADE_4}>الرابع</option>
            <option value={GradeLevel.GRADE_6}>السادس</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">لا يوجد طالبات مسجلات بهذا البحث.</div>
        ) : (
          filteredStudents.map(student => (
            <div key={student.id} className={`bg-white border rounded-xl shadow-sm p-4 transition-all ${student.hasWon ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Student Info */}
                <div className="flex items-start gap-4 min-w-[200px]">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${student.hasWon ? 'bg-yellow-400' : 'bg-purple-600'}`}>
                    {student.hasWon ? <Trophy size={20} /> : student.totalPoints}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{student.name}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{student.grade}</span>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, student.totalPoints)}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{student.totalPoints} / {WINNING_SCORE} نقطة</p>
                    
                    {/* AI Feedback Section */}
                    {aiMessage?.id === student.id && (
                        <div className="mt-2 text-sm text-green-700 bg-green-50 p-2 rounded animate-pulse">
                            🤖 {aiMessage.msg}
                        </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-1">
                   <p className="text-xs text-gray-500 mb-2 font-semibold">إضافة نقاط:</p>
                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {(Object.keys(ACTIVITY_POINTS) as ActivityType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleActivityClick(student, type)}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition text-center ${
                            type === ActivityType.PROJECT 
                            ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' 
                            : 'bg-purple-50 border-purple-100 hover:bg-purple-100'
                          }`}
                        >
                          <span className={`text-xs font-bold ${type === ActivityType.PROJECT ? 'text-indigo-700' : 'text-purple-700'}`}>{ACTIVITY_POINTS[type]} pts</span>
                          <span className="text-[10px] text-gray-600 mt-1 leading-tight">{ACTIVITY_LABELS[type].split('(')[0]}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* AI Button */}
                <div className="flex items-center justify-center md:justify-end">
                   <button 
                    onClick={() => handleGenerateFeedback(student)}
                    disabled={loadingAI === student.id}
                    className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-3 py-2 rounded-full hover:bg-indigo-100 transition"
                   >
                     {loadingAI === student.id ? 'جارِ التحليل...' : <><Wand2 size={14} /> تشجيع ذكي</>}
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Project Modal */}
      {isProjectModalOpen && selectedStudentForProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">إضافة مشروع للطالبة {selectedStudentForProject.name}</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المشروع</label>
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="مثلاً: مجسم عن النظام الشمسي"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المشروع (اختياري)</label>
                <textarea 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                  placeholder="تفاصيل إضافية عن المشروع..."
                />
              </div>
              
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                ✨ سيتم إضافة <strong>2 نقطة</strong> تلقائياً للطالبة عند حفظ المشروع.
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleSaveProject}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Save size={18} /> حفظ وإضافة النقاط
                </button>
                <button 
                  onClick={() => setIsProjectModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};