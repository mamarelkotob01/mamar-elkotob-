import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, Globe,  Book,
  Check, X, Palette, Image as ImageIcon, Star,
  Library, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  AdminLayout, 
  AdminPageHeader 
} from '@/components/admin/AdminLayout';
import { 
  useWorlds, 
  useUpsertWorld, 
  useDeleteWorld,
  useUploadFile,
  useBooks,
  useAssignBooksToWorld
} from '@/services/supabase.hooks';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

export function AdminWorlds() {
  const { isRTL, language } = useLanguage();
  const { data: worlds, isLoading } = useWorlds();
  const { data: allBooks } = useBooks();
  const upsertWorld = useUpsertWorld();
  const deleteWorld = useDeleteWorld();
  const assignBooks = useAssignBooksToWorld();
  const { upload, isUploading } = useUploadFile();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorld, setEditingWorld] = useState<any>(null);
  const [showBookSelector, setShowBookSelector] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    banner_url: '',
    color_primary: '#8B1D3D',
    is_featured: false,
  });

  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);

  const handleOpenModal = (world: any = null) => {
    if (world) {
      setEditingWorld(world);
      setFormData({
        name_ar: world.name_ar,
        name_en: world.name_en,
        description_ar: world.description_ar || '',
        description_en: world.description_en || '',
        banner_url: world.banner_url || '',
        color_primary: world.color_primary || '#8B1D3D',
        is_featured: world.is_featured || false,
      });
      // Find books currently assigned to this world
      const currentBooks = allBooks?.filter(b => b.world_id === world.id).map(b => b.id) || [];
      setSelectedBookIds(currentBooks);
    } else {
      setEditingWorld(null);
      setFormData({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        banner_url: '',
        color_primary: '#8B1D3D',
        is_featured: false,
      });
      setSelectedBookIds([]);
    }
    setShowBookSelector(false);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file);
      setFormData({ ...formData, banner_url: url });
      toast({ title: 'Image uploaded successfully' });
    } catch (err) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

  const toggleBook = (id: string) => {
    setSelectedBookIds(prev => 
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Upsert the world
      const worldResult: any = await upsertWorld.mutateAsync({
        ...(editingWorld?.id ? { id: editingWorld.id } : {}),
        ...formData,
      });

      // 2. Assign books to this world
      if (worldResult?.id) {
        await assignBooks.mutateAsync({
          worldId: worldResult.id,
          bookIds: selectedBookIds,
        });
      }

      toast({ title: editingWorld ? 'World updated' : 'World created' });
      setIsModalOpen(false);
    } catch (err) {
      toast({ title: 'Error saving world', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this world?')) {
      try {
        await deleteWorld.mutateAsync(id);
        toast({ title: 'World deleted' });
      } catch (err) {
        toast({ title: 'Error deleting world', variant: 'destructive' });
      }
    }
  };

  const filteredWorlds = worlds?.filter(w => 
    w.name_ar.includes(searchQuery) || w.name_en.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <AdminPageHeader 
        title={isRTL ? 'إدارة العوالم' : 'Manage Worlds'}
        subtitle={isRTL ? 'تحرير وإنشاء عوالم للكتب والمؤلفين' : 'Create and edit reading worlds'}
        action={
          <Button onClick={() => handleOpenModal()} className="rounded-2xl gap-2 font-bold px-6 py-6 h-auto">
            <Plus size={18} />
            <span>{isRTL ? 'إضافة عالم جديد' : 'Add New World'}</span>
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-1 max-w-md gap-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
          <input 
            type="text"
            placeholder={isRTL ? 'ابحث عن عالم...' : 'Search worlds...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary"
          />
        </div>
      </div>

      {/* Worlds Grid/List */}
      <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              <th className="px-8 py-5 text-xs font-black uppercase tracking-wider text-primary/40 truncate">Visual</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-wider text-primary/40">Name</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-wider text-primary/40">Featured</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-wider text-primary/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={4} className="p-20 text-center text-primary/40 font-bold">Loading worlds...</td></tr>
            ) : filteredWorlds.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-primary/40 font-bold">No worlds found.</td></tr>
            ) : filteredWorlds.map((world: any) => (
              <motion.tr key={world.id} layout className="group hover:bg-primary/5 transition-colors">
                <td className="px-8 py-6">
                  <div className="w-16 h-10 rounded-xl bg-border overflow-hidden relative shadow-sm">
                    {world.banner_url ? (
                      <img src={world.banner_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20" style={{ backgroundColor: world.color_primary }}>
                        <Globe size={14} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-primary">{world.name_en}</p>
                  <p className="text-primary/40 font-arabic text-sm">{world.name_ar}</p>
                </td>
                <td className="px-8 py-6">
                  {world.is_featured ? (
                    <span className="flex items-center gap-1.5 text-accent font-black text-xs uppercase tracking-wider">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  ) : (
                    <span className="text-primary/20 font-black text-xs uppercase tracking-wider">Standard</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleOpenModal(world)}
                      className="w-10 h-10 rounded-xl border-primary/10 hover:bg-primary hover:text-white transition-all"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(world.id)}
                      className="w-10 h-10 rounded-xl border-red-100 text-red-400 hover:bg-red-400 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm" 
            />
            <motion.div
              layoutId="modal"
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/60 shadow-2xl rounded-2xl overflow-hidden text-slate-100"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
                <div>
                  <h3 className="text-xl font-black text-slate-100 tracking-tight">
                    {editingWorld ? 'Edit World' : 'Add New World'}
                  </h3>
                  <p className="text-slate-400 font-medium text-xs">Universe Definition & Book Binding</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-lg">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {formData.banner_url && (
                  <div className="w-full h-40 rounded-xl overflow-hidden relative group border border-slate-800">
                    <img src={formData.banner_url} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-xs uppercase tracking-wider">Banner Preview</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">World Name (EN)</label>
                    <input 
                      required
                      value={formData.name_en}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                      placeholder="e.g. Chronicles of Al-Andalus"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block text-right">عنوان العالم (AR)</label>
                    <input 
                      required
                      value={formData.name_ar}
                      onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-white placeholder-slate-500 font-arabic text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                      placeholder="مثال: وقائع الأندلس"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block flex items-center justify-between">
                       <span className="flex items-center gap-2"><ImageIcon size={12} /> Narrative Banner</span>
                       {isUploading && <Loader2 size={12} className="animate-spin text-indigo-400" />}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        value={formData.banner_url}
                        onChange={(e) => setFormData({...formData, banner_url: e.target.value})}
                        className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-xs"
                        placeholder="https://..."
                      />
                      <input 
                        type="file" 
                        id="world-banner" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button 
                        type="button" 
                        disabled={isUploading}
                        onClick={() => document.getElementById('world-banner')?.click()}
                        className="h-auto px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block flex items-center gap-2">
                      <Palette size={12} /> Theme Color
                    </label>
                    <div className="flex gap-3 items-center">
                      <input 
                        type="color"
                        value={formData.color_primary}
                        onChange={(e) => setFormData({...formData, color_primary: e.target.value})}
                        className="w-11 h-11 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1"
                      />
                      <input 
                        value={formData.color_primary}
                        onChange={(e) => setFormData({...formData, color_primary: e.target.value})}
                        className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">Description (EN)</label>
                  <textarea 
                    rows={3}
                    value={formData.description_en}
                    onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block text-right">الوصف (AR)</label>
                  <textarea 
                    rows={3}
                    value={formData.description_ar}
                    onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-white font-arabic text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm"
                  />
                </div>

                {/* Book Binding Section */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowBookSelector(!showBookSelector)}
                    className="w-full p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group bg-slate-950"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                        <Library size={18} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-200 text-xs uppercase tracking-wider">Bind Books</p>
                        <p className="text-slate-400 text-xs">
                          {selectedBookIds.length} titles connected
                        </p>
                      </div>
                    </div>
                    {showBookSelector ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </button>

                  <AnimatePresence>
                    {showBookSelector && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 max-h-60 overflow-y-auto custom-scrollbar">
                            {allBooks?.map((book: any) => (
                              <label 
                                key={book.id} 
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                  selectedBookIds.includes(book.id) 
                                  ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <input 
                                  type="checkbox" 
                                  className="hidden"
                                  checked={selectedBookIds.includes(book.id)}
                                  onChange={() => toggleBook(book.id)}
                                />
                                <div className="w-8 h-11 bg-slate-950 rounded border border-slate-800 overflow-hidden flex-shrink-0">
                                  {book.cover_url && <img src={book.cover_url} className="w-full h-full object-cover" alt="" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-xs truncate text-white">
                                    {language === 'ar' ? book.title_ar : book.title_en}
                                  </p>
                                  <p className="text-[11px] truncate text-slate-400">
                                    {language === 'ar' ? book.authors?.name_ar : book.authors?.name_en}
                                  </p>
                                </div>
                                {selectedBookIds.includes(book.id) && <Check size={16} className="text-indigo-400" />}
                              </label>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    formData.is_featured 
                    ? 'bg-indigo-600/15 border-indigo-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      formData.is_featured ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <Star size={18} fill={formData.is_featured ? 'currentColor' : 'none'} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-200 text-xs uppercase tracking-wider">Featured World</p>
                      <p className="text-slate-400 text-xs">Display on home page hero carousel</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    formData.is_featured ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-transparent'
                  }`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                </button>

                <div className="flex gap-4 pt-6 border-t border-slate-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all text-sm">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={upsertWorld.isPending || assignBooks.isPending}
                    className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                  >
                    {upsertWorld.isPending || assignBooks.isPending ? 'Saving...' : editingWorld ? 'Save Changes' : 'Add World'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
