import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface CompetitiveAnalysisData {
  market_position?: string;
  competitive_gaps?: string[];
  competitive_advantages?: string[];
}

interface CompetitiveAnalysisProps {
  data?: CompetitiveAnalysisData;
}

export function CompetitiveAnalysis({ data }: CompetitiveAnalysisProps) {
  if (!data) return null;

  const gaps = data.competitive_gaps || [];
  const advantages = data.competitive_advantages || [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-xl font-bold text-white">Análisis Competitivo</h3>
            <p className="text-sm text-violet-100 mt-0.5">Posición en el mercado vs. competencia</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {data.market_position && (
          <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">Posición actual en el mercado</p>
            <p className="text-sm text-violet-900 font-medium">{data.market_position}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {gaps.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Brechas competitivas ({gaps.length})
              </h4>
              <ul className="space-y-2">
                {gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {advantages.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Ventajas competitivas ({advantages.length})
              </h4>
              <ul className="space-y-2">
                {advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
