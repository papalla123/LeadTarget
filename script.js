// Global State - Control de Gráficos para evitar errores de duplicidad
let funnelChart = null;
let ltvChart = null;

// Inicialización inmediata
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    console.log("🎯 LeadTarget AI: Motor de Inteligencia Activo");
});

function setupEventListeners() {
    // Botón Principal
    const analyzeBtn = document.getElementById('analyzeBtn');
    if(analyzeBtn) {
        analyzeBtn.addEventListener('click', ejecutarAnalisisCompleto);
    }

    // Botón de Sincronización (Ecosistema)
    const syncBtn = document.getElementById('syncBtn');
    if(syncBtn) {
        syncBtn.addEventListener('click', simulateEcosystemImport);
    }

    // Botón de Exportación
    const exportBtn = document.getElementById('exportBtn');
    if(exportBtn) {
        exportBtn.addEventListener('click', exportStrategy);
    }
}

function ejecutarAnalisisCompleto() {
    // 1. Captura de datos de los inputs
    const industry = document.getElementById('industry').value;
    const budget = parseFloat(document.getElementById('budget').value) || 0;
    const productPrice = parseFloat(document.getElementById('productPrice').value) || 0;

    // Validación rápida
    if (budget <= 0 || productPrice <= 0) {
        alert("⚠️ Por favor, ingresa un presupuesto y precio válidos para calcular la estrategia.");
        return;
    }

    // 2. Mostrar la sección de resultados inmediatamente
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('hidden');

    // 3. Motor de cálculos (Benchmarks de data.js)
    const metrics = calculateMetrics(industry, budget, productPrice);
    
    // 4. Renderizado masivo de componentes
    updateStatsDOM(metrics);
    createFunnelChart(metrics);
    createLTVChart(metrics);
    generatePlatformScores(productPrice);
    renderBuyerPersona(industry);
    renderAdCopies(industry, productPrice);
    
    // 5. Scroll suave al éxito
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateMetrics(industry, budget, price) {
    const bench = industryData[industry] || industryData.ecommerce;
    const clicks = Math.floor(budget / bench.avgCPC);
    const conversions = Math.floor(clicks * (bench.avgConversion / 100));
    const revenue = conversions * price;
    const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;
    const cpa = conversions > 0 ? budget / conversions : 0;

    return { clicks, conversions, revenue, roi, cpa, bench };
}

function updateStatsDOM(m) {
    document.getElementById('statClicks').textContent = m.clicks.toLocaleString();
    document.getElementById('statConversions').textContent = m.conversions.toLocaleString();
    document.getElementById('statRevenue').textContent = '$' + m.revenue.toLocaleString();
    
    const roiEl = document.getElementById('statROI');
    roiEl.textContent = m.roi.toFixed(1) + '%';
    roiEl.className = m.roi >= 0 ? 'text-3xl font-bold text-emerald-400' : 'text-3xl font-bold text-rose-500';
}

function createFunnelChart(m) {
    const ctx = document.getElementById('funnelChart').getContext('2d');
    if (funnelChart) funnelChart.destroy();
    
    funnelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Alcance', 'Clicks', 'Ventas'],
            datasets: [{
                data: [m.clicks * 40, m.clicks, m.conversions],
                backgroundColor: ['#4c1d95', '#8b5cf6', '#22d3ee'],
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { ticks: { color: '#94a3b8' } } }
        }
    });
}

function createLTVChart(m) {
    const ctx = document.getElementById('ltvChart').getContext('2d');
    if (ltvChart) ltvChart.destroy();
    
    ltvChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mes 1', 'Mes 3', 'Mes 6', 'Mes 12'],
            datasets: [{
                label: 'Crecimiento Proyectado',
                data: [m.revenue, m.revenue * 1.4, m.revenue * 2, m.revenue * m.bench.avgLTV],
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } }
        }
    });
}

function generatePlatformScores(price) {
    const container = document.getElementById('platformScores');
    // Inteligencia: Si el ticket es alto (>100), Google Search es mejor. Si es bajo, TikTok.
    const platforms = [
        { name: 'TikTok Ads', score: price < 50 ? 98 : 65, icon: '📱' },
        { name: 'Instagram Ads', score: price < 150 ? 92 : 70, icon: '📸' },
        { name: 'Google Search', score: price > 100 ? 95 : 60, icon: '🔍' },
        { name: 'Facebook Ads', score: 85, icon: '👥' }
    ].sort((a,b) => b.score - a.score);

    container.innerHTML = platforms.map(p => `
        <div class="bg-indigo-900/40 p-4 rounded-xl border border-violet-400/20">
            <div class="flex justify-between mb-2">
                <span class="text-sm">${p.icon} ${p.name}</span>
                <span class="text-cyan-400 font-bold">${p.score}%</span>
            </div>
            <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-violet-500 to-cyan-400 h-full" style="width: ${p.score}%"></div>
            </div>
        </div>
    `).join('');
}

function renderBuyerPersona(industry) {
    const p = buyerPersonas[industry] || buyerPersonas.ecommerce;
    document.getElementById('personaName').textContent = p.name;
    document.getElementById('personaAge').textContent = p.age;
    document.getElementById('personaPain').textContent = p.pain;
    document.getElementById('personaHook').textContent = p.hook;
}

function renderAdCopies(industry, price) {
    const p = buyerPersonas[industry] || buyerPersonas.ecommerce;
    const containers = document.querySelectorAll('#resultsSection .bg-indigo-950\\/50.p-4');
    
    // Copy AIDA
    if(containers[0]) {
        containers[0].innerHTML = `
            <p class="text-xs text-violet-400 font-mono mb-2">MODELO AIDA</p>
            <p class="text-sm"><strong>A:</strong> ¿Te frustra ${p.pain}?</p>
            <p class="text-sm"><strong>I:</strong> Tenemos la solución por solo $${price}.</p>
            <p class="text-sm"><strong>D:</strong> Imagina lograr ${p.hook}.</p>
            <p class="text-sm font-bold text-cyan-400">A: Compra ahora aquí.</p>
        `;
    }
    // Copy PAS
    if(containers[1]) {
        containers[1].innerHTML = `
            <p class="text-xs text-cyan-400 font-mono mb-2">MODELO PAS</p>
            <p class="text-sm"><strong>P:</strong> El gran problema es ${p.pain}.</p>
            <p class="text-sm"><strong>A:</strong> No resolverlo te aleja de ${p.hook}.</p>
            <p class="text-sm font-bold text-violet-400">S: Adquiérelo hoy por $${price}.</p>
        `;
    }
}

function simulateEcosystemImport() {
    const btn = document.getElementById('syncBtn');
    btn.innerHTML = '🔄 Conectando...';
    
    // Una espera mínima de 0.8s solo para dar sensación de "conexión" real
    setTimeout(() => {
        const simulatedMargin = 38.5;
        const simulatedBudget = 2450;
        
        document.getElementById('budget').value = simulatedBudget;
        document.getElementById('importedMargin').textContent = simulatedMargin + '%';
        document.getElementById('importedBudget').textContent = '$' + simulatedBudget.toLocaleString();
        
        document.getElementById('syncBanner').classList.add('hidden');
        document.getElementById('importedData').classList.remove('hidden');
        btn.innerHTML = '✅ Conectado';
        
        ejecutarAnalisisCompleto();
    }, 800);
}

function exportStrategy() {
    const budget = document.getElementById('budget').value;
    const content = `LEADTARGET AI - ESTRATEGIA DE CRECIMIENTO\n\nPresupuesto: $${budget}\nROI Sugerido: ${document.getElementById('statROI').textContent}\n\nCanal Principal: ${document.querySelector('#platformScores span').innerText}`;
    const blob = new Blob([content], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Estrategia_Global.txt';
    a.click();
}