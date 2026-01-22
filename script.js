// Simulate Ecosystem Import
function simulateEcosystemImport() {
    const banner = document.getElementById('syncBanner');
    const importedDataDiv = document.getElementById('importedData');
    
    banner.classList.remove('hidden');
    
    setTimeout(() => {
        // Simular datos importados de MarginMaster y LiquidezForce
        const simulatedMargin = (Math.random() * 30 + 20).toFixed(1);
        const simulatedBudget = (Math.random() * 5000 + 2000).toFixed(0);
        
        document.getElementById('importedMargin').textContent = simulatedMargin + '%';
        document.getElementById('importedBudget').textContent = '$' + simulatedBudget;
        
        banner.classList.add('hidden');
        importedDataDiv.classList.remove('hidden');
        
        showAIInsights();
    }, 2000);
}

// Show AI Insights
function showAIInsights() {
    const insights = [
        {
            icon: '🎯',
            title: 'Nicho Identificado',
            text: 'Tu industria muestra tendencia evergreen con estabilidad de demanda'
        },
        {
            icon: '💡',
            title: 'Recomendación IA',
            text: 'Optimiza para conversión. Tu ticket permite invertir en calidad de leads'
        },
        {
            icon: '📈',
            title: 'Oportunidad Detectada',
            text: 'El mercado está sub-saturado en tu rango de precio. ¡Momento ideal!'
        }
    ];

    const container = document.getElementById('aiInsights');
    container.innerHTML = insights.map(insight => `
        <div class="bg-indigo-950/50 rounded-lg p-4 border border-violet-400/20">
            <div class="flex items-start space-x-3">
                <span class="text-2xl">${insight.icon}</span>
                <div>
                    <h4 class="font-semibold text-violet-400 mb-1">${insight.title}</h4>
                    <p class="text-sm text-gray-300">${insight.text}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Calculate Metrics
function calculateMetrics() {
    const industry = document.getElementById('industry').value;
    const price = parseFloat(document.getElementById('productPrice').value) || 297;
    const budget = parseFloat(document.getElementById('monthlyBudget').value) || 3000;
    const convRate = parseFloat(document.getElementById('conversionRate').value) || 2.5;
    
    const data = industryData[industry];
    const marginText = document.getElementById('importedMargin').textContent;
    const margin = parseFloat(marginText) || 25;
    
    // CPA Máximo Seguro (70% del margen para seguridad)
    const maxCPA = (price * (margin / 100) * 0.7).toFixed(2);
    
    // Leads proyectados basados en CPC de industria
    const estimatedCPC = data.avgCPC;
    const projectedLeads = Math.floor(budget / estimatedCPC);
    
    // Ventas esperadas
    const expectedSales = Math.floor(projectedLeads * (convRate / 100));
    
    // ROI
    const revenue = expectedSales * price;
    const roi = (((revenue - budget) / budget) * 100).toFixed(1);
    
    return {
        maxCPA,
        projectedLeads,
        expectedSales,
        roi,
        revenue,
        budget,
        price,
        margin,
        industry,
        data
    };
}

// Display Metrics
function displayMetrics(metrics) {
    document.getElementById('maxCPA').textContent = '$' + metrics.maxCPA;
    document.getElementById('projectedLeads').textContent = metrics.projectedLeads.toLocaleString();
    document.getElementById('expectedSales').textContent = metrics.expectedSales.toLocaleString();
    document.getElementById('projectedROI').textContent = metrics.roi + '%';
}

// Generate Platform Scores
function generatePlatformScores(price) {
    const ticketLevel = price < 100 ? 'lowTicket' : price < 500 ? 'medTicket' : 'highTicket';
    
    const platforms = [
        { 
            name: 'TikTok', 
            icon: '📱', 
            score: platformScoring.tiktok[ticketLevel], 
            color: 'from-pink-500 to-purple-500',
            strength: platformScoring.tiktok.strength
        },
        { 
            name: 'Instagram', 
            icon: '📸', 
            score: platformScoring.instagram[ticketLevel], 
            color: 'from-purple-500 to-pink-500',
            strength: platformScoring.instagram.strength
        },
        { 
            name: 'Google Ads', 
            icon: '🔍', 
            score: platformScoring.google[ticketLevel], 
            color: 'from-blue-500 to-green-500',
            strength: platformScoring.google.strength
        },
        { 
            name: 'LinkedIn', 
            icon: '💼', 
            score: platformScoring.linkedin[ticketLevel], 
            color: 'from-blue-600 to-blue-400',
            strength: platformScoring.linkedin.strength
        }
    ].sort((a, b) => b.score - a.score);

    const container = document.getElementById('platformScores');
    container.innerHTML = platforms.map(platform => `
        <div class="platform-score bg-indigo-950/50 rounded-lg p-4 border border-violet-400/20">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">${platform.icon}</span>
                    <span class="font-semibold">${platform.name}</span>
                </div>
                <span class="text-2xl font-bold text-violet-400">${platform.score}</span>
            </div>
            <div class="w-full bg-indigo-900 rounded-full h-2 mb-2">
                <div class="bg-gradient-to-r ${platform.color} h-2 rounded-full transition-all duration-1000" style="width: ${platform.score}%"></div>
            </div>
            <p class="text-xs text-gray-400 mb-1">
                ${platform.score > 85 ? '🔥 Altamente Recomendado' : platform.score > 70 ? '✅ Buena Opción' : '⚠️ Considerar Alternativas'}
            </p>
            <p class="text-xs text-gray-500">${platform.strength}</p>
        </div>
    `).join('');
}

// Create Funnel Chart
function createFunnelChart(metrics) {
    const ctx = document.getElementById('funnelChart');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Impresiones', 'Clicks', 'Leads', 'Ventas'],
            datasets: [{
                label: 'Cantidad',
                data: [
                    metrics.projectedLeads * 50,
                    metrics.projectedLeads,
                    metrics.projectedLeads * (metrics.data.avgConversion / 100),
                    metrics.expectedSales
                ],
                backgroundColor: [
                    'rgba(167, 139, 250, 0.8)',
                    'rgba(34, 211, 238, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(234, 179, 8, 0.8)'
                ],
                borderColor: [
                    'rgba(167, 139, 250, 1)',
                    'rgba(34, 211, 238, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(234, 179, 8, 1)'
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
                    backgroundColor: 'rgba(30, 27, 75, 0.9)',
                    titleColor: '#a78bfa',
                    bodyColor: '#fff',
                    borderColor: '#a78bfa',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(167, 139, 250, 0.1)' },
                    ticks: { color: '#9ca3af' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

// Create LTV Chart
function createLTVChart(metrics) {
    const ctx = document.getElementById('ltvChart');
    const ltvMultiplier = metrics.data.avgLTV;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mes 1', 'Mes 3', 'Mes 6', 'Mes 12'],
            datasets: [{
                label: 'Revenue Acumulado',
                data: [
                    metrics.revenue,
                    metrics.revenue * 1.5,
                    metrics.revenue * (1 + ltvMultiplier * 0.5),
                    metrics.revenue * ltvMultiplier
                ],
                borderColor: 'rgba(167, 139, 250, 1)',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3
            }, {
                label: 'Inversión',
                data: [metrics.budget, metrics.budget, metrics.budget, metrics.budget],
                borderColor: 'rgba(239, 68, 68, 1)',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#9ca3af' }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 27, 75, 0.9)',
                    titleColor: '#a78bfa',
                    bodyColor: '#fff',
                    borderColor: '#a78bfa',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(167, 139, 250, 0.1)' },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

// Generate Buyer Persona
function generateBuyerPersona(industry) {
    const persona = personaTemplates[industry];
    const container = document.getElementById('buyerPersona');
    
    container.innerHTML = `
        <div class="bg-indigo-950/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-cyan-400 mb-4">🎭 Perfil</h3>
            <p class="text-xl font-bold mb-2">${persona.name}</p>
            <p class="text-sm text-gray-400 mb-3">${persona.age}</p>
            <p class="text-xs text-gray-500">${persona.behavior}</p>
        </div>
        <div class="bg-indigo-950/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-cyan-400 mb-4">💔 Dolor Principal</h3>
            <p class="text-gray-300 mb-4">${persona.pain}</p>
            <div class="mt-4">
                <h4 class="text-sm font-semibold text-violet-400 mb-2">🎣 Gancho Psicológico</h4>
                <p class="text-sm text-gray-300">${persona.hook}</p>
            </div>
        </div>
        <div class="bg-indigo-950/50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-cyan-400 mb-4">🌐 Dream 100</h3>
            <p class="text-sm text-gray-400 mb-3">Dónde se congregan:</p>
            <div class="space-y-2">
                ${persona.channels.map(channel => `
                    <div class="flex items-center space-x-2 text-sm">
                        <div class="w-2 h-2 bg-violet-400 rounded-full"></div>
                        <span>${channel}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Generate Ad Copy
function generateAdCopy(industry, price) {
    const productType = price < 100 ? 'producto accesible' : price < 500 ? 'solución premium' : 'inversión estratégica';
    
    const copies = {
        aida: {
            attention: `🔥 ¿Cansado de [PROBLEMA]? Descubre la solución que [RESULTADO]`,
            interest: `Miles ya están transformando su [ÁREA] con nuestro ${productType}`,
            desire: `Imagina despertar sabiendo que [BENEFICIO EMOCIONAL]`,
            action: `✅ Accede ahora por solo $${price} - Oferta limitada`
        },
        pas: {
            problem: `❌ El 87% de personas en tu situación sufre de [DOLOR ESPECÍFICO]`,
            agitate: `Cada día que pasa, estás perdiendo [COSTO DE OPORTUNIDAD]`,
            solution: `Nuestra solución elimina [PROBLEMA] en solo [TIEMPO]. Garantizado.`
        },
        story: {
            act1: `Hace 6 meses, [CLIENTE IDEAL] estaba exactamente donde tú estás ahora...`,
            act2: `Entonces descubrió [TU SOLUCIÓN] y todo cambió. En 30 días logró [RESULTADO]`,
            act3: `Hoy, vive [VIDA TRANSFORMADA]. ¿Listo para tu historia de éxito? 👉`
        }
    };

    document.getElementById('aidaCopy').querySelector('.space-y-2').innerHTML =         <p><strong class="text-violet-400">A:</strong> ${copies.aida.attention}</p>         <p><strong class="text-violet-400">I:</strong> ${copies.aida.interest}</p>         <p><strong class="text-violet-400">D:</strong> ${copies.aida.desire}</p>         <p><strong class="text-violet-400">A:</strong> ${copies.aida.action}</p>    ;
document.getElementById('pasCopy').querySelector('.space-y-2').innerHTML = `
    <p><strong class="text-cyan-400">P:</strong> ${copies.pas.problem}</p>
    <p><strong class="text-cyan-400">A:</strong> ${copies.pas.agitate}</p>
    <p><strong class="text-cyan-400">S:</strong> ${copies.pas.solution}</p>
`;

document.getElementById('storyCopy').querySelector('.space-y-2').innerHTML = `
    <p><strong class="text-yellow-400">Acto 1:</strong> ${copies.story.act1}</p>
    <p><strong class="text-yellow-400">Acto 2:</strong> ${copies.story.act2}</p>
    <p><strong class="text-yellow-400">Acto 3:</strong> ${copies.story.act3}</p>
`;
}
// Export Strategy
function exportStrategy() {
const metrics = calculateMetrics();
const industry = document.getElementById('industry').value;
const goal = document.getElementById('campaignGoal').value;
const persona = personaTemplates[industry];
const strategyDoc = `
═══════════════════════════════════════════════════════════════
HOJA DE RUTA DE ESCALAMIENTO - LEADTARGET AI
═══════════════════════════════════════════════════════════════
📊 ANÁLISIS DE MERCADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Industria: ${industry.toUpperCase()}
Precio del Producto: $${metrics.price}
Margen Neto: ${metrics.margin}%
Presupuesto Mensual: $${metrics.budget}
🎯 MÉTRICAS CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CPA Máximo Seguro: $${metrics.maxCPA}
Leads Proyectados: ${metrics.projectedLeads}
Ventas Esperadas: ${metrics.expectedSales}
ROI Proyectado: ${metrics.roi}%
Revenue Estimado: $${metrics.revenue.toLocaleString()}

📱 PLATAFORMAS RECOMENDADAS (Orden de Prioridad)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${metrics.price < 100 ? 'TikTok (Score: 95)' : metrics.price < 500 ? 'Instagram (Score: 90)' : 'Google Ads (Score: 95)'}
${metrics.price < 100 ? 'Instagram (Score: 85)' : metrics.price < 500 ? 'Google Ads (Score: 85)' : 'LinkedIn (Score: 98)'}

👤 BUYER PERSONA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Perfil: ${persona.name}
Dolor: ${persona.pain}
Gancho: ${persona.hook}
📈 PROYECCIÓN LTV (12 MESES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mes 1: $${metrics.revenue.toLocaleString()}
Mes 6: $${(metrics.revenue * (1 + metrics.data.avgLTV * 0.5)).toLocaleString()}
Mes 12: $${(metrics.revenue * metrics.data.avgLTV).toLocaleString()}
🚀 PLAN DE ACCIÓN (30 DÍAS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Semana 1: Configuración de campañas en plataforma principal
Semana 2: Testing de creatividades y audiencias (A/B test)
Semana 3: Optimización basada en datos (CPA < $${metrics.maxCPA})
Semana 4: Escalamiento controlado (+20% presupuesto)
⚡ RECOMENDACIONES DE IA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mantén CPA por debajo de $${metrics.maxCPA} para rentabilidad
Foco en ${goal === 'conversion' ? 'conversiones directas' : goal === 'awareness' ? 'alcance masivo' : 'tráfico cualificado'}
Reserva 20% del presupuesto para retargeting
Implementa pixel tracking desde día 1

═══════════════════════════════════════════════════════════════
Generado por LeadTarget AI - ${new Date().toLocaleDateString()}
Datos basados en benchmarks de industria y análisis predictivo
═══════════════════════════════════════════════════════════════
`;
const blob = new Blob([strategyDoc], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `LeadTarget-Strategy-${Date.now()}.txt`;
a.click();
URL.revokeObjectURL(url);
}
// Event Listeners
document.getElementById('analyzeBtn').addEventListener('click', () => {
const metrics = calculateMetrics();
const industry = document.getElementById('industry').value;
const price = parseFloat(document.getElementById('productPrice').value);
displayMetrics(metrics);
generatePlatformScores(price);
createFunnelChart(metrics);
createLTVChart(metrics);
generateBuyerPersona(industry);
generateAdCopy(industry, price);

document.getElementById('resultsSection').classList.remove('hidden');

setTimeout(() => {
    document.getElementById('resultsSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}, 300);
});
document.getElementById('exportBtn').addEventListener('click', exportStrategy);
// Initialize
window.addEventListener('load', () => {
simulateEcosystemImport();
});
