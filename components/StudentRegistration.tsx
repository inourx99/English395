import React, { useState } from 'react';
import { GradeLevel, Student } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onRegister: (student: Student) => void;
  existingNames: string[];
}

export const StudentRegistration: React.FC<Props> = ({ onRegister, existingNames }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.GRADE_4);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('الرجاء كتابة الاسم الثلاثي');
      return;
    }

    if (existingNames.includes(name.trim())) {
      setError('هذا الاسم مسجل بالفعل، يرجى مراجعة المعلمة إذا كان هناك تشابه أسماء.');
      return;
    }

    const newStudent: Student = {
      id: uuidv4(),
      name: name.trim(),
      grade: grade,
      totalPoints: 0,
      logs: [],
      projects: [],
      hasWon: false,
    };

    onRegister(newStudent);
    setName('');
    alert('تم التسجيل بنجاح! بالتوفيق يا بطلة.');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto border-t-4 border-purple-500">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">تسجيل طالبة جديدة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الثلاثي</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
            placeholder="اكتبي اسمك هنا..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الصف الدراسي</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setGrade(GradeLevel.GRADE_4)}
              className={`p-3 rounded-lg border-2 transition font-bold ${
                grade === GradeLevel.GRADE_4
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-500 hover:border-purple-300'
              }`}
            >
              الصف الرابع
            </button>
            <button
              type="button"
              onClick={() => setGrade(GradeLevel.GRADE_6)}
              className={`p-3 rounded-lg border-2 transition font-bold ${
                grade === GradeLevel.GRADE_6
                  ? 'border-pink-600 bg-pink-50 text-pink-700'
                  : 'border-gray-200 text-gray-500 hover:border-pink-300'
              }`}
            >
              الصف السادس
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-200"
        >
          سجلي الآن
        </button>
      </form>
    </div>
  );
};