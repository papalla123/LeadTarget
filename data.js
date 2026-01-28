// ═══════════════════════════════════════════════════════════════
// LEADTARGET DATA ENGINE - PENTÁGONO FINANCIERO
// Market Intelligence & Sales Funnel Database - Perú 2026
// ═══════════════════════════════════════════════════════════════

const MARKET_NEWS_PERU = [
    {
        id: 1,
        title: "BCR mantiene tasa de interés en 5.75% para enero 2026",
        summary: "El Banco Central de Reserva decidió mantener la tasa de referencia ante señales de desaceleración inflacionaria. Expertos proyectan inicio de recortes en Q2.",
        impact: "NEUTRAL",
        source: "Gestión",
        url: "https://gestion.pe",
        date: "2026-01-28",
        category: "MONETARY_POLICY"
    },
    {
        id: 2,
        title: "E-commerce peruano creció 28% en 2025, liderado por food delivery",
        summary: "Plataformas digitales alcanzaron S/18,500 millones en GMV. TikTok Shop y redes sociales capturaron 34% del tráfico de conversión.",
        impact: "POSITIVE",
        source: "El Comercio",
        url: "https://elcomercio.pe",
        date: "2026-01-27",
        category: "DIGITAL_ECONOMY"
    },
    {
        id: 3,
        title: "Dólar cierra en S/3.72: presión cambiaria por incertidumbre global",
        summary: "El tipo de cambio subió 0.8% esta semana. Importadores reportan incremento en costos de insumos para Q1 2026.",
        impact: "NEGATIVE",
        source: "Bloomberg Línea",
        url: "https://bloomberg.com",
        date: "2026-01-28",
        category: "FOREX"
    },
    {
        id: 4,
        title: "Sector construcción proyecta crecimiento de 6.2% para 2026",
        summary: "Inversión privada en vivienda y obras públicas impulsan recuperación. Lima Norte y Callao concentran 42% de nuevos proyectos inmobiliarios.",
        impact: "POSITIVE",
        source: "Gestión",
        url: "https://gestion.pe",
        date: "2026-01-26",
        category: "REAL_ESTATE"
    },
    {
        id: 5,
        title: "Costos de Meta Ads suben 18% YoY en Perú por saturación",
        summary: "CPM promedio alcanza $8.50 en Facebook/Instagram. Marcas migran a TikTok Ads donde CPM se mantiene en $4.20 con mejor engagement.",
        impact: "NEGATIVE",
        source: "Mercado Negro",
        url: "https://mercanegro.pe",
        date: "2026-01-25",
        category: "DIGITAL_ADS"
    },
    {
        id: 6,
        title: "Sunat intensifica fiscalización a influencers y creadores de contenido",
        summary: "Nueva directiva exige declaración de ingresos por monetización digital. Afecta a +12,000 profesionales del marketing digital en Perú.",
        impact: "NEUTRAL",
        source: "Gestión",
        url: "https://gestion.pe",
        date: "2026-01-24",
        category: "REGULATION"
    }
];

const INDUSTRIES_PERU = {
    ecommerce: {
        name: "E-commerce / Tiendas Online",
        avgTicket: 180,
        conversionRate: 2.8,
        avgMargin: 35,
        closingCycle: 2,
        whatsappScript: "¡Hola! 👋 Vi tu tienda online y me interesa {producto}. ¿Tienes stock disponible? ¿Cuál es el tiempo de envío a {ciudad}?"
    },
    realEstate: {
        name: "Inmobiliaria / Proyectos",
        avgTicket: 320000,
        conversionRate: 1.2,
        avgMargin: 8,
        closingCycle: 120,
        whatsappScript: "Buenos días. Estoy interesado en {proyecto} que vi en su publicidad. ¿Podrían enviarme el brochure y agendar una visita? Mi presupuesto es de S/{monto}."
    },
    healthWellness: {
        name: "Salud / Clínicas / Wellness",
        avgTicket: 850,
        conversionRate: 4.5,
        avgMargin: 52,
        closingCycle: 7,
        whatsappScript: "Hola, quisiera agendar una cita para {servicio}. ¿Tienen disponibilidad esta semana? ¿Aceptan seguro/particular?"
    },
    education: {
        name: "Educación / Cursos / Coaching",
        avgTicket: 1200,
        conversionRate: 3.8,
        avgMargin: 68,
        closingCycle: 14,
        whatsappScript: "¡Hola! Me interesa el curso de {especialidad}. ¿Cuándo inicia la próxima promoción? ¿Tienen opciones de pago fraccionado?"
    },
    automotive: {
        name: "Automotriz / Repuestos",
        avgTicket: 4500,
        conversionRate: 2.1,
        avgMargin: 28,
        closingCycle: 21,
        whatsappScript: "Buen día. Necesito cotización para {servicio/repuesto} para un {marca} {modelo}. ¿Hacen instalación? ¿Cuál es el tiempo de entrega?"
    },
    beautyFashion: {
        name: "Belleza / Moda / Estética",
        avgTicket: 420,
        conversionRate: 5.2,
        avgMargin: 58,
        closingCycle: 3,
        whatsappScript: "Hola! Vi tu {servicio/producto} en {red_social}. Me encantó! ¿Cuál es el precio final? ¿Tienen promociones activas?"
    },
    foodBeverage: {
        name: "Restaurantes / Food Delivery",
        avgTicket: 65,
        conversionRate: 8.5,
        avgMargin: 42,
        closingCycle: 1,
        whatsappScript: "Hola! Quiero hacer un pedido para {cantidad} personas. ¿Tienen delivery a {distrito}? ¿Cuál es el monto mínimo?"
    },
    legalServices: {
        name: "Servicios Legales / Asesoría",
        avgTicket: 2800,
        conversionRate: 2.9,
        avgMargin: 72,
        closingCycle: 30,
        whatsappScript: "Buenos días. Necesito asesoría legal para {tema}. ¿Podrían agendar una consulta? ¿Cuál es el costo de la primera sesión?"
    },
    homeServices: {
        name: "Servicios para el Hogar",
        avgTicket: 580,
        conversionRate: 6.8,
        avgMargin: 48,
        closingCycle: 5,
        whatsappScript: "Hola, necesito contratar servicio de {tipo} para {fecha}. ¿Tienen disponibilidad? ¿Cuál es la tarifa en {distrito}?"
    },
    b2bServices: {
        name: "Servicios B2B / Corporativos",
        avgTicket: 8500,
        conversionRate: 1.8,
        avgMargin: 45,
        closingCycle: 60,
        whatsappScript: "Buen día. Representamos a {empresa} y nos interesa su solución de {servicio}. ¿Podrían enviarnos una propuesta comercial? Nuestro volumen mensual es de {cantidad}."
    }
};

const AD_PLATFORMS_PERU_2026 = {
    facebookAds: {
        name: "Facebook/Instagram Ads",
        cpmLima: 8.50,
        cpmProvincias: 6.20,
        cpcLima: 0.42,
        cpcProvincias: 0.31,
        avgCTR: 2.8,
        bestFor: ["E-commerce", "Belleza", "Food", "Servicios"],
        minBudget: 300,
        saturationLevel: "HIGH"
    },
    tiktokAds: {
        name: "TikTok Ads",
        cpmLima: 4.20,
        cpmProvincias: 3.10,
        cpcLima: 0.18,
        cpcProvincias: 0.13,
        avgCTR: 4.5,
        bestFor: ["Belleza", "Moda", "Food", "Educación"],
        minBudget: 500,
        saturationLevel: "MEDIUM"
    },
    googleAds: {
        name: "Google Ads (Search)",
        cpmLima: 12.80,
        cpmProvincias: 8.90,
        cpcLima: 0.85,
        cpcProvincias: 0.58,
        avgCTR: 3.2,
        bestFor: ["B2B", "Legal", "Salud", "Inmobiliaria"],
        minBudget: 800,
        saturationLevel: "HIGH"
    },
    youtubeAds: {
        name: "YouTube Ads",
        cpmLima: 5.60,
        cpmProvincias: 3.80,
        cpcLima: 0.28,
        cpcProvincias: 0.19,
        avgCTR: 3.8,
        bestFor: ["Educación", "Automotriz", "Inmobiliaria"],
        minBudget: 600,
        saturationLevel: "MEDIUM"
    },
    linkedinAds: {
        name: "LinkedIn Ads",
        cpmLima: 18.50,
        cpmProvincias: 14.20,
        cpcLima: 1.85,
        cpcProvincias: 1.42,
        avgCTR: 1.8,
        bestFor: ["B2B", "Legal", "Educación Premium"],
        minBudget: 1500,
        saturationLevel: "LOW"
    }
};

const COST_PER_LEAD_BENCHMARKS_2026 = {
    lima: {
        cold: { min: 8, max: 25, avg: 15 },
        warm: { min: 12, max: 38, avg: 22 },
        hot: { min: 28, max: 85, avg: 52 }
    },
    provincias: {
        cold: { min: 5, max: 18, avg: 10 },
        warm: { min: 8, max: 28, avg: 16 },
        hot: { min: 18, max: 62, avg: 38 }
    }
};

const CONVERSION_FUNNEL_STAGES = {
    awareness: {
        name: "Awareness (Conocimiento)",
        typical_rate: 100,
        description: "Personas que ven tu anuncio"
    },
    interest: {
        name: "Interest (Interés)",
        typical_rate: 15,
        description: "Clicks en tu anuncio / Landing page"
    },
    consideration: {
        name: "Consideration (Consideración)",
        typical_rate: 35,
        description: "Dejan datos / Añaden al carrito"
    },
    intent: {
        name: "Intent (Intención)",
        typical_rate: 55,
        description: "Inician checkout / Solicitan cotización"
    },
    purchase: {
        name: "Purchase (Compra)",
        typical_rate: 42,
        description: "Completan la compra / Firman contrato"
    }
};

const GROWTH_STRATEGIES_PERU = [
    {
        strategy: "WhatsApp Business API",
        roi: 320,
        difficulty: "MEDIUM",
        timeToResults: "2-4 semanas",
        bestFor: ["E-commerce", "Servicios", "Food"]
    },
    {
        strategy: "Influencer Marketing Local",
        roi: 280,
        difficulty: "MEDIUM",
        timeToResults: "1-2 semanas",
        bestFor: ["Belleza", "Moda", "Food"]
    },
    {
        strategy: "SEO Local + Google My Business",
        roi: 450,
        difficulty: "HIGH",
        timeToResults: "3-6 meses",
        bestFor: ["Servicios Locales", "Salud", "Legal"]
    },
    {
        strategy: "TikTok Shop + Live Shopping",
        roi: 380,
        difficulty: "LOW",
        timeToResults: "1-3 semanas",
        bestFor: ["E-commerce", "Belleza", "Moda"]
    },
    {
        strategy: "Email Marketing Automation",
        roi: 420,
        difficulty: "MEDIUM",
        timeToResults: "2-4 semanas",
        bestFor: ["E-commerce", "Educación", "B2B"]
    }
];

const PENTAGON_TOOLS = {
    sueldopro: {
        name: "SueldoPro",
        icon: "💰",
        description: "Calculadora Salarial Inteligente",
        color: "#059669",
        available: true
    },
    marginaxis: {
        name: "MarginAxis",
        icon: "📊",
        description: "Optimizador de Márgenes",
        color: "#0891b2",
        available: true
    },
    liquidezforce: {
        name: "LiquidezForce",
        icon: "💎",
        description: "Monitor de Flujo de Caja",
        color: "#7c3aed",
        available: true
    },
    wealtharmor: {
        name: "WealthArmor",
        icon: "🛡️",
        description: "Escudo Patrimonial",
        color: "#dc2626",
        available: true
    },
    leadtarget: {
        name: "LeadTarget",
        icon: "🎯",
        description: "Central de Crecimiento",
        color: "#991b1b",
        available: true
    }
};

const NEWS_SOURCES_CREDIBILITY = {
    gestion: { name: "Gestión", trust: 95, category: "BUSINESS" },
    elcomercio: { name: "El Comercio", trust: 90, category: "GENERAL" },
    bloomberg: { name: "Bloomberg Línea", trust: 98, category: "FINANCE" },
    rpp: { name: "RPP Noticias", trust: 88, category: "GENERAL" },
    mercanegro: { name: "Mercado Negro", trust: 85, category: "MARKETING" },
    semanaeconomica: { name: "Semana Económica", trust: 92, category: "BUSINESS" }
};

// Export para uso en script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MARKET_NEWS_PERU,
        INDUSTRIES_PERU,
        AD_PLATFORMS_PERU_2026,
        COST_PER_LEAD_BENCHMARKS_2026,
        CONVERSION_FUNNEL_STAGES,
        GROWTH_STRATEGIES_PERU,
        PENTAGON_TOOLS,
        NEWS_SOURCES_CREDIBILITY
    };
}
