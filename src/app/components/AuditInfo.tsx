import { Calendar, Globe, User, FileText, Layers, CheckCircle2, AlertTriangle } from "lucide-react";

interface AuditInfoProps {
  site?: string;
  brand?: string;
  auditDate?: string;
  auditor?: string;
  pagesAudited?: string[];
  technicalSeoScore?: number;
  contentSeoScore?: number;
  auditVersion?: string;
  totalChecks?: number;
  layersAnalyzed?: number;
  baselineVersion?: string;
}

export function AuditInfo({
  site,
  brand,
  auditDate,
  auditor,
  pagesAudited,
  technicalSeoScore,
  contentSeoScore,
  auditVersion,
  totalChecks,
  layersAnalyzed,
  baselineVersion,
}: AuditInfoProps) {
  if (!site && !brand && !auditDate) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-white bg-opacity-70 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900">Información de la Auditoría</h3>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brand && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Marca</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{brand}</p>
              </div>
            </div>
          )}

          {site && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Sitio Web</p>
                <a
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 truncate block"
                >
                  {site}
                </a>
              </div>
            </div>
          )}

          {auditDate && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Fecha de Auditoría</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(/^\d{4}-\d{2}-\d{2}$/.test(auditDate) ? `${auditDate}T00:00:00` : auditDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {auditor && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Auditor</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{auditor}</p>
              </div>
            </div>
          )}

          {/* Versión de Auditoría y Baseline - v5 */}
          {auditVersion && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Versión</p>
                <p className="text-sm font-semibold text-gray-900">{auditVersion}</p>
                {baselineVersion && (
                  <p className="text-xs text-gray-500 mt-0.5">Base: {baselineVersion}</p>
                )}
              </div>
            </div>
          )}

          {/* Total Checks y Layers Analyzed - v5 */}
          {totalChecks !== undefined && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Verificaciones</p>
                <p className="text-sm font-semibold text-gray-900">{totalChecks} checks</p>
                {layersAnalyzed !== undefined && (
                  <p className="text-xs text-gray-500 mt-0.5">{layersAnalyzed} capas</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Scores */}
        {(technicalSeoScore !== undefined || contentSeoScore !== undefined) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {technicalSeoScore !== undefined && (
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-1">Technical SEO</p>
                <p className="text-2xl font-bold text-blue-700">{technicalSeoScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">de 10 puntos</p>
              </div>
            )}
            {contentSeoScore !== undefined && (
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-1">Content SEO</p>
                <p className="text-2xl font-bold text-purple-700">{contentSeoScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">de 10 puntos</p>
              </div>
            )}
          </div>
        )}

        {/* Pages Audited */}
        {pagesAudited && pagesAudited.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-2">
              Páginas Auditadas ({pagesAudited.length})
            </p>
            <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-48 overflow-y-auto">
              <ul className="space-y-2">
                {pagesAudited.map((page, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <a
                      href={page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline break-all flex-1"
                    >
                      {page}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}