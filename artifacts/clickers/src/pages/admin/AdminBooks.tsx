import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Star } from 'lucide-react';
import { AdminLayout, AdminPageHeader } from '@/components/admin/AdminLayout';
import { useBooks, useDeleteBook, useUpsertBook, useAuthors, useUpsertAuthor, useWorlds } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';
import { ImageUpload } from '@/components/ImageUpload';
import { UploadResult } from '@/services/upload';

const GENRES = ['Fantasy', 'Sci-Fi', 'Historical', 'Horror', 'Romance', 'Adventure', 'Literary', 'Mystery', 'General'];
const GENRES_AR = ['الخيال', 'الخيال العلمي', 'التاريخي', 'الرعب', 'الرومانسية', 'المغامرة', 'الأدبي', 'الغموض', 'عام'];

function BookFormModal({ book, onClose }: { book?: Record<string, unknown> | null; onClose: () => void }) {
  const { data: authors } = useAuthors();
  const { data: worlds } = useWorlds();
  const upsert = useUpsertBook();
  const upsertAuthor = useUpsertAuthor();
  const { isRTL } = useLanguage();
  const [form, setForm] = useState<Record<string, unknown>>({
    title_ar: '', title_en: '', author_id: '', world_id: '', cover_url: '',
    image_public_id: '', image_storage_type: 'local',
    description_ar: '', description_en: '', price: 0, original_price: '',
    genre: 'Fantasy', genre_ar: 'الخيال', format: 'both', language: 'ar',
    pages: 0, published_date: '', is_featured: false, is_new: false,
    status: 'published', tags: [], trailer_url: '',
    ...(book ?? {}),
    author_name_input: book ? (book as any).authors?.name_en || (book as any).authors?.[0]?.name_en || '' : '',
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form } as Record<string, unknown>;
    
    // Auto-resolve or Auto-create Author if user typed
    if (payload.author_name_input) {
      const existing = authors?.find(a => a.name_en === payload.author_name_input || a.name_ar === payload.author_name_input);
      if (existing) {
        payload.author_id = existing.id;
      } else {
        const newAuthor = await upsertAuthor.mutateAsync({
          name_en: payload.author_name_input,
          name_ar: payload.author_name_input,
        }) as any;
        payload.author_id = newAuthor.id;
      }
    }
    // Cleanup non-schema fields and relation objects
    delete payload.author_name_input;
    delete payload.authors;
    delete payload.worlds;
    delete payload.image_public_id;
    delete payload.image_storage_type;
    delete payload.trailer_url; // Not in PostgreSQL table schema

    if (!payload.author_id) delete payload.author_id;
    if (!payload.world_id) delete payload.world_id;
    if (!payload.original_price) delete payload.original_price;
    if (!payload.published_date) delete payload.published_date;
    if (!payload.cover_url) delete payload.cover_url;

    if (payload.pages === '' || payload.pages === null || payload.pages === undefined) {
      delete payload.pages;
    } else {
      payload.pages = Number(payload.pages);
    }
    
    await upsert.mutateAsync(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-arabic" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        className="bg-slate-900 border border-slate-700/60 shadow-2xl rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-slate-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">
              {book ? 'تعديل بيانات الكتاب' : 'إضافة كتاب جديد'}
            </h2>
            <p className="text-slate-400 font-medium text-xs">بيانات النشر، الأسعار، والغلاف</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-lg">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'عنوان الكتاب (باللغة العربية) *', key: 'title_ar', required: true, placeholder: 'مثال: في ممر الفئران' },
            { label: 'عنوان الكتاب (باللغة الإنجليزية) *', key: 'title_en', required: true, placeholder: 'e.g. In the Corridor' },
            { label: 'سعر البيع (ج.م) *', key: 'price', type: 'number', required: true },
            { label: 'السعر الأصلي قبل الخصم (ج.م)', key: 'original_price', type: 'number' },
            { label: 'عدد الصفحات', key: 'pages', type: 'number' },
            { label: 'تاريخ النشر', key: 'published_date', type: 'date' },
          ].map(({ label, key, required, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">{label}</label>
              <input
                type={type || 'text'}
                value={(form[key] as string) || ''}
                onChange={(e) => set(key, e.target.value)}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">رابط الإعلان الترويجي (YouTube)</label>
            <input
              type="text"
              value={(form.trailer_url as string) || ''}
              onChange={(e) => set('trailer_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              dir="ltr"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">صورة غلاف الكتاب</label>
            <ImageUpload
              folder="stories"
              currentImageUrl={form.cover_url as string}
              aspectRatio="portrait"
              onUploadComplete={(result: UploadResult) => {
                set('cover_url', result.imageUrl);
                set('image_public_id', result.publicId);
                set('image_storage_type', result.storageType);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">المؤلف</label>
            <input
              type="text"
              list="authors-list"
              value={(form.author_name_input as string) || ''}
              onChange={(e) => set('author_name_input', e.target.value)}
              placeholder="اختر مؤلفاً أو اكتب اسماً جديداً"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
            />
            <datalist id="authors-list">
              {authors?.map((a) => <option key={a.id} value={a.name_ar || a.name_en} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">العالم الأدبي / السلسلة</label>
            <select value={(form.world_id as string) || ''} onChange={(e) => set('world_id', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium">
              <option value="" className="bg-slate-900 text-white">بدون عالم (كتاب مستقل)</option>
              {worlds?.map((w) => <option key={w.id} value={w.id} className="bg-slate-900 text-white">{w.name_ar || w.name_en}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">التصنيف الأدبي</label>
            <select value={(form.genre as string)} onChange={(e) => {
              const idx = GENRES.indexOf(e.target.value);
              set('genre', e.target.value);
              set('genre_ar', GENRES_AR[idx]);
            }} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium">
              {GENRES.map((g, idx) => <option key={g} value={g} className="bg-slate-900 text-white">{GENRES_AR[idx]} ({g})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">حالة النشر في المتجر</label>
            <div className="flex gap-2">
              {[
                { key: 'published', label: 'منشور ومتاح' },
                { key: 'draft', label: 'مسودة مؤقتة' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('status', key)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all text-sm ${
                    form.status === key 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 font-black' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">شكل وتنسيق الإصدار</label>
            <select value={(form.format as string)} onChange={(e) => set('format', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium">
              <option value="both" className="bg-slate-900 text-white">متوفر ورقياً ورقمياً (كلاهما)</option>
              <option value="digital" className="bg-slate-900 text-white">نسخة رقمية فقط (eBook/PDF)</option>
              <option value="physical" className="bg-slate-900 text-white">كتاب ورقي مطبوع فقط</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">نبذة ووصف الكتاب (بالعربية)</label>
            <textarea value={(form.description_ar as string) || ''} onChange={(e) => set('description_ar', e.target.value)} rows={3} dir="rtl" placeholder="اكتب نبذة شيقة عن الكتاب..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium font-arabic resize-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">الوصف بالإنجليزية</label>
            <textarea value={(form.description_en as string) || ''} onChange={(e) => set('description_en', e.target.value)} rows={3} dir="ltr" placeholder="Book description in English..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium resize-none" />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-8">
            {[
              { key: 'is_featured', label: 'كتاب مميز (يظهر في القسم الرئيسي)' },
              { key: 'is_new', label: 'تمييز كإصدار حديث (شارة جديد)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => set(key, !form[key])}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form[key] ? 'bg-amber-500' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${form[key] ? 'right-6' : 'right-0.5'}`} />
                </div>
                <span className="text-slate-200 font-bold text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="md:col-span-2 flex gap-4 justify-end pt-6 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all text-sm">
              إلغاء
            </button>
            <button type="submit" disabled={upsert.isPending} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50">
              {upsert.isPending ? 'جاري الحفظ...' : (book ? 'حفظ التعديلات' : 'إضافة الكتاب')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function AdminBooks() {
  const [search, setSearch] = useState('');
  const [editingBook, setEditingBook] = useState<Record<string, unknown> | null | undefined>(undefined);
  const { data: books, isLoading } = useBooks({ status: undefined });
  const deleteBook = useDeleteBook();
  const { isRTL } = useLanguage();

  const filtered = books?.filter((b) =>
    b.title_ar.includes(search) || b.title_en.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminLayout>
      <AdminPageHeader
        title={isRTL ? "إدارة الكتب والإصدارات" : "Books Management"}
        subtitle={isRTL ? `${books?.length ?? 0} كتاب مسجل بالمنصة` : `${books?.length ?? 0} total books`}
        action={
          <button
            onClick={() => setEditingBook(null)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all text-sm shadow-xl shadow-primary/20 font-arabic"
          >
            <Plus size={18} />
            <span>إضافة كتاب جديد</span>
          </button>
        }
      />

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن كتاب بالاسم..."
          className="w-full pr-12 pl-4 py-3 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-2xl font-bold text-primary placeholder:text-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-arabic text-right"
        />
      </div>

      {/* Table */}
      <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl border border-border shadow-sm overflow-hidden font-arabic">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              {['الغلاف', 'عنوان الكتاب', 'المؤلف', 'التصنيف', 'السعر', 'الحالة', 'إجراءات'].map((h) => (
                <th key={h} className="px-6 py-4 text-xs font-black uppercase tracking-wider text-primary/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-primary/5 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.map((book) => (
              <motion.tr
                key={book.id}
                className="border-b border-border hover:bg-primary/2 transition-colors group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="px-6 py-4">
                  <img src={book.cover_url || ''} alt="" className="w-10 h-14 object-cover rounded-xl shadow-sm" />
                </td>
                <td className="px-6 py-4 max-w-[200px]">
                  <p className="font-bold text-primary text-sm truncate">{book.title_ar}</p>
                  <p className="text-primary/40 text-xs truncate font-mono">{book.title_en}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {book.is_featured && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                        <Star size={10} className="fill-amber-400" /> مميز
                      </span>
                    )}
                    {book.is_new && (
                      <span className="text-[11px] font-black bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md">
                        جديد
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-primary/70 font-bold text-sm">
                    {book.authors?.name_ar || book.authors?.name_en || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary/5 text-primary font-bold text-xs rounded-lg">
                    {book.genre_ar || book.genre}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-black text-primary">{book.price}</span>
                  <span className="text-primary/40 text-xs mr-1">ج.م</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black ${book.status === 'published' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                    {book.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingBook(book as Record<string, unknown>)}
                      title="تعديل"
                      className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من حذف هذا الكتاب نهائياً من قاعدة البيانات؟')) {
                          deleteBook.mutate(book.id as string);
                        }
                      }}
                      title="حذف"
                      className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-primary/30 font-bold font-arabic">
            لا توجد كتب مطابقة لخيارات البحث
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {editingBook !== undefined && (
          <BookFormModal book={editingBook} onClose={() => setEditingBook(undefined)} />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
