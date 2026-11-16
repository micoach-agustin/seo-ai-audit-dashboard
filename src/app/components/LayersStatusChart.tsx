import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo, useId } from "react";

interface Layer {
  name: string;
  status: string;
  pass_items?: string[];
  fail_items?: string[];
  details?: string[];
}

interface LayersStatusChartProps {
  layers: Layer[];
}

export function LayersStatusChart({ layers }: LayersStatusChartProps) {
  const uniqueId = useId();

  const statusCount = useMemo(() => (layers || []).reduce((acc: any, layer) => {
    // Validación defensiva: asegurarse de que status existe
    if (!layer || !layer.status) return acc;
    
    const normalizedStatus = layer.status.toUpperCase();
    acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
    return acc;
  }, {}), [layers]);

  const statusColors: Record<string, string> = {
    PASS: "#10b981",
    FAIL: "#ef4444",
    WARNING: "#f59e0b",
    MEDIUM: "#f59e0b",
  };

  const statusLabels: Record<string, string> = {
    PASS: "Aprobado",
    FAIL: "Fallido",
    WARNING: "Advertencia",
    MEDIUM: "Medio",
  };

  const pieData = useMemo(() => Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    displayName: statusLabels[status] || status,
    value: count as number,
    color: statusColors[status] || "#6b7280",
    percentage: ((count as number / (layers || []).length) * 100).toFixed(1),
  })), [statusCount, layers]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <p className="text-sm font-semibold text-gray-900">{data.displayName}</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: data.color }}>{data.value}</p>
          <p className="text-xs text-gray-500 mt-1">{data.percentage}% de las capas</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    return `${entry.value}`;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600">
        <h3 className="text-xl font-bold text-white">Distribución de Estados</h3>
        <p className="text-sm text-emerald-100 mt-1">
          Estado general de las {(layers || []).length} capas analizadas
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={95}
                  innerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`${uniqueId}-layer-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-4xl font-bold text-gray-900">{(layers || []).length}</p>
              <p className="text-sm text-gray-500 font-medium">Capas</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 w-full">
            {pieData.map((entry, index) => (
              <div
                key={`${uniqueId}-status-card-${index}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:shadow-md transition-shadow"
                style={{ borderColor: entry.color + '30', backgroundColor: entry.color + '05' }}
              >
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }}></div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">{entry.displayName}</p>
                  <p className="text-xl font-bold mt-1" style={{ color: entry.color }}>
                    {entry.value}
                  </p>
                  <p className="text-xs font-semibold text-gray-500">{entry.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}