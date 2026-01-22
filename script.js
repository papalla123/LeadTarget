// Global State
let funnelChart = null;
let ltvChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    console.log("🚀 LeadTarget AI: Sistema Listo");
});

function setupEventListeners() {
    // Botón Principal de Análisis
    document.getElementById('analyzeBtn').addEventListener('click', () => {
        ejecutarAnalisisCompleto();
    });

    // Botón de Sincronización
    document.getElementById('syncBtn').addEventListener('click', () => {
        simulateEcosystemImport();
    });

    // Botón de Exportación
    document.getElementById('exportBtn').addEventListener('click', exportStrategy);
}

function ejecutarAnalisisCompleto() {
    const btn = document.getElementById('analyzeBtn');
    btn.innerHTML = '<span>⏳ Procesando Inteligencia...</span>';
    
    // 1. Obtener Datos
    const industry = document.getElementById('industry').value;
    const budget = parseFloat(document.getElementById('budget').value) || 0;
    const productPrice = parseFloat(document.getElementById('productPrice').value) || 0;

    if (budget <= 0 || productPrice <= 0) {
        alert("Por favor ingresa un presupuesto y precio válidos.");
        btn.innerHTML = '<span>🎯 Analizar Estrategia de Crecimiento</span>';
        return;
    }

    // 2. Mostrar Sección de Resultados (Eliminamos el hidden)
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('hidden');

    // 3. Cálculos de Métricas
    const metrics = calculateMetrics(industry, budget, productPrice);
    
    // 4. Renderizar todo (Instantáneo)
    displayMetrics(metrics);
    generatePlatformScores(productPrice);
    createFunnelChart(metrics);
    createLTVChart(metrics);
    generateBuyerPersona(industry);
    generateAdCopy(industry, productPrice);
    
    // 5. Scroll suave al resultado
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    btn.innerHTML = '<span>🎯 Analizar Estrategia de Crecimiento</span>';
}

function calculateMetrics(industry, budget, price) {
    const bench = industryData[industry] || industryData.ecommerce;
    const clicks = Math.floor(budget / bench.avgCPC);
    const conversions = Math.floor(clicks * (bench.avgConversion / 100));
    const revenue = conversions * price;
    const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;
    const cpa = conversions > 0 ? budget / conversions : budget;

    return { clicks, conversions, revenue, roi, cpa, bench };
}

function displayMetrics(m) {
    document.getElementById('statClicks').textContent = m.clicks.toLocaleString();
    document.getElementById('statConversions').textContent = m.conversions.toLocaleString();
    document.getElementById('statRevenue').textContent = '$' + m.revenue.toLocaleString();
    document.getElementById('statROI').textContent = m.roi.toFixed(1) + '%';
    
    // Actualizar colores según ROI
    const roiEl = document.getElementById('statROI');
    roiEl.className = m.roi > 0 ? 'text-3xl font-bold text-emerald-400' : 'text-3xl font-bold text-rose-500';
}

function createFunnelChart(m) {
    const ctx = document.getElementById('funnelChart').getContext('2d');
    if (funnelChart) funnelChart.destroy();
    
    funnelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Impresiones', 'Clicks', 'Conversiones'],
            datasets: [{
                label: 'Embudo de Ventas',
                data: [m.clicks * 50, m.clicks, m.conversions],
                backgroundColor: ['rgba(167, 139, 250, 0.3)', 'rgba(167, 139, 250, 0.6)', 'rgba(34, 211, 238, 0.9)'],
                borderColor: '#a78bfa',
                borderWidth: 1
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

function createLTVChart(m) {
    const ctx = document.getElementById('ltvChart').getContext('2d');
    if (ltvChart) ltvChart.destroy();
    
    const monthlyRev = m.revenue;
    ltvChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mes 1', 'Mes 3', 'Mes 6', 'Mes 12'],
            datasets: [{
                label: 'Valor Acumulado (LTV)',
                data: [monthlyRev, monthlyRev * 1.5, monthlyRev * 2.2, monthlyRev * m.bench.avgLTV],
                borderColor: '#22d3ee',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(34, 211, 238, 0.1)'
            }]
        },
        options: { responsive: true }
    });
}

function generatePlatformScores(price) {
    const scoresContainer = document.getElementById('platformScores');
    // Lógica: Productos caros -> Google/LinkedIn. Productos baratos/visuales -> TikTok/IG.
    const scores = [
        { name: 'TikTok Ads', score: price < 50 ? 95 : 60, icon: '📱' },
        { name: 'Instagram Ads', score: price < 150 ? 90 : 75, icon: '📸' },
        { name: 'Google Search', score: price > 100 ? 92 : 70, icon: '🔍' },
        { name: 'Facebook Ads', score: 85, icon: '👥' }
    ].sort((a,b) => b.score - a.score);

    scoresContainer.innerHTML = scores.map(p => `
        <div class="bg-indigo-900/30 p-4 rounded-lg border border-violet-400/10">
            <div class="flex justify-between mb-2">
                <span>${p.icon} ${p.name}</span>
                <span class="text-cyan-400 font-bold">${p.score}%</span>
            </div>
            <div class="w-full bg-gray-700 h-2 rounded-full">
                <div class="bg-gradient-to-r from-violet-500 to-cyan-400 h-2 rounded-full" style="width: ${p.score}%"></div>
            </div>
        </div>
    `).join('');
}

function generateBuyerPersona(industry) {
    const persona = buyerPersonas[industry] || buyerPersonas.ecommerce;
    document.getElementById('personaName').textContent = persona.name;
    document.getElementById('personaAge').textContent = persona.age;
    document.getElementById('personaPain').textContent = persona.pain;
    document.getElementById('personaHook').textContent = persona.hook;
}

function generateAdCopy(industry, price) {
    const persona = buyerPersonas[industry] || buyerPersonas.ecommerce;
    // Fórmulas dinámicas
    const copySections = document.querySelectorAll('.bg-indigo-950\\/50.p-4.rounded-lg');
    
    // AIDA
    copySections[0].innerHTML = `
        <p class="text-xs text-violet-400 mb-2 font-mono">FRAMEWORK: AIDA</p>
        <p class="mb-2"><strong>A:</strong> ¿Cansado de ${persona.pain}?</p>
        <p class="mb-2"><strong>I:</strong> Descubre cómo nuestro producto por solo $${price} cambia las reglas.</p>
        <p class="mb-2"><strong>D:</strong> Únete a miles que ya usan el hook de ${persona.hook}.</p>
        <p><strong>A:</strong> Haz clic aquí y empieza hoy.</p>
    `;

    // PAS
    copySections[1].innerHTML = `
        <p class="text-xs text-cyan-400 mb-2 font-mono">FRAMEWORK: PAS</p>
        <p class="mb-2"><strong>P:</strong> El problema es ${persona.pain}.</p>
        <p class="mb-2"><strong>A:</strong> No dejes que pase más tiempo sin solución.</p>
        <p><strong>S:</strong> Conoce la solución definitiva por $${price}.</p>
    `;
}

function simulateEcosystemImport() {
    const btn = document.getElementById('syncBtn');
    btn.textContent = '🔄 Sincronizando...';
    
    setTimeout(() => {
        const margin = 35; // Simulado de MarginMaster
        const budget = 1500; // Simulado de LiquidezForce
        
        document.getElementById('budget').value = budget;
        document.getElementById('importedMargin').textContent = margin + '%';
        document.getElementById('importedBudget').textContent = '$' + budget;
        
        document.getElementById('syncBanner').classList.add('hidden');
        document.getElementById('importedData').classList.remove('hidden');
        btn.textContent = '✅ Sincronizado';
        
        ejecutarAnalisisCompleto();
    }, 1000);
}

function exportStrategy() {
    alert("Generando Hoja de Ruta de Escalamiento... Revisa tus descargas.");
    // Lógica simple de exportación de texto
    const content = `ESTRATEGIA LEADTARGET AI\n\nPresupuesto: $${document.getElementById('budget').value}\nROI Estimado: ${document.getElementById('statROI').textContent}`;
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Estrategia_LeadTarget.txt';
    a.click();
}