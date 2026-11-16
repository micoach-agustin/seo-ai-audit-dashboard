import { Globe, CheckCircle, XCircle, Search, Link } from "lucide-react";

interface URLDiscoveryData {
  method_used?: string;
  sitemap_check_result?: string;
  robots_txt_check_result?: string;
  total_urls_discovered?: number;
  valid_urls_200?: number;
  invalid_urls?: number;
  coverage_percentage?: number;
  discovery_notes?: string;
  discovered_urls?: string[];
  spanish_patterns_applied?: boolean;
}

interface URLDiscoveryProps {
  data?: URLDiscoveryData;
}

export function URLDiscovery({ data }: URLDiscoveryProps) {
  if (!data) return null;

  const urls = data.discovered_urls || [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-xl font-bold text-white">URL Discovery</h3>
            <p className="text-sm text-indigo-100 mt-0.5">Páginas descubiertas y validadas</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-indigo-700">{data.total_urls_discovered ?? "—"}</p>
            <p className="text-xs text-indigo-600 font-medium mt-1">URLs Descubiertas</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{data.valid_urls_200 ?? "—"}</p>
            <p className="text-xs text-green-600 font-medium mt-1">Válidas (200)</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-700">{data.invalid_urls ?? 0}</p>
            <p className="text-xs text-red-600 font-medium mt-1">Inválidas</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{data.coverage_percentage ?? "—"}%</p>
            <p className="text-xs text-blue-600 font-medium mt-1">Cobertura</p>
          </div>
        </div>

        {/* Infrastructure checks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: "Método de descubrimiento",
              value: data.method_used?.replace(/_/g, " ") ?? "—",
              icon: <Search className="w-4 h-4" />,
              color: "blue",
            },
            {
              label: "Sitemap XML",
              value: data.sitemap_check_result === "404_not_found" ? "No encontrado (404)" : data.sitemap_check_result ?? "—",
              icon: data.sitemap_check_result === "404_not_found" ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />,
              color: data.sitemap_check_result === "404_not_found" ? "red" : "green",
            },
            {
              label: "Robots.txt",
              value: data.robots_txt_check_result === "404_not_found" ? "No encontrado (404)" : data.robots_txt_check_result ?? "—",
              icon: data.robots_txt_check_result === "404_not_found" ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />,
              color: data.robots_txt_check_result === "404_not_found" ? "red" : "green",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                <p className="text-sm text-gray-800 font-semibold capitalize">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Discovery note */}
        {data.discovery_notes && (
          <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-4 italic">
            {data.discovery_notes}
          </p>
        )}

        {/* URL list */}
        {urls.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Link className="w-4 h-4 text-indigo-500" />
              URLs descubiertas ({urls.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {urls.map((url, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-700 font-mono hover:bg-indigo-50 transition-colors">
                  <Globe className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{url}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
