import { TrendingUp, Calendar, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendDataProps {
  trendData?: {
    methodology_note?: string;
    history?: Array<{
      version: string;
      date: string;
      seo_score?: number | null;
      ai_visibility_score?: number | null;
      technical_seo_score?: number | null;
      content_seo_score?: number | null;
      notes?: string;
    }>;
  };
}

export function TrendData({ trendData }: TrendDataProps) {
  if (!trendData || !trendData.history || trendData.history.length === 0) {
    return null;
  }

  const { history, methodology_note } = trendData;

  // Preparar datos para el gráfico
  const chartData = history.map((item) => ({
    version: item.version,
    "SEO Score": item.seo_score,
    "AI Visibility": item.ai_visibility_score,
    "Technical SEO": item.technical_seo_score,
    "Content SEO": item.content_seo_score,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Evolución de Puntuaciones</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Histórico de mejoras a través de las versiones
        </p>
      </div>

      {/* Methodology Note */}
      {methodology_note && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Nota Metodológica</h4>
              <p className="text-sm text-blue-800 leading-relaxed">{methodology_note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-6">
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="version"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "1rem" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="SEO Score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="AI Visibility"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Technical SEO"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Content SEO"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Version History Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Versión
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  SEO
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  AI
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.version}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {item.seo_score !== null && item.seo_score !== undefined ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {item.seo_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {item.ai_visibility_score !== null && item.ai_visibility_score !== undefined ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {item.ai_visibility_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600 max-w-md">{item.notes || "—"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
