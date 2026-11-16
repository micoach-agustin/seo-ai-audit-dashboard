import { Activity, TrendingUp, BarChart3, Sparkles, MapPin, Image, Code, Search, FileText, Link, Globe, Gauge } from "lucide-react";

interface ScoreBreakdownItem {
  score: number | null;
  max: number;
  status: string;
  components?: string[];
  weight?: number;
  details_count?: {
    pass: number;
    fail: number;
  };
  note?: string;
  details?: string;
}

interface ScoreBreakdownProps {
  breakdown?: {
    [key: string]: number | null | ScoreBreakdownItem;
  };
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  if (!breakdown) {
    return null;
  }

  // Categorías principales con sus componentes
  const mainCategories = [
    { 
      key: "on_page_seo", 
      label: "On-Page SEO", 
      icon: FileText, 
      color: "blue",
      description: "Optimización de metadatos, etiquetas y estructura"
    },
    { 
      key: "technical_seo", 
      label: "Technical SEO", 
      icon: Code, 
      color: "green",
      description: "Rastreo, renderizado y rendimiento técnico"
    },
    { 
      key: "content_seo", 
      label: "Content SEO", 
      icon: BarChart3, 
      color: "purple",
      description: "Estructura de contenido y enlaces internos"
    },
    { 
      key: "local_seo", 
      label: "Local SEO", 
      icon: MapPin, 
      color: "orange",
      description: "Optimización para búsquedas locales"
    },
  ];

  // Sub-categorías detalladas
  const subCategories = [
    { key: "metadata_head", label: "Metadata & Head", icon: FileText, color: "blue" },
    { key: "open_graph_sharing", label: "Open Graph", icon: Globe, color: "sky" },
    { key: "structured_data", label: "Structured Data", icon: Code, color: "indigo" },
    { key: "crawling_indexing", label: "Crawling & Indexing", icon: Search, color: "green" },
    { key: "ai_search", label: "AI Search", icon: Sparkles, color: "purple" },
    { key: "content_structure", label: "Content Structure", icon: BarChart3, color: "violet" },
    { key: "technical_rendering", label: "Technical Rendering", icon: Code, color: "emerald" },
    { key: "internal_linking", label: "Internal Linking", icon: Link, color: "cyan" },
    { key: "analytics_data", label: "Analytics & Data", icon: Activity, color: "blue" },
    { key: "core_web_vitals", label: "Core Web Vitals", icon: Gauge, color: "orange" },
    { key: "hreflang", label: "Hreflang", icon: Globe, color: "teal" },
    { key: "h1_presence", label: "H1 Presence", icon: FileText, color: "blue" },
    { key: "navigation_consistency", label: "Navigation", icon: Link, color: "indigo" },
    { key: "mobile_responsive", label: "Mobile Responsive", icon: Activity, color: "green" },
    { key: "image_seo", label: "Image SEO", icon: Image, color: "pink" },
    { key: "https_protocol", label: "HTTPS Protocol", icon: Code, color: "green" },
  ];

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "bg-gray-200";
    if (score >= 9) return "bg-green-500";
    if (score >= 8) return "bg-green-400";
    if (score >= 7) return "bg-yellow-400";
    if (score >= 6) return "bg-orange-400";
    return "bg-red-400";
  };

  const getScoreTextColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "text-gray-600";
    if (score >= 9) return "text-green-700";
    if (score >= 8) return "text-green-600";
    if (score >= 7) return "text-yellow-700";
    if (score >= 6) return "text-orange-700";
    return "text-red-700";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PASS: { bg: "bg-green-100", text: "text-green-700", label: "PASS" },
      WARNING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "WARNING" },
      FAIL: { bg: "bg-red-100", text: "text-red-700", label: "FAIL" },
      "N/A": { bg: "bg-gray-100", text: "text-gray-600", label: "N/A" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["N/A"];
    return (
      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getItemValue = (key: string): ScoreBreakdownItem | null => {
    const value = breakdown[key];
    
    // Si es un objeto con estructura de ScoreBreakdownItem
    if (value && typeof value === 'object' && 'score' in value) {
      return value as ScoreBreakdownItem;
    }
    
    // Si es solo un número (formato antiguo)
    if (typeof value === 'number') {
      return {
        score: value,
        max: 10,
        status: value >= 7 ? "PASS" : value >= 4 ? "WARNING" : "FAIL"
      };
    }
    
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Desglose de Puntuaciones</h3>
        <p className="text-sm text-gray-600 mt-1">
          Análisis detallado por área de optimización
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Categorías Principales */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Categorías Principales</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainCategories.map((item) => {
              const itemData = getItemValue(item.key);
              if (!itemData || itemData.score === null) {
                // Mostrar N/A para local_seo si tiene nota
                if (itemData && itemData.note) {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 text-gray-400`} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </div>
                        {getStatusBadge("N/A")}
                      </div>
                      <p className="text-xs text-gray-500 italic mt-2">{itemData.note}</p>
                    </div>
                  );
                }
                return null;
              }

              const Icon = item.icon;
              const score = itemData.score;

              return (
                <div
                  key={item.key}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 text-${item.color}-600`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    {getStatusBadge(itemData.status)}
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-3xl font-bold ${getScoreTextColor(score)}`}>
                      {score?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">/ {itemData.max}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className={`h-full ${getScoreColor(score)} transition-all duration-500`}
                      style={{ width: `${score ? (score / itemData.max) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Components list */}
                  {itemData.components && itemData.components.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-medium">Componentes:</span> {itemData.components.length}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sub-categorías Detalladas */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Métricas Detalladas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {subCategories.map((item) => {
              const itemData = getItemValue(item.key);
              if (!itemData || itemData.score === null) return null;

              const Icon = item.icon;
              const score = itemData.score;

              return (
                <div
                  key={item.key}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${item.color}-600`} />
                      <span className="text-xs font-medium text-gray-700">{item.label}</span>
                    </div>
                    {getStatusBadge(itemData.status)}
                  </div>

                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className={`text-2xl font-bold ${getScoreTextColor(score)}`}>
                      {score?.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">/ {itemData.max}</span>
                    {itemData.weight && (
                      <span className="ml-auto text-xs text-gray-400 font-medium">
                        ×{itemData.weight}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-2">
                    <div
                      className={`h-full ${getScoreColor(score)} transition-all duration-500`}
                      style={{ width: `${score ? (score / itemData.max) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Pass/Fail counts */}
                  {itemData.details_count && (
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">{itemData.details_count.pass} pass</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">{itemData.details_count.fail} fail</span>
                      </div>
                    </div>
                  )}
                  {itemData.details && (
                    <p className="mt-2 border-t border-gray-100 pt-2 text-xs leading-5 text-gray-500">
                      {itemData.details}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
