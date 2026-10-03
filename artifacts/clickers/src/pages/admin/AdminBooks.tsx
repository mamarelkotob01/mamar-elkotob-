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
  const [isUploading, setIsUploading] = useState(false);

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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-slate-900 border border-slate-700/60 shadow-2xl rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-slate-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-lg">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {( [
            { label: 'Arabic Title', key: 'title_ar', required: true },
            { label: 'English Title', key: 'title_en', required: true },
            { label: 'Price (EGP)', key: 'price', type: 'number' },
            { label: 'Original Price', key: 'original_price', type: 'number' },
            { label: 'Pages', key: 'pages', type: 'number' },
            { label: 'Published Date', key: 'published_date', type: 'date' },
          ] ).map(({ label, key, required, type }) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">{label}</label>
              <input
                type={type || 'text'}
                value={(form[key] as string) || ''}
                onChange={(e) => set(key, e.target.value)}
                required={required}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">YouTube Trailer URL</label>
            <input
              type="text"
              value={(form.trailer_url as string) || ''}
              onChange={(e) => set('trailer_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Cover Image</label>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Author</label>
            <input
              type="text"
              list="authors-list"
              value={(form.author_name_input as string) || ''}
              onChange={(e) => set('author_name_input', e.target.value)}
              placeholder="Type new or select existing"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium"
            />
            <datalist id="authors-list">
              {authors?.map((a) => <option key={a.id} value={a.name_en} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">World / Series</label>
            <select value={(form.world_id as string) || ''} onChange={(e) => set('world_id', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium">
              <option value="" className="bg-slate-900 text-white">None</option>
              {worlds?.map((w) => <option key={w.id} value={w.id} className="bg-slate-900 text-white">{w.name_en}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Genre</label>
            <select value={(form.genre as string)} onChange={(e) => {
              const idx = GENRES.indexOf(e.target.value);
              set('genre', e.target.value);
              set('genre_ar', GENRES_AR[idx]);
            }} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium">
              {GENRES.map(g => <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Publishing Status</label>
            <div className="flex gap-2">
              {['published', 'draft'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all text-sm ${
                    form.status === s 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {s === 'published' ? 'Live' : 'Draft'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Format</label>
            <select value={(form.format as string)} onChange={(e) => set('format', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium">
              {['digital', 'physical', 'both'].map((f) => <option key={f} value={f} className="bg-slate-900 text-white">{f}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Arabic Description</label>
            <textarea value={(form.description_ar as string) || ''} onChange={(e) => set('description_ar', e.target.value)} rows={3} dir="rtl" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium font-arabic resize-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">English Description</label>
            <textarea value={(form.description_en as string) || ''} onChange={(e) => set('description_en', e.target.value)} rows={3} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium resize-none" />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-6">
            {[
              { key: 'is_featured', label: 'Featured' },
              { key: 'is_new', label: 'Mark as New' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => set(key, !form[key])}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form[key] ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${form[key] ? 'left-6' : 'left-0.5'}`} />
                </div>
                <span className="text-slate-200 font-bold text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="md:col-span-2 flex gap-4 justify-end pt-6 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all text-sm">
              Cancel
            </button>
            <button type="submit" disabled={upsert.isPending} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50">
              {upsert.isPending ? 'Saving...' : (book ? 'Save Changes' : 'Add Book')}
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

  const filtered = books?.filter((b) =>
    b.title_ar.includes(search) || b.title_en.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Books Management"
        subtitle={`${books?.length ?? 0} total books`}
        action={
          <button
            onClick={() => setEditingBook(null)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all text-sm uppercase tracking-wider shadow-xl shadow-primary/20"
          >
            <Plus size={18} />
            Add Book
          </button>
        }
      />

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="w-full pl-12 pr-4 py-3 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-2xl font-bold text-primary placeholder:text-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Cover', 'Title', 'Author', 'Genre', 'Price', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-primary/40">{h}</th>
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
                  <p className="font-bold text-primary text-sm truncate" dir="rtl">{book.title_ar}</p>
                  <p className="text-primary/40 text-xs truncate">{book.title_en}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {book.is_featured && <Star size={10} className="fill-accent text-accent" />}
                    {book.is_new && <span className="text-\[11px\] font-black bg-green-100 text-green-600 px-1.5 rounded">NEW</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-primary/60 font-bold text-sm">—</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary/5 text-primary font-bold text-xs rounded-lg">{book.genre}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-black text-primary">{book.price}</span>
                  <span className="text-primary/30 text-xs ml-1">EGP</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black ${book.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingBook(book as Record<string, unknown>)}
                      className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this book?')) deleteBook.mutate(book.id as string);
                      }}
                      className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-primary/30 font-bold">No books found</div>
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
