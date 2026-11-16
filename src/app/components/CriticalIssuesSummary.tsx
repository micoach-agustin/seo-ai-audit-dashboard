import { ShieldAlert, AlertTriangle, Info, Ban } from "lucide-react";

interface CriticalIssuesSummaryData {
  total_critical_issues?: number;
  total_high_priority_issues?: number;
  total_warnings?: number;
  blocking_issues?: string[];
}

interface CriticalIssuesSummaryProps {
  data?: CriticalIssuesSummaryData;
}

export function CriticalIssuesSummary({ data }: CriticalIssuesSummaryProps) {
  if (!data) return null;

  const blockingIssues = data.blocking_issues || [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-xl font-bold text-white">Resumen de Problemas Críticos</h3>
            <p className="text-sm text-red-100 mt-0.5">Issues que bloquean el rendimiento SEO</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Count cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-5 bg-red-50 rounded-xl border border-red-100">
            <div className="flex justify-center mb-2">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-4xl font-bold text-red-600">{data.total_critical_issues ?? 0}</p>
            <p className="text-xs font-semibold text-red-500 mt-1 uppercase tracking-wide">Críticos</p>
          </div>
          <div className="text-center p-5 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-4xl font-bold text-orange-600">{data.total_high_priority_issues ?? 0}</p>
            <p className="text-xs font-semibold text-orange-500 mt-1 uppercase tracking-wide">Alta Prioridad</p>
          </div>
          <div className="text-center p-5 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="flex justify-center mb-2">
              <Info className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-yellow-600">{data.total_warnings ?? 0}</p>
            <p className="text-xs font-semibold text-yellow-600 mt-1 uppercase tracking-wide">Advertencias</p>
          </div>
        </div>

        {/* Blocking issues */}
        {blockingIssues.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-500" />
              Issues bloqueantes ({blockingIssues.length})
            </h4>
            <div className="space-y-2">
              {blockingIssues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-800 font-medium">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
