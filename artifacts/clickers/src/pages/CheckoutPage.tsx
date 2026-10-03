import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, CheckCircle, CreditCard, ArrowRight, Trash2, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/useAuth';
import { useCreateOrder } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

type Step = 'cart' | 'details' | 'confirmation';

export function CheckoutPage() {
  const { items, totalPrice, totalItems, clear } = useCart();
  const { profile } = useAuth();
  const { isRTL, t } = useLanguage();
  const createOrder = useCreateOrder();
  const [, navigate] = useLocation();

  const [step, setStep] = useState<Step>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [transactionId, setTransactionId] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: profile?.full_name || '', phone: profile?.phone || '', address: '', notes: '' });

  const handlePlaceOrder = async () => {
    if (!profile) { navigate('/auth'); return; }
    try {
      // Always save phone to profile when placing an order
      if (formData.phone.trim()) {
        const { error: phoneErr } = await (supabase.from('profiles') as any)
          .update({ phone: formData.phone.trim() })
          .eq('id', profile.id);
        if (phoneErr) console.error('[Checkout] Failed to save phone:', phoneErr);
      }

      const order = await createOrder.mutateAsync({
        userId: profile.id,
        items: items.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: formData.address,
        notes: formData.notes,
        transactionId: ['instapay', 'vodafone_cash'].includes(paymentMethod) ? transactionId : undefined,
      });
      setOrderId(order.id as string);
      clear();
      setStep('confirmation');
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    { key: 'cart', label: isRTL ? 'مراجعة السلة' : 'Review Cart', num: 1 },
    { key: 'details', label: isRTL ? 'تفاصيل الطلب' : 'Order Details', num: 2 },
    { key: 'confirmation', label: isRTL ? 'التأكيد' : 'Confirmation', num: 3 },
  ] as const;

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Progress Steps */}
        {step !== 'confirmation' && (
          <div className={`flex items-center justify-center gap-4 mb-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {steps.filter((s) => s.key !== 'confirmation').map((s, i, arr) => (
              <div key={s.key} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    step === s.key ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                    steps.findIndex(x => x.key === step) > i ? 'bg-green-500 text-white' :
                    'bg-primary/10 text-primary/40'
                  }`}>
                    {steps.findIndex(x => x.key === step) > i ? '✓' : s.num}
                  </div>
                  <span className={`font-bold text-sm ${step === s.key ? 'text-primary' : 'text-primary/40'}`}>{s.label}</span>
                </div>
                {i < arr.length - 1 && <div className="h-px w-12 bg-border" />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Cart Review */}
          {step === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <h1 className={`text-4xl font-black text-primary mb-12 ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`}>
                {isRTL ? 'مراجعة طلبك' : 'Review Your Order'}
              </h1>

              {items.length === 0 ? (
                <div className="text-center py-24">
                  <ShoppingBag size={64} className="mx-auto text-primary/10 mb-6" />
                  <p className={`text-primary/40 font-bold text-xl mb-8 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                    {isRTL ? 'السلة فارغة' : 'Your cart is empty'}
                  </p>
                  <Link href="/store">
                    <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all">
                      {isRTL ? 'تصفح الكتب' : 'Browse Books'}
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                      <div key={item.bookId} className={`flex gap-6 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-2xl p-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <img src={item.coverUrl} alt={item.title} className="w-16 h-22 object-cover rounded-xl shadow-md flex-shrink-0" style={{ height: '88px' }} />
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-primary mb-1 ${isRTL ? 'text-right font-arabic' : ''}`}>{item.title}</h3>
                          <p className="text-primary/40 text-sm font-bold mb-3">
                            {item.format === 'digital' ? (isRTL ? 'نسخة رقمية' : 'Digital') : (isRTL ? 'نسخة مطبوعة' : 'Physical')}
                          </p>
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-accent font-black text-lg">{(item.price * item.quantity).toFixed(2)} <span className="text-xs text-primary/40">{t.common.currency}</span></span>
                            <span className="text-primary/40 text-sm font-bold">×{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-8 h-fit sticky top-32">
                    <h3 className={`text-lg font-black text-primary mb-6 ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`}>
                      {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                    </h3>
                    <div className="space-y-3 mb-6">
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-primary/50 font-bold text-sm">{isRTL ? `${totalItems} كتاب` : `${totalItems} book(s)`}</span>
                        <span className="text-primary font-bold">{totalPrice.toFixed(2)} {t.common.currency}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-primary/50 font-bold text-sm">{isRTL ? 'الشحن' : 'Shipping'}</span>
                        <span className="text-green-600 font-black text-sm">{isRTL ? 'مجاني' : 'Free'}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-primary font-black">{isRTL ? 'الإجمالي' : 'Total'}</span>
                        <span className="text-primary font-black text-2xl">{totalPrice.toFixed(2)} <span className="text-sm text-primary/40">{t.common.currency}</span></span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setStep('details')}
                      className={`w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>{isRTL ? 'متابعة' : 'Continue'}</span>
                      <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Details & Payment */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h1 className={`text-4xl font-black text-primary mb-12 ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`}>
                {isRTL ? 'تفاصيل الدفع' : 'Payment Details'}
              </h1>

              {!profile && (
                <div className={`flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-2xl mb-8 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className={`font-bold text-amber-800 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL ? 'يجب تسجيل الدخول لإتمام الطلب' : 'You must be signed in to place an order'}
                    </p>
                    <Link href="/auth">
                      <span className="text-amber-600 font-black text-sm underline cursor-pointer">{isRTL ? 'تسجيل الدخول' : 'Sign in now'}</span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-xs font-black uppercase tracking-wider text-primary/40 mb-3 ${isRTL ? 'text-right' : ''}`}>
                          {isRTL ? 'الاسم بالكامل' : 'Full Name'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="w-full px-5 py-4 border border-border rounded-2xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-black uppercase tracking-wider text-primary/40 mb-3 ${isRTL ? 'text-right' : ''}`}>
                          {isRTL ? 'رقم الهاتف (للتوصيل)' : 'Phone Number (For Delivery)'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                          dir="ltr"
                          className="w-full px-5 py-4 border border-border rounded-2xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl text-left"
                          placeholder="+20 ..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-black uppercase tracking-wider text-primary/40 mb-3 ${isRTL ? 'text-right' : ''}`}>
                        {isRTL ? 'عنوان الشحن (مطلوب للنسخ المطبوعة)' : 'Shipping Address (Required for Physical Books)'} <span className="text-red-500">*</span>
                      </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                      rows={3}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      className="w-full px-5 py-4 border border-border rounded-2xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl resize-none placeholder:text-primary/20 mb-6"
                      placeholder={isRTL ? 'أدخل عنوان الشحن بالتفصيل (المدينة، الحي، الشارع...)' : 'Enter detailed address (City, District, Street...)'}
                    />

                    <label className={`block text-xs font-black uppercase tracking-wider text-primary/40 mb-3 ${isRTL ? 'text-right' : ''}`}>
                      {isRTL ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                      rows={2}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      className="w-full px-5 py-4 border border-border rounded-2xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl resize-none placeholder:text-primary/20"
                      placeholder={isRTL ? 'أي ملاحظات للطلب...' : 'Any notes for your order...'}
                    />
                  </div>

                  <div>
                    <h3 className={`text-xs font-black uppercase tracking-wider text-primary/40 mb-4 ${isRTL ? 'text-right' : ''}`}>
                      {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                    </h3>
                    <div className="space-y-3">
                      {([
                        { value: 'instapay', label: 'InstaPay', desc: isRTL ? 'تحويل فوري عبر انستا باي' : 'Instant transfer via InstaPay' },
                        { value: 'vodafone_cash', label: isRTL ? 'فودافون كاش' : 'Vodafone Cash', desc: isRTL ? 'تحويل عبر محفظة فودافون' : 'Transfer via Vodafone wallet' },
                      ] as const).map((method) => (
                        <label key={method.value} className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === method.value ? 'border-primary bg-primary/5' : 'border-border bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl hover:border-primary/30'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <input
                            type="radio"
                            name="payment"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={() => setPaymentMethod(method.value)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === method.value ? 'border-primary' : 'border-border'}`}>
                            {paymentMethod === method.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <div className={isRTL ? 'text-right' : ''}>
                            <p className="font-black text-primary text-sm">{method.label}</p>
                            <p className="text-primary/40 text-xs font-bold mt-0.5">{method.desc}</p>
                          </div>
                          <CreditCard className="text-primary/20 ml-auto" size={20} />
                        </label>
                      ))}
                    </div>

                    <AnimatePresence>
                      {['instapay', 'vodafone_cash'].includes(paymentMethod) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          {/* Step 1: Send money to this number */}
                          <div className={`p-5 mt-3 bg-accent/8 border-2 border-accent/20 rounded-2xl ${isRTL ? 'text-right' : ''}`}>
                            <p className="text-xs font-black uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs font-black flex-shrink-0">1</span>
                              {isRTL ? 'حوّل المبلغ على الرقم التالي' : 'Send Your Payment To This Number'}
                            </p>
                            <div className={`flex items-center justify-between gap-3 bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-accent/20 rounded-xl px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div>
                                <p className="font-mono font-black text-primary text-xl tracking-wider">01011088867</p>
                                <p className="text-primary/40 text-xs font-bold mt-0.5">
                                  {paymentMethod === 'instapay'
                                    ? (isRTL ? 'حساب انستا باي' : 'InstaPay Account')
                                    : (isRTL ? 'محفظة فودافون كاش' : 'Vodafone Cash Wallet')}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText('01011088867'); }}
                                className="text-xs font-black uppercase tracking-wider text-accent hover:text-primary transition-colors border border-accent/30 rounded-xl px-3 py-2 hover:border-primary/30"
                              >
                                {isRTL ? 'نسخ' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          {/* Step 2: Enter transaction ID */}
                          <div className={`p-5 mt-2 bg-primary/5 border border-primary/10 rounded-2xl ${isRTL ? 'text-right' : ''}`}>
                            <label className="block text-xs font-black uppercase tracking-wider text-primary/70 mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black flex-shrink-0">2</span>
                              {isRTL ? 'أدخل رقم العملية بعد التحويل' : 'Enter Transaction ID After Transfer'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              dir="ltr"
                              className={`w-full px-5 py-4 border border-border rounded-xl text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}
                              placeholder={isRTL ? 'مثال: TXN123456789' : 'e.g. TXN123456789'}
                            />
                            <p className="text-xs text-primary/40 mt-2 font-bold leading-relaxed">
                              {isRTL
                                ? 'بعد إتمام التحويل، ادخل رقم المرجع أو رقم العملية الذي ظهر لك على شاشة التأكيد.'
                                : 'After completing the transfer, enter the reference or transaction number shown on your confirmation screen.'}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl border border-border rounded-3xl p-8 h-fit">
                  <h3 className={`text-lg font-black text-primary mb-6 ${isRTL ? 'font-arabic text-right' : 'font-cinematic'}`}>
                    {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                  </h3>
                  <div className="space-y-3 mb-8">
                    {items.map((item) => (
                      <div key={item.bookId} className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-primary/70 font-bold text-sm truncate flex-1 ${isRTL ? 'text-right' : ''}`}>{item.title}</span>
                        <span className="text-primary font-black text-sm ml-4">{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="h-px bg-border pt-2" />
                    <div className={`flex justify-between items-center pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-primary font-black">{isRTL ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-primary font-black text-xl">{totalPrice.toFixed(2)} <span className="text-sm text-primary/40">{t.common.currency}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(() => {
                      const isPaymentIncomplete = ['instapay', 'vodafone_cash'].includes(paymentMethod) && !transactionId.trim();
                      const isDisabled = !profile || createOrder.isPending || !formData.address.trim() || !formData.phone.trim() || isPaymentIncomplete;
                      
                      return (
                        <motion.button
                          onClick={handlePlaceOrder}
                          disabled={isDisabled}
                          className={`w-full py-5 font-black rounded-2xl transition-all flex items-center justify-center gap-3 ${
                            isDisabled
                            ? 'bg-primary/20 text-primary/40 cursor-not-allowed shadow-none' 
                            : 'bg-primary text-white hover:bg-accent hover:text-primary shadow-xl shadow-primary/20'
                          } ${isRTL ? 'flex-row-reverse' : ''}`}
                          whileTap={isDisabled ? {} : { scale: 0.97 }}
                        >
                          {createOrder.isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>{isRTL ? 'تأكيد الطلب' : 'Place Order'}</span>
                              <ShoppingBag size={18} />
                            </>
                          )}
                        </motion.button>
                      );
                    })()}
                    <button
                      onClick={() => setStep('cart')}
                      className="w-full py-3 border border-border text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all text-sm"
                    >
                      {isRTL ? 'رجوع' : 'Back'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 max-w-lg mx-auto">
              <motion.div
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="text-green-600" size={48} />
              </motion.div>
              <h1 className={`text-4xl font-black text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-cinematic'}`}>
                {isRTL ? 'ðŸŽ‰ تم استلام طلبك!' : 'ðŸŽ‰ Order Confirmed!'}
              </h1>
              <p className={`text-primary/50 text-lg mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'سيتم التواصل معك خلال 24 ساعة لتأكيد الدفع.' : 'We\'ll reach out within 24 hours to confirm your payment.'}
              </p>
              {orderId && (
                <p className="text-primary/30 text-sm font-mono mb-10">
                  {isRTL ? `رقم الطلب: ${orderId.slice(0, 8).toUpperCase()}` : `Order #${orderId.slice(0, 8).toUpperCase()}`}
                </p>
              )}
              <div className={`flex gap-4 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link href="/my-orders">
                  <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20">
                    {isRTL ? 'متابعة طلباتي' : 'Track My Orders'}
                  </button>
                </Link>
                <Link href="/store">
                  <button className="px-8 py-4 border border-border text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all">
                    {isRTL ? 'تصفح المزيد' : 'Browse More'}
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

