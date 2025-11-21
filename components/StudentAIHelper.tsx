import React, { useState } from 'react';
import { generateProjectIdeas } from '../services/geminiService';
import { GradeLevel } from '../types';
import { Lightbulb, Sparkles } from 'lucide-react';

export const StudentAIHelper: React.FC = () => {
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.GRADE_4);
  const [ideas, setIdeas] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGetIdeas = async () => {
    setLoading(true);
    setIdeas('');
    const result = await generateProjectIdeas(grade);
    setIdeas(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-yellow-300" />
        <h3 className="text-xl font-bold">مساعد الأفكار الذكي 🤖</h3>
      </div>
      <p className="mb-4 text-indigo-100 text-sm">محتاجة فكرة لمشروعك عشان تكسبي نقطتين؟ اطلبي من الذكاء الاصطناعي!</p>
      
      <div className="flex gap-2 mb-4">
        <select 
          value={grade} 
          onChange={(e) => setGrade(e.target.value as GradeLevel)}
          className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white outline-none focus:bg-white/30"
        >
          <option className="text-gray-900" value={GradeLevel.GRADE_4}>الصف الرابع</option>
          <option className="text-gray-900" value={GradeLevel.GRADE_6}>الصف السادس</option>
        </select>
        <button 
          onClick={handleGetIdeas}
          disabled={loading}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'جارِ التفكير...' : <><Lightbulb size={18} /> اقترح أفكاراً</>}
        </button>
      </div>

      {ideas && (
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-indigo-50">{ideas}</pre>
        </div>
      )}
    </div>
  );
};