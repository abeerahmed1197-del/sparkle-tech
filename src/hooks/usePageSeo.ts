import { useEffect } from 'react';

export function usePageSeo(title: string, description: string, path: string, breadcrumbs: { name: string; path: string }[], notFound = false) {
  const serialized = JSON.stringify(breadcrumbs);
  useEffect(() => {
    const previousTitle = document.title;
    const restore: (() => void)[] = [];
    document.title = title;
    const meta = (attribute: 'name' | 'property', name: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      const previous = element?.content;
      const created = !element;
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.appendChild(element); }
      const current = element;
      current.content = content;
      restore.push(() => { if (created) current.remove(); else current.content = previous || ''; });
    };
    meta('name', 'description', description);
    meta('name', 'robots', notFound ? 'noindex,follow' : 'index,follow');
    meta('property', 'og:title', title); meta('property', 'og:description', description);
    meta('property', 'og:type', 'website'); meta('property', 'og:url', new URL(path, window.location.origin).href);
    meta('name', 'twitter:title', title); meta('name', 'twitter:description', description);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const oldHref = canonical?.getAttribute('href');
    const createdCanonical = !canonical;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    const currentCanonical = canonical;
    currentCanonical.href = new URL(path, window.location.origin).href;
    const script = document.createElement('script'); script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: JSON.parse(serialized).map((crumb: { name: string; path: string }, index: number) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: new URL(crumb.path, window.location.origin).href })) });
    if (!notFound) document.head.appendChild(script);
    return () => {
      document.title = previousTitle; restore.forEach(fn => fn()); script.remove();
      if (createdCanonical) currentCanonical.remove(); else if (oldHref != null) currentCanonical.setAttribute('href', oldHref);
    };
  }, [title, description, path, serialized, notFound]);
}