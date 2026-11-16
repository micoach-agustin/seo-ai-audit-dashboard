import { Bot, CheckCircle, AlertTriangle, XCircle, Calendar, ChevronRight } from "lucide-react";

interface WebMCPCheck {
  id: string;
  name: string;
  status: "PASS" | "WARNING" | "FAIL";
  detail: string;
  manualCheck?: boolean;
}

interface WebMCPData {
  layer_id: number;
  score: number;
  total_checks: number;
  checks: WebMCPCheck[];
  priority_fixes?: string[];
  last_ai_check_date?: string;
}

interface WebMCPCardProps {
  data?: WebMCPData;
}

export function WebMCPCard({ data }: WebMCPCardProps) {
  // Default data si no se proporciona
  const defaultData: WebMCPData = {
    layer_id: 21,
    score: 0,
    total_checks: 7,
    checks: [
      { id: "21.1", name: "actions.json", status: "FAIL", detail: "File not found or invalid schema" },
      { id: "21.2", name: "AI Entity Credibility", status: "FAIL", detail: "Missing sameAs links and entity signals" },
      { id: "21.3", name: "Hreflang Integrity", status: "FAIL", detail: "Hreflang tags missing or inconsistent" },
      { id: "21.4", name: "Critical Schemas", status: "FAIL", detail: "Organization/Product schema incomplete" },
      { id: "21.5", name: "PWA Manifest", status: "FAIL", detail: "Manifest missing or incomplete" },
      { id: "21.6", name: "CTA Clarity", status: "FAIL", detail: "Call-to-action not clearly defined" },
      { id: "21.7", name: "AI Visibility", status: "FAIL", detail: "Manual check required", manualCheck: true },
    ],
    priority_fixes: ["Add actions.json", "Complete Organization schema", "Add sameAs entity links"],
    last_ai_check_date: undefined,
  };

  const cardData = data || defaultData;
  const { score, total_checks, checks, priority_fixes, last_ai_check_date } = cardData;

  // Calcular nivel de AI-Readiness
  const getReadinessLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 6) return { level: "High", color: "#22C55E", bgColor: "rgba(34, 197, 94, 0.15)" };
    if (score >= 3) return { level: "Medium", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.15)" };
    return { level: "Low", color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.15)" };
  };

  const readiness = getReadinessLevel(score);

  // Obtener icono y color por status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle className="w-5 h-5" style={{ color: "#22C55E" }} />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5" style={{ color: "#F59E0B" }} />;
      case "FAIL":
        return <XCircle className="w-5 h-5" style={{ color: "#EF4444" }} />;
      default:
        return <XCircle className="w-5 h-5" style={{ color: "#64748B" }} />;
    }
  };

  // Calcular progreso para el anillo
  const progressPercentage = (score / total_checks) * 100;

  return (
    <div
      className="rounded-2xl shadow-2xl overflow-hidden w-full"
      style={{
        backgroundColor: "#0F172A",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "#1E293B" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#1E293B" }}
            >
              <Bot className="w-6 h-6" style={{ color: "#22C55E" }} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>
                  WebMCP & AI-Readiness
                </h3>
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{ backgroundColor: "#475569", color: "#F1F5F9" }}
                >
                  Layer 21
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Score */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                {/* Progress ring background */}
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#1E293B"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={readiness.color}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${progressPercentage * 1.76} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
                    {score}
                  </span>
                  <span className="text-sm" style={{ color: "#64748B" }}>
                    /{total_checks}
                  </span>
                </div>
              </div>
            </div>
            {/* AI-Readiness Level pill */}
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: readiness.bgColor,
                color: readiness.color,
                border: `1px solid ${readiness.color}`,
              }}
            >
              {readiness.level} AI-Readiness
            </div>
          </div>
        </div>
      </div>

      {/* BODY - Checklist */}
      <div className="px-6 py-4">
        <div className="space-y-0">
          {checks.map((check, index) => (
            <div
              key={check.id}
              className="flex items-start gap-4 py-3"
              style={{
                borderBottom: index < checks.length - 1 ? "1px solid #1E293B" : "none",
              }}
            >
              {/* Left column: Check number + icon + name (25%) */}
              <div className="flex items-center gap-3" style={{ width: "25%", minWidth: "200px" }}>
                {/* Check number */}
                <span
                  className="text-xs font-mono flex-shrink-0"
                  style={{ color: "#94A3B8", minWidth: "36px" }}
                >
                  {check.id}
                </span>

                {/* Status icon */}
                <div className="flex-shrink-0">{getStatusIcon(check.status)}</div>

                {/* Check name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                      {check.name}
                    </span>
                    {check.manualCheck && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" style={{ color: "#94A3B8" }} />
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: "#334155", color: "#CBD5E1" }}
                        >
                          manual
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column: Detail text (75%) */}
              <div className="flex-1" style={{ width: "75%" }}>
                <span
                  className="text-xs block"
                  style={{ color: "#CBD5E1", lineHeight: "1.5" }}
                >
                  {check.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER - Priority Fixes */}
      {priority_fixes && priority_fixes.length > 0 && (
        <div
          className="px-6 py-4 border-t"
          style={{ borderColor: "#1E293B", backgroundColor: "#0B1120" }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                Priority fixes:
              </span>
              <div className="flex gap-2 flex-wrap">
                {priority_fixes.slice(0, 3).map((fix, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-md text-xs font-medium border"
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      borderColor: "#EF4444",
                      color: "#FCA5A5",
                    }}
                  >
                    {fix}
                  </span>
                ))}
              </div>
            </div>
            <button
              className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
              style={{ color: "#CBD5E1" }}
            >
              View fixes
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* SECOND FOOTER - Last AI Check */}
      <div
        className="px-6 py-3 border-t"
        style={{ borderColor: "#1E293B", backgroundColor: "#0B1120" }}
      >
        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: "#64748B" }}>Last AI visibility check:</span>
          <span
            className="font-mono"
            style={{ color: last_ai_check_date ? "#CBD5E1" : "#94A3B8" }}
          >
            {last_ai_check_date || "Not run yet"}
          </span>
        </div>
      </div>
    </div>
  );
}