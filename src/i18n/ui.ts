export type Lang = "es" | "en";

export const defaultLang: Lang = "es";

export const ui = {
  es: {
    "nav.about": "./sobre-mi",
    "nav.services": "./servicios",
    "nav.blog": "./blog",
    "nav.menu": "Menú",
    "nav.close": "Cerrar",
    "hero.since": "data scientist desde 2019, antes del boom de los LLMs",
    "hero.mission": "acelero a tu equipo. tu IA en producción, no en slides.",
    "hero.cta": "Agendar consultoría",
    "home.aboutTitle": "Sobre mí",
    "home.servicesTitle": "Servicios",
    "home.servicesIntro": "Por números, no por hype. IA aplicada desde mucho antes del boom.",
    "home.servicesCta": "Ver todos los servicios",
    "home.blogTitle": "Blog",
    "home.blogCta": "Ver todas las publicaciones",
    "home.videosTitle": "Videos",
    "home.videosIntro": "Lo último que publiqué en YouTube.",
    "home.videosCta": "Ver más en YouTube",
    "home.projectsTitle": "Proyectos open source",
    "home.projectsIntro": "Lo que construyo por mi cuenta. Todo público en GitHub.",
    "home.projectsCta": "Ver todo mi GitHub",
    "blog.empty": "Aún no hay publicaciones.",
    "blog.backToList": "Volver al blog",
    "blog.readingTime": "min de lectura",
    "services.detailsTitle": "Lo que incluye",
    "services.contactTitle": "¿Tu equipo necesita esto?",
    "services.contactBody": "Cuéntame qué estás construyendo. Respondo personalmente.",
    "services.contactCta": "Escribir a hello@hectorpulido.net",
    "footer.tagline": "IA aplicada con criterio. Decisiones por números.",
    "footer.contact": "Contacto",
    "footer.elsewhere": "En otros sitios",
    "footer.copy": "Hector Pulido",
    "404.title": "Página no encontrada",
    "404.body": "La ruta que buscas no existe. Quizás se movió.",
    "404.cta": "Volver al inicio",
    "meta.siteTitle": "Hector Pulido",
    "meta.siteDescription": "Consultoría en IA con criterio matemático. Construyo agentes solo cuando realmente los necesitas, y los llevo a producción con métricas y coste bajo control.",
    "lang.label": "Idioma",
  },
  en: {
    "nav.about": "./about",
    "nav.services": "./services",
    "nav.blog": "./blog",
    "nav.menu": "Menu",
    "nav.close": "Close",
    "hero.since": "data scientist since 2019, before the LLM boom",
    "hero.mission": "I accelerate your team. your AI in production, not in slides.",
    "hero.cta": "Book a consulting call",
    "home.aboutTitle": "About me",
    "home.servicesTitle": "Services",
    "home.servicesIntro": "Numbers over hype. Applied AI from long before the boom.",
    "home.servicesCta": "See all services",
    "home.blogTitle": "Blog",
    "home.blogCta": "See all posts",
    "home.videosTitle": "Videos",
    "home.videosIntro": "Latest uploads on my YouTube channel.",
    "home.videosCta": "See more on YouTube",
    "home.projectsTitle": "Open source projects",
    "home.projectsIntro": "What I build on my own time. All public on GitHub.",
    "home.projectsCta": "See full GitHub",
    "blog.empty": "No posts yet.",
    "blog.backToList": "Back to the blog",
    "blog.readingTime": "min read",
    "services.detailsTitle": "What's included",
    "services.contactTitle": "Does your team need this?",
    "services.contactBody": "Tell me what you're building. I reply personally.",
    "services.contactCta": "Email hello@hectorpulido.net",
    "footer.tagline": "Applied AI with judgment. Decisions by the numbers.",
    "footer.contact": "Contact",
    "footer.elsewhere": "Elsewhere",
    "footer.copy": "Hector Pulido",
    "404.title": "Page not found",
    "404.body": "The page you're looking for doesn't exist. It may have moved.",
    "404.cta": "Back to home",
    "meta.siteTitle": "Hector Pulido",
    "meta.siteDescription": "AI consulting with mathematical rigor. I build agents only when you actually need them, and ship them to production with metrics and cost under control.",
    "lang.label": "Language",
  },
} as const;

export type UiKey = keyof typeof ui.es;

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key];
}

export function localizedPath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === "es") return clean;
  return `/en${clean === "/" ? "/" : clean}`;
}

export type PageKey = "home" | "about" | "services" | "blog" | "blogPost" | "notFound";

export const pageRoutes: Record<PageKey, Record<Lang, string>> = {
  home: { es: "/", en: "/" },
  about: { es: "/sobre-mi/", en: "/about/" },
  services: { es: "/servicios/", en: "/services/" },
  blog: { es: "/blog/", en: "/blog/" },
  blogPost: { es: "/blog/", en: "/blog/" },
  notFound: { es: "/", en: "/" },
};

/** Absolute path for a page key in a given language, including /en prefix when applicable. */
export function pageHref(key: PageKey, lang: Lang, suffix = ""): string {
  const base = pageRoutes[key][lang];
  return localizedPath(lang, `${base}${suffix}`);
}

/** Absolute path of the same page in the other language. Used by the language switcher. */
export function otherLangHref(currentLang: Lang, key: PageKey, suffix = ""): string {
  const target: Lang = currentLang === "es" ? "en" : "es";
  return pageHref(key, target, suffix);
}
