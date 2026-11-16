import { CheckCircle, XCircle, AlertTriangle, Info, TrendingUp } from "lucide-react";

interface Layer {
  name: string;
  status: string;
  pass_items?: string[];
  fail_items?: string[];
  details?: string[]; // Mantener compatibilidad con formato antiguo
  // Campos específicos de v5
  score?: number;
  weight?: number;
  checks_passed?: number;
  checks_total?: number;
  improvements_from_v4?: string[];
  key_findings?: string[];
}

interface LayersAnalysisProps {
  layers: Layer[];
}

export function LayersAnalysis({ layers }: LayersAnalysisProps) {
  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PASS":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "FAIL":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PASS":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          badge: "bg-green-100 text-green-800",
        };
      case "FAIL":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          badge: "bg-red-100 text-red-800",
        };
      case "WARNING":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          badge: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Análisis por Capas</h3>
        <p className="text-sm text-gray-600 mt-1">
          Evaluación detallada de cada capa de optimización
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layers.map((layer, index) => {
            const colors = getStatusColor(layer.status);
            const passItems = layer.pass_items || [];
            const failItems = layer.fail_items || [];
            const detailItems = layer.details || []; // Compatibilidad con formato antiguo
            
            return (
              <div
                key={index}
                className={`border ${colors.border} rounded-lg overflow-hidden hover:shadow-md transition-shadow`}
              >
                <div className={`${colors.bg} px-4 py-3 border-b ${colors.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getStatusIcon(layer.status)}
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {layer.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Score de la capa - v5 */}
                      {layer.score !== undefined && (
                        <span className="px-2 py-1 bg-white rounded text-xs font-bold text-gray-900">
                          {layer.score.toFixed(1)}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}
                      >
                        {layer.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Checks passed/total - v5 */}
                  {layer.checks_passed !== undefined && layer.checks_total !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-900">{layer.checks_passed}</span>
                        <span> / </span>
                        <span>{layer.checks_total}</span>
                        <span className="ml-1">verificaciones pasadas</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white space-y-4">
                  {/* Si hay pass_items y fail_items separados (nuevo formato) */}
                  {(passItems.length > 0 || failItems.length > 0) && (
                    <div className="space-y-4">
                      {/* Items que pasan */}
                      {passItems.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h5 className="text-xs font-semibold text-green-700 uppercase">
                              Correcto ({passItems.length})
                            </h5>
                          </div>
                          <ul className="space-y-2 pl-6">
                            {passItems.map((item, itemIndex) => (
                              <li key={`pass-${itemIndex}`} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-600" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Items que fallan */}
                      {failItems.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <h5 className="text-xs font-semibold text-red-700 uppercase">
                              A corregir ({failItems.length})
                            </h5>
                          </div>
                          <ul className="space-y-2 pl-6">
                            {failItems.map((item, itemIndex) => (
                              <li key={`fail-${itemIndex}`} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-600" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formato antiguo: solo details */}
                  {detailItems.length > 0 && passItems.length === 0 && failItems.length === 0 && (
                    <ul className="space-y-2">
                      {detailItems.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm">
                          <span className={`mt-1 block w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text.replace('text-', 'bg-')}`} />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Improvements from v4 - v5 */}
                  {layer.improvements_from_v4 && layer.improvements_from_v4.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <h5 className="text-xs font-semibold text-blue-700 uppercase">
                          Mejoras desde v4 ({layer.improvements_from_v4.length})
                        </h5>
                      </div>
                      <ul className="space-y-2 pl-6">
                        {layer.improvements_from_v4.map((improvement, improvementIndex) => (
                          <li key={`improvement-${improvementIndex}`} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-600" />
                            <span className="text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}