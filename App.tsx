import React, { useState, useEffect } from 'react';
import { Student } from './types';
import { StudentRegistration } from './components/StudentRegistration';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Leaderboard } from './components/Leaderboard';
import { StudentAIHelper } from './components/StudentAIHelper';
import { ProjectsGallery } from './components/ProjectsGallery';
import { UserPlus, LayoutDashboard, Lock, LogOut, BarChart3, Image as ImageIcon } from 'lucide-react';

const STORAGE_KEY = 'english_comp_students';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentView, setCurrentView] = useState<'HOME' | 'REGISTER' | 'TEACHER' | 'GALLERY'>('HOME');
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [teacherPin, setTeacherPin] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setStudents(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
  }, []);

  // Save to local storage whenever students change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const handleRegister = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    setCurrentView('HOME');
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded simple pin for demo purposes
    if (teacherPin === 'Nour1978') {
      setIsTeacherAuthenticated(true);
      setTeacherPin('');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2" onClick={() => setCurrentView('HOME')} role="button">
            <div className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white p-2 rounded-lg">
               <span className="text-xl font-bold">ES</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">مسابقة اللغة الإنجليزية</h1>
              <p className="text-[10px] text-gray-500 hidden sm:block">الابتدائية 395</p>
            </div>
          </div>
          
          <nav className="flex gap-2">
            <button 
              onClick={() => setCurrentView('HOME')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${currentView === 'HOME' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <BarChart3 size={18} />
              <span className="hidden md:inline">النتائج</span>
            </button>
            <button 
              onClick={() => setCurrentView('GALLERY')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${currentView === 'GALLERY' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <ImageIcon size={18} />
              <span className="hidden md:inline">المعرض</span>
            </button>
            <button 
              onClick={() => setCurrentView('REGISTER')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${currentView === 'REGISTER' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <UserPlus size={18} />
              <span className="hidden md:inline">تسجيل</span>
            </button>
            <button 
              onClick={() => setCurrentView('TEACHER')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${currentView === 'TEACHER' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {isTeacherAuthenticated ? <LayoutDashboard size={18} /> : <Lock size={18} />}
              <span className="hidden md:inline">المعلمة</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        
        {/* Home View: Leaderboard + AI Ideas */}
        {currentView === 'HOME' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <Leaderboard students={students} />
            </div>
            <div className="lg:col-span-1">
               <StudentAIHelper />
               
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-gray-800 mb-4">طريقة احتساب النقاط</h3>
                 <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex justify-between border-b pb-2"><span>مشروع إنجليزي</span> <span className="font-bold text-purple-600">2 نقاط</span></li>
                    <li className="flex justify-between border-b pb-2"><span>ورقة عمل</span> <span className="font-bold text-purple-600">1 نقطة</span></li>
                    <li className="flex justify-between border-b pb-2"><span>شرح الدرس</span> <span className="font-bold text-purple-600">1 نقطة</span></li>
                    <li className="flex justify-between border-b pb-2"><span>استراتيجيات الدرس</span> <span className="font-bold text-purple-600">1 نقطة</span></li>
                    <li className="flex justify-between"><span>عمل بحث</span> <span className="font-bold text-purple-600">1 نقطة</span></li>
                 </ul>
               </div>
            </div>
          </div>
        )}

        {/* Projects Gallery View */}
        {currentView === 'GALLERY' && (
          <ProjectsGallery students={students} />
        )}

        {/* Registration View */}
        {currentView === 'REGISTER' && (
          <div className="flex justify-center items-center py-10">
            <StudentRegistration 
              onRegister={handleRegister} 
              existingNames={students.map(s => s.name)} 
            />
          </div>
        )}

        {/* Teacher View */}
        {currentView === 'TEACHER' && (
          <div>
            {!isTeacherAuthenticated ? (
              <div className="max-w-sm mx-auto bg-white p-8 rounded-2xl shadow-lg text-center mt-10">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">دخول المعلمة</h2>
                <p className="text-gray-500 text-sm mb-6">الرجاء إدخال رمز المرور للوصول إلى لوحة التحكم.</p>
                <form onSubmit={handleTeacherLogin}>
                  <input 
                    type="password" 
                    value={teacherPin}
                    onChange={(e) => setTeacherPin(e.target.value)}
                    className="w-full text-center text-2xl tracking-widest p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="****"
                  />
                  <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">دخول</button>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => setIsTeacherAuthenticated(false)}
                    className="text-red-500 text-sm flex items-center gap-1 hover:bg-red-50 px-3 py-1 rounded-lg transition"
                  >
                    <LogOut size={16} /> تسجيل خروج
                  </button>
                </div>
                <TeacherDashboard students={students} onUpdateStudent={handleUpdateStudent} />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center text-gray-500 text-sm py-8 bg-white mt-8 border-t border-gray-100">
        <p className="font-bold text-purple-600 mb-1">الابتدائية 395</p>
        <p>إعداد المعلمة: نور القحطاني</p>
        <p className="text-xs text-gray-400 mt-2">© 2024 جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default App;