// Industry Benchmarks Data
const industryData = {
    ecommerce: { 
        avgCPC: 0.85, 
        avgConversion: 2.8, 
        avgLTV: 1.8, 
        trend: 'evergreen',
        description: 'Comercio electrónico con demanda constante'
    },
    servicios: { 
        avgCPC: 2.30, 
        avgConversion: 3.5, 
        avgLTV: 2.5, 
        trend: 'evergreen',
        description: 'Servicios profesionales de alta demanda'
    },
    b2b: { 
        avgCPC: 3.50, 
        avgConversion: 2.1, 
        avgLTV: 4.2, 
        trend: 'evergreen',
        description: 'Soluciones empresariales y SaaS'
    },
    educacion: { 
        avgCPC: 1.20, 
        avgConversion: 4.2, 
        avgLTV: 3.0, 
        trend: 'creciente',
        description: 'Formación online en expansión'
    },
    salud: { 
        avgCPC: 2.80, 
        avgConversion: 3.8, 
        avgLTV: 2.8, 
        trend: 'evergreen',
        description: 'Bienestar y salud preventiva'
    },
    inmobiliaria: { 
        avgCPC: 4.20, 
        avgConversion: 1.5, 
        avgLTV: 5.5, 
        trend: 'estacional',
        description: 'Propiedades con alta inversión'
    }
};

// Platform Scoring Algorithm
const platformScoring = {
    tiktok: { 
        lowTicket: 95, 
        medTicket: 75, 
        highTicket: 45, 
        baseCPC: 0.50,
        strength: 'Viral content, audiencias jóvenes'
    },
    instagram: { 
        lowTicket: 85, 
        medTicket: 90, 
        highTicket: 70, 
        baseCPC: 0.75,
        strength: 'Visual branding, engagement alto'
    },
    google: { 
        lowTicket: 70, 
        medTicket: 85, 
        highTicket: 95, 
        baseCPC: 1.50,
        strength: 'Intención de compra, search demand'
    },
    linkedin: { 
        lowTicket: 40, 
        medTicket: 70, 
        highTicket: 98, 
        baseCPC: 5.00,
        strength: 'B2B, profesionales, decisores'
    }
};

// Buyer Persona Templates
const personaTemplates = {
    ecommerce: {
        name: 'Compradora Digital Urbana',
        age: '25-40 años',
        pain: 'Busca productos únicos sin perder tiempo en tiendas físicas',
        hook: 'Exclusividad y entrega rápida',
        channels: ['Instagram', 'TikTok', 'Pinterest'],
        behavior: 'Compra por impulso, valora reviews'
    },
    servicios: {
        name: 'Profesional en Crecimiento',
        age: '30-50 años',
        pain: 'Necesita resolver problemas específicos sin contratar permanente',
        hook: 'Resultados garantizados y expertise comprobado',
        channels: ['LinkedIn', 'Google', 'YouTube'],
        behavior: 'Busca testimonios, compara opciones'
    },
    b2b: {
        name: 'Tomador de Decisiones Corporativo',
        age: '35-55 años',
        pain: 'Requiere soluciones escalables con ROI medible',
        hook: 'Reducción de costos operativos y eficiencia',
        channels: ['LinkedIn', 'Google', 'Webinars'],
        behavior: 'Proceso de compra largo, necesita demos'
    },
    educacion: {
        name: 'Aprendiz Ambicioso',
        age: '22-35 años',
        pain: 'Quiere adquirir habilidades rentables rápidamente',
        hook: 'Transformación de carrera y certificaciones',
        channels: ['YouTube', 'Instagram', 'TikTok'],
        behavior: 'Consume contenido gratis antes de comprar'
    },
    salud: {
        name: 'Buscador de Bienestar',
        age: '30-55 años',
        pain: 'Desea mejorar salud sin métodos invasivos',
        hook: 'Resultados naturales y testimonios reales',
        channels: ['Instagram', 'YouTube', 'Google'],
        behavior: 'Investiga mucho, valora autoridad'
    },
    inmobiliaria: {
        name: 'Inversor o Comprador de Hogar',
        age: '30-60 años',
        pain: 'Encontrar la propiedad ideal al mejor precio',
        hook: 'Oportunidades exclusivas y asesoría experta',
        channels: ['Google', 'Facebook', 'Instagram'],
        behavior: 'Decisión meditada, necesita confianza'
    }
};

// Ad Copy Framework Templates
const adCopyFrameworks = {
    aida: {
        name: 'AIDA (Attention, Interest, Desire, Action)',
        structure: ['Captar Atención', 'Generar Interés', 'Crear Deseo', 'Llamado a la Acción']
    },
    pas: {
        name: 'PAS (Problem, Agitate, Solution)',
        structure: ['Identificar Problema', 'Agitar Dolor', 'Presentar Solución']
    },
    story: {
        name: 'Storytelling 3 Actos',
        structure: ['Situación Inicial', 'Conflicto/Transformación', 'Resolución']
    }
};