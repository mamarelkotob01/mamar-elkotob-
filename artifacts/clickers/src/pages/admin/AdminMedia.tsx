import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Video, Music, Play, Link, Clock, Type } from 'lucide-react';
import { AdminLayout, AdminPageHeader } from '@/components/admin/AdminLayout';
import { useMedia } from '@/services/supabase.hooks';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export function AdminMedia() {
  const { data: media, isLoading } = useMedia('all');
  const [isAdding, setIsAdding] = useState(false);
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    type: 'trailer' as 'video' | 'music' | 'trailer',
    url: '',
    duration: '',
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('media').insert(form as any);
    if (error) {
      alert('حدث خطأ أثناء إضافة الوسائط');
    } else {
      setIsAdding(false);
      setForm({ title_ar: '', title_en: '', description_ar: '', description_en: '', type: 'trailer', url: '', duration: '' });
      qc.invalidateQueries({ queryKey: ['media'] });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) alert('حدث خطأ أثناء الحذف');
    else qc.invalidateQueries({ queryKey: ['media'] });
  };

  const typeLabel = (type: string) => {
    if (type === 'trailer') return 'إعلان ترويجي';
    if (type === 'video') return 'مقطع فيديو';
    if (type === 'music') return 'موسيقى';
    return type;
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="إدارة الوسائط والإعلانات"
        subtitle="أضف وأدر الإعلانات الترويجية والمقاطع الموسيقية ومقاطع الفيديو"
      />

      <div className="mb-8" dir="rtl">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20 font-arabic"
        >
          <Plus size={18} />
          {isAdding ? 'إلغاء' : 'إضافة وسائط جديدة'}
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-8 mb-10 shadow-sm font-arabic"
          dir="rtl"
        >
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} className="text-accent" /> العنوان بالعربية
                </label>
                <input
                  required
                  value={form.title_ar}
                  onChange={e => setForm({ ...form, title_ar: e.target.value })}
                  dir="rtl"
                  className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-primary/20 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="عنوان الإعلان..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} className="text-accent" /> العنوان بالإنجليزية
                </label>
                <input
                  required
                  value={form.title_en}
                  onChange={e => setForm({ ...form, title_en: e.target.value })}
                  dir="ltr"
                  className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-primary/20 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Media title..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
                  <Video size={14} className="text-accent" /> نوع الوسائط
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as any })}
                  className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 text-primary font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="trailer">إعلان ترويجي (Trailer)</option>
                  <option value="video">مقطع فيديو (Video)</option>
                  <option value="music">موسيقى (Music)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
                  <Link size={14} className="text-accent" /> رابط يوتيوب
                </label>
                <input
                  required
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  dir="ltr"
                  className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-primary/20 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} className="text-accent" /> المدة الزمنية
                </label>
                <input
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  dir="ltr"
                  className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 text-primary font-bold placeholder:text-primary/20 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="مثال: 2:45"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all font-arabic"
            >
              نشر الوسائط الآن
            </button>
          </form>
        </motion.div>
      )}

      {/* قائمة الوسائط */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl h-64 animate-pulse border border-border" />
          ))
        ) : (media ?? []).map((m) => (
          <motion.div
            key={m.id}
            layout
            className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-6 flex flex-col justify-between group hover:shadow-xl hover:shadow-primary/5 transition-all font-arabic"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`
                  px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 
                  ${m.type === 'trailer' ? 'bg-accent/10 text-accent' : m.type === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}
                `}>
                  {m.type === 'trailer' ? <Play size={10} fill="currentColor" /> : m.type === 'video' ? <Video size={10} /> : <Music size={10} />}
                  {typeLabel(m.type)}
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-primary/20 hover:text-red-500 transition-colors"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-primary font-black text-lg line-clamp-1 mb-1" dir="rtl">{m.title_ar}</h3>
              <p className="text-primary/30 text-xs font-bold line-clamp-2" dir="rtl">{m.description_ar || 'لا يوجد وصف'}</p>
            </div>

            <div className="mt-6 flex items-center justify-between font-black text-xs uppercase tracking-wider text-primary/40">
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {m.duration || '—'}
              </span>
              <a href={m.url} target="_blank" className="hover:text-primary transition-colors">فتح الرابط</a>
            </div>
          </motion.div>
        ))}
        {!isLoading && (media ?? []).length === 0 && (
          <div className="col-span-full py-20 text-center text-primary/20 font-black font-arabic" dir="rtl">
            لا توجد وسائط حتى الآن. ابدأ بإضافة أول إعلان ترويجي.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
