import { useMemo } from "react";

interface ScoreChartsProps {
  seoScore: number;
  aiVisibilityScore: number;
  layers?: Array<{
    name: string;
    status: string;
    pass_items?: string[];
    fail_items?: string[];
    warning_items?: string[];
    details?: string[];
  }>;
  statusDistribution?: {
    PASS?: number;
    WARNING?: number;
    FAIL?: number;
    Pass?: number;
    Warning?: number;
    Fail?: number;
    total_checks?: number;
  };
}

export function ScoreCharts({ seoScore, aiVisibilityScore, layers = [], statusDistribution }: ScoreChartsProps) {
  // Calcular totales de pass vs fail items usando statusDistribution si está disponible
  const statusData = useMemo(() => {
    let totalPass = 0;
    let totalFail = 0;

    // Contar TODOS los items individuales en pass_items y fail_items de todas las capas
    layers.forEach((layer) => {
      const passCount = (layer.pass_items || []).length;
      const failCount = (layer.fail_items || []).length;
      const warningCount = (layer.warning_items || []).length;
      
      totalPass += passCount;
      totalFail += failCount + warningCount;
    });

    // Algunos formatos sólo incluyen el resumen de estados.
    if (totalPass + totalFail === 0 && statusDistribution) {
      totalPass = Number(statusDistribution.PASS ?? statusDistribution.Pass ?? 0);
      totalFail =
        Number(statusDistribution.FAIL ?? statusDistribution.Fail ?? 0) +
        Number(statusDistribution.WARNING ?? statusDistribution.Warning ?? 0);
    }

    return [
      { 
        name: "Estado del Sitio", 
        correcto: totalPass, 
        corregir: totalFail,
        total: totalPass + totalFail 
      }
    ];
  }, [layers, statusDistribution]);

  const barData = useMemo(() => [
    { id: "seo", name: "SEO Score", score: Math.min(10, Math.max(0, Number(seoScore) || 0)), color: "#3b82f6" },
    { id: "ai", name: "AI Visibility", score: Math.min(10, Math.max(0, Number(aiVisibilityScore) || 0)), color: "#9333ea" },
  ], [seoScore, aiVisibilityScore]);

  // Datos para el gráfico circular moderno
  const pieData = useMemo(() => {
    const data = statusData[0];
    if (!data || data.total === 0) return [];
    
    return [
      { id: "correct", name: "Correcto", value: data.correcto, color: "#10b981", percentage: ((data.correcto / data.total) * 100).toFixed(1) },
      { id: "fix", name: "A Corregir", value: data.corregir, color: "#ef4444", percentage: ((data.corregir / data.total) * 100).toFixed(1) }
    ];
  }, [statusData]);
  
  const correctPercentage = pieData.length > 0 ? Number(pieData[0].percentage) : 0;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600">
        <h3 className="text-xl font-bold text-white">Visualización de Puntuaciones</h3>
        <p className="text-sm text-blue-100 mt-1">
          Comparativa visual de los scores principales
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Modern Pie Chart - Correcto vs A Corregir */}
          <div className="flex flex-col items-center">
            <h4 className="text-base font-semibold text-gray-800 mb-6">Balance: Correcto vs A Corregir</h4>
            {statusData[0].total > 0 ? (
              <div className="relative w-full">
                <div
                  className="relative mx-auto h-[240px] w-[240px] rounded-full shadow-inner"
                  role="img"
                  aria-label={`${pieData[0].percentage}% correcto y ${pieData[1].percentage}% a corregir`}
                  style={{
                    background: `conic-gradient(#10b981 0% ${correctPercentage}%, #ffffff ${correctPercentage}% calc(${correctPercentage}% + 0.8%), #ef4444 calc(${correctPercentage}% + 0.8%) 99.2%, #ffffff 99.2% 100%)`,
                  }}
                >
                  <div className="absolute inset-[42px] flex flex-col items-center justify-center rounded-full bg-white shadow-sm">
                    <p className="text-3xl font-bold text-gray-900">{statusData[0].total}</p>
                    <p className="text-xs text-gray-500 font-medium">Total items</p>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  {pieData.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <div className="text-sm">
                        <span className="text-gray-700 font-medium">{entry.name}:</span>
                        <span className="ml-1 font-bold" style={{ color: entry.color }}>
                          {entry.value} <span className="text-gray-500 text-xs">({entry.percentage}%)</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No hay datos de capas disponibles</p>
              </div>
            )}
          </div>

          {/* Modern Bar Chart - Scores */}
          <div className="flex flex-col items-center">
            <h4 className="text-base font-semibold text-gray-800 mb-6">Comparativa de Puntuaciones</h4>
            <div
              className="relative h-[300px] w-full border-b border-l border-gray-300"
              role="img"
              aria-label={`SEO Score: ${barData[0].score.toFixed(1)} de 10. AI Visibility: ${barData[1].score.toFixed(1)} de 10.`}
            >
              {[10, 8, 6, 4, 2, 0].map((tick) => (
                <div
                  key={`score-tick-${tick}`}
                  className="absolute left-0 right-0 border-t border-dashed border-gray-200"
                  style={{ bottom: `${tick * 10}%` }}
                >
                  <span className="absolute -left-7 -top-2 text-[11px] text-gray-400">{tick}</span>
                </div>
              ))}
              <div className="absolute inset-x-8 bottom-0 top-0 flex items-end justify-around gap-10">
                {barData.map((entry) => (
                  <div key={entry.id} className="flex h-full w-24 flex-col justify-end">
                    <div className="relative flex flex-1 items-end justify-center">
                      <div
                        className="group relative w-20 rounded-t-xl shadow-sm transition-opacity hover:opacity-90"
                        style={{ height: `${entry.score * 10}%`, backgroundColor: entry.color }}
                        title={`${entry.name}: ${entry.score.toFixed(1)}/10`}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700">
                          {entry.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 h-8 text-center text-xs font-medium text-gray-600">{entry.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modern Score Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <p className="text-sm text-blue-100 font-semibold mb-2">SEO Score</p>
              <p className="text-5xl font-bold text-white mb-1">{barData[0].score.toFixed(1)}</p>
              <p className="text-xs text-blue-200 font-medium">de 10 puntos</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <p className="text-sm text-purple-100 font-semibold mb-2">AI Visibility Score</p>
              <p className="text-5xl font-bold text-white mb-1">{barData[1].score.toFixed(1)}</p>
              <p className="text-xs text-purple-200 font-medium">de 10 puntos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
