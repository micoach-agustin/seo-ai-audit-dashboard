import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { X, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Minus, Download, Code, FileText, BarChart3, Sparkles, Search, GitCommit, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { generateComparisonPDF } from "../utils/pdfGenerator";

// ── Live post-fix reference data (from SEO_V11_V12_COMPARATIVE brief) ──────────
type LiveStatus = "FIXED" | "PARTIAL" | "STILL OPEN" | "EXPECTED" | "RE-MEDIR" | "PASS";

const LIVE_LAYER_DATA: {
  name: string;
  v11: number;
  v12: number;
  delta: number;
  liveStatus: LiveStatus;
  liveNote: string;
}[] = [
  { name: "Metadata & Head",     v11: 7.0, v12: 4.5, delta: -2.5, liveStatus: "PARTIAL",    liveNote: "Shells título-home = 0/210. Titles >60 = 41; desc fuera rango = 68." },
  { name: "Open Graph",          v11: 8.0, v12: 9.0, delta: +1.0, liveStatus: "PASS",       liveNote: "Mejora confirmada." },
  { name: "Structured Data",     v11: 7.0, v12: 7.5, delta: +0.5, liveStatus: "PARTIAL",    liveNote: "0 FAQ/Software leak; Article OK; sameAs OK. Score = re-medir." },
  { name: "Crawling & Indexing", v11: 5.0, v12: 2.0, delta: -3.0, liveStatus: "FIXED",      liveNote: "Canonical-home leak 0/210; robots→sitemap-index OK." },
  { name: "AI Search",           v11: 9.0, v12: 3.5, delta: -5.5, liveStatus: "FIXED",      liveNote: "llms.txt 200; GPTBot/ChatGPT-User/Google-Extended OK; sameAs Org+Person; JA 33 URLs live." },
  { name: "Content Structure",   v11: 7.0, v12: 5.0, delta: -2.0, liveStatus: "PARTIAL",    liveNote: "Blog EN/ES h1=1 (prod b0f914d). Thin pages = residual editorial." },
  { name: "Technical Rendering", v11: 4.0, v12: 2.5, delta: -1.5, liveStatus: "FIXED",      liveNote: "Home-shell 0/210; matriz prerender ~210 (no 64); JA ≥33 rutas." },
  { name: "Internal Linking",    v11: 7.0, v12: 8.5, delta: +1.5, liveStatus: "PASS",       liveNote: "Mejora confirmada." },
  { name: "Analytics & Data",    v11: 8.0, v12: 7.0, delta: -1.0, liveStatus: "EXPECTED",   liveNote: "GA4 post-consent = correcto GDPR. No pintar rojo." },
  { name: "Core Web Vitals",     v11: 5.5, v12: 8.0, delta: +2.5, liveStatus: "RE-MEDIR",   liveNote: "Requiere PageSpeed API o humano." },
  { name: "Entity SEO",          v11: 7.5, v12: 4.0, delta: -3.5, liveStatus: "FIXED",      liveNote: "sameAs Organization + Person presente en /." },
  { name: "Indexation Health",   v11: 6.0, v12: 2.5, delta: -3.5, liveStatus: "FIXED",      liveNote: "0 shells / 0 title-home / 0 canon-home en matriz." },
  { name: "SERP Optimization",   v11: 7.0, v12: 5.5, delta: -1.5, liveStatus: "STILL OPEN", liveNote: "41 titles >60; ~68 desc fuera rango. Sigue ámbar." },
  { name: "Content Modularity",  v11: 8.0, v12: 6.0, delta: -2.0, liveStatus: "PARTIAL",    liveNote: "Módulos presentes en matrix; rutas SPA fuera de matrix. Re-audit 2026-09-04." },
  { name: "Image SEO",           v11: 6.0, v12: 9.0, delta: +3.0, liveStatus: "PASS",       liveNote: "Mejora confirmada." },
];

const OBSOLETE_CLAIMS: { old: string; replacement: string; strike: boolean }[] = [
  { old: "155 URLs sirven home shell",        replacement: "0/210 home-shell en matriz prerender (HTTP)",               strike: true },
  { old: "155 canonical a /",                 replacement: "0 canonical-home leak",                                      strike: true },
  { old: "155 heredan título home",           replacement: "0 title-home leak",                                          strike: true },
  { old: "JA invisible / solo free-trial",    replacement: "JA live: 33 rutas con title/canonical propios",              strike: true },
  { old: "Sin sameAs",                        replacement: "sameAs Organization + Person presente",                      strike: true },
  { old: "include manual 64",                 replacement: "Matriz prerender ~210 rutas (buildIncludeMatrix)",            strike: true },
  { old: "52% invisible sin JS",              replacement: "Matriz medible tiene HTML único; residual fuera de matrix*", strike: true },
  { old: "284 multi-H1",                      replacement: "Spot h1=1 en posts (provisional — confirmar re-crawl)",      strike: true },
  { old: "78 titles >60 / 81 desc fuera",     replacement: "Actualizar a 41 / ~68 — sigue ámbar",                       strike: false },
  { old: "quiz Disallow conflict",            replacement: "Shell noindex live; Disallow+CTA = EXPECTED, no fail",       strike: true },
];

const DEPLOY_COMMITS = [
  { sha: "6270bf7", label: "Matriz prerender, verify-prerender, lang/hreflang/sameAs" },
  { sha: "084e62e", label: "Soft-404 blog, IP gate, thin JA noindex" },
  { sha: "b0f914d", label: "Single H1 blog — LIVE en prod" },
  { sha: "13e20a9", label: "Shells noindex /quiz-ejecutivo + deploy archive" },
];

// ── Status pill helpers ───────────────────────────────────────────────────────
function liveStatusColor(s: LiveStatus) {
  switch (s) {
    case "FIXED": return { bg: "bg-green-100 text-green-800 border-green-300", dot: "#16A34A" };
    case "PASS":  return { bg: "bg-green-100 text-green-800 border-green-300", dot: "#16A34A" };
    case "PARTIAL":    return { bg: "bg-amber-100 text-amber-800 border-amber-300", dot: "#D97706" };
    case "STILL OPEN": return { bg: "bg-amber-100 text-amber-800 border-amber-300", dot: "#D97706" };
    case "EXPECTED":   return { bg: "bg-slate-100 text-slate-700 border-slate-300", dot: "#64748B" };
    case "RE-MEDIR":   return { bg: "bg-slate-100 text-slate-700 border-slate-300", dot: "#64748B" };
    default: return { bg: "bg-gray-100 text-gray-600 border-gray-200", dot: "#64748B" };
  }
}

function deltaColor(d: number) {
  if (d > 0) return "text-green-700 font-semibold";
  if (d < 0) return "text-red-600 font-semibold";
  return "text-gray-500";
}

function v11ScoreColor(score: number) {
  if (score >= 7) return "text-amber-600";
  if (score >= 4) return "text-orange-600";
  return "text-red-600";
}

function v12ScoreColor(score: number) {
  if (score >= 7) return "text-green-700";
  if (score >= 4) return "text-amber-600";
  return "text-red-600";
}

interface ComparisonViewProps {
  normalizeData: (data: any) => any;
}

interface LayerComparison {
  name: string;
  oldStatus: string;
  newStatus: string;
  oldScore?: number;
  newScore?: number;
  change: "improved" | "degraded" | "unchanged";
  details: string[];
}

interface PriorityFixComparison {
  category: string;
  resolved: string[];
  stillPending: string[];
}

interface ScoreBreakdownComparison {
  name: string;
  oldScore: number;
  newScore: number;
  change: number;
  status: "improved" | "degraded" | "unchanged";
}

interface CriticalFixComparison {
  resolved: any[];
  newIssues: any[];
  stillPending: any[];
}

interface WebMCPComparison {
  oldScore: number;
  newScore: number;
  change: number;
  checksImproved: any[];
  checksDegraded: any[];
}

export function ComparisonView({ normalizeData }: ComparisonViewProps) {
  const [oldData, setOldData] = useState<any>(null);
  const [newData, setNewData] = useState<any>(null);
  const [oldFileName, setOldFileName] = useState<string>("");
  const [newFileName, setNewFileName] = useState<string>("");

  const handleOldFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const normalized = normalizeData(json);
        setOldData(normalized);
        setOldFileName(file.name);
      } catch (error) {
        alert("Error al leer el archivo JSON antiguo.");
      }
    };
    reader.readAsText(file);
  };

  const handleNewFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const normalized = normalizeData(json);
        setNewData(normalized);
        setNewFileName(file.name);
      } catch (error) {
        alert("Error al leer el archivo JSON nuevo.");
      }
    };
    reader.readAsText(file);
  };

  const compareData = (): {
    improvements: LayerComparison[];
    stillPending: LayerComparison[];
    degraded: LayerComparison[];
    scoreComparison: {
      seo: { old: number; new: number; change: number };
      ai: { old: number; new: number; change: number };
      technical?: { old: number; new: number; change: number };
      content?: { old: number; new: number; change: number };
    };
    scoreBreakdownComparison?: ScoreBreakdownComparison[];
    criticalFixesComparison?: CriticalFixComparison;
    webmcpComparison?: WebMCPComparison;
  } | null => {
    if (!oldData || !newData) return null;

    const improvements: LayerComparison[] = [];
    const stillPending: LayerComparison[] = [];
    const degraded: LayerComparison[] = [];

    const oldLayers = oldData.layers || [];
    const newLayers = newData.layers || [];

    // Función helper para normalizar nombres de capas para matching
    const normalizeName = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[&\-_]+/g, " ") // Reemplazar & - _ con espacios
        .replace(/\s+/g, " ") // Normalizar espacios múltiples
        .trim();
    };

    // Crear un mapa de las nuevas capas por nombre normalizado para acceso rápido
    const newLayersMap = new Map();
    newLayers.forEach((layer: any) => {
      const normalizedName = normalizeName(layer.name || "");
      newLayersMap.set(normalizedName, layer);
    });

    // Comparar cada capa antigua con la nueva
    oldLayers.forEach((oldLayer: any) => {
      const oldLayerName = oldLayer.name || "";
      const normalizedOldName = normalizeName(oldLayerName);
      const newLayer = newLayersMap.get(normalizedOldName);
      
      if (!newLayer) return; // Si la capa no existe en el nuevo, la ignoramos

      const oldStatus = oldLayer.status || "";
      const newStatus = newLayer.status || "";
      const oldScore = oldLayer.score || 0;
      const newScore = newLayer.score || 0;

      let change: "improved" | "degraded" | "unchanged" = "unchanged";

      // Determinar si mejoró, empeoró o se mantuvo
      const statusWeight = { Fail: 1, Warning: 2, Medium: 2.5, Pass: 3 };
      const oldWeight = statusWeight[oldStatus as keyof typeof statusWeight] || 0;
      const newWeight = statusWeight[newStatus as keyof typeof statusWeight] || 0;

      if (newWeight > oldWeight || newScore > oldScore) {
        change = "improved";
      } else if (newWeight < oldWeight || newScore < oldScore) {
        change = "degraded";
      }

      const comparison: LayerComparison = {
        name: oldLayerName,
        oldStatus,
        newStatus,
        oldScore,
        newScore,
        change,
        details: newLayer.details || [],
      };

      if (change === "improved") {
        improvements.push(comparison);
      } else if (change === "degraded") {
        degraded.push(comparison);
      } else {
        // Solo agregamos a "stillPending" si sigue en estado problemático
        if (newStatus === "Fail" || newStatus === "Warning") {
          stillPending.push(comparison);
        }
      }
    });

    const scoreComparison: any = {
      seo: {
        old: oldData.seo_score || 0,
        new: newData.seo_score || 0,
        change: (newData.seo_score || 0) - (oldData.seo_score || 0),
      },
      ai: {
        old: oldData.ai_visibility_score || 0,
        new: newData.ai_visibility_score || 0,
        change: (newData.ai_visibility_score || 0) - (oldData.ai_visibility_score || 0),
      },
    };

    // Add technical and content scores if available
    if (oldData.technical_seo_score !== undefined || newData.technical_seo_score !== undefined) {
      scoreComparison.technical = {
        old: oldData.technical_seo_score || 0,
        new: newData.technical_seo_score || 0,
        change: (newData.technical_seo_score || 0) - (oldData.technical_seo_score || 0),
      };
    }

    if (oldData.content_seo_score !== undefined || newData.content_seo_score !== undefined) {
      scoreComparison.content = {
        old: oldData.content_seo_score || 0,
        new: newData.content_seo_score || 0,
        change: (newData.content_seo_score || 0) - (oldData.content_seo_score || 0),
      };
    }

    // Score Breakdown Comparison
    let scoreBreakdownComparison: ScoreBreakdownComparison[] | undefined;
    if (oldData.score_breakdown || newData.score_breakdown) {
      scoreBreakdownComparison = [];
      const categories = [
        { key: "on_page_seo", name: "On-Page SEO" },
        { key: "technical_seo", name: "Technical SEO" },
        { key: "content_seo", name: "Content SEO" },
        { key: "metadata_head", name: "Metadata & Head" },
        { key: "open_graph_sharing", name: "Open Graph" },
        { key: "structured_data", name: "Structured Data" },
        { key: "crawling_indexing", name: "Crawling & Indexing" },
        { key: "ai_search", name: "AI Search" },
        { key: "technical_rendering", name: "Technical Rendering" },
        { key: "core_web_vitals", name: "Core Web Vitals" },
      ];

      categories.forEach((cat) => {
        const oldCat = oldData.score_breakdown?.[cat.key];
        const newCat = newData.score_breakdown?.[cat.key];
        
        // If at least one exists (old or new), include it
        if (oldCat || newCat) {
          const oldScore = oldCat ? (typeof oldCat === 'object' ? oldCat.score : oldCat) : 0;
          const newScore = newCat ? (typeof newCat === 'object' ? newCat.score : newCat) : 0;
          
          // Skip if both are null or undefined
          if (oldScore === null && newScore === null) return;
          
          // Use 0 if one side is null but the other isn't
          const finalOldScore = oldScore === null ? 0 : oldScore;
          const finalNewScore = newScore === null ? 0 : newScore;
          
          const change = finalNewScore - finalOldScore;
          let status: "improved" | "degraded" | "unchanged" = "unchanged";
          if (change > 0.1) status = "improved";
          else if (change < -0.1) status = "degraded";

          scoreBreakdownComparison!.push({
            name: cat.name,
            oldScore: finalOldScore,
            newScore: finalNewScore,
            change,
            status,
          });
        }
      });
    }

    // Critical Fixes Comparison
    let criticalFixesComparison: CriticalFixComparison | undefined;
    if (oldData.critical_fixes_v5 || newData.critical_fixes_v5) {
      const oldFixes = oldData.critical_fixes_v5 || [];
      const newFixes = newData.critical_fixes_v5 || [];
      
      const oldIssuesSet = new Set(oldFixes.map((f: any) => f.issue || f.name));
      const newIssuesSet = new Set(newFixes.map((f: any) => f.issue || f.name));
      
      const resolved = oldFixes.filter((f: any) => !newIssuesSet.has(f.issue || f.name));
      const stillPendingFixes = newFixes.filter((f: any) => oldIssuesSet.has(f.issue || f.name));
      const newIssues = newFixes.filter((f: any) => !oldIssuesSet.has(f.issue || f.name));

      criticalFixesComparison = {
        resolved,
        newIssues,
        stillPending: stillPendingFixes,
      };
    }

    // WebMCP Comparison
    let webmcpComparison: WebMCPComparison | undefined;
    if (oldData.webmcp_data || newData.webmcp_data) {
      const oldScore = oldData.webmcp_data?.score || 0;
      const newScore = newData.webmcp_data?.score || 0;
      
      const checksImproved: any[] = [];
      const checksDegraded: any[] = [];
      
      if (oldData.webmcp_data?.checks || newData.webmcp_data?.checks) {
        const oldChecks = oldData.webmcp_data?.checks || [];
        const newChecks = newData.webmcp_data?.checks || [];
        
        // If there are new checks but no old checks, all are "improved" from N/A
        if (oldChecks.length === 0 && newChecks.length > 0) {
          newChecks.forEach((newCheck: any) => {
            if (newCheck.status === "PASS") {
              checksImproved.push({ ...newCheck, oldStatus: "N/A" });
            }
          });
        } else {
          oldChecks.forEach((oldCheck: any, index: number) => {
            const newCheck = newChecks[index];
            if (newCheck && oldCheck.status !== newCheck.status) {
              const statusWeight = { PASS: 3, WARNING: 2, FAIL: 1, "N/A": 0 };
              const oldWeight = statusWeight[oldCheck.status as keyof typeof statusWeight] || 0;
              const newWeight = statusWeight[newCheck.status as keyof typeof statusWeight] || 0;
              
              if (newWeight > oldWeight) {
                checksImproved.push({ ...newCheck, oldStatus: oldCheck.status });
              } else if (newWeight < oldWeight) {
                checksDegraded.push({ ...newCheck, oldStatus: oldCheck.status });
              }
            }
          });
        }
      }

      webmcpComparison = {
        oldScore,
        newScore,
        change: newScore - oldScore,
        checksImproved,
        checksDegraded,
      };
    }

    return { 
      improvements, 
      stillPending, 
      degraded, 
      scoreComparison,
      scoreBreakdownComparison,
      criticalFixesComparison,
      webmcpComparison,
    };
  };

  const comparisonResults = compareData();

  const handleDownloadPDF = () => {
    if (!comparisonResults || !oldData || !newData) return;

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `comparacion-seo-${timestamp}`;
    const doc = generateComparisonPDF(
      oldData,
      newData,
      comparisonResults.improvements,
      comparisonResults.degraded,
      comparisonResults.stillPending,
      comparisonResults.scoreComparison
    );
    doc.save(`${filename}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fail":
        return "bg-red-100 text-red-700 border-red-300";
      case "Warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Pass":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Fail":
        return "destructive";
      case "Warning":
      case "Medium":
        return "default";
      case "Pass":
        return "default";
      default:
        return "secondary";
    }
  };

  const ScoreComparisonCard = ({ title, old, newVal, change }: { title: string; old: number; newVal: number; change: number }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Anterior</p>
            <p className="text-2xl font-bold text-gray-400">{old.toFixed(1)}</p>
          </div>
          <div className="flex items-center">
            {change > 0 ? (
              <TrendingUp className="w-8 h-8 text-green-600" />
            ) : change < 0 ? (
              <TrendingDown className="w-8 h-8 text-red-600" />
            ) : (
              <Minus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-gray-600">Nuevo</p>
            <p className={`text-2xl font-bold ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-900"}`}>
              {newVal.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className={`text-sm font-semibold ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"}`}>
            {change > 0 ? "+" : ""}{change.toFixed(1)} puntos
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Intro Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparador de Auditorías</h2>
        <p className="text-gray-700 mb-4">
          Compara dos auditorías SEO para visualizar mejoras, identificar áreas que empeoraron y ver qué problemas siguen pendientes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700"><strong>Mejoras:</strong> Capas que pasaron de Fail/Warning a Pass o mejoraron su score</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700"><strong>Pendientes:</strong> Issues que aún necesitan corrección</p>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700"><strong>Empeoradas:</strong> Áreas que requieren atención inmediata</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Auditoría Antigua</h3>
          </div>
          <FileUpload onFileUpload={handleOldFileUpload} />
          {oldData && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                ✓ <span className="font-semibold">{oldFileName}</span>
              </p>
              <button
                onClick={() => {
                  setOldData(null);
                  setOldFileName("");
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Auditoría Nueva</h3>
          </div>
          <FileUpload onFileUpload={handleNewFileUpload} />
          {newData && (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ <span className="font-semibold">{newFileName}</span>
              </p>
              <button
                onClick={() => {
                  setNewData(null);
                  setNewFileName("");
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResults && (
        <div className="space-y-8">

          {/* ── Deploy Banner ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
              <GitCommit className="w-3.5 h-3.5" />
              Prod commits:
            </span>
            {DEPLOY_COMMITS.map(c => (
              <span key={c.sha} title={c.label} className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 cursor-default hover:bg-slate-700 transition-colors">
                <span className="text-green-400">{c.sha}</span>
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1.5 text-slate-400">
              <Search className="w-3.5 h-3.5" />
              Método: HTTP no-JS (crawler IA)
            </span>
          </div>

          {/* ── Coverage Callout ──────────────────────────────────────────── */}
          <div className="relative border border-amber-300 bg-amber-50 rounded-xl p-4 pl-5">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-l-xl" />
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Cobertura: <span className="font-bold">v11 = 58 URLs (casi EN)</span> vs <span className="font-bold">v12 = 296 URLs × 5 locales</span>
                </p>
                <p className="text-sm text-amber-800">
                  La caída v11→v12 <strong>NO es regresión de producto sola</strong>: v12 descubrió 155 shells en locales/JA al ampliar el crawl 58→296.
                  El REPORT v12 usa otra línea base de resumen — <em>no mezclar scores sin etiqueta de cobertura</em>.
                </p>
              </div>
            </div>
          </div>

          {/* ── 3-Column Layer Diff Table ─────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tabla Comparativa de Layers — v11 → v12 → Live</h2>
                <p className="text-xs text-gray-500 mt-0.5">Scores de <code>layers[]</code> del JSON. Δ = v12 − v11.</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 w-48">Layer</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-500 w-20">
                      v11 <span className="block text-xs font-normal text-gray-400">58 URLs</span>
                    </th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-500 w-20">
                      v12 <span className="block text-xs font-normal text-gray-400">296 URLs</span>
                    </th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-500 w-16">Δ</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Live post-fix</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Callout</th>
                  </tr>
                </thead>
                <tbody>
                  {LIVE_LAYER_DATA.map((row, i) => {
                    const { bg, dot } = liveStatusColor(row.liveStatus);
                    return (
                      <tr key={row.name} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                        <td className="px-4 py-2.5 font-medium text-gray-800">{row.name}</td>
                        <td className={`text-center px-3 py-2.5 font-mono font-semibold ${v11ScoreColor(row.v11)}`}>{row.v11.toFixed(1)}</td>
                        <td className={`text-center px-3 py-2.5 font-mono font-semibold ${v12ScoreColor(row.v12)}`}>{row.v12.toFixed(1)}</td>
                        <td className={`text-center px-3 py-2.5 font-mono text-xs ${deltaColor(row.delta)}`}>
                          {row.delta > 0 ? "+" : ""}{row.delta.toFixed(1)}
                        </td>
                        <td className="text-center px-4 py-2.5">
                          <span className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-xs font-semibold ${bg}`}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                            {row.liveStatus}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-500 max-w-xs">{row.liveNote}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Composite scores */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "SEO Score",        v11: 8.3, v12: 6.5 },
                { label: "AI Visibility",    v11: 8.6, v12: 3.8 },
                { label: "Technical SEO",    v11: 7.5, v12: 3.4 },
                { label: "Content SEO",      v11: 8.1, v12: 6.6 },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs font-medium text-gray-500 mb-2">{s.label}</p>
                  <div className="flex items-end justify-between">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">v11</p>
                      <p className="text-lg font-bold text-amber-600">{s.v11.toFixed(1)}</p>
                    </div>
                    <TrendingDown className="w-4 h-4 text-red-400 mb-1" />
                    <div className="text-center">
                      <p className="text-xs text-gray-400">v12</p>
                      <p className="text-lg font-bold text-red-600">{s.v12.toFixed(1)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Live</p>
                      <p className="text-xs font-semibold text-slate-500 italic">re-medir</p>
                      <p className="text-xs text-slate-400">2026-09-04</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Obsolete Claims (Strike-through) ─────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-7 h-7 text-slate-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Claims v12 → Estado Live</h2>
                <p className="text-xs text-gray-500">Tachado = obsoleto post-<code>6270bf7</code>. Leer tooltip para contexto.</p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Texto v12 (pre-fix)</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 w-24">¿Tachar?</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Reemplazo live</th>
                  </tr>
                </thead>
                <tbody>
                  {OBSOLETE_CLAIMS.map((c, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-2.5">
                        <span className={c.strike ? "line-through text-gray-400" : "text-gray-700"}>
                          {c.old}
                        </span>
                      </td>
                      <td className="text-center px-4 py-2.5">
                        {c.strike
                          ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">SÍ</span>
                          : <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">NO</span>
                        }
                      </td>
                      <td className="px-4 py-2.5 text-gray-700">{c.replacement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Residuals (must stay amber/red) ──────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-amber-500" />
              <h2 className="text-lg font-bold text-gray-900">Residuales — no pintar verde todavía</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: "Meta title >60 / desc fuera rango", color: "amber", note: "41 / ~68 live" },
                { label: "Thin pages <300 palabras", color: "amber", note: "Editorial; no expandir" },
                { label: "GA4 post-consent", color: "amber", note: "GDPR correcto — EXPECTED" },
                { label: "Knowledge panel / sameAs Wikidata", color: "amber", note: "Solo si URLs verificables" },
                { label: "Core Web Vitals CrUX", color: "slate", note: "Requiere API / humano" },
                { label: "Multi-H1 blog (sin re-crawl)",      color: "slate", note: "Spot OK, confirmar matrix" },
                { label: "Rich Results Test",                  color: "slate", note: "Re-audit humano" },
                { label: "Prompts IA (ChatGPT/Perplexity)",   color: "slate", note: "Check 21.7 manual — 2026-09-04" },
              ].map(r => {
                const cls = r.color === "amber"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-slate-200 bg-slate-50 text-slate-600";
                const dot = r.color === "amber" ? "#D97706" : "#64748B";
                return (
                  <div key={r.label} className={`flex items-start gap-2.5 border rounded-lg p-3 ${cls}`}>
                    <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: dot }} />
                    <div>
                      <p className="text-xs font-semibold">{r.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{r.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Score Comparison */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Comparación de Puntuaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScoreComparisonCard
                title="SEO Score"
                old={comparisonResults.scoreComparison.seo.old}
                newVal={comparisonResults.scoreComparison.seo.new}
                change={comparisonResults.scoreComparison.seo.change}
              />
              <ScoreComparisonCard
                title="AI Visibility Score"
                old={comparisonResults.scoreComparison.ai.old}
                newVal={comparisonResults.scoreComparison.ai.new}
                change={comparisonResults.scoreComparison.ai.change}
              />
              {comparisonResults.scoreComparison.technical && (
                <ScoreComparisonCard
                  title="Technical SEO Score"
                  old={comparisonResults.scoreComparison.technical.old}
                  newVal={comparisonResults.scoreComparison.technical.new}
                  change={comparisonResults.scoreComparison.technical.change}
                />
              )}
              {comparisonResults.scoreComparison.content && (
                <ScoreComparisonCard
                  title="Content SEO Score"
                  old={comparisonResults.scoreComparison.content.old}
                  newVal={comparisonResults.scoreComparison.content.new}
                  change={comparisonResults.scoreComparison.content.change}
                />
              )}
            </div>
          </section>

          {/* Score Breakdown Comparison */}
          {comparisonResults.scoreBreakdownComparison && comparisonResults.scoreBreakdownComparison.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Desglose Detallado de Métricas
                  </h2>
                  <p className="text-sm text-gray-600">Cambios en las categorías SEO principales</p>
                </div>
              </div>
              
              {/* Info banner for version differences */}
              {!oldData.score_breakdown && newData.score_breakdown && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">ℹ️ Nueva funcionalidad:</span> La auditoría antigua no incluía este desglose detallado. 
                    Los valores "Anterior: 0.0" indican métricas que no estaban disponibles en la versión anterior.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparisonResults.scoreBreakdownComparison.map((item, index) => (
                  <Card 
                    key={index} 
                    className={`${
                      item.status === "improved" 
                        ? "border-l-4 border-l-green-500 bg-green-50/30" 
                        : item.status === "degraded" 
                        ? "border-l-4 border-l-red-500 bg-red-50/30"
                        : "border-l-4 border-l-gray-300 bg-gray-50/30"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">{item.name}</CardTitle>
                        {item.status === "improved" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : item.status === "degraded" ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Anterior:</span>
                          <span className="font-semibold text-gray-700">{item.oldScore.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Nuevo:</span>
                          <span className={`font-semibold ${
                            item.status === "improved" 
                              ? "text-green-600" 
                              : item.status === "degraded" 
                              ? "text-red-600" 
                              : "text-gray-900"
                          }`}>
                            {item.newScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="pt-1 border-t border-gray-200">
                          <p className={`text-xs font-semibold ${
                            item.change > 0 
                              ? "text-green-600" 
                              : item.change < 0 
                              ? "text-red-600" 
                              : "text-gray-600"
                          }`}>
                            {item.change > 0 ? "+" : ""}{item.change.toFixed(1)} puntos
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Critical Fixes Comparison */}
          {comparisonResults.criticalFixesComparison && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Problemas Críticos
                  </h2>
                  <p className="text-sm text-gray-600">Comparación de issues críticos</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Resolved */}
                {comparisonResults.criticalFixesComparison.resolved.length > 0 && (
                  <Card className="border-l-4 border-l-green-500 bg-green-50/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Resueltos ({comparisonResults.criticalFixesComparison.resolved.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {comparisonResults.criticalFixesComparison.resolved.slice(0, 3).map((fix: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{fix.issue || fix.name}</span>
                          </li>
                        ))}
                        {comparisonResults.criticalFixesComparison.resolved.length > 3 && (
                          <li className="text-xs text-gray-500 italic">
                            + {comparisonResults.criticalFixesComparison.resolved.length - 3} más
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Still Pending */}
                {comparisonResults.criticalFixesComparison.stillPending.length > 0 && (
                  <Card className="border-l-4 border-l-orange-500 bg-orange-50/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        Aún Pendientes ({comparisonResults.criticalFixesComparison.stillPending.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {comparisonResults.criticalFixesComparison.stillPending.slice(0, 3).map((fix: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-orange-600 mt-0.5">⚠</span>
                            <span>{fix.issue || fix.name}</span>
                          </li>
                        ))}
                        {comparisonResults.criticalFixesComparison.stillPending.length > 3 && (
                          <li className="text-xs text-gray-500 italic">
                            + {comparisonResults.criticalFixesComparison.stillPending.length - 3} más
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* New Issues */}
                {comparisonResults.criticalFixesComparison.newIssues.length > 0 && (
                  <Card className="border-l-4 border-l-red-500 bg-red-50/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        Nuevos Issues ({comparisonResults.criticalFixesComparison.newIssues.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {comparisonResults.criticalFixesComparison.newIssues.slice(0, 3).map((fix: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">✗</span>
                            <span>{fix.issue || fix.name}</span>
                          </li>
                        ))}
                        {comparisonResults.criticalFixesComparison.newIssues.length > 3 && (
                          <li className="text-xs text-gray-500 italic">
                            + {comparisonResults.criticalFixesComparison.newIssues.length - 3} más
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}

          {/* WebMCP Comparison */}
          {comparisonResults.webmcpComparison && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-green-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    WebMCP & AI-Readiness (Layer 21)
                  </h2>
                  <p className="text-sm text-gray-600">Comparación de AI-Readiness checks</p>
                </div>
              </div>
              
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Score de AI-Readiness</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Anterior</p>
                        <p className="text-2xl font-bold text-gray-300">
                          {comparisonResults.webmcpComparison.oldScore}/7
                        </p>
                      </div>
                      {comparisonResults.webmcpComparison.change > 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : comparisonResults.webmcpComparison.change < 0 ? (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      ) : (
                        <Minus className="w-6 h-6 text-gray-400" />
                      )}
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Nuevo</p>
                        <p className={`text-2xl font-bold ${
                          comparisonResults.webmcpComparison.change > 0 
                            ? "text-green-400" 
                            : comparisonResults.webmcpComparison.change < 0 
                            ? "text-red-400" 
                            : "text-white"
                        }`}>
                          {comparisonResults.webmcpComparison.newScore}/7
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Checks Improved */}
                    {comparisonResults.webmcpComparison.checksImproved.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Checks Mejorados ({comparisonResults.webmcpComparison.checksImproved.length})
                        </h4>
                        <ul className="space-y-2">
                          {comparisonResults.webmcpComparison.checksImproved.map((check: any, idx: number) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                              <span className="text-xs text-gray-500">{check.id}</span>
                              <span>{check.name}</span>
                              <Badge className="ml-auto bg-green-600 text-white text-xs">
                                {check.oldStatus} → {check.status}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Checks Degraded */}
                    {comparisonResults.webmcpComparison.checksDegraded.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                          <TrendingDown className="w-4 h-4" />
                          Checks Empeorados ({comparisonResults.webmcpComparison.checksDegraded.length})
                        </h4>
                        <ul className="space-y-2">
                          {comparisonResults.webmcpComparison.checksDegraded.map((check: any, idx: number) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                              <span className="text-xs text-gray-500">{check.id}</span>
                              <span>{check.name}</span>
                              <Badge className="ml-auto bg-red-600 text-white text-xs">
                                {check.oldStatus} → {check.status}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {comparisonResults.webmcpComparison.checksImproved.length === 0 && 
                     comparisonResults.webmcpComparison.checksDegraded.length === 0 && (
                      <div className="col-span-2 text-center py-4">
                        <p className="text-gray-400 text-sm">No hay cambios en los checks de WebMCP</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Improvements */}
          {comparisonResults.improvements.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mejoras Implementadas ({comparisonResults.improvements.length})
                  </h2>
                  <p className="text-sm text-gray-600">Capas que mejoraron su estado</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {comparisonResults.improvements.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500 bg-green-50/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeColor(item.oldStatus)} className={getStatusColor(item.oldStatus)}>
                            {item.oldStatus}
                          </Badge>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <Badge variant={getStatusBadgeColor(item.newStatus)} className={getStatusColor(item.newStatus)}>
                            {item.newStatus}
                          </Badge>
                        </div>
                      </div>
                      {(item.oldScore !== undefined && item.newScore !== undefined) && (
                        <CardDescription>
                          Score: {item.oldScore.toFixed(1)} → {item.newScore.toFixed(1)} 
                          <span className="text-green-600 font-semibold ml-2">
                            (+{(item.newScore - item.oldScore).toFixed(1)})
                          </span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Estado actual:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {item.details.slice(0, 3).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                          {item.details.length > 3 && (
                            <li className="text-gray-500 italic">+ {item.details.length - 3} más...</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Degraded */}
          {comparisonResults.degraded.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <TrendingDown className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Áreas que Empeoraron ({comparisonResults.degraded.length})
                  </h2>
                  <p className="text-sm text-gray-600">Capas que requieren atención inmediata</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {comparisonResults.degraded.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-red-500 bg-red-50/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeColor(item.oldStatus)} className={getStatusColor(item.oldStatus)}>
                            {item.oldStatus}
                          </Badge>
                          <TrendingDown className="w-5 h-5 text-red-600" />
                          <Badge variant={getStatusBadgeColor(item.newStatus)} className={getStatusColor(item.newStatus)}>
                            {item.newStatus}
                          </Badge>
                        </div>
                      </div>
                      {(item.oldScore !== undefined && item.newScore !== undefined) && (
                        <CardDescription>
                          Score: {item.oldScore.toFixed(1)} → {item.newScore.toFixed(1)} 
                          <span className="text-red-600 font-semibold ml-2">
                            ({(item.newScore - item.oldScore).toFixed(1)})
                          </span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Problemas detectados:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {item.details.slice(0, 3).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">✗</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                          {item.details.length > 3 && (
                            <li className="text-gray-500 italic">+ {item.details.length - 3} más...</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Still Pending */}
          {comparisonResults.stillPending.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pendientes por Resolver ({comparisonResults.stillPending.length})
                  </h2>
                  <p className="text-sm text-gray-600">Capas que aún necesitan corrección</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {comparisonResults.stillPending.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-orange-500 bg-orange-50/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeColor(item.newStatus)} className={getStatusColor(item.newStatus)}>
                            {item.newStatus}
                          </Badge>
                        </div>
                      </div>
                      {(item.oldScore !== undefined && item.newScore !== undefined) && (
                        <CardDescription>
                          Score: {item.newScore.toFixed(1)}/10
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Requiere atención:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {item.details.slice(0, 3).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-600 mt-0.5">⚠</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                          {item.details.length > 3 && (
                            <li className="text-gray-500 italic">+ {item.details.length - 3} más...</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Summary */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Resumen de Cambios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{comparisonResults.improvements.length}</p>
                    <p className="text-sm text-gray-600">Mejoras</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{comparisonResults.stillPending.length}</p>
                    <p className="text-sm text-gray-600">Pendientes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{comparisonResults.degraded.length}</p>
                    <p className="text-sm text-gray-600">Empeoradas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                Descargar Comparación en PDF
              </button>
            </div>
          </section>
        </div>
      )}

      {!oldData && !newData && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-2">Sube ambos archivos JSON para comparar</p>
          <p className="text-gray-500 text-sm">Selecciona la auditoría antigua (Box 1) y la nueva (Box 2)</p>
        </div>
      )}

      {(oldData || newData) && !comparisonResults && (
        <div className="text-center py-12 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
          <p className="text-blue-700 text-lg mb-2">
            {oldData && !newData ? "Ahora sube la auditoría nueva (Box 2)" : "Ahora sube la auditoría antigua (Box 1)"}
          </p>
          <p className="text-blue-600 text-sm">Se generará la comparación automáticamente</p>
        </div>
      )}
    </div>
  );
}