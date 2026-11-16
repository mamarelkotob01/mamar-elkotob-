import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, CheckCircle2, ShieldCheck, Save, Sparkles, AlertCircle } from 'lucide-react';
import { AdminLayout, AdminPageHeader } from '@/components/admin/AdminLayout';
import { useShippingSettings, useUpdateShippingSettings, type ShippingSettings } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';

export function AdminShipping() {
  const { isRTL } = useLanguage();
  const { data: settings, isLoading } = useShippingSettings();
  const updateMutation = useUpdateShippingSettings();

  const [form, setForm] = useState<ShippingSettings>({
    shipping_title_ar: '',
    shipping_content_ar: '',
    estimated_days: '',
    shipping_cost: '',
    free_shipping_threshold: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(isRTL ? 'حدث خطأ أثناء حفظ الإعدادات' : 'Failed to save settings');
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title={isRTL ? "معلومات الشحن والتوصيل" : "Shipping & Delivery Settings"}
        subtitle={isRTL ? "تعديل معلومات الشحن الثابتة التي تظهر في جميع صفحات الكتب" : "Manage fixed shipping & delivery details shown on all book pages"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-arabic">
        {/* Form */}
        <div className="lg:col-span-7 bg-card/70 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-primary/40 mb-2">
                عنوان قسم الشحن (مثال: الشحن والتوصيل السريع)
              </label>
              <input
                type="text"
                required
                value={form.shipping_title_ar}
                onChange={(e) => setForm(p => ({ ...p, shipping_title_ar: e.target.value }))}
                placeholder="الشحن والتوصيل السريع"
                className="w-full px-5 py-4 border border-border rounded-2xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/50 text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-primary/40 mb-2">
                تفاصيل الشحن والتوصيل (النص الرئيسي)
              </label>
              <textarea
                required
                rows={4}
                value={form.shipping_content_ar}
                onChange={(e) => setForm(p => ({ ...p, shipping_content_ar: e.target.value }))}
                placeholder="اكتب تفاصيل الشحن والمحافظات وشركات الشحن المتعاقد معها..."
                className="w-full px-5 py-4 border border-border rounded-2xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/50 resize-none text-right"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-primary/40 mb-2">
                  مدة التوصيل التقديرية
                </label>
                <input
                  type="text"
                  value={form.estimated_days}
                  onChange={(e) => setForm(p => ({ ...p, estimated_days: e.target.value }))}
                  placeholder="2-4 أيام عمل"
                  className="w-full px-4 py-3 border border-border rounded-xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/50 text-right text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-primary/40 mb-2">
                  تكلفة الشحن
                </label>
                <input
                  type="text"
                  value={form.shipping_cost}
                  onChange={(e) => setForm(p => ({ ...p, shipping_cost: e.target.value }))}
                  placeholder="يتم احتسابه عند الطلب"
                  className="w-full px-4 py-3 border border-border rounded-xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/50 text-right text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-primary/40 mb-2">
                  ميزة الشحن المجاني
                </label>
                <input
                  type="text"
                  value={form.free_shipping_threshold}
                  onChange={(e) => setForm(p => ({ ...p, free_shipping_threshold: e.target.value }))}
                  placeholder="مجاني للطلبات فوق 500 ج.م"
                  className="w-full px-4 py-3 border border-border rounded-xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/50 text-right text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <motion.button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                whileTap={{ scale: 0.97 }}
              >
                <Save size={18} />
                <span>{updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
              </motion.button>

              {savedSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200"
                >
                  <CheckCircle2 size={16} />
                  <span>تم حفظ وتحديث بيانات الشحن بنجاح!</span>
                </motion.div>
              )}
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-sm mb-2">
            <Sparkles size={16} className="text-amber-500" />
            <span>معاينة حية (كما تظهر لزوار صفحات الكتب):</span>
          </div>

          <div className="bg-card/90 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 flex-row-reverse text-right">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="font-black text-primary text-base">
                  {form.shipping_title_ar || 'الشحن والتوصيل السريع'}
                </h3>
                <p className="text-xs text-primary/40 font-bold">معلومات الشحن المعتمدة للدار</p>
              </div>
            </div>

            <p className="text-primary/70 text-sm leading-relaxed mb-6 text-right">
              {form.shipping_content_ar || 'تفاصيل الشحن والتوصيل ستظهر هنا...'}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-center">
              <div className="p-3 rounded-xl bg-primary/5">
                <Clock size={16} className="mx-auto text-primary/40 mb-1" />
                <p className="text-[10px] text-primary/40 font-black">المدة</p>
                <p className="text-xs font-black text-primary truncate">{form.estimated_days || '2-4 أيام'}</p>
              </div>

              <div className="p-3 rounded-xl bg-primary/5">
                <Truck size={16} className="mx-auto text-primary/40 mb-1" />
                <p className="text-[10px] text-primary/40 font-black">التكلفة</p>
                <p className="text-xs font-black text-primary truncate">{form.shipping_cost || 'عند الطلب'}</p>
              </div>

              <div className="p-3 rounded-xl bg-primary/5">
                <ShieldCheck size={16} className="mx-auto text-emerald-600 mb-1" />
                <p className="text-[10px] text-primary/40 font-black">المجاني</p>
                <p className="text-xs font-black text-primary truncate">{form.free_shipping_threshold || 'فوق 500 ج.م'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

