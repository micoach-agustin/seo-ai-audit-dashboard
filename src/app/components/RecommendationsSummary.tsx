import { ClipboardList, Clock, TrendingUp, Star } from "lucide-react";

interface RecommendationsSummaryData {
  critical_fixes?: number;
  high_priority_fixes?: number;
  total_implementation_hours?: number;
  estimated_investment?: string;
  expected_roi?: string;
  primary_focus?: string;
  success_probability?: string;
}

interface RecommendationsSummaryProps {
  data?: RecommendationsSummaryData;
}

export function RecommendationsSummary({ data }: RecommendationsSummaryProps) {
  if (!data) return null;

  const stats = [
    { label: "Fixes Críticos", value: data.critical_fixes ?? "—", icon: ClipboardList, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    { label: "Alta Prioridad", value: data.high_priority_fixes ?? "—", icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Horas estimadas", value: data.total_implementation_hours ?? "—", icon: Clock, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-slate-700 to-slate-900">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-xl font-bold text-white">Resumen de Recomendaciones</h3>
            <p className="text-sm text-slate-300 mt-0.5">Plan de acción e inversión estimada</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`text-center p-4 rounded-xl ${s.bg} border ${s.border}`}>
                <Icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className={`text-xs font-medium ${s.color} mt-1`}>{s.label}</p>
              </div>
            );
          })}
        </div>


        {/* Focus + probability */}
        {(data.primary_focus || data.success_probability) && (
          <div className="space-y-3">
            {data.primary_focus && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">Foco principal</p>
                <p className="text-sm text-blue-900 font-medium">{data.primary_focus}</p>
              </div>
            )}
            {data.success_probability && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Probabilidad de éxito</p>
                  <p className="text-sm text-amber-900 font-bold">{data.success_probability}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
