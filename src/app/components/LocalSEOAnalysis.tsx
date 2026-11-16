import { MapPin, Phone, Mail, Clock, CheckCircle, XCircle, Building2 } from "lucide-react";

interface BusinessInfo {
  name?: string;
  industry?: string;
  address?: string;
  phone?: string[];
  email?: string;
  business_hours?: string;
  service_areas?: string[];
}

interface LocalSEOData {
  business_info?: BusinessInfo;
  local_seo_score?: number | null;
  applicability?: string;
  issues_found?: string[];
  strengths?: string[];
}

interface LocalSEOAnalysisProps {
  data?: LocalSEOData;
}

const scoreColor = (score: number) => {
  if (score >= 7) return { text: "text-green-700", bg: "bg-green-50", border: "border-green-200", ring: "bg-green-500" };
  if (score >= 4) return { text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", ring: "bg-yellow-500" };
  return { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", ring: "bg-red-500" };
};

export function LocalSEOAnalysis({ data }: LocalSEOAnalysisProps) {
  if (!data) return null;

  const info = data.business_info || {};
  const hasScore = typeof data.local_seo_score === "number";
  const score = hasScore ? data.local_seo_score as number : 0;
  const colors = scoreColor(score);
  const issues = data.issues_found || [];
  const strengths = data.strengths || [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">Local SEO Analysis</h3>
              <p className="text-sm text-emerald-100 mt-0.5">Presencia local y negocio</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl ${hasScore ? `${colors.bg} ${colors.border}` : "bg-gray-50 border-gray-200"} border`}>
            <span className={`text-2xl font-bold ${hasScore ? colors.text : "text-gray-600"}`}>
              {hasScore ? score.toFixed(1) : "N/A"}
            </span>
            {hasScore && <span className={`text-xs ${colors.text} ml-1`}>/10</span>}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!hasScore && data.applicability && (
          <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            {data.applicability}
          </p>
        )}
        {/* Business info card */}
        {(info.name || info.industry || info.address) && (
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              Información del Negocio
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {info.name && (
                <div>
                  <p className="text-xs text-gray-500">Empresa</p>
                  <p className="text-sm font-semibold text-gray-800">{info.name}</p>
                </div>
              )}
              {info.industry && (
                <div>
                  <p className="text-xs text-gray-500">Industria</p>
                  <p className="text-sm font-semibold text-gray-800">{info.industry}</p>
                </div>
              )}
              {info.address && (
                <div className="md:col-span-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{info.address}</p>
                </div>
              )}
              {info.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-700">{info.email}</p>
                </div>
              )}
              {info.business_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-700">{info.business_hours}</p>
                </div>
              )}
              {info.phone && info.phone.length > 0 && (
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="space-y-0.5">
                    {info.phone.map((p, i) => (
                      <p key={i} className="text-sm text-gray-700">{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {info.service_areas && info.service_areas.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Áreas de servicio</p>
                <div className="flex flex-wrap gap-2">
                  {info.service_areas.map((area, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Issues + Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Problemas encontrados
              </h4>
              <ul className="space-y-2">
                {issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Puntos fuertes
              </h4>
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
