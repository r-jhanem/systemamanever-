import React, { useState, useEffect } from 'react';
import { Icons, LogoIcon } from './Icons';

interface EntryScreenProps {
  onSelect: (type: 'visitor' | 'subscriber', data?: any) => void;
}

type Step = 'selection' | 'form' | 'verifying' | 'otp' | 'success';
type ResidencyType = 'resident' | 'visitor';

const EntryScreen: React.FC<EntryScreenProps> = ({ onSelect }) => {
  const [step, setStep] = useState<Step>('selection');
  const [loading, setLoading] = useState(false);
  const [residencyType, setResidencyType] = useState<ResidencyType>('resident');
  
  const [formData, setFormData] = useState({
      name: '',
      idNumber: '', // This will serve as ID or Passport Number
      phone: '',
      email: ''
  });
  const [otp, setOtp] = useState(['', '', '', '']);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Submit Form -> Go to Verifying -> Then OTP
  const handleSubmitForm = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      // Simulate verification API call
      setTimeout(() => {
          setLoading(false);
          setStep('otp');
      }, 1500);
  };

  // Step 2: Submit OTP -> Go to Verifying -> Then Success
  const handleVerifyOtp = () => {
      setLoading(true);
      // Simulate OTP verification
      setTimeout(() => {
          setLoading(false);
          setStep('success');
      }, 1500);
  };

  // Step 3: Success -> Redirect to App
  useEffect(() => {
      if (step === 'success') {
          const timer = setTimeout(() => {
              onSelect('subscriber', { ...formData, residencyType });
          }, 2000);
          return () => clearTimeout(timer);
      }
  }, [step, onSelect, formData, residencyType]);

  // Handle OTP Input
  const handleOtpChange = (index: number, value: string) => {
      if (value.length > 1) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto focus next
      if (value && index < 3) {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          nextInput?.focus();
      }
  };

  // --- Render Functions ---

  const renderSelection = () => (
    <div className="relative z-10 flex flex-col items-center w-full animate-fade-in-up">
        {/* Logo Area */}
        <div className="mb-12 scale-125">
            <LogoIcon />
        </div>

        <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-800 mb-2">أهلاً بك في أمان إيفر</h1>
            <p className="text-gray-500 text-sm font-medium">رعايتك الطبية بأمان وثقة</p>
        </div>

        {/* Selection Buttons */}
        <div className="w-full space-y-4">
            
            {/* Subscriber Button */}
            <button 
                onClick={() => setStep('form')}
                className="w-full bg-[#0C5A5D] text-white p-1 rounded-2xl shadow-lg shadow-[#0C5A5D]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 group"
            >
                <div className="bg-[#0C5A5D] border border-white/10 rounded-xl py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Icons.User size={24} className="text-white" />
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-lg">الدخول كمشترك</span>
                            <span className="block text-xs text-cyan-100 opacity-80">الوصول لملفك، بطاقتك، والموافقات</span>
                        </div>
                    </div>
                    <Icons.ChevronLeft className="text-white/50 group-hover:-translate-x-1 transition-transform" />
                </div>
            </button>

            {/* Visitor Button */}
            <button 
                onClick={() => onSelect('visitor')}
                className="w-full bg-white text-gray-800 p-1 rounded-2xl shadow-md border border-gray-100 hover:border-[#0C5A5D]/30 hover:shadow-lg transition-all duration-300 group"
            >
                 <div className="bg-white rounded-xl py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full group-hover:bg-[#0C5A5D]/10 transition-colors">
                            <Icons.Globe size={24} className="text-gray-600 group-hover:text-[#0C5A5D]" />
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-lg group-hover:text-[#0C5A5D] transition-colors">تصفح كزائر</span>
                            <span className="block text-xs text-gray-400">استكشف الخدمات، الباقات، والعروض</span>
                        </div>
                    </div>
                    <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D] group-hover:-translate-x-1 transition-transform" />
                </div>
            </button>

        </div>

        <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400">تطبيق أمان إيفر والرعاية الشاملة للخدمات الصحية</p>
            <p className="text-[10px] text-gray-300 font-mono mt-1">v2.1.0</p>
        </div>
    </div>
  );

  const renderForm = () => (
      <div className="w-full relative z-20 animate-fade-in-up bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
          <button 
            onClick={() => setStep('selection')}
            className="absolute top-4 left-4 text-gray-400 hover:text-[#0C5A5D] transition-colors bg-gray-50 p-2 rounded-full"
          >
              <Icons.ArrowLeft size={20} />
          </button>
          
          <div className="text-center mb-6 pt-2">
              <h2 className="text-2xl font-black text-[#0C5A5D]">بيانات المشترك</h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">أدخل بياناتك للوصول إلى بطاقتك وخدماتك</p>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
              
              {/* Name */}
              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-1 flex items-center gap-2">
                      <div className="p-1.5 bg-[#0C5A5D]/10 rounded-lg text-[#0C5A5D]">
                        <Icons.User size={14} />
                      </div>
                       الاسم الرباعي
                  </label>
                  <div className="relative">
                      <input 
                        required 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="الاسم كما هو في الهوية"
                        className="w-full bg-gray-50 border-2 border-[#0C5A5D]/20 text-gray-900 font-bold rounded-2xl px-4 py-4 focus:outline-none focus:border-[#0C5A5D] focus:bg-white focus:ring-4 focus:ring-[#0C5A5D]/10 transition-all text-sm placeholder-gray-400 shadow-sm"
                      />
                  </div>
              </div>

              {/* Residency Type Toggle */}
              <div className="bg-gray-100 p-1.5 rounded-2xl flex relative shadow-inner">
                  <button
                    type="button"
                    onClick={() => setResidencyType('resident')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
                        residencyType === 'resident' ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                     <Icons.Building2 size={16} /> مقيم / مواطن
                  </button>
                  <button
                    type="button"
                    onClick={() => setResidencyType('visitor')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
                        residencyType === 'visitor' ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                     <Icons.Globe size={16} /> زائر / عمرة
                  </button>

                  {/* Sliding Background */}
                  <div 
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#0C5A5D] rounded-xl transition-all duration-300 ease-in-out shadow-lg ${
                        residencyType === 'resident' ? 'right-1.5' : 'right-[calc(50%+3px)]'
                    }`}
                  ></div>
              </div>

              {/* Dynamic ID / Passport Input */}
              <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-bold text-gray-700 mr-1 flex items-center gap-2">
                      <div className="p-1.5 bg-[#0C5A5D]/10 rounded-lg text-[#0C5A5D]">
                        {residencyType === 'resident' ? <Icons.CreditCard size={14} /> : <Icons.Globe size={14} />}
                      </div>
                      {residencyType === 'resident' ? 'رقم الهوية / الإقامة' : 'رقم الجواز'}
                  </label>
                  <div className="relative">
                      <input 
                        required 
                        type={residencyType === 'resident' ? "number" : "text"}
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder={residencyType === 'resident' ? "أدخل رقم الهوية (10 أرقام)" : "أدخل رقم الجواز"}
                        className="w-full bg-gray-50 border-2 border-[#0C5A5D]/20 text-gray-900 font-bold rounded-2xl px-4 py-4 focus:outline-none focus:border-[#0C5A5D] focus:bg-white focus:ring-4 focus:ring-[#0C5A5D]/10 transition-all text-sm placeholder-gray-400 font-mono shadow-sm"
                      />
                  </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-1 flex items-center gap-2">
                       <div className="p-1.5 bg-[#0C5A5D]/10 rounded-lg text-[#0C5A5D]">
                          <Icons.Smartphone size={14} />
                       </div>
                       رقم الهاتف
                  </label>
                  <div className="relative">
                      <input 
                        required 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="05xxxxxxxx"
                        className="w-full bg-gray-50 border-2 border-[#0C5A5D]/20 text-gray-900 font-bold rounded-2xl px-4 py-4 focus:outline-none focus:border-[#0C5A5D] focus:bg-white focus:ring-4 focus:ring-[#0C5A5D]/10 transition-all text-sm font-mono text-left placeholder-gray-400 shadow-sm"
                        dir="ltr"
                      />
                  </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-1 flex items-center gap-2">
                      <div className="p-1.5 bg-[#0C5A5D]/10 rounded-lg text-[#0C5A5D]">
                          <Icons.Mail size={14} />
                      </div>
                       البريد الالكتروني <span className="text-[10px] font-normal bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">(اختياري)</span>
                  </label>
                  <div className="relative">
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        className="w-full bg-gray-50 border-2 border-[#0C5A5D]/20 text-gray-900 font-bold rounded-2xl px-4 py-4 focus:outline-none focus:border-[#0C5A5D] focus:bg-white focus:ring-4 focus:ring-[#0C5A5D]/10 transition-all text-sm placeholder-gray-400 shadow-sm"
                      />
                  </div>
              </div>

              <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0C5A5D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#0C5A5D]/20 mt-4 hover:bg-[#0a484b] active:scale-95 transition-all flex justify-center items-center gap-2 text-base ring-2 ring-offset-2 ring-transparent focus:ring-[#0C5A5D]"
              >
                  {loading ? (
                      <>
                        <Icons.Loader2 className="animate-spin" size={20} />
                        جاري التحقق...
                      </>
                  ) : (
                      <>
                        تسجيل الدخول <Icons.ChevronLeft size={18} />
                      </>
                  )}
              </button>
          </form>
      </div>
  );

  const renderOtp = () => (
    <div className="w-full relative z-20 animate-fade-in-up bg-white p-8 rounded-3xl shadow-xl text-center border-t-4 border-[#0C5A5D]">
         <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0C5A5D] ring-4 ring-cyan-50/50">
             <Icons.MessageSquare size={36} />
         </div>
         <h2 className="text-xl font-black text-[#0C5A5D] mb-2">التحقق من الرقم</h2>
         <p className="text-sm text-gray-500 mb-6 font-medium">
             أدخل الرمز المرسل إلى <br/>
             <span className="font-mono text-gray-800 font-bold text-lg dir-ltr inline-block mt-1">{formData.phone}</span>
         </p>

         <div className="flex justify-center gap-3 mb-6" dir="ltr">
             {otp.map((digit, idx) => (
                 <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="number"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-16 h-20 bg-gray-50 border-2 border-[#0C5A5D]/20 rounded-2xl text-center text-4xl font-bold text-[#0C5A5D] focus:border-[#0C5A5D] focus:bg-white focus:outline-none transition-all shadow-md focus:shadow-lg focus:scale-105"
                 />
             ))}
         </div>
         
         {/* Resend OTP Button */}
         <button 
             onClick={() => alert('تم إعادة إرسال الرمز')}
             className="text-sm text-[#0C5A5D] font-bold hover:text-[#09484b] hover:underline transition-colors mb-6 inline-block"
         >
             لم يصلك الرمز؟ إعادة إرسال
         </button>

         <button 
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-[#0C5A5D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#0C5A5D]/20 hover:bg-[#0a484b] active:scale-95 transition-all flex justify-center items-center gap-2 text-base"
        >
             {loading ? <Icons.Loader2 className="animate-spin" size={20} /> : 'تحقق ودخول'}
        </button>
        
        <button 
            onClick={() => setStep('form')}
            className="mt-6 text-xs text-gray-400 hover:text-[#0C5A5D] transition-colors font-bold flex items-center justify-center gap-1 mx-auto"
        >
            <Icons.ArrowLeft size={14} className="rotate-180" />
            تغيير رقم الهاتف
        </button>
    </div>
  );

  const renderSuccess = () => (
      <div className="w-full relative z-20 animate-scale-in bg-white p-10 rounded-3xl shadow-xl text-center border-t-4 border-green-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-50/50 animate-bounce-slow">
              <Icons.CheckCircle size={56} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">تم التحقق بنجاح!</h2>
          <p className="text-gray-500 text-sm font-medium">جاري تحويلك إلى ملفك الشخصي...</p>
          <div className="mt-8 flex justify-center">
              <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#0C5A5D] rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-[#0C5A5D] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#0C5A5D] rounded-full animate-bounce delay-200"></div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden max-w-md mx-auto shadow-2xl">
      
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#0C5A5D]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      {step === 'selection' && renderSelection()}
      {step === 'form' && renderForm()}
      {step === 'otp' && renderOtp()}
      {step === 'success' && renderSuccess()}

    </div>
  );
};

export default EntryScreen;