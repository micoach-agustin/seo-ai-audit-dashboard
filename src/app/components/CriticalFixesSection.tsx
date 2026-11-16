import { AlertTriangle, XCircle, AlertCircle } from "lucide-react";

interface CriticalFix {
  fix_id: string;
  title: string;
  priority: string;
  layer: number;
  impact: string;
}

interface CriticalFixesSectionProps {
  criticalFixes?: CriticalFix[];
  pendingBlockers?: string[];
}

export function CriticalFixesSection({ criticalFixes = [], pendingBlockers = [] }: CriticalFixesSectionProps) {
  if (!criticalFixes || criticalFixes.length === 0) {
    return null;
  }

  // Agrupar por prioridad
  const p0Fixes = criticalFixes.filter(f => f.priority === "P0");
  const p1Fixes = criticalFixes.filter(f => f.priority === "P1");
  const p2Fixes = criticalFixes.filter(f => f.priority === "P2");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-900",
          badge: "bg-red-600",
          icon: "text-red-600",
        };
      case "P1":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-900",
          badge: "bg-orange-600",
          icon: "text-orange-600",
        };
      case "P2":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-900",
          badge: "bg-yellow-600",
          icon: "text-yellow-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-900",
          badge: "bg-gray-600",
          icon: "text-gray-600",
        };
    }
  };

  const renderFixGroup = (fixes: CriticalFix[], priority: string, label: string) => {
    if (fixes.length === 0) return null;

    const colors = getPriorityColor(priority);

    return (
      <div className={`${colors.bg} border ${colors.border} rounded-lg p-6 mb-4`}>
        <div className="flex items-center gap-3 mb-4">
          <XCircle className={`w-6 h-6 ${colors.icon}`} />
          <div className="flex items-center gap-3">
            <h3 className={`text-lg font-bold ${colors.text}`}>{label}</h3>
            <span className={`${colors.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>
              {priority}
            </span>
            <span className={`text-sm ${colors.text} font-semibold`}>
              {fixes.length} {fixes.length === 1 ? "issue" : "issues"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {fixes.map((fix, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${colors.badge} text-white`}>
                    {fix.fix_id}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{fix.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Layer:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {fix.layer}
                      </span>
                    </span>
                  </div>
                  <div className={`${colors.bg} border-l-4 ${colors.border} pl-4 py-2`}>
                    <p className={`text-sm ${colors.text} leading-relaxed`}>
                      <span className="font-semibold">Impact:</span> {fix.impact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-red-300 rounded-lg shadow-lg overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-white" />
          <div>
            <h2 className="text-xl font-bold text-white">
              Critical Fixes Required
            </h2>
            <p className="text-red-100 text-sm mt-0.5">
              {criticalFixes.length} critical {criticalFixes.length === 1 ? "issue" : "issues"} requiring immediate attention
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderFixGroup(p0Fixes, "P0", "🔴 Critical Priority")}
        {renderFixGroup(p1Fixes, "P1", "🟠 High Priority")}
        {renderFixGroup(p2Fixes, "P2", "🟡 Medium Priority")}

        {/* Pending Blockers */}
        {pendingBlockers && pendingBlockers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Pending Blockers</h3>
            </div>
            <ul className="space-y-2">
              {pendingBlockers.map((blocker, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-blue-800">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span className="flex-1">{blocker}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
