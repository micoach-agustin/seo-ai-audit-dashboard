import { TrendingUp, Eye, Zap } from "lucide-react";

interface EstimatedImpactProps {
  impact?: {
    traffic_increase?: string;
    ai_search_visibility?: string;
    indexing_speed?: string;
    // Compatibilidad con v1 que usa nombres diferentes
    traffic?: string;
    ai_search?: string;
  };
}

export function EstimatedImpact({ impact }: EstimatedImpactProps) {
  // Si no hay impact, no renderizar nada
  if (!impact) return null;

  // Normalizar los nombres de campos para compatibilidad v1/v2/v3/v5
  const trafficIncrease = impact.traffic_increase || impact.traffic || "No disponible";
  const aiSearchVisibility = impact.ai_search_visibility || impact.ai_search || "No disponible";
  const indexingSpeed = impact.indexing_speed || "No disponible";

  const metrics = [
    {
      label: "Incremento de Tráfico",
      value: trafficIncrease,
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Visibilidad AI Search",
      value: aiSearchVisibility,
      icon: <Eye className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "Velocidad de Indexación",
      value: indexingSpeed,
      icon: <Zap className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
      border: "border-green-200",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Estimated Impact</h3>
        <p className="text-sm text-gray-600 mt-1">
          Impacto estimado después de implementar las correcciones
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`border ${metric.border} ${metric.bg} rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{metric.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    {metric.label}
                  </p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}