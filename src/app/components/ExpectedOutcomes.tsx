import { TrendingUp, Calendar, Rocket } from "lucide-react";

interface OutcomePeriod {
  organic_traffic_increase?: string;
  ranking_improvements?: string;
  technical_score_improvement?: string;
  ai_visibility_improvement?: string;
  lead_generation_increase?: string;
  local_search_visibility?: string;
  rich_results_eligibility?: string;
  market_authority?: string;
  ai_readiness?: string;
  roi_achievement?: string;
  [key: string]: string | undefined;
}

interface ExpectedOutcomesData {
  "3_months"?: OutcomePeriod;
  "6_months"?: OutcomePeriod;
  "12_months"?: OutcomePeriod;
}

interface ExpectedOutcomesProps {
  data?: ExpectedOutcomesData;
}

const periodConfig = [
  { key: "3_months" as const, label: "3 Meses", icon: Calendar, color: "blue", bg: "from-blue-500 to-blue-600" },
  { key: "6_months" as const, label: "6 Meses", icon: TrendingUp, color: "purple", bg: "from-purple-500 to-purple-600" },
  { key: "12_months" as const, label: "12 Meses", icon: Rocket, color: "emerald", bg: "from-emerald-500 to-emerald-600" },
];

const labelMap: Record<string, string> = {
  organic_traffic_increase: "Tráfico orgánico",
  ranking_improvements: "Mejora de posiciones",
  technical_score_improvement: "Score técnico",
  ai_visibility_improvement: "Visibilidad en IA",
  lead_generation_increase: "Generación de leads",
  local_search_visibility: "Visibilidad local",
  rich_results_eligibility: "Rich results",
  market_authority: "Autoridad de mercado",
  ai_readiness: "IA readiness",
  roi_achievement: "ROI estimado",
};

export function ExpectedOutcomes({ data }: ExpectedOutcomesProps) {
  if (!data) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-xl font-bold text-white">Resultados Esperados</h3>
            <p className="text-sm text-blue-100 mt-0.5">Proyección de impacto a 3, 6 y 12 meses</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {periodConfig.map(({ key, label, icon: Icon, bg }) => {
            const period = data[key];
            if (!period) return null;
            const entries = Object.entries(period).filter(([, v]) => v !== undefined);

            return (
              <div key={key} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <div className={`bg-gradient-to-r ${bg} px-4 py-3`}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-white" />
                    <span className="text-base font-bold text-white">{label}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  {entries.map(([field, value]) => (
                    <div key={field}>
                      <p className="text-xs text-gray-500 font-medium">{labelMap[field] || field.replace(/_/g, " ")}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
