import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'book' | 'article';
  publishedAt?: string;
  locale?: string;
}

const SITE_NAME = 'ممر الكتب | Mamar Elkotob Publishing';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://mamarelkotob.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

function setMeta(property: string, content: string) {
  // property (og:*) or name (description, twitter:*)
  const isProperty = property.startsWith('og:') || property.startsWith('article:');
  const attr = isProperty ? 'property' : 'name';

  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * SEO Component — sets document.title + all meta tags dynamically.
 * Works perfectly with React SPA routing (no SSR required).
 * Supports Arabic/English bilingual titles automatically.
 */
export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedAt,
  locale,
}: SEOProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const resolvedLocale = locale || (language === 'ar' ? 'ar_EG' : 'en_US');
    const resolvedUrl = url || window.location.href;
    const resolvedImage = image || DEFAULT_IMAGE;
    const resolvedTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const resolvedDescription = description ||
      (language === 'ar'
        ? 'اكتشف عالمًا من الكتب والروايات العربية والإنجليزية في دار ممر الكتب للنشر والتوزيع.'
        : 'Discover Arabic and English books, novels, and literary worlds at Mamar Elkotob Publishing.');

    // ── Primary ─────────────────────────────────────────────────
    document.title = resolvedTitle;
    setMeta('description', resolvedDescription);
    setMeta('robots', 'index, follow');

    // ── Open Graph (Facebook, WhatsApp, LinkedIn) ─────────────
    setMeta('og:site_name', SITE_NAME);
    setMeta('og:type', type);
    setMeta('og:title', resolvedTitle);
    setMeta('og:description', resolvedDescription);
    setMeta('og:image', resolvedImage);
    setMeta('og:image:width', '1200');
    setMeta('og:image:height', '630');
    setMeta('og:url', resolvedUrl);
    setMeta('og:locale', resolvedLocale);

    // ── Twitter / X Card ──────────────────────────────────────
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', resolvedTitle);
    setMeta('twitter:description', resolvedDescription);
    setMeta('twitter:image', resolvedImage);
    setMeta('twitter:site', '@zahmetkotab'); // Update with your Twitter handle

    // ── Article-specific (blog posts) ────────────────────────
    if (type === 'article' && publishedAt) {
      setMeta('article:published_time', publishedAt);
    }

    // ── Canonical URL ────────────────────────────────────────
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', resolvedUrl);
  }, [title, description, image, url, type, publishedAt, locale, language]);

  return null; // Renders nothing — side-effect only
}
