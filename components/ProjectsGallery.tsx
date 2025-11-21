import React from 'react';
import { Student } from '../types';
import { Sparkles, Calendar } from 'lucide-react';

interface Props {
  students: Student[];
}

export const ProjectsGallery: React.FC<Props> = ({ students }) => {
  // Flatten projects from all students into a single list for display
  const allProjects = students.flatMap(student => 
    (student.projects || []).map(project => ({
      ...project,
      studentName: student.name,
      studentGrade: student.grade,
      studentId: student.id
    }))
  ).sort((a, b) => b.timestamp - a.timestamp); // Newest first

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2">
          <Sparkles className="text-yellow-500" /> معرض إبداعات الطالبات
        </h2>
        <p className="text-gray-500">نحتفل هنا بإنجازات ومشاريع بطلاتنا المتميزات</p>
      </div>

      {allProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-700">لا توجد مشاريع معروضة حالياً</h3>
          <p className="text-gray-500 mt-2">سيظهر هنا أي مشروع تقوم المعلمة بإضافته للطالبات.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
              {/* Artistic Header for Card */}
              <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 flex items-end">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-purple-700 shadow-sm">
                   {project.studentGrade}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                
                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs">
                        {project.studentName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{project.studentName}</span>
                   </div>
                   <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Calendar size={12} />
                      {new Date(project.timestamp).toLocaleDateString('ar-SA')}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};