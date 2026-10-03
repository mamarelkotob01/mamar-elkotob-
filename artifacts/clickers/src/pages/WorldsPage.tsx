import { motion } from 'framer-motion';
import { WorldCard } from '@/components/WorldCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';
import { useWorlds } from '@/services/supabase.hooks';

export function WorldsPage() {
  const { t } = useLanguage();
  const { data: worlds, isLoading } = useWorlds();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.worlds.title}
          subtitle={t.worlds.subtitle}
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : worlds && worlds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worlds.map((world, i) => (
              <WorldCard key={world.id} world={world} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-primary/5 rounded-[3rem] border border-dashed border-primary/10">
            <p className="text-primary/40 font-bold">No worlds found in the archive yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
