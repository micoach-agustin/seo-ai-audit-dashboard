import { useState, useMemo } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, Search, Filter, TrendingUp } from "lucide-react";

interface Layer {
  name: string;
  status: string;
  pass_items?: string[];
  fail_items?: string[];
  warning_items?: string[];
  details?: string[]; // Mantener compatibilidad con formato antiguo
  // Campos específicos de v5
  score?: number;
  weight?: number;
  checks_passed?: number;
  checks_total?: number;
  improvements_from_v4?: string[];
  key_findings?: string[];
}

interface LayersAnalysisWithFiltersProps {
  layers: Layer[];
}

export function LayersAnalysisWithFilters({ layers }: LayersAnalysisWithFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const availableStatuses = useMemo(() => {
    const statuses = new Set(
      (layers || [])
        .filter((layer) => layer && layer.status)
        .map((layer) => layer.status.toUpperCase())
    );
    return Array.from(statuses).sort();
  }, [layers]);

  const filteredLayers = useMemo(() => {
    return (layers || []).filter((layer) => {
      const matchesSearch =
        searchTerm === "" ||
        layer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (layer.pass_items || []).some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (layer.fail_items || []).some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (layer.warning_items || []).some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (layer.details || []).some((detail) =>
          detail.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(layer.status.toUpperCase());

      return matchesSearch && matchesStatus;
    });
  }, [layers, searchTerm, selectedStatuses]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatuses([]);
  };

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
          filterBg: "bg-green-100 hover:bg-green-200",
          filterActiveBg: "bg-green-600 text-white",
        };
      case "FAIL":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          badge: "bg-red-100 text-red-800",
          filterBg: "bg-red-100 hover:bg-red-200",
          filterActiveBg: "bg-red-600 text-white",
        };
      case "WARNING":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-800",
          filterBg: "bg-yellow-100 hover:bg-yellow-200",
          filterActiveBg: "bg-yellow-600 text-white",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          badge: "bg-gray-100 text-gray-800",
          filterBg: "bg-gray-100 hover:bg-gray-200",
          filterActiveBg: "bg-gray-600 text-white",
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

      {/* Filters Section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de capa o detalle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
            </div>
            {availableStatuses.map((status) => {
              const colors = getStatusColor(status);
              const isActive = selectedStatuses.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    isActive ? colors.filterActiveBg : `${colors.filterBg} text-gray-700`
                  }`}
                >
                  {status}
                </button>
              );
            })}
            {(searchTerm || selectedStatuses.length > 0) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Mostrando <span className="font-semibold text-gray-900">{filteredLayers.length}</span> de{" "}
              <span className="font-semibold text-gray-900">{(layers || []).length}</span> capas
            </span>
          </div>
        </div>
      </div>

      {/* Layers Grid */}
      <div className="p-6">
        {filteredLayers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No se encontraron capas</p>
            <p className="text-sm text-gray-500 mt-1">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLayers.map((layer, index) => {
              const colors = getStatusColor(layer.status);
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
                          {layer.status}
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

                  <div className="p-4 bg-white space-y-3">
                    {/* Si hay pass_items y fail_items separados (nuevo formato) */}
                    {(layer.pass_items && layer.pass_items.length > 0) || (layer.fail_items && layer.fail_items.length > 0) || (layer.warning_items && layer.warning_items.length > 0) ? (
                      <div className="space-y-3">
                        {/* Items con FAIL - Primero para dar prioridad visual */}
                        {layer.fail_items && layer.fail_items.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-3">
                              <XCircle className="w-5 h-5 text-red-600" />
                              <h5 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                                🔴 A Corregir ({layer.fail_items.length})
                              </h5>
                            </div>
                            <ul className="space-y-2">
                              {layer.fail_items.map((item, itemIndex) => (
                                <li key={`fail-${itemIndex}`} className="flex items-start gap-2 bg-white rounded-md p-2 border border-red-100">
                                  <span className="mt-1.5 block w-2 h-2 rounded-full flex-shrink-0 bg-red-600" />
                                  <span className="text-sm text-gray-800">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Items con WARNING */}
                        {layer.warning_items && layer.warning_items.length > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              <h5 className="text-sm font-bold text-yellow-800 uppercase tracking-wide">
                                🟡 Advertencia ({layer.warning_items.length})
                              </h5>
                            </div>
                            <ul className="space-y-2">
                              {layer.warning_items.map((item, itemIndex) => (
                                <li key={`warning-${itemIndex}`} className="flex items-start gap-2 bg-white rounded-md p-2 border border-yellow-100">
                                  <span className="mt-1.5 block w-2 h-2 rounded-full flex-shrink-0 bg-yellow-600" />
                                  <span className="text-sm text-gray-800">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Items que PASAN */}
                        {layer.pass_items && layer.pass_items.length > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <h5 className="text-sm font-bold text-green-800 uppercase tracking-wide">
                                🟢 Correcto ({layer.pass_items.length})
                              </h5>
                            </div>
                            <ul className="space-y-2">
                              {layer.pass_items.map((item, itemIndex) => (
                                <li key={`pass-${itemIndex}`} className="flex items-start gap-2 bg-white rounded-md p-2 border border-green-100">
                                  <span className="mt-1.5 block w-2 h-2 rounded-full flex-shrink-0 bg-green-600" />
                                  <span className="text-sm text-gray-800">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Formato antiguo: solo details */
                      <ul className="space-y-2">
                        {(layer.details || []).map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-2 text-sm">
                            <span className={`mt-1 block w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text.replace('text-', 'bg-')}`} />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Improvements from v4 - v5 */}
                    {layer.improvements_from_v4 && layer.improvements_from_v4.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h5 className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                              📈 Mejoras desde v4 ({layer.improvements_from_v4.length})
                            </h5>
                          </div>
                          <ul className="space-y-2">
                            {layer.improvements_from_v4.map((improvement, improvementIndex) => (
                              <li key={`improvement-${improvementIndex}`} className="flex items-start gap-2 bg-white rounded-md p-2 border border-blue-100">
                                <span className="mt-1.5 block w-2 h-2 rounded-full flex-shrink-0 bg-blue-600" />
                                <span className="text-sm text-gray-800">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}