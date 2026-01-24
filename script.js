// ═══════════════════════════════════════════════════════════════════
// LEADNEXUS AI - CORE ENGINE PACK 2 FINAL COMPLETO
// Complete Marketing Intelligence Suite
// ═══════════════════════════════════════════════════════════════════

let funnelChart = null;
let currentCountry = null;
let forexRates = {};
let currentMetrics = {};

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

window.addEventListener('load', async () => {
    renderPentagonNav();
    populateCountrySelector();
    checkEcosystemConnections();
    await loadForexRates();
    initializeEventListeners();
    loadSavedData();
    updateInfluencerSymbol();
    updateWhatsAppSymbol();
});

// ═══════════════════════════════════════════════════════════════════
// PENTAGON NAVIGATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

function renderPentagonNav() {
    const navContainer = document.getElementById('pentagonNav');
    const footerContainer = document.getElementById('pentagonFooter');
    
    Object.values(window.PENTAGON_LINKS).forEach(link => {
        const navLink = document.createElement('a');
        navLink.href = link.url;
        navLink.className = `nav-link ${link.active ? 'active' : ''}`;
        navLink.innerHTML = `${link.icon} ${link.name}`;
        navContainer.appendChild(navLink);
        
        const footerCard = document.createElement('a');
        footerCard.href = link.url;
        footerCard.className = 'block p-4 bg-gradient-to-br ' + link.color + ' rounded-lg hover:scale-105 transition-transform';
        footerCard.innerHTML = `
            <div class="text-center">
                <span class="text-3xl">${link.icon}</span>
                <p class="text-xs font-semibold mt-2 text-white">${link.name}</p>
            </div>
        `;
        footerContainer.appendChild(footerCard);
    });
}

// ═══════════════════════════════════════════════════════════════════
// COUNTRY SELECTOR & INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════

function populateCountrySelector() {
    const select = document.getElementById('countrySelect');
    
    Object.entries(window.COUNTRY_DATABASE).forEach(([code, country]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${country.flag} ${country.name}`;
        select.appendChild(option);
    });
}

function handleCountryChange() {
    const code = document.getElementById('countrySelect').value;
    if (!code) {
        document.getElementById('countryInfo').classList.add('hidden');
        currentCountry = null;
        return;
    }
    
    currentCountry = window.COUNTRY_DATABASE[code];
    
    document.getElementById('countryInfo').classList.remove('hidden');
    document.getElementById('countryCPC').textContent = `${currentCountry.symbol}${currentCountry.cpcEstimated.toFixed(2)}`;
    document.getElementById('countryTax').textContent = `${currentCountry.digitalTax}% ${currentCountry.taxName}`;
    document.getElementById('currencySymbol').textContent = currentCountry.symbol;
    document.getElementById('budgetSymbol').textContent = currentCountry.symbol;
    
    updateInfluencerSymbol();
    updateWhatsAppSymbol();
    
    if (!document.getElementById('resultsSection').classList.contains('hidden')) {
        calculateROI();
    }
}

// ═══════════════════════════════════════════════════════════════════
// FOREX INTEGRATION
// ═══════════════════════════════════════════════════════════════════

async function loadForexRates() {
    try {
        await window.FOREX_CONFIG.updateRates();
        forexRates = window.FOREX_CONFIG.rates;
    } catch (e) {
        console.warn('Forex rates not available, using defaults');
    }
}

function convertToUSD(amount, currency) {
    if (!forexRates[currency]) return amount;
    return window.FOREX_CONFIG.convert(amount, currency, 'USD');
}

function updatePriceInUSD() {
    if (!currentCountry) return;
    
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const priceUSD = convertToUSD(price, currentCountry.currency);
    
    if (currentCountry.currency !== 'USD') {
        document.getElementById('priceUSD').classList.remove('hidden');
        document.getElementById('priceUSD').textContent = `≈ $${priceUSD.toFixed(2)} USD`;
    } else {
        document.getElementById('priceUSD').classList.add('hidden');
    }
}

function updateInfluencerSymbol() {
    if (currentCountry) {
        document.getElementById('influencerSymbol').textContent = currentCountry.symbol;
    }
}

function updateWhatsAppSymbol() {
    if (currentCountry) {
        document.getElementById('whatsappSymbol').textContent = currentCountry.symbol;
    }
}

// ═══════════════════════════════════════════════════════════════════
// ECOSYSTEM DATA BRIDGE
// ═══════════════════════════════════════════════════════════════════

function checkEcosystemConnections() {
    const status = window.EcosystemBridge.checkEcosystemHealth();
    const statusContainer = document.getElementById('ecosystemStatus');
    
    const connections = [
        { name: 'SueldoPro', key: 'sueldopro', icon: '💼' },
        { name: 'LiquidezForce', key: 'liquidezforce', icon: '💰' },
        { name: 'MarginAxis', key: 'marginaxis', icon: '📊' }
    ];
    
    statusContainer.innerHTML = connections.map(conn => `
        <div class="flex items-center space-x-1 ${status[conn.key] ? 'text-green-400' : 'text-gray-600'}">
            <span>${conn.icon}</span>
            <span class="text-xs">${conn.name}</span>
            <span>${status[conn.key] ? '✓' : '○'}</span>
        </div>
    `).join('');
    
    const netMargin = localStorage.getItem('NET_MARGIN');
    if (netMargin) {
        document.getElementById('netMargin').value = netMargin;
    }
}

function checkCashAlert(budget) {
    const availableCash = window.EcosystemBridge.importCashData();
    
    if (availableCash > 0 && budget > availableCash) {
        document.getElementById('cashAlert').classList.remove('hidden');
        document.getElementById('cashAlertMsg').textContent = 
            `Tu presupuesto ($${budget.toLocaleString()}) excede tu caja disponible ($${availableCash.toLocaleString()})`;
    } else {
        document.getElementById('cashAlert').classList.add('hidden');
    }
}

// ═══════════════════════════════════════════════════════════════════
// FUNNEL PHYSICS SIMULATOR
// ═══════════════════════════════════════════════════════════════════

function autoFillFunnel() {
    const industry = document.getElementById('industrySelect').value;
    const funnel = window.INDUSTRY_FUNNELS[industry];
    
    if (!funnel) return;
    
    const ctr = ((funnel.clicks / funnel.impressions) * 100).toFixed(1);
    const leadConv = ((funnel.leads / funnel.clicks) * 100).toFixed(0);
    const closeRate = ((funnel.sales / funnel.leads) * 100).toFixed(0);
    
    document.getElementById('ctrSlider').value = ctr;
    document.getElementById('leadConvSlider').value = leadConv;
    document.getElementById('closeRateSlider').value = closeRate;
    
    updateFunnelMetrics();
}

function updateFunnelMetrics() {
    const budget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
    const cpc = currentCountry ? currentCountry.cpcEstimated : 0.50;
    
    const clicks = Math.floor(budget / cpc);
    const ctr = parseFloat(document.getElementById('ctrSlider').value);
    const impressions = Math.floor(clicks / (ctr / 100));
    
    const leadConv = parseFloat(document.getElementById('leadConvSlider').value);
    const leads = Math.floor(clicks * (leadConv / 100));
    
    const closeRate = parseFloat(document.getElementById('closeRateSlider').value);
    const sales = Math.floor(leads * (closeRate / 100));
    
    document.getElementById('ctrDisplay').textContent = ctr + '%';
    document.getElementById('leadConvDisplay').textContent = leadConv + '%';
    document.getElementById('closeRateDisplay').textContent = closeRate + '%';
    
    document.getElementById('impressions').value = impressions.toLocaleString();
    document.getElementById('clicks').value = clicks.toLocaleString();
    document.getElementById('leads').value = leads.toLocaleString();
    document.getElementById('sales').value = sales.toLocaleString();
}

// ═══════════════════════════════════════════════════════════════════
// ROI CALCULATOR ENGINE
// ═══════════════════════════════════════════════════════════════════

function calculateROI() {
    if (!currentCountry) {
        alert('Por favor selecciona un país primero');
        return;
    }
    
    const budget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const margin = parseFloat(document.getElementById('netMargin').value) || 0;
    const sales = parseInt(document.getElementById('sales').value.replace(/,/g, '')) || 0;
    const leads = parseInt(document.getElementById('leads').value.replace(/,/g, '')) || 0;
    
    const digitalTax = budget * (currentCountry.digitalTax / 100);
    const totalCost = budget + digitalTax;
    
    const revenue = sales * price;
    const netRevenue = revenue * (margin / 100);
    
    const cpa = sales > 0 ? (totalCost / sales) : 0;
    const cac = cpa;
    const roas = budget > 0 ? (revenue / budget) : 0;
    const roi = budget > 0 ? ((netRevenue - totalCost) / totalCost * 100) : 0;
    
    currentMetrics = { budget, price, margin, sales, leads, revenue, netRevenue, cpa, cac, roas, roi, totalCost, digitalTax };
    
    document.getElementById('cpaValue').textContent = `${currentCountry.symbol}${cpa.toFixed(2)}`;
    document.getElementById('cacValue').textContent = `${currentCountry.symbol}${cac.toFixed(2)}`;
    document.getElementById('roasValue').textContent = `${roas.toFixed(2)}x`;
    document.getElementById('roiValue').textContent = `${roi.toFixed(1)}%`;
    
    updateStatusMessages(cpa, roas, roi, price, margin);
    
    window.EcosystemBridge.exportCAC(cac);
    window.EcosystemBridge.exportBurnRate(budget);
    
    checkCashAlert(budget);
    
    document.getElementById('resultsSection').classList.remove('hidden');
    
    createFunnelChart();
    createChannelBreakdown(budget);
    createHealthDiagnostic();
    
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function updateStatusMessages(cpa, roas, roi, price, margin) {
    const maxSafeCPA = price * (margin / 100) * 0.7;
    
    if (cpa <= maxSafeCPA) {
        document.getElementById('cpaStatus').innerHTML = '<span class="status-excellent">✓ Dentro del rango seguro</span>';
    } else if (cpa <= maxSafeCPA * 1.2) {
        document.getElementById('cpaStatus').innerHTML = '<span class="status-warning">⚠️ Cerca del límite</span>';
    } else {
        document.getElementById('cpaStatus').innerHTML = '<span class="status-danger">⛔ Muy alto, reduce costos</span>';
    }
    
    if (roas >= 4) {
        document.getElementById('roasStatus').innerHTML = '<span class="status-excellent">🔥 Excelente retorno</span>';
    } else if (roas >= 2) {
        document.getElementById('roasStatus').innerHTML = '<span class="status-good">✓ Buen retorno</span>';
    } else if (roas >= 1) {
        document.getElementById('roasStatus').innerHTML = '<span class="status-warning">⚠️ Margen estrecho</span>';
    } else {
        document.getElementById('roasStatus').innerHTML = '<span class="status-danger">⛔ Perdiendo dinero</span>';
    }
    
    if (roi >= 100) {
        document.getElementById('roiStatus').innerHTML = '<span class="status-excellent">🚀 ¡Escala ahora!</span>';
    } else if (roi >= 50) {
        document.getElementById('roiStatus').innerHTML = '<span class="status-good">✓ Rentable</span>';
    } else if (roi >= 0) {
        document.getElementById('roiStatus').innerHTML = '<span class="status-warning">⚠️ Margen bajo</span>';
    } else {
        document.getElementById('roiStatus').innerHTML = '<span class="status-danger">⛔ Pérdida neta</span>';
    }
}

// ═══════════════════════════════════════════════════════════════════
// CHART VISUALIZATIONS
// ═══════════════════════════════════════════════════════════════════

function createFunnelChart() {
    const ctx = document.getElementById('funnelChart');
    
    if (funnelChart) {
        funnelChart.destroy();
    }
    
    const impressions = parseInt(document.getElementById('impressions').value.replace(/,/g, '')) || 0;
    const clicks = parseInt(document.getElementById('clicks').value.replace(/,/g, '')) || 0;
    const leads = parseInt(document.getElementById('leads').value.replace(/,/g, '')) || 0;
    const sales = parseInt(document.getElementById('sales').value.replace(/,/g, '')) || 0;
    
    funnelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Impresiones', 'Clicks', 'Leads', 'Ventas'],
            datasets: [{
                label: 'Cantidad',
                data: [impressions, clicks, leads, sales],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(217, 70, 239, 0.8)',
                    'rgba(34, 211, 238, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    'rgba(139, 92, 246, 1)',
                    'rgba(217, 70, 239, 1)',
                    'rgba(34, 211, 238, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(2, 6, 23, 0.95)',
                    titleColor: '#8b5cf6',
                    bodyColor: '#fff',
                    borderColor: '#8b5cf6',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(139, 92, 246, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// ═══════════════════════════════════════════════════════════════════
// MULTI-CHANNEL SIMULATOR
// ═══════════════════════════════════════════════════════════════════

function createChannelBreakdown(totalBudget) {
    const container = document.getElementById('channelBreakdown');
    const channels = window.CHANNEL_BENCHMARKS;
    
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    let totalROAS = 0;
    let channelCount = 0;
    
    Object.entries(channels).forEach(([key, channel]) => {
        const allocation = totalBudget * 0.2;
        const estimatedRevenue = allocation * (channel.avgConversion / 100) * parseFloat(document.getElementById('productPrice').value);
        const channelROAS = allocation > 0 ? (estimatedRevenue / allocation) : 0;
        
        totalROAS += channelROAS;
        channelCount++;
        
        html += `
            <div class="channel-card">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl">${channel.icon}</span>
                        <div>
                            <p class="font-semibold">${channel.name}</p>
                            <p class="text-xs text-gray-500">${channel.bestFor.join(', ')}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-violet-400">${channelROAS.toFixed(2)}x</p>
                        <p class="text-xs text-gray-500">ROAS</p>
                    </div>
                </div>
                <div class="w-full bg-obsidian-light rounded-full h-2">
                    <div class="bg-gradient-to-r ${channel.color} h-2 rounded-full" style="width: ${Math.min(channelROAS * 25, 100)}%"></div>
                </div>
                <p class="text-xs text-gray-400 mt-2">${channel.strength}</p>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    const blendedROAS = totalROAS / channelCount;
    document.getElementById('blendedROAS').textContent = blendedROAS.toFixed(2) + 'x';
}

// ═══════════════════════════════════════════════════════════════════
// INFLUENCER ROI CALCULATOR
// ═══════════════════════════════════════════════════════════════════

function calculateInfluencer() {
    const fee = parseFloat(document.getElementById('influencerFee').value) || 0;
    const conversion = parseFloat(document.getElementById('influencerConversion').value) || 0;
    const reach = parseFloat(document.getElementById('influencerReach').value) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const margin = parseFloat(document.getElementById('netMargin').value) || 0;
    
    const estimatedViews = reach * 0.3;
    const estimatedSales = (estimatedViews * conversion) / 100;
    const salesNeeded = Math.ceil(fee / (price * (margin / 100)));
    const cpv = estimatedSales > 0 ? (fee / estimatedSales) : 0;
    const revenue = estimatedSales * price;
    const profit = (revenue * (margin / 100)) - fee;
    const influencerROI = fee > 0 ? ((profit / fee) * 100) : 0;
    
    document.getElementById('influencerSalesNeeded').textContent = salesNeeded;
    document.getElementById('influencerCPV').textContent = `${currentCountry ? currentCountry.symbol : '$'}${cpv.toFixed(2)}`;
    document.getElementById('influencerROI').textContent = `${influencerROI.toFixed(1)}%`;
    
    document.getElementById('influencerResults').classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════
// WHATSAPP GROWTH CALCULATOR
// ═══════════════════════════════════════════════════════════════════

function calculateWhatsApp() {
    const budget = parseFloat(document.getElementById('whatsappBudget').value) || 0;
    const responseRate = parseFloat(document.getElementById('whatsappResponse').value) || 0;
    const cpc = currentCountry ? currentCountry.cpcEstimated : 0.50;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    
    const clicks = Math.floor(budget / (cpc * 1.2));
    const conversations = Math.floor(clicks * (responseRate / 100));
    const costPerConversation = conversations > 0 ? (budget / conversations) : 0;
    const estimatedSales = Math.floor(conversations * 0.15);
    
    document.getElementById('whatsappConversations').textContent = conversations.toLocaleString();
    document.getElementById('whatsappCPC').textContent = `${currentCountry ? currentCountry.symbol : '$'}${costPerConversation.toFixed(2)}`;
    document.getElementById('whatsappSales').textContent = estimatedSales.toLocaleString();
    
    document.getElementById('whatsappResults').classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════
// CMO HEALTH DIAGNOSTIC
// ═══════════════════════════════════════════════════════════════════

function createHealthDiagnostic() {
    const container = document.getElementById('healthDiagnostic');
    const metrics = currentMetrics;
    
    const diagnostics = [
        {
            name: 'Eficiencia de Gasto',
            value: metrics.roas >= 3 ? 'Excelente' : metrics.roas >= 2 ? 'Bueno' : metrics.roas >= 1 ? 'Aceptable' : 'Crítico',
            status: metrics.roas >= 3 ? 'excellent' : metrics.roas >= 2 ? 'good' : metrics.roas >= 1 ? 'warning' : 'danger',
            icon: '💰'
        },
        {
            name: 'Salud del CAC',
            value: metrics.cac <= (metrics.price * 0.3) ? 'Óptimo' : metrics.cac <= (metrics.price * 0.5) ? 'Sostenible' : 'Alto Riesgo',
            status: metrics.cac <= (metrics.price * 0.3) ? 'excellent' : metrics.cac <= (metrics.price * 0.5) ? 'good' : 'danger',
            icon: '🎯'
        },
        {
            name: 'Rentabilidad',
            value: metrics.roi >= 100 ? 'Altamente Rentable' : metrics.roi >= 50 ? 'Rentable' : metrics.roi >= 0 ? 'Margen Bajo' : 'Pérdidas',
            status: metrics.roi >= 100 ? 'excellent' : metrics.roi >= 50 ? 'good' : metrics.roi >= 0 ? 'warning' : 'danger',
            icon: '📈'
        },
        {
            name: 'Escalabilidad',
            value: metrics.roi >= 50 && metrics.roas >= 2.5 ? 'Lista para Escalar' : 'Optimizar Primero',
            status: metrics.roi >= 50 && metrics.roas >= 2.5 ? 'excellent' : 'warning',
            icon: '🚀'
        }
    ];
    
    container.innerHTML = diagnostics.map(diag => `
        <div class="p-4 rounded-lg health-${diag.status}">
            <div class="flex items-center justify-between mb-2">
                <span class="text-2xl">${diag.icon}</span>
                <span class="text-xs font-bold uppercase status-${diag.status}">${diag.value}</span>
            </div>
            <p class="text-sm font-semibold">${diag.name}</p>
        </div>
    `).join('');
}

// ═══════════════════════════════════════════════════════════════════
// SCENARIO MANAGER
// ═══════════════════════════════════════════════════════════════════

function openScenarioManager() {
    document.getElementById('scenarioModal').classList.remove('hidden');
    loadScenarioList();
}

function closeScenarioManager() {
    document.getElementById('scenarioModal').classList.add('hidden');
}

function loadScenarioList() {
    const container = document.getElementById('scenarioList');
    const scenarios = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('scenario_')) {
            const data = JSON.parse(localStorage.getItem(key));
            scenarios.push({ name: key.replace('scenario_', ''), data, key });
        }
    }
    
    if (scenarios.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-8">No hay escenarios guardados</p>';
        return;
    }
    
    container.innerHTML = scenarios.map(scenario => `
        <div class="scenario-card">
            <div class="flex justify-between items-start">
                <div class="flex-1" onclick="loadScenario('${scenario.key}')">
                    <h3 class="font-semibold text-violet-400 mb-1">${scenario.name}</h3>
                    <p class="text-xs text-gray-400">${new Date(scenario.data.timestamp).toLocaleDateString('es-ES')}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        ${window.COUNTRY_DATABASE[scenario.data.country]?.name || 'N/A'} • ${scenario.data.industry} • ${currentCountry?.symbol || '$'}${scenario.data.price}
                    </p>
                </div>
                <button onclick="deleteScenario('${scenario.key}')" class="scenario-delete-btn">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function loadScenario(key) {
    const data = JSON.parse(localStorage.getItem(key));
    
    document.getElementById('countrySelect').value = data.country;
    handleCountryChange();
    
    document.getElementById('industrySelect').value = data.industry;
    document.getElementById('productPrice').value = data.price;
    document.getElementById('monthlyBudget').value = data.budget;
    document.getElementById('netMargin').value = data.margin;
    document.getElementById('ctrSlider').value = data.ctr;
    document.getElementById('leadConvSlider').value = data.leadConv;
    document.getElementById('closeRateSlider').value = data.closeRate;
    
    updateFunnelMetrics();
    closeScenarioManager();
}

function deleteScenario(key) {
    if (confirm('¿Eliminar este escenario?')) {
        localStorage.removeItem(key);
        loadScenarioList();
    }
}

// ═══════════════════════════════════════════════════════════════════
// PDF EXPORT
// ═══════════════════════════════════════════════════════════════════

function exportToPDF() {
    if (!currentMetrics.sales) {
        alert('Primero calcula las métricas');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('LeadNexus AI - Reporte de Campaña', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`País: ${currentCountry.name}`, 20, 35);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 42);
    
    doc.setFontSize(14);
    doc.text('Métricas Principales', 20, 55);
    
    doc.setFontSize(11);
    doc.text(`Presupuesto: ${currentCountry.symbol}${currentMetrics.budget.toLocaleString()}`, 20, 65);
    doc.text(`CAC: ${currentCountry.symbol}${currentMetrics.cac.toFixed(2)}`, 20, 72);
    doc.text(`ROAS: ${currentMetrics.roas.toFixed(2)}x`, 20, 79);
    doc.text(`ROI: ${currentMetrics.roi.toFixed(1)}%`, 20, 86);
    doc.text(`Revenue: ${currentCountry.symbol}${currentMetrics.revenue.toLocaleString()}`, 20, 93);
    
    doc.setFontSize(14);
    doc.text('Embudo de Conversión', 20, 110);
    
    doc.setFontSize(11);
    doc.text(`Impresiones: ${document.getElementById('impressions').value}`, 20, 120);
    doc.text(`Clicks: ${document.getElementById('clicks').value}`, 20, 127);
    doc.text(`Leads: ${document.getElementById('leads').value}`, 20, 134);
    doc.text(`Ventas: ${document.getElementById('sales').value}`, 20, 141);
    
    doc.setFontSize(8);
    doc.text('Generado por LeadNexus AI - Pentagon Financial Ecosystem', 20, 280);
    
    doc.save(`LeadNexus-Report-${Date.now()}.pdf`);
}

// ═══════════════════════════════════════════════════════════<function_calls>
<invoke name="artifacts">
<parameter name="command">update</parameter>
<parameter name="id">leadnexus_script_complete</parameter>
<parameter name="old_str">// ═══════════════════════════════════════════════════════════════════</parameter>
<parameter name="new_str">// ═══════════════════════════════════════════════════════════════════
// TXT EXPORT
// ═══════════════════════════════════════════════════════════════════
function exportToTXT() {
if (!currentMetrics.sales) {
alert('Primero calcula las métricas');
return;
}
const report = `
╔═══════════════════════════════════════════════════════════════════╗
LEADNEXUS AI - REPORTE DE CAMPAÑA PUBLICITARIA
╚═══════════════════════════════════════════════════════════════════╝
📅 INFORMACIÓN GENERAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
País: ${currentCountry.name} ${currentCountry.flag}
Industria: ${document.getElementById('industrySelect').value}
Fecha: ${new Date().toLocaleString('es-ES')}
💰 INVERSIÓN Y COSTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Presupuesto Mensual: currentCountry.symbol{currentCountry.symbol}
currentCountry.symbol{currentMetrics.budget.toLocaleString()}
Impuestos Digitales (currentCountry.digitalTax{currentCountry.digitalTax}%): ${currentCountry.symbol}
currentCountry.digitalTax{currentMetrics.digitalTax.toFixed(2)}
Costo Total: currentCountry.symbol{currentCountry.symbol}
currentCountry.symbol{currentMetrics.totalCost.toLocaleString()}

📊 MÉTRICAS DE RENDIMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CPA (Costo por Adquisición): currentCountry.symbol{currentCountry.symbol}
currentCountry.symbol{currentMetrics.cpa.toFixed(2)}
CAC (Customer Acquisition Cost): currentCountry.symbol{currentCountry.symbol}
currentCountry.symbol{currentMetrics.cac.toFixed(2)}
ROAS (Return on Ad Spend): ${currentMetrics.roas.toFixed(2)}x
ROI Neto: ${currentMetrics.roi.toFixed(1)}%

📉 EMBUDO DE CONVERSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Impresiones: ${document.getElementById('impressions').value}
Clicks: ${document.getElementById('clicks').value}
Leads: ${document.getElementById('leads').value}
Ventas: ${document.getElementById('sales').value}
💵 RESULTADOS FINANCIEROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Revenue Total: currentCountry.symbol{currentCountry.symbol}
currentCountry.symbol{currentMetrics.revenue.toLocaleString()}
Revenue Neto: currentCountry.symbol{currentCountry.symbol}
currentCountry.symbol{currentMetrics.netRevenue.toLocaleString()}
Ganancia/Pérdida: currentCountry.symbol{currentCountry.symbol}
currentCountry.symbol{(currentMetrics.netRevenue - currentMetrics.totalCost).toLocaleString()}

🩺 DIAGNÓSTICO DE SALUD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado General: ${currentMetrics.roi >= 50 ? '✅ SALUDABLE' : currentMetrics.roi >= 0 ? '⚠️ PRECAUCIÓN' : '❌ CRÍTICO'}
Recomendación: ${currentMetrics.roi >= 100 && currentMetrics.roas >= 2.5 ? 'ESCALAR AHORA' : currentMetrics.roi >= 50 ? 'OPTIMIZAR Y ESCALAR' : 'OPTIMIZAR CAMPAÑA'}
╔═══════════════════════════════════════════════════════════════════╗
Generado por LeadNexus AI - Pentagon Financial Ecosystem
© 2026 - Simulación basada en benchmarks de mercado
╚═══════════════════════════════════════════════════════════════════╝
`;
const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `LeadNexus-Report-${Date.now()}.txt`;
a.click();
URL.revokeObjectURL(url);
}
// ═══════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════
function initializeEventListeners() {
document.getElementById('countrySelect').addEventListener('change', handleCountryChange);
document.getElementById('productPrice').addEventListener('input', updatePriceInUSD);
document.getElementById('autoFillBtn').addEventListener('click', autoFillFunnel);
document.getElementById('calculateBtn').addEventListener('click', calculateROI);
document.getElementById('ctrSlider').addEventListener('input', updateFunnelMetrics);
document.getElementById('leadConvSlider').addEventListener('input', updateFunnelMetrics);
document.getElementById('closeRateSlider').addEventListener('input', updateFunnelMetrics);
document.getElementById('monthlyBudget').addEventListener('input', updateFunnelMetrics);

document.getElementById('saveScenarioBtn').addEventListener('click', saveScenario);
document.getElementById('exportPDFBtn').addEventListener('click', exportToPDF);
document.getElementById('exportTXTBtn').addEventListener('click', exportToTXT);

document.getElementById('calculateInfluencerBtn').addEventListener('click', calculateInfluencer);
document.getElementById('calculateWhatsAppBtn').addEventListener('click', calculateWhatsApp);

document.getElementById('scenarioManagerBtn').addEventListener('click', openScenarioManager);
document.getElementById('closeModalBtn').addEventListener('click', closeScenarioManager);

document.getElementById('countrySelect')?.addEventListener('change', (e) => {
    localStorage.setItem('lastCountry', e.target.value);
});
}
// ═══════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════
function saveScenario() {
const scenarioName = prompt('Nombre del escenario:');
if (!scenarioName) return;
const data = {
    country: document.getElementById('countrySelect').value,
    industry: document.getElementById('industrySelect').value,
    price: document.getElementById('productPrice').value,
    budget: document.getElementById('monthlyBudget').value,
    margin: document.getElementById('netMargin').value,
    ctr: document.getElementById('ctrSlider').value,
    leadConv: document.getElementById('leadConvSlider').value,
    closeRate: document.getElementById('closeRateSlider').value,
    timestamp: new Date().toISOString()
};

localStorage.setItem(`scenario_${scenarioName}`, JSON.stringify(data));
alert('✓ Escenario guardado exitosamente');
}
function loadSavedData() {
const lastCountry = localStorage.getItem('lastCountry');
if (lastCountry) {
document.getElementById('countrySelect').value = lastCountry;
handleCountryChange();
}
}</parameter>