import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { GoogleGenAI } from "@google/genai";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
        textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse('');
    setError('');

    try {
      const apiKey = process.env.API_KEY; 
      
      if (!apiKey) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponse("عذراً، لا يمكن الاتصال بالخادم الذكي حالياً لعدم توفر مفتاح التفعيل. (API Key missing)");
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful medical assistant. Answer this health-related question in Arabic briefly and professionally. Advise them to see a real doctor for serious issues. Question: ${query}`,
      });
      
      setResponse(result.text || "لم أتمكن من الحصول على إجابة، يرجى المحاولة لاحقاً.");

    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header - Updated to #0C5A5D */}
        <div className="bg-[#0C5A5D] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                    <Icons.Sparkles size={20} />
                </div>
                <h3 className="font-bold text-lg">المساعد الطبي الذكي</h3>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
                <Icons.PlusCircle className="transform rotate-45" size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1">
            <p className="text-gray-500 text-sm mb-4 bg-blue-50 p-3 rounded-xl border border-blue-100 font-medium">
                مرحباً بك. أنا مساعدك الطبي المعتمد على الذكاء الاصطناعي. اسألني عن الأعراض، النصائح الصحية، أو المعلومات العامة.
            </p>

            {response && (
                <div className="bg-gray-100 p-4 rounded-2xl mb-4 text-gray-800 text-sm leading-relaxed border-r-4 border-[#0C5A5D]">
                    <strong className="block text-[#0C5A5D] mb-1">الإجابة:</strong>
                    {response}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
                    {error}
                </div>
            )}
            
            <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="اكتب سؤالك هنا... (مثال: ما هي أعراض الانفلونزا؟)"
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 font-medium placeholder-gray-400 focus:border-[#0C5A5D] focus:ring-4 focus:ring-[#0C5A5D]/10 outline-none resize-none h-32 shadow-inner text-base"
            />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
            <button 
                onClick={handleAsk}
                disabled={loading || !query.trim()}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    loading || !query.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0C5A5D] text-white hover:opacity-90 shadow-lg hover:shadow-cyan-500/30'
                }`}
            >
                {loading ? (
                    <>
                        <Icons.Activity className="animate-spin" size={18} />
                        جاري التحليل...
                    </>
                ) : (
                    <>
                        <Icons.Zap size={18} />
                        احصل على إجابة
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};

export default AIModal;