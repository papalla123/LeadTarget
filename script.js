// ═══════════════════════════════════════════════════════════════
// LEADTARGET PREMIUM ENGINE - SCRIPT.JS
// Intelligence & Growth Strategy System - Pentágono Financiero
// Golden Edition - Perú 2026
// ═══════════════════════════════════════════════════════════════

const AppState = {
    currentIndustry: null,
    currentPlatform: null,
    currentLocation: 'lima',
    currentBudget: 0,
    currentLeadQuality: 'warm',
    lastCalculation: null,
    savedScenarios: JSON.parse(localStorage.getItem('leadtarget_premium_scenarios')) || [],
    newsData: MARKET_NEWS_PERU || [],
    marginMasterData: null
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('%c🎯 LeadTarget Premium', 'font-size: 26px; font-weight: 900; color: #d4af37; text-shadow: 0 0 12px rgba(212, 175, 55, 0.5);');
    console.log('%cPentágono Financiero © 2026', 'font-size: 13px; color: #64748b; font-weight: 700;');
    console.log('%cGolden Intelligence System', 'font-size: 15px; color: #94a3b8; font-weight: 600;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4af37;');
    
    populateIndustrySelector();
    populateAdPlatformSelector();
    loadNewsFeed();
    loadNewsTicker();
    loadGrowthStrategies();
    loadPentagonTools();
    loadSavedScenarios();
    attachEventListeners();
    updateLastUpdateTime();
    loadMarginMasterData();
    
    console.log('✅ Sistema inicializado correctamente');
}

// ══════════════════════════════════════════════════════════════════════════
// NEWS PULSE - DYNAMIC LOADER
// ══════════════════════════════════════════════════════════════════════════

async function loadNewsFeed() {
    const container = document.getElementById('newsContainer');
    
    if (!container) return;
    
    container.innerHTML = '<div style="text-align: center; padding: 24px; color: var(--slate-500); font-weight: 600;">📡 Cargando inteligencia de mercado...</div>';
    
    try {
        const news = await fetchMarketNews();
        
        if (news && news.length > 0) {
            renderNews(news);
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 24px; color: var(--slate-500); font-weight: 600;">No hay noticias disponibles</div>';
        }
    } catch (error) {
        console.error('Error cargando noticias:', error);
        renderNews(MARKET_NEWS_PERU);
    }
}

async function fetchMarketNews() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sortedNews = [...MARKET_NEWS_PERU].sort((a, b) => {
                const priorityOrder = { POSITIVE: 1, NEUTRAL: 2, NEGATIVE: 3 };
                return priorityOrder[a.impact] - priorityOrder[b.impact];
            });
            resolve(sortedNews);
        }, 600);
    });
}

function renderNews(newsArray) {
    const container = document.getElementById('newsContainer');
    
    if (!container) return;
    
    container.innerHTML = newsArray.map(news => `
        <div class="news-card slide-in" onclick="openNewsLink('${news.url}')">
            <div class="news-category">${news.category.replace(/_/g, ' ')}</div>
            <h4 class="news-title">${news.title}</h4>
            <p class="news-summary">${news.summary}</p>
            <div class="news-meta">
                <div class="news-source">
                    <span>📰</span>
                    <strong>${news.source}</strong>
                </div>
                <div class="news-impact-${news.impact.toLowerCase()}">
                    ${news.impact === 'POSITIVE' ? '📈' : news.impact === 'NEGATIVE' ? '📉' : '➖'}
                    ${news.impact}
                </div>
            </div>
        </div>
    `).join('');
}

function loadNewsTicker() {
    const ticker = document.getElementById('newsTicker');
    
    if (!ticker) return;
    
    const tickerContent = MARKET_NEWS_PERU.map(news => 
        `<span style="margin-right: 40px; display: inline-flex; align-items: center; gap: 8px;">
            <span style="color: var(--gold-primary); font-weight: 700;">${news.source}:</span>
            <span>${news.title}</span>
        </span>`
    ).join('');
    
    ticker.innerHTML = `<div style="display: inline-block; animation: scroll-ticker 60s linear infinite;">${tickerContent} ${tickerContent}</div>`;
}

function openNewsLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

function refreshNews() {
    loadNewsFeed();
    loadNewsTicker();
    updateLastUpdateTime();
    
    const btn = document.getElementById('refreshNewsBtn');
    if (btn) {
        btn.textContent = '🔄 Actualizando...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = '🔄 Actualizar';
            btn.disabled = false;
        }, 800);
    }
}

function updateLastUpdateTime() {
    const element = document.getElementById('lastUpdate');
    if (element) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        element.textContent = `${hours}:${minutes}`;
    }
}

// ══════════════════════════════════════════════════════════════════════════
// INDUSTRY & PLATFORM SELECTORS
// ══════════════════════════════════════════════════════════════════════════

function populateIndustrySelector() {
    const select = document.getElementById('industrySelect');
    
    if (!select) return;
    
    Object.keys(INDUSTRIES_PERU).forEach(key => {
        const industry = INDUSTRIES_PERU[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = industry.name;
        select.appendChild(option);
    });
}

function populateAdPlatformSelector() {
    const select = document.getElementById('platformSelect');
    
    if (!select) return;
    
    Object.keys(AD_PLATFORMS_PERU_2026).forEach(key => {
        const platform = AD_PLATFORMS_PERU_2026[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${platform.name} (CPM: $${platform.cpmLima})`;
        select.appendChild(option);
    });
}

function onIndustryChange(industryKey) {
    AppState.currentIndustry = industryKey;
}

function onPlatformChange(platformKey) {
    AppState.currentPlatform = platformKey;
    showPlatformInfo(platformKey);
}

function showPlatformInfo(platformKey) {
    const platform = AD_PLATFORMS_PERU_2026[platformKey];
    const infoDiv = document.getElementById('platformInfo');
    
    if (!platform || !infoDiv) return;
    
    infoDiv.style.display = 'block';
    
    document.getElementById('platformCPMLima').textContent = `$${platform.cpmLima}`;
    document.getElementById('platformCPCLima').textContent = `$${platform.cpcLima}`;
    document.getElementById('platformMinBudget').textContent = `S/${platform.minBudget}`;
    
    const saturationEl = document.getElementById('platformSaturation');
    saturationEl.textContent = platform.saturationLevel;
    saturationEl.style.color = platform.saturationLevel === 'HIGH' ? 'var(--danger-red)' : 
                                platform.saturationLevel === 'MEDIUM' ? 'var(--warning-amber)' : 'var(--success-green)';
}

// ══════════════════════════════════════════════════════════════════════════
// LEAD QUALITY SLIDER
// ══════════════════════════════════════════════════════════════════════════

function onLeadQualityChange(value) {
    const qualities = ['cold', 'warm', 'hot'];
    const labels = ['COLD', 'WARM', 'HOT'];
    const colors = ['var(--info-cyan)', 'var(--warning-amber)', 'var(--danger-red)'];
    
    AppState.currentLeadQuality = qualities[value - 1];
    
    const label = document.getElementById('leadQualityLabel');
    if (label) {
        label.textContent = labels[value - 1];
        label.style.color = colors[value - 1];
    }
}

// ══════════════════════════════════════════════════════════════════════════
// FUNNEL CALCULATION ENGINE - OPTIMIZED
// ══════════════════════════════════════════════════════════════════════════

function calculateFunnel() {
    const industryKey = document.getElementById('industrySelect').value;
    const platformKey = document.getElementById('platformSelect').value;
    const location = document.getElementById('locationSelect').value;
    const budget = parseFloat(document.getElementById('budgetInput').value);
    const leadQualityValue = parseInt(document.getElementById('leadQualityRange').value);
    
    if (!industryKey) {
        showPremiumAlert('Por favor selecciona una industria', 'warning');
        return;
    }
    
    if (!platformKey) {
        showPremiumAlert('Por favor selecciona una plataforma publicitaria', 'warning');
        return;
    }
    
    if (!budget || budget < 100) {
        showPremiumAlert('Por favor ingresa un presupuesto válido (mínimo S/100)', 'warning');
        return;
    }
    
    const industry = INDUSTRIES_PERU[industryKey];
    const platform = AD_PLATFORMS_PERU_2026[platformKey];
    const leadQualityMap = ['cold', 'warm', 'hot'];
    const leadQuality = leadQualityMap[leadQualityValue - 1];
    const benchmarks = COST_PER_LEAD_BENCHMARKS_2026[location][leadQuality];
    
    const costPerLead = benchmarks.avg;
    const estimatedLeads = Math.floor(budget / costPerLead);
    const conversionRate = industry.conversionRate / 100;
    const projectedSales = Math.floor(estimatedLeads * conversionRate);
    const totalRevenue = projectedSales * industry.avgTicket;
    
    const funnelData = calculateFunnelStages(estimatedLeads, industry);
    
    const marginData = getMarginFromMarginMaster();
    const netMargin = marginData ? marginData.netMargin : industry.avgMargin;
    const grossProfit = totalRevenue * (netMargin / 100);
    const netProfit = grossProfit - budget;
    const roas = budget > 0 ? (totalRevenue / budget).toFixed(2) : 0;
    
    AppState.lastCalculation = {
        timestamp: Date.now(),
        industry: industryKey,
        industryName: industry.name,
        platform: platformKey,
        platformName: platform.name,
        location,
        budget,
        leadQuality,
        costPerLead,
        estimatedLeads,
        projectedSales,
        totalRevenue,
        roas,
        netProfit,
        netMargin,
        funnelData
    };
    
    renderResults(AppState.lastCalculation);
    
    document.getElementById('saveScenarioBtn').style.display = 'inline-block';
    
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculateFunnelStages(totalLeads, industry) {
    const stages = CONVERSION_FUNNEL_STAGES;
    
    const data = {
        awareness: totalLeads,
        interest: Math.floor(totalLeads * (stages.interest.typical_rate / 100)),
        consideration: 0,
        intent: 0,
        purchase: 0
    };
    
    data.consideration = Math.floor(data.interest * (stages.consideration.typical_rate / 100));
    data.intent = Math.floor(data.consideration * (stages.intent.typical_rate / 100));
    data.purchase = Math.floor(data.intent * (stages.purchase.typical_rate / 100));
    
    return data;
}

function renderResults(calculation) {
    document.getElementById('resultsSection').style.display = 'block';
    
    document.getElementById('estimatedLeads').textContent = calculation.estimatedLeads.toLocaleString('es-PE');
    document.getElementById('costPerLead').textContent = `S/${calculation.costPerLead.toFixed(2)}`;
    document.getElementById('projectedSales').textContent = calculation.projectedSales.toLocaleString('es-PE');
    document.getElementById('totalRevenue').textContent = `S/${calculation.totalRevenue.toLocaleString('es-PE')}`;
    
    document.getElementById('roasValue').textContent = `${calculation.roas}x`;
    document.getElementById('netProfit').textContent = `S/${calculation.netProfit.toLocaleString('es-PE')}`;
    
    updateROASHealthBadge(parseFloat(calculation.roas));
    renderFunnelVisualization(calculation.funnelData);
    generateWhatsAppScript(calculation.industryName);
}

function updateROASHealthBadge(roas) {
    const badge = document.getElementById('roasHealthBadge');
    
    if (!badge) return;
    
    let message = '';
    let bgColor = '';
    let textColor = '';
    
    if (roas >= 4) {
        message = '🔥 EXCELENTE - Campaña altamente rentable';
        bgColor = 'rgba(16, 185, 129, 0.15)';
        textColor = 'var(--success-green)';
    } else if (roas >= 2.5) {
        message = '✅ BUENO - Campaña rentable y saludable';
        bgColor = 'rgba(6, 182, 212, 0.15)';
        textColor = 'var(--info-cyan)';
    } else if (roas >= 1.5) {
        message = '⚠️ REGULAR - Optimización requerida';
        bgColor = 'rgba(245, 158, 11, 0.15)';
        textColor = 'var(--warning-amber)';
    } else {
        message = '🚨 CRÍTICO - Revisar estrategia urgente';
        bgColor = 'rgba(239, 68, 68, 0.15)';
        textColor = 'var(--danger-red)';
    }
    
    badge.style.background = bgColor;
    badge.style.color = textColor;
    badge.textContent = message;
}

function renderFunnelVisualization(funnelData) {
    const container = document.getElementById('funnelVisualization');
    
    if (!container) return;
    
    const stages = [
        { name: 'Awareness (Impresiones)', value: funnelData.awareness, percent: 100 },
        { name: 'Interest (Clicks)', value: funnelData.interest, percent: (funnelData.interest / funnelData.awareness * 100) },
        { name: 'Consideration (Leads)', value: funnelData.consideration, percent: (funnelData.consideration / funnelData.awareness * 100) },
        { name: 'Intent (Calificados)', value: funnelData.intent, percent: (funnelData.intent / funnelData.awareness * 100) },
        { name: 'Purchase (Ventas)', value: funnelData.purchase, percent: (funnelData.purchase / funnelData.awareness * 100) }
    ];
    
    container.innerHTML = stages.map(stage => `
        <div class="funnel-stage" style="--fill-width: ${stage.percent}%;">
            <div class="funnel-stage-content">
                <span class="funnel-stage-name">${stage.name}</span>
                <span class="funnel-stage-value">${stage.value.toLocaleString('es-PE')}</span>
            </div>
        </div>
    `).join('');
}

// ══════════════════════════════════════════════════════════════════════════
// WHATSAPP SCRIPT GENERATOR
// ══════════════════════════════════════════════════════════════════════════

function generateWhatsAppScript(industryName) {
    const industryKey = document.getElementById('industrySelect').value;
    const industry = INDUSTRIES_PERU[industryKey];
    
    if (!industry) return;
    
    const scriptDiv = document.getElementById('whatsappScript');
    
    if (!scriptDiv) return;
    
    scriptDiv.textContent = industry.whatsappScript;
}

function copyWhatsAppScript() {
    const script = document.getElementById('whatsappScript').textContent;
    
    navigator.clipboard.writeText(script).then(() => {
        const btn = document.getElementById('copyWhatsappBtn');
        const originalText = btn.textContent;
        
        btn.textContent = '✅ Script Copiado!';
        btn.style.background = 'linear-gradient(135deg, var(--success-green), #059669)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Error copiando script:', err);
        showPremiumAlert('Error al copiar el script', 'danger');
    });
}

// ══════════════════════════════════════════════════════════════════════════
// PENTAGON BRIDGE - MARGINMASTER INTEGRATION
// ══════════════════════════════════════════════════════════════════════════

function loadMarginMasterData() {
    try {
        const marginData = localStorage.getItem('marginmaster_calculation');
        
        if (marginData) {
            AppState.marginMasterData = JSON.parse(marginData);
            console.log('✅ Datos de MarginMaster Pro cargados:', AppState.marginMasterData);
        }
    } catch (error) {
        console.warn('No se pudo cargar datos de MarginMaster:', error);
    }
}

function getMarginFromMarginMaster() {
    try {
        const marginData = localStorage.getItem('marginmaster_calculation');
        
        if (marginData) {
            const data = JSON.parse(marginData);
            return {
                netMargin: data.netMargin || data.margin || 0,
                timestamp: data.timestamp
            };
        }
    } catch (error) {
        console.warn('No se pudo recuperar margen de MarginMaster:', error);
    }
    
    return null;
}

// ══════════════════════════════════════════════════════════════════════════
// GROWTH STRATEGIES
// ══════════════════════════════════════════════════════════════════════════

function loadGrowthStrategies() {
    const container = document.getElementById('strategiesContainer');
    
    if (!container) return;
    
    container.innerHTML = GROWTH_STRATEGIES_PERU.map(strategy => `
        <div class="strategy-card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <h4 style="font-size: 15px; font-weight: 800; color: var(--slate-100); margin: 0; font-family: 'Outfit', sans-serif;">
                    ${strategy.strategy}
                </h4>
                <span style="font-size: 11px; font-weight: 800; padding: 5px 10px; background: rgba(16, 185, 129, 0.12); color: var(--success-green); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.25); font-family: 'Outfit', sans-serif;">
                    ROI: ${strategy.roi}%
                </span>
            </div>
            <div style="font-size: 12px; color: var(--slate-400); margin-bottom: 8px; font-weight: 500;">
                ${strategy.bestFor.join(' · ')}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--slate-500); font-weight: 600;">
                <span>⏱️ ${strategy.timeToResults}</span>
                <span style="color: ${strategy.difficulty === 'LOW' ? 'var(--success-green)' : strategy.difficulty === 'MEDIUM' ? 'var(--warning-amber)' : 'var(--danger-red)'};">
                    ${strategy.difficulty}
                </span>
            </div>
        </div>
    `).join('');
}

// ══════════════════════════════════════════════════════════════════════════
// PENTAGON TOOLS HUB - WITH REAL LINKS
// ══════════════════════════════════════════════════════════════════════════

function loadPentagonTools() {
    const container = document.getElementById('pentagonTools');
    
    if (!container) return;
    
    const tools = Object.values(PENTAGON_TOOLS).filter(tool => tool.available);
    
    container.innerHTML = tools.map(tool => `
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="pentagon-tool" style="text-decoration: none;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 32px;">${tool.icon}</span>
                <div style="flex: 1;">
                    <div style="font-size: 15px; font-weight: 900; color: ${tool.color}; margin-bottom: 4px; font-family: 'Outfit', sans-serif;">
                        ${tool.name}
                    </div>
                    <div style="font-size: 11px; color: var(--slate-400); font-weight: 600;">
                        ${tool.description}
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

// ══════════════════════════════════════════════════════════════════════════
// SCENARIO MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════

function saveScenario() {
    if (!AppState.lastCalculation) {
        showPremiumAlert('No hay cálculo para guardar', 'warning');
        return;
    }
    
    const scenarioId = `scenario_${Date.now()}`;
    
    const scenario = {
        id: scenarioId,
        ...AppState.lastCalculation,
        savedAt: new Date().toISOString()
    };
    
    AppState.savedScenarios.push(scenario);
    
    localStorage.setItem('leadtarget_premium_scenarios', JSON.stringify(AppState.savedScenarios));
    
    loadSavedScenarios();
    
    showPremiumAlert('✅ Escenario guardado exitosamente', 'success');
    
    document.getElementById('saveScenarioBtn').style.display = 'none';
}

function loadSavedScenarios() {
    const container = document.getElementById('scenariosContainer');
    
    if (!container) return;
    
    if (AppState.savedScenarios.length === 0) {
        container.innerHTML = `
            <div style="padding: 44px; text-align: center; color: var(--slate-500); border: 2px dashed rgba(212, 175, 55, 0.2); border-radius: 14px;">
                <div style="font-size: 52px; margin-bottom: 14px; opacity: 0.4;">📊</div>
                <p style="font-size: 14px; margin: 0; font-weight: 600; line-height: 1.5;">No hay escenarios guardados aún.<br>Calcula una proyección y guárdala para referencia futura.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = AppState.savedScenarios.map(scenario => `
        <div class="scenario-card" onclick="viewScenario('${scenario.id}')">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 14px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 17px; font-weight: 900; color: var(--gold-primary); margin: 0 0 6px 0; font-family: 'Outfit', sans-serif;">
                        ${scenario.industryName}
                    </h4>
                    <p style="font-size: 12px; color: var(--slate-400); margin: 0; font-weight: 600;">
                        ${scenario.platformName} · ${scenario.location === 'lima' ? 'Lima' : 'Provincias'}
                    </p>
                </div>
                <button class="scenario-delete-btn" onclick="deleteScenario('${scenario.id}', event)">
                    🗑️
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;">
                <div style="padding: 10px; background: rgba(212, 175, 55, 0.08); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.15);">
                    <div style="font-size: 10px; color: var(--slate-500); font-weight: 700; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Presupuesto</div>
                    <div style="font-size: 18px; font-weight: 900; color: var(--gold-primary); font-family: 'Outfit', sans-serif;">S/${scenario.budget.toLocaleString('es-PE')}</div>
                </div>
                <div style="padding: 10px; background: rgba(16, 185, 129, 0.08); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.15);">
                    <div style="font-size: 10px; color: var(--slate-500); font-weight: 700; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">ROAS</div>
                    <div style="font-size: 18px; font-weight: 900; color: var(--success-green); font-family: 'Outfit', sans-serif;">${scenario.roas}x</div>
                </div>
            </div>
            
            <div style="font-size: 11px; color: var(--slate-500); display: flex; justify-content: space-between; font-weight: 600;">
                <span>📊 ${scenario.estimatedLeads} leads</span>
                <span>💰 ${scenario.projectedSales} ventas</span>
            </div>
        </div>
    `).join('');
}

function viewScenario(scenarioId) {
    const scenario = AppState.savedScenarios.find(s => s.id === scenarioId);
    
    if (!scenario) return;
    
    showScenarioModal(scenario);
}

function deleteScenario(scenarioId, event) {
    event.stopPropagation();
    
    if (!confirm('¿Estás seguro de eliminar este escenario?')) return;
    
    AppState.savedScenarios = AppState.savedScenarios.filter(s => s.id !== scenarioId);
    
    localStorage.setItem('leadtarget_premium_scenarios', JSON.stringify(AppState.savedScenarios));
    
    loadSavedScenarios();
    
    showPremiumAlert('Escenario eliminado', 'info');
}

function showScenarioModal(scenario) {
    const modal = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 28px; padding-bottom: 18px; border-bottom: 1px solid rgba(212, 175, 55, 0.15);">
                    <div>
                        <h3 style="font-size: 26px; font-weight: 900; color: var(--gold-primary); margin: 0 0 10px 0; font-family: 'Outfit', sans-serif;">
                            ${scenario.industryName}
                        </h3>
                        <p style="font-size: 14px; color: var(--slate-400); margin: 0; font-weight: 600;">
                            Guardado el ${new Date(scenario.savedAt).toLocaleDateString('es-PE')}
                        </p>
                    </div>
                    <button onclick="closeModal()" class="golden-btn-sm">✕ Cerrar</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 28px;">
                    <div class="metric-box-premium">
                        <div style="font-size: 11px; color: var(--slate-500); font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Presupuesto</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--gold-primary); font-family: 'Outfit', sans-serif;">S/${scenario.budget.toLocaleString('es-PE')}</div>
                    </div>
                    <div class="metric-box-premium">
                        <div style="font-size: 11px; color: var(--slate-500); font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Leads Estimados</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--gold-primary); font-family: 'Outfit', sans-serif;">${scenario.estimatedLeads.toLocaleString('es-PE')}</div>
                    </div>
                    <div class="metric-box-premium">
                        <div style="font-size: 11px; color: var(--slate-500); font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Ventas Proyectadas</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--success-green); font-family: 'Outfit', sans-serif;">${scenario.projectedSales.toLocaleString('es-PE')}</div>
                    </div>
                    <div class="metric-box-premium">
                        <div style="font-size: 11px; color: var(--slate-500); font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Ingresos Totales</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--success-green); font-family: 'Outfit', sans-serif;">S/${scenario.totalRevenue.toLocaleString('es-PE')}</div>
                    </div>
                </div>
                
                <div style="padding: 22px; background: rgba(16, 185, 129, 0.08); border-radius: 14px; border: 2px solid var(--success-green); margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 13px; color: var(--slate-400); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">ROAS Proyectado</div>
                            <div style="font-size: 48px; font-weight: 900; color: var(--success-green); font-family: 'Outfit', sans-serif;">${scenario.roas}x</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 13px; color: var(--slate-400); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Ganancia Neta</div>
                            <div style="font-size: 32px; font-weight: 900; color: var(--success-green); font-family: 'Outfit', sans-serif;">S/${scenario.netProfit.toLocaleString('es-PE')}</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; font-size: 14px;">
                    <div>
                        <strong style="color: var(--gold-primary); font-weight: 800;">Plataforma:</strong>
                        <span style="color: var(--slate-300); font-weight: 600;">${scenario.platformName}</span>
                    </div>
                    <div>
                        <strong style="color: var(--gold-primary); font-weight: 800;">Ubicación:</strong>
                        <span style="color: var(--slate-300); font-weight: 600;">${scenario.location === 'lima' ? 'Lima Metropolitana' : 'Provincias'}</span>
                    </div>
                    <div>
                        <strong style="color: var(--gold-primary); font-weight: 800;">Calidad:</strong>
                        <span style="color: var(--slate-300); font-weight: 600;">${scenario.leadQuality.toUpperCase()}</span>
                    </div>
                    <div>
                        <strong style="color: var(--gold-primary); font-weight: 800;">CPL:</strong>
                        <span style="color: var(--slate-300); font-weight: 600;">S/${scenario.costPerLead.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modalContainer').innerHTML = '';
}

// ══════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ══════════════════════════════════════════════════════════════════════════

function attachEventListeners() {
    const industrySelect = document.getElementById('industrySelect');
    if (industrySelect) {
        industrySelect.addEventListener('change', (e) => onIndustryChange(e.target.value));
    }
    
    const platformSelect = document.getElementById('platformSelect');
    if (platformSelect) {
        platformSelect.addEventListener('change', (e) => onPlatformChange(e.target.value));
    }
    
    const leadQualityRange = document.getElementById('leadQualityRange');
    if (leadQualityRange) {
        leadQualityRange.addEventListener('input', (e) => onLeadQualityChange(e.target.value));
    }
    
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateFunnel);
    }
    
    const saveScenarioBtn = document.getElementById('saveScenarioBtn');
    if (saveScenarioBtn) {
        saveScenarioBtn.addEventListener('click', saveScenario);
    }
    
    const copyWhatsappBtn = document.getElementById('copyWhatsappBtn');
    if (copyWhatsappBtn) {
        copyWhatsappBtn.addEventListener('click', copyWhatsAppScript);
    }
    
    const refreshNewsBtn = document.getElementById('refreshNewsBtn');
    if (refreshNewsBtn) {
        refreshNewsBtn.addEventListener('click', refreshNews);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ══════════════════════════════════════════════════════════════════════════
// PREMIUM ALERT SYSTEM
// ══════════════════════════════════════════════════════════════════════════

function showPremiumAlert(message, type = 'info') {
    const colors = {
        success: 'var(--success-green)',
        warning: 'var(--warning-amber)',
        danger: 'var(--danger-red)',
        info: 'var(--gold-primary)'
    };
    
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 18px 28px;
        background: linear-gradient(135deg, rgba(18, 18, 18, 0.98), rgba(10, 10, 10, 0.96));
        border: 2px solid ${colors[type] || colors.info};
        border-radius: 14px;
        color: ${colors[type] || colors.info};
        font-weight: 800;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6), 0 0 30px ${colors[type] || colors.info}33;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(12px);
        font-family: 'Outfit', sans-serif;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3500);
}

const alertStyle = document.createElement('style');
alertStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(alertStyle);

// ══════════════════════════════════════════════════════════════════════════
// RESPONSIVE LAYOUT ADJUSTMENTS
// ══════════════════════════════════════════════════════════════════════════

function adjustLayoutForMobile() {
    const mainGrid = document.getElementById('mainGrid');
    
    if (!mainGrid) return;
    
    if (window.innerWidth < 1024) {
        mainGrid.style.gridTemplateColumns = '1fr';
    } else if (window.innerWidth < 1400) {
        mainGrid.style.gridTemplateColumns = '1fr 420px';
    } else {
        mainGrid.style.gridTemplateColumns = '1fr 520px 380px';
    }
}

window.addEventListener('resize', adjustLayoutForMobile);
adjustLayoutForMobile();
