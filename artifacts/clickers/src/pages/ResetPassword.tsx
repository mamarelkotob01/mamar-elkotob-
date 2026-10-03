import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { updatePassword } = useAuth();
  const { isRTL } = useLanguage();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(password);
    
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 3000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-32">
      <div className="fixed -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-border p-10">
          <h2 className={`text-2xl font-black text-primary mb-8 ${isRTL ? 'text-right font-arabic' : 'font-cinematic uppercase tracking-wider'}`}>
            {isRTL ? 'تعيين كلمة مرور جديدة' : 'Reset Your Password'}
          </h2>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className={`text-lg font-bold text-primary ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully!'}
              </p>
              <p className="text-sm text-primary/60">
                {isRTL ? 'سيتم توجيهك إلى صفحة الدخول...' : 'Redirecting you to login...'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-primary/40 mb-2">
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-5 py-4 bg-transparent border border-border rounded-2xl font-bold text-primary placeholder:text-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-primary/30 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-primary/40 mb-2">
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-5 py-4 bg-transparent border border-border rounded-2xl font-bold text-primary placeholder:text-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>

              {error && (
                <p className={`text-red-500 text-sm font-bold bg-red-50 px-4 py-3 rounded-xl border border-red-100 ${isRTL ? 'text-right font-arabic' : ''}`}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-accent hover:text-primary transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-sm uppercase tracking-wider"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRTL ? 'حفظ كلمة المرور' : 'Save New Password'}</span>
                    <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

