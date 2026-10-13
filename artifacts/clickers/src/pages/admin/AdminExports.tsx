import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, BookOpen, Users, ShoppingBag, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { AdminLayout, AdminPageHeader } from '@/components/admin/AdminLayout';
import { useBooks, useAuthors, useAllOrders, useAnalytics } from '@/services/supabase.hooks';
import { format } from 'date-fns';

type ExportType = 'books' | 'authors' | 'orders' | 'sales';

interface ExportCard {
  type: ExportType;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const exportCards: ExportCard[] = [
  { type: 'books', title: 'كتالوج الكتب والمؤلفات', description: 'تصدير كامل لكافة الكتب مع الأسعار، نوع الإصدار، حالة النشر، والمؤلف', icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
  { type: 'authors', title: 'سجل المؤلفين والكُتّاب', description: 'بيانات الكُتاب مع السير الذاتية والجنسية وحسابات التواصل الاجتماعي', icon: Users, color: 'bg-purple-50 text-purple-600' },
  { type: 'orders', title: 'تقرير المبيعات والطلبات', description: 'سجل تفصيلي لجميع طلبات الشراء مع بيانات العملاء وطرق الدفع وعناوين الشحن', icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
];

function downloadExcel(data: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'البيانات');

  // Style the header row
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = XLSX.utils.encode_cell({ r: 0, c });
    if (ws[cell]) {
      ws[cell].s = {
        fill: { fgColor: { rgb: '8B1D3D' } },
        font: { bold: true, color: { rgb: 'FFFFFF' } },
      };
    }
  }

  XLSX.writeFile(wb, `${filename}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}

export function AdminExports() {
  const { data: books } = useBooks({ status: undefined });
  const { data: authors } = useAuthors();
  const { data: orders } = useAllOrders();
  const { data: analytics } = useAnalytics();

  const handleExport = (type: ExportType) => {
    switch (type) {
      case 'books': {
        const rows = (books ?? []).map((b) => ({
          'معرّف الكتاب (ID)': b.id,
          'العنوان بالعربية': b.title_ar,
          'العنوان بالإنجليزية': b.title_en,
          'التصنيف الأدبي': b.genre,
          'نوع الإصدار': b.format,
          'السعر الحالي (ج.م)': b.price,
          'السعر الأصلي (ج.م)': b.original_price || '',
          'عدد الصفحات': b.pages,
          'حالة النشر': b.status,
          'مميز': b.is_featured ? 'نعم' : 'لا',
          'إصدار جديد': b.is_new ? 'نعم' : 'لا',
          'التقييم': b.rating,
          'عدد المراجعات': b.review_count,
          'تاريخ النشر': b.published_date,
        }));
        downloadExcel(rows, 'books_catalog');
        break;
      }
      case 'authors': {
        const rows = (authors ?? []).map((a) => ({
          'المعرّف (ID)': a.id,
          'الاسم بالعربية': a.name_ar,
          'الاسم بالإنجليزية': a.name_en,
          'الجنسية': a.nationality || '',
          'إنستغرام': a.instagram || '',
          'تويتر / X': a.twitter || '',
          'الموقع الإلكتروني': a.website || '',
          'تاريخ الإضافة': format(new Date(a.created_at), 'yyyy-MM-dd'),
        }));
        downloadExcel(rows, 'authors_list');
        break;
      }
      case 'orders': {
        const rows = (orders ?? []).map((o) => {
          const typedOrder = o as Record<string, unknown> & { 
            profiles?: { email: string; full_name?: string; phone?: string };
            order_items?: { books?: { title_en: string; title_ar: string }; quantity: number }[];
            transaction_id?: string;
            shipping_address?: string;
            notes?: string;
          };
          
          // Flatten book titles into a single string
          const bookTitles = typedOrder.order_items?.map(item => 
            `${item.books?.title_ar || item.books?.title_en || 'كتاب غير محدد'} (${item.quantity}x)`
          ).join('، ') || 'لا توجد عناصر';

          return {
            'رقم الطلب': o.id,
            'تاريخ الطلب': format(new Date(o.created_at), 'yyyy-MM-dd HH:mm'),
            'اسم العميل': typedOrder.profiles?.full_name || 'غير مسجل',
            'البريد الإلكتروني': typedOrder.profiles?.email || '',
            'رقم الهاتف': typedOrder.profiles?.phone || '',
            'الكتب المطلوبة': bookTitles,
            'الإجمالي المدفوع (ج.م)': o.total_amount,
            'حالة الطلب': o.status,
            'طريقة الدفع': o.payment_method || 'غير محدد',
            'رقم المعاملة / التحويل': typedOrder.transaction_id || 'لا يوجد',
            'عنوان التوصيل': typedOrder.shipping_address || '',
            'ملاحظات العميل': typedOrder.notes || '',
            'عدد العناصر': typedOrder.order_items?.length || 0,
          };
        });
        downloadExcel(rows, 'orders_report_detailed');
        break;
      }
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="تصدير التقارير والبيانات"
        subtitle="تحميل تقارير الكتالوج والطلبات والمؤلفين كجداول إكسل (Excel) جاهزة للتحليل"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
        {exportCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.type}
              className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl rounded-3xl border border-border p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => handleExport(card.type)}
            >
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                  <Icon size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-primary font-arabic mb-2">{card.title}</h3>
                  <p className="text-primary/50 font-bold text-sm leading-relaxed mb-6 font-arabic">{card.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-wider group-hover:bg-accent group-hover:text-primary transition-all font-arabic">
                      <Download size={14} />
                      <span>تحميل كملف إكسل</span>
                    </div>
                    <FileSpreadsheet size={16} className="text-green-500" />
                    <span className="text-green-600 font-bold text-xs" dir="ltr">.xlsx</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 bg-primary/5 border border-primary/10 rounded-3xl p-8 text-right" dir="rtl">
        <h3 className="text-lg font-black text-primary font-arabic mb-3">📊 إرشادات استخدام التقارير وملفات الإكسل</h3>
        <ul className="space-y-2 text-primary/70 font-bold text-sm font-arabic">
          <li>• يتم استخراج وتوليد التقارير لحظياً ومباشرة من قاعدة البيانات المحدثة</li>
          <li>• الملفات منسقة بألوان وهوية دار زحمة كتاب الرسمية</li>
          <li>• الملفات متوافقة مع Microsoft Excel و Google Sheets و LibreOffice</li>
          <li>• يشمل تقرير الطلبات تفاصيل العملاء وأرقام المعاملات وعناوين الشحن</li>
          <li>• جميع المبالغ والأسعار مقومة بالجنيه المصري (ج.م)</li>
        </ul>
      </div>
    </AdminLayout>
  );
}
