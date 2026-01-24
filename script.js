// ═══════════════════════════════════════════════════════════════════
// LEADNEXUS AI - CORE ENGINE
// Pack 1: Pentagon Architecture + Funnel Physics + Multi-Channel
// ═══════════════════════════════════════════════════════════════════

let funnelChart = null;
let currentCountry = null;
let forexRates = {};

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
});

// ═══════════════════════════════════════════════════════════════════
// PENTAGON NAVIGATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

function renderPentagonNav() {
    const navContainer = document.getElementById('pentagonNav');
    const footerContainer = document.getElementById('pentagonFooter');
    
    Object.values(window.PENTAGON_LINKS).forEach(link => {
        // Nav Link
        const navLink = document.createElement('a');
        navLink.href = link.url;
        navLink.className = `nav-link ${link.active ? 'active' : ''}`;
        navLink.innerHTML = `${link.icon} ${link.name}`;
        navContainer.appendChild(navLink);
        
        // Footer Card
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
    
    // Update UI
    document.getElementById('countryInfo').classList.remove('hidden');
    document.getElementById('countryCPC').textContent = `${currentCountry.symbol}${currentCountry.cpcEstimated.toFixed(2)}`;
    document.getElementById('countryTax').textContent = `${currentCountry.digitalTax}% ${currentCountry.taxName}`;
    document.getElementById('currencySymbol').textContent = currentCountry.symbol;
    document.getElementById('budgetSymbol').textContent = currentCountry.symbol;
    
    // Recalculate if data exists
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
    
    // Import margin if available
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
    
    // Set benchmark values
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
    
    // Calculate impressions and clicks
    const clicks = Math.floor(budget / cpc);
    const ctr = parseFloat(document.getElementById('ctrSlider').value);
    const impressions = Math.floor(clicks / (ctr / 100));
    
    // Calculate leads
    const leadConv = parseFloat(document.getElementById('leadConvSlider').value);
    const leads = Math.floor(clicks * (leadConv / 100));
    
    // Calculate sales
    const closeRate = parseFloat(document.getElementById('closeRateSlider').value);
    const sales = Math.floor(leads * (closeRate / 100));
    
    // Update displays
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
    
    // Calculate digital tax
    const digitalTax = budget * (currentCountry.digitalTax / 100);
    const totalCost = budget + digitalTax;
    
    // Calculate revenue
    const revenue = sales * price;
    const netRevenue = revenue * (margin / 100);
    
    // Calculate metrics
    const cpa = sales > 0 ? (totalCost / sales) : 0;
    const cac = cpa; // Simplified, can include commissions
    const roas = budget > 0 ? (revenue / budget) : 0;
    const roi = budget > 0 ? ((netRevenue - totalCost) / totalCost * 100) : 0;
    
    // Update UI
    document.getElementById('cpaValue').textContent = `${currentCountry.symbol}${cpa.toFixed(2)}`;
    document.getElementById('cacValue').textContent = `${currentCountry.symbol}${cac.toFixed(2)}`;
    document.getElementById('roasValue').textContent = `${roas.toFixed(2)}x`;
    document.getElementById('roiValue').textContent = `${roi.toFixed(1)}%`;
    
    // Status messages
    updateStatusMessages(cpa, roas, roi, price, margin);
    
    // Export to ecosystem
    window.EcosystemBridge.exportCAC(cac);
    window.EcosystemBridge.exportBurnRate(budget);
    
    // Check cash alert
    checkCashAlert(budget);
    
    // Show results
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // Create visualizations
    createFunnelChart();
    createChannelBreakdown(budget);
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function updateStatusMessages(cpa, roas, roi, price, margin) {
    const maxSafeCPA = price * (margin / 100) * 0.7;
    
    // CPA Status
    if (cpa <= maxSafeCPA) {
        document.getElementById('cpaStatus').innerHTML = '<span class="status-excellent">✓ Dentro del rango seguro</span>';
    } else if (cpa <= maxSafeCPA * 1.2) {
        document.getElementById('cpaStatus').innerHTML = '<span class="status-warning">⚠️ Cerca del límite</span>';
    } else {
        document.getElementById('cpaStatus').innerHTML = '<span class="status-danger">⛔ Muy alto, reduce costos</span>';
    }
    
    // ROAS Status
    if (roas >= 4) {
        document.getElementById('roasStatus').innerHTML = '<span class="status-excellent">🔥 Excelente retorno</span>';
    } else if (roas >= 2) {
        document.getElementById('roasStatus').innerHTML = '<span class="status-good">✓ Buen retorno</span>';
    } else if (roas >= 1) {
        document.getElementById('roasStatus').innerHTML = '<span class="status-warning">⚠️ Margen estrecho</span>';
    } else {
        document.getElementById('roasStatus').innerHTML = '<span class="status-danger">⛔ Perdiendo dinero</span>';
    }
    
    // ROI Status
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
        const allocation = totalBudget * 0.2; // 20% per channel for demo
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
    
    // Update blended ROAS
    const blendedROAS = totalROAS / channelCount;
    document.getElementById('blendedROAS').textContent = blendedROAS.toFixed(2) + 'x';
}

// ═══════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════

function initializeEventListeners() {
    document.getElementById('countrySelect').addEventListener('change', handleCountryChange);
    document.getElementById('productPrice').addEventListener('input', updatePriceInUSD);
    document.getElementById('autoFillBtn').addEventListener('click', autoFillFunnel);
    document.getElementById('calculateBtn').addEventListener('click', calculateROI);
    
    // Funnel sliders
    document.getElementById('ctrSlider').addEventListener('input', updateFunnelMetrics);
    document.getElementById('leadConvSlider').addEventListener('input', updateFunnelMetrics);
    document.getElementById('closeRateSlider').addEventListener('input', updateFunnelMetrics);
    document.getElementById('monthlyBudget').addEventListener('input', updateFunnelMetrics);
    
    // Save & Export
    document.getElementById('saveScenarioBtn').addEventListener('click', saveScenario);
    document.getElementById('exportPDFBtn').addEventListener('click', exportToPDF);
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
    // Check if there's auto-saved data
    const lastCountry = localStorage.getItem('lastCountry');
    if (lastCountry) {
        document.getElementById('countrySelect').value = lastCountry;
        handleCountryChange();
    }
}

function exportToPDF() {
    alert('📄 Función de exportación PDF en Pack 2');
    // Will be implemented in Pack 2
}

// Auto-save country selection
document.getElementById('countrySelect')?.addEventListener('change', (e) => {
    localStorage.setItem('lastCountry', e.target.value);
});