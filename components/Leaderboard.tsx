import React from 'react';
import { Student, WINNING_SCORE } from '../types';
import { Trophy, Medal, Star } from 'lucide-react';

interface Props {
  students: Student[];
}

export const Leaderboard: React.FC<Props> = ({ students }) => {
  const sortedStudents = [...students].sort((a, b) => b.totalPoints - a.totalPoints);
  const topStudents = sortedStudents.slice(0, 10); // Show top 10

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white text-center">
        <h2 className="text-3xl font-bold flex justify-center items-center gap-3">
          <Trophy className="w-8 h-8" /> لوحة الشرف
        </h2>
        <p className="opacity-90 mt-2">من ستصل إلى 100 نقطة وتفوز بالآيباد؟ 📱</p>
      </div>

      <div className="p-4">
        {topStudents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">لا يوجد طالبات مسجلات حتى الآن.</div>
        ) : (
          <div className="space-y-3">
            {topStudents.map((student, index) => {
              let rankIcon = <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;
              let bgClass = "bg-white";

              if (index === 0) {
                rankIcon = <Trophy className="text-yellow-500 w-6 h-6" />;
                bgClass = "bg-yellow-50 border-yellow-200";
              } else if (index === 1) {
                rankIcon = <Medal className="text-gray-400 w-6 h-6" />;
                bgClass = "bg-gray-50";
              } else if (index === 2) {
                rankIcon = <Medal className="text-amber-600 w-6 h-6" />;
                bgClass = "bg-orange-50";
              }

              return (
                <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg border ${bgClass} shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">{rankIcon}</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{student.name}</h3>
                      <span className="text-xs text-gray-500">{student.grade}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                       <span className="block font-bold text-purple-600 text-xl">{student.totalPoints}</span>
                       <span className="text-[10px] text-gray-400">نقطة</span>
                    </div>
                    {student.totalPoints >= WINNING_SCORE && (
                        <Star className="fill-yellow-400 text-yellow-400 animate-spin-slow" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};