// ═══════════════════════════════════════════════════════════════
// LEADTARGET ENGINE - SCRIPT.JS
// War Room Intelligence System - Pentágono Financiero
// ═══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// GLOBAL STATE MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════

const AppState = {
    currentIndustry: null,
    currentPlatform: null,
    currentLocation: 'lima',
    currentBudget: 0,
    currentLeadQuality: 'warm',
    lastCalculation: null,
    savedScenarios: JSON.parse(localStorage.getItem('leadtarget_scenarios')) || [],
    newsData: MARKET_NEWS_PERU || []
};

// ══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('🎯 LeadTarget War Room - Initializing...');
    
    // Load industries
    populateIndustrySelector();
    
    // Load ad platforms
    populateAdPlatformSelector();
    
    // Load news feed
    loadNewsFeed();
    
    // Load growth strategies
    loadGrowthStrategies();
    
    // Load Pentagon tools
    loadPentagonTools();
    
    // Load saved scenarios
    loadSavedScenarios();
    
    // Attach event listeners
    attachEventListeners();
    
    // Update last update time
    updateLastUpdateTime();
    
    console.log('✅ LeadTarget War Room - Ready');
}

// ══════════════════════════════════════════════════════════════════════════
// NEWS PULSE - REAL-TIME FETCHER
// ══════════════════════════════════════════════════════════════════════════

async function loadNewsFeed() {
    const container = document.getElementById('newsContainer');
    
    if (!container) return;
    
    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280;">📡 Cargando noticias del mercado...</div>';
    
    try {
        // Simulate API call (in production, this would fetch from a real endpoint)
        const news = await fetchMarketNews();
        
        if (news && news.length > 0) {
            renderNews(news);
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280;">No hay noticias disponibles</div>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        // Fallback to local data
        renderNews(MARKET_NEWS_PERU);
    }
}

async function fetchMarketNews() {
    // Simulate async API call with delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MARKET_NEWS_PERU);
        }, 800);
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

function openNewsLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

function refreshNews() {
    loadNewsFeed();
    updateLastUpdateTime();
    
    // Visual feedback
    const btn = document.getElementById('refreshNewsBtn');
    if (btn) {
        btn.textContent = '🔄 Actualizando...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = '🔄 Actualizar';
            btn.disabled = false;
        }, 1000);
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
    
    // Show relevant platforms for this industry
    updatePlatformRecommendations(industryKey);
}

function onPlatformChange(platformKey) {
    AppState.currentPlatform = platformKey;
    
    // Show platform details
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
    saturationEl.style.color = platform.saturationLevel === 'HIGH' ? '#ef4444' : 
                                platform.saturationLevel === 'MEDIUM' ? '#f59e0b' : '#10b981';
}

function updatePlatformRecommendations(industryKey) {
    const industry = INDUSTRIES_PERU[industryKey];
    const platformSelect = document.getElementById('platformSelect');
    
    if (!industry || !platformSelect) return;
    
    // Visual feedback for recommended platforms could be added here
    console.log(`Recommended platforms for ${industry.name}:`, industry);
}

// ══════════════════════════════════════════════════════════════════════════
// LEAD QUALITY SLIDER
// ══════════════════════════════════════════════════════════════════════════

function onLeadQualityChange(value) {
    const qualities = ['cold', 'warm', 'hot'];
    const labels = ['COLD (Fríos)', 'WARM (Templados)', 'HOT (Calientes)'];
    const colors = ['#06b6d4', '#f59e0b', '#ef4444'];
    
    AppState.currentLeadQuality = qualities[value - 1];
    
    const label = document.getElementById('leadQualityLabel');
    if (label) {
        label.textContent = labels[value - 1];
        label.style.color = colors[value - 1];
    }
}

// ══════════════════════════════════════════════════════════════════════════
// FUNNEL CALCULATION ENGINE
// ══════════════════════════════════════════════════════════════════════════

function calculateFunnel() {
    // Get inputs
    const industryKey = document.getElementById('industrySelect').value;
    const platformKey = document.getElementById('platformSelect').value;
    const location = document.getElementById('locationSelect').value;
    const budget = parseFloat(document.getElementById('budgetInput').value);
    const leadQualityValue = parseInt(document.getElementById('leadQualityRange').value);
    
    // Validation
    if (!industryKey) {
        showAlert('Por favor selecciona una industria', 'warning');
        return;
    }
    
    if (!platformKey) {
        showAlert('Por favor selecciona una plataforma publicitaria', 'warning');
        return;
    }
    
    if (!budget || budget < 100) {
        showAlert('Por favor ingresa un presupuesto válido (mínimo S/100)', 'warning');
        return;
    }
    
    // Get data
    const industry = INDUSTRIES_PERU[industryKey];
    const platform = AD_PLATFORMS_PERU_2026[platformKey];
    const leadQualityMap = ['cold', 'warm', 'hot'];
    const leadQuality = leadQualityMap[leadQualityValue - 1];
    const benchmarks = COST_PER_LEAD_BENCHMARKS_2026[location][leadQuality];
    
    // Calculate metrics
    const costPerLead = benchmarks.avg;
    const estimatedLeads = Math.floor(budget / costPerLead);
    const conversionRate = industry.conversionRate / 100;
    const projectedSales = Math.floor(estimatedLeads * conversionRate);
    const totalRevenue = projectedSales * industry.avgTicket;
    
    // Calculate funnel stages
    const funnelData = calculateFunnelStages(estimatedLeads, industry);
    
    // Calculate ROAS
    const marginData = getMarginFromMarginAxis();
    const netMargin = marginData ? marginData.netMargin : industry.avgMargin;
    const grossProfit = totalRevenue * (netMargin / 100);
    const netProfit = grossProfit - budget;
    const roas = budget > 0 ? (totalRevenue / budget).toFixed(2) : 0;
    
    // Store calculation
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
        funnelData
    };
    
    // Render results
    renderResults(AppState.lastCalculation);
    
    // Show save button
    document.getElementById('saveScenarioBtn').style.display = 'inline-block';
    
    // Scroll to results
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
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Update metrics
    document.getElementById('estimatedLeads').textContent = calculation.estimatedLeads.toLocaleString('es-PE');
    document.getElementById('costPerLead').textContent = `S/${calculation.costPerLead.toFixed(2)}`;
    document.getElementById('projectedSales').textContent = calculation.projectedSales.toLocaleString('es-PE');
    document.getElementById('totalRevenue').textContent = `S/${calculation.totalRevenue.toLocaleString('es-PE')}`;
    
    // Update ROAS
    document.getElementById('roasValue').textContent = `${calculation.roas}x`;
    document.getElementById('netProfit').textContent = `S/${calculation.netProfit.toLocaleString('es-PE')}`;
    
    // Update ROAS health badge
    updateROASHealthBadge(parseFloat(calculation.roas));
    
    // Render funnel visualization
    renderFunnelVisualization(calculation.funnelData);
    
    // Generate WhatsApp script
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
        bgColor = 'rgba(16, 185, 129, 0.2)';
        textColor = '#10b981';
    } else if (roas >= 2.5) {
        message = '✅ BUENO - Campaña rentable';
        bgColor = 'rgba(34, 211, 238, 0.2)';
        textColor = '#06b6d4';
    } else if (roas >= 1.5) {
        message = '⚠️ REGULAR - Optimización requerida';
        bgColor = 'rgba(245, 158, 11, 0.2)';
        textColor = '#f59e0b';
    } else {
        message = '🚨 CRÍTICO - Revisar estrategia urgente';
        bgColor = 'rgba(239, 68, 68, 0.2)';
        textColor = '#ef4444';
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
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Error copying script:', err);
        showAlert('Error al copiar el script', 'danger');
    });
}

// ══════════════════════════════════════════════════════════════════════════
// MARGINAXIS INTEGRATION
// ══════════════════════════════════════════════════════════════════════════

function getMarginFromMarginAxis() {
    // Try to get margin data from MarginAxis via localStorage
    try {
        const marginAxisData = localStorage.getItem('marginaxis_calculation');
        
        if (marginAxisData) {
            const data = JSON.parse(marginAxisData);
            return {
                netMargin: data.netMargin || data.margin || 0,
                timestamp: data.timestamp
            };
        }
    } catch (error) {
        console.warn('Could not retrieve MarginAxis data:', error);
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
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #f3f4f6; margin: 0;">
                    ${strategy.strategy}
                </h4>
                <span style="font-size: 11px; font-weight: 700; padding: 4px 8px; background: rgba(16, 185, 129, 0.2); color: #10b981; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.3);">
                    ROI: ${strategy.roi}%
                </span>
            </div>
            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 6px;">
                ${strategy.bestFor.join(' · ')}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #6b7280;">
                <span>⏱️ ${strategy.timeToResults}</span>
                <span style="color: ${strategy.difficulty === 'LOW' ? '#10b981' : strategy.difficulty === 'MEDIUM' ? '#f59e0b' : '#ef4444'};">
                    Dificultad: ${strategy.difficulty}
                </span>
            </div>
        </div>
    `).join('');
}

// ══════════════════════════════════════════════════════════════════════════
// PENTAGON TOOLS HUB
// ══════════════════════════════════════════════════════════════════════════

function loadPentagonTools() {
    const container = document.getElementById('pentagonTools');
    
    if (!container) return;
    
    const tools = Object.values(PENTAGON_TOOLS).filter(tool => tool.available);
    
    container.innerHTML = tools.map(tool => `
        <a href="#" class="pentagon-tool" style="--tool-color: ${tool.color}; --tool-color-rgb: ${hexToRgb(tool.color)};" 
           onclick="openPentagonTool('${tool.name.toLowerCase().replace(/\s+/g, '')}'); return false;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 28px;">${tool.icon}</span>
                <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 800; color: ${tool.color}; margin-bottom: 2px;">
                        ${tool.name}
                    </div>
                    <div style="font-size: 11px; color: #9ca3af;">
                        ${tool.description}
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

function openPentagonTool(toolName) {
    showAlert(`Navegando a ${toolName}... 🚀`, 'info');
    
    // In production, this would navigate to actual tool URLs
    setTimeout(() => {
        console.log(`Opening ${toolName}`);
    }, 500);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '220, 38, 38';
}

// ══════════════════════════════════════════════════════════════════════════
// SCENARIO MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════

function saveScenario() {
    if (!AppState.lastCalculation) {
        showAlert('No hay cálculo para guardar', 'warning');
        return;
    }
    
    // Generate unique ID
    const scenarioId = `scenario_${Date.now()}`;
    
    // Create scenario object
    const scenario = {
        id: scenarioId,
        ...AppState.lastCalculation,
        savedAt: new Date().toISOString()
    };
    
    // Add to scenarios array
    AppState.savedScenarios.push(scenario);
    
    // Save to localStorage
    localStorage.setItem('leadtarget_scenarios', JSON.stringify(AppState.savedScenarios));
    
    // Reload scenarios display
    loadSavedScenarios();
    
    // Show feedback
    showAlert('✅ Escenario guardado exitosamente', 'success');
    
    // Hide save button
    document.getElementById('saveScenarioBtn').style.display = 'none';
}

function loadSavedScenarios() {
    const container = document.getElementById('scenariosContainer');
    
    if (!container) return;
    
    if (AppState.savedScenarios.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #6b7280; border: 2px dashed rgba(153, 27, 27, 0.3); border-radius: 12px;">
                <div style="font-size: 48px; margin-bottom: 12px; opacity: 0.5;">📊</div>
                <p style="font-size: 14px; margin: 0;">No hay escenarios guardados aún.<br>Calcula una proyección y guárdala.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = AppState.savedScenarios.map(scenario => `
        <div class="scenario-card" onclick="viewScenario('${scenario.id}')">
            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 16px; font-weight: 800; color: #dc2626; margin: 0 0 4px 0;">
                        ${scenario.industryName}
                    </h4>
                    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                        ${scenario.platformName} · ${scenario.location === 'lima' ? 'Lima' : 'Provincias'}
                    </p>
                </div>
                <button class="scenario-delete-btn" onclick="deleteScenario('${scenario.id}', event)">
                    🗑️ Eliminar
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">
                <div style="padding: 8px; background: rgba(220, 38, 38, 0.1); border-radius: 6px; border: 1px solid rgba(220, 38, 38, 0.2);">
                    <div style="font-size: 10px; color: #6b7280; font-weight: 600; margin-bottom: 2px;">PRESUPUESTO</div>
                    <div style="font-size: 16px; font-weight: 900; color: #dc2626;">S/${scenario.budget.toLocaleString('es-PE')}</div>
                </div>
                <div style="padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <div style="font-size: 10px; color: #6b7280; font-weight: 600; margin-bottom: 2px;">ROAS</div>
                    <div style="font-size: 16px; font-weight: 900; color: #10b981;">${scenario.roas}x</div>
                </div>
            </div>
            
            <div style="font-size: 11px; color: #6b7280; display: flex; justify-content: space-between;">
                <span>📊 ${scenario.estimatedLeads} leads</span>
                <span>💰 ${scenario.projectedSales} ventas</span>
            </div>
        </div>
    `).join('');
}

function viewScenario(scenarioId) {
    const scenario = AppState.savedScenarios.find(s => s.id === scenarioId);
    
    if (!scenario) return;
    
    // Show modal with scenario details
    showScenarioModal(scenario);
}

function deleteScenario(scenarioId, event) {
    event.stopPropagation();
    
    if (!confirm('¿Estás seguro de eliminar este escenario?')) return;
    
    // Remove from array
    AppState.savedScenarios = AppState.savedScenarios.filter(s => s.id !== scenarioId);
    
    // Update localStorage
    localStorage.setItem('leadtarget_scenarios', JSON.stringify(AppState.savedScenarios));
    
    // Reload display
    loadSavedScenarios();
    
    showAlert('Escenario eliminado', 'info');
}

function showScenarioModal(scenario) {
    const modal = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid rgba(153, 27, 27, 0.3);">
                    <div>
                        <h3 style="font-size: 24px; font-weight: 900; color: #dc2626; margin: 0 0 8px 0;">
                            ${scenario.industryName}
                        </h3>
                        <p style="font-size: 14px; color: #9ca3af; margin: 0;">
                            Guardado el ${new Date(scenario.savedAt).toLocaleDateString('es-PE')}
                        </p>
                    </div>
                    <button onclick="closeModal()" class="crimson-btn-sm">✕ Cerrar</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                    <div class="metric-box-crimson">
                        <div style="font-size: 11px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">PRESUPUESTO</div>
                        <div style="font-size: 28px; font-weight: 900; color: #dc2626;">S/${scenario.budget.toLocaleString('es-PE')}</div>
                    </div>
                    <div class="metric-box-crimson">
                        <div style="font-size: 11px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">LEADS ESTIMADOS</div>
                        <div style="font-size: 28px; font-weight: 900; color: #dc2626;">${scenario.estimatedLeads.toLocaleString('es-PE')}</div>
                    </div>
                    <div class="metric-box-crimson">
                        <div style="font-size: 11px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">VENTAS PROYECTADAS</div>
                        <div style="font-size: 28px; font-weight: 900; color: #10b981;">${scenario.projectedSales.toLocaleString('es-PE')}</div>
                    </div>
                    <div class="metric-box-crimson">
                        <div style="font-size: 11px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">INGRESOS TOTALES</div>
                        <div style="font-size: 28px; font-weight: 900; color: #10b981;">S/${scenario.totalRevenue.toLocaleString('es-PE')}</div>
                    </div>
                </div>
                
                <div style="padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; border: 2px solid #10b981; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600;">ROAS PROYECTADO</div>
                            <div style="font-size: 42px; font-weight: 900; color: #10b981;">${scenario.roas}x</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600;">GANANCIA NETA</div>
                            <div style="font-size: 28px; font-weight: 800; color: #10b981;">S/${scenario.netProfit.toLocaleString('es-PE')}</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
                    <div>
                        <strong style="color: #dc2626;">Plataforma:</strong>
                        <span style="color: #9ca3af;">${scenario.platformName}</span>
                    </div>
                    <div>
                        <strong style="color: #dc2626;">Ubicación:</strong>
                        <span style="color: #9ca3af;">${scenario.location === 'lima' ? 'Lima Metropolitana' : 'Provincias'}</span>
                    </div>
                    <div>
                        <strong style="color: #dc2626;">Calidad de Leads:</strong>
                        <span style="color: #9ca3af;">${scenario.leadQuality.toUpperCase()}</span>
                    </div>
                    <div>
                        <strong style="color: #dc2626;">CPL:</strong>
                        <span style="color: #9ca3af;">S/${scenario.costPerLead.toFixed(2)}</span>
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
    // Industry selector
    const industrySelect = document.getElementById('industrySelect');
    if (industrySelect) {
        industrySelect.addEventListener('change', (e) => onIndustryChange(e.target.value));
    }
    
    // Platform selector
    const platformSelect = document.getElementById('platformSelect');
    if (platformSelect) {
        platformSelect.addEventListener('change', (e) => onPlatformChange(e.target.value));
    }
    
    // Lead quality slider
    const leadQualityRange = document.getElementById('leadQualityRange');
    if (leadQualityRange) {
        leadQualityRange.addEventListener('input', (e) => onLeadQualityChange(e.target.value));
    }
    
    // Calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateFunnel);
    }
    
    // Save scenario button
    const saveScenarioBtn = document.getElementById('saveScenarioBtn');
    if (saveScenarioBtn) {
        saveScenarioBtn.addEventListener('click', saveScenario);
    }
    
    // Copy WhatsApp button
    const copyWhatsappBtn = document.getElementById('copyWhatsappBtn');
    if (copyWhatsappBtn) {
        copyWhatsappBtn.addEventListener('click', copyWhatsAppScript);
    }
    
    // Refresh news button
    const refreshNewsBtn = document.getElementById('refreshNewsBtn');
    if (refreshNewsBtn) {
        refreshNewsBtn.addEventListener('click', refreshNews);
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════

function showAlert(message, type = 'info') {
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4'
    };
    
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: linear-gradient(135deg, rgba(23, 23, 23, 0.98), rgba(10, 10, 10, 0.95));
        border: 2px solid ${colors[type] || colors.info};
        border-radius: 12px;
        color: ${colors[type] || colors.info};
        font-weight: 700;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: slideIn 0.3s ease;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ══════════════════════════════════════════════════════════════════════════
// CONSOLE BRANDING
// ══════════════════════════════════════════════════════════════════════════

console.log('%c🎯 LeadTarget War Room', 'font-size: 24px; font-weight: 900; color: #dc2626; text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);');
console.log('%cPentágono Financiero © 2026', 'font-size: 12px; color: #6b7280;');
console.log('%cCentral de Crecimiento + Inteligencia de Mercado', 'font-size: 14px; color: #9ca3af;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #dc2626;');
