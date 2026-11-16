import { useMemo, useId } from "react";

interface PriorityFix {
  category: string;
  items: (string | {
    issue: string;
    solution?: string;
    effort?: string;
    impact_score?: number;
  })[];
}

interface PriorityFixesChartProps {
  fixes?: PriorityFix[];
}

export function PriorityFixesChart({ fixes }: PriorityFixesChartProps) {
  const uniqueId = useId();
  const chartData = useMemo(() => {
    if (!fixes || !Array.isArray(fixes)) return [];
    return fixes.map((fix, index) => ({
      name: fix.category,
      category: fix.category,
      count: (fix.items || []).length,
      id: `${fix.category}-${index}`,
    }));
  }, [fixes]);

  const categoryColors: Record<string, string> = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#f59e0b",
    Low: "#3b82f6",
  };

  const categoryLabels: Record<string, string> = {
    Critical: "Crítico",
    High: "Alto",
    Medium: "Medio",
    Low: "Bajo",
  };

  if (!fixes || !Array.isArray(fixes) || fixes.length === 0) return null;

  const totalFixes = fixes.reduce((sum, fix) => sum + (fix.items || []).length, 0);
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden mt-6">
      <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-red-600">
        <h3 className="text-xl font-bold text-white">Distribución de Correcciones</h3>
        <p className="text-sm text-orange-100 mt-1">
          {totalFixes} correcciones totales organizadas por prioridad
        </p>
      </div>

      <div className="p-6">
        {/* CSS horizontal bar chart */}
        <div className="space-y-4">
          {chartData.map((entry, index) => {
            const color = categoryColors[entry.category] ?? "#6b7280";
            const pct = (entry.count / maxCount) * 100;
            return (
              <div key={`${uniqueId}-row-${index}`} className="flex items-center gap-4">
                <div className="w-16 shrink-0 text-right text-sm font-medium text-gray-600">
                  {categoryLabels[entry.category] || entry.category}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: color }}
                  >
                    <span className="text-white text-xs font-bold">{entry.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {fixes.map((fix, idx) => {
            const color = categoryColors[fix.category] || "#6b7280";
            const itemCount = (fix.items || []).length;
            return (
              <div
                key={`${uniqueId}-fix-card-${fix.category}-${idx}`}
                className="relative overflow-hidden rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
                style={{
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                  borderLeft: `4px solid ${color}`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                  <p className="text-3xl font-bold" style={{ color }}>{itemCount}</p>
                </div>
                <p className="text-xs font-semibold text-gray-600">
                  {categoryLabels[fix.category] || fix.category}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
