import { useState } from "react";
import { FileCheck, X } from "lucide-react";
import { ScoreCard } from "./components/ScoreCard";
import { PriorityFixesTable } from "./components/PriorityFixesTable";
import { EstimatedImpact } from "./components/EstimatedImpact";
import { ImplementationRoadmap } from "./components/ImplementationRoadmap";
import { LayersAnalysis } from "./components/LayersAnalysis";
import { FileUpload } from "./components/FileUpload";
import { DownloadButtons } from "./components/DownloadButtons";
import { ScoreCharts } from "./components/ScoreCharts";
import { LayersStatusChart } from "./components/LayersStatusChart";
import { PriorityFixesChart } from "./components/PriorityFixesChart";
import { LayersAnalysisWithFilters } from "./components/LayersAnalysisWithFilters";
import { AuditInfo } from "./components/AuditInfo";
import { URLDiscovery } from "./components/URLDiscovery";
import { CriticalIssuesSummary } from "./components/CriticalIssuesSummary";
import { LocalSEOAnalysis } from "./components/LocalSEOAnalysis";
import { CompetitiveAnalysis } from "./components/CompetitiveAnalysis";
import { ExpectedOutcomes } from "./components/ExpectedOutcomes";
import { RecommendationsSummary } from "./components/RecommendationsSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ComparisonView } from "./components/ComparisonView";
import { ScoreBreakdown } from "./components/ScoreBreakdown";
import { TrendData } from "./components/TrendData";
import { CriticalFixesSection } from "./components/CriticalFixesSection";
import { WebMCPCard } from "./components/WebMCPCard";
import { AIVisibilityOpportunities } from "./components/AIVisibilityOpportunities";
import { MarketContext } from "./components/MarketContext";
import { CanonicalAuditSections } from "./components/CanonicalAuditSections";
import { generateCanonicalPDF } from "./utils/canonicalPdfGenerator";
import sampleAudit from "../../samples/sample-audit.json";

// Sample data basado en la estructura JSON proporcionada
const sampleData = {
  seo_score: 8.5,
  ai_visibility_score: 7.2,
  priority_fixes: [
    {
      category: "Critical",
      items: ["Falta JSON-LD", "Falta sitemap.xml", "Falta llms.txt"],
    },
    {
      category: "High",
      items: ["Optimizar meta description", "Mejorar Open Graph images"],
    },
    {
      category: "Medium",
      items: ["Agregar FAQ schema", "Reforzar linking interno"],
    },
    {
      category: "Low",
      items: ["Actualizar favicon", "Revisar theme-color"],
    },
  ],
  estimated_impact: {
    traffic_increase: "15-25%",
    ai_search_visibility: "Mejora notable",
    indexing_speed: "Optimizado",
  },
  implementation_roadmap: {
    week_1: ["Fix critical issues", "Agregar JSON-LD"],
    week_2: ["Optimizar meta tags", "Actualizar sitemap.xml"],
    week_3: ["Mejorar linking interno", "Agregar FAQ schema"],
    week_4: ["Revisión final y performance"],
  },
  layers: [
    {
      name: "Metadata & Head Tags",
      status: "Warning",
      details: ["Meta description demasiado corta", "Falta manifest"],
    },
    {
      name: "Open Graph & Sharing",
      status: "Fail",
      details: ["Falta og:image", "Twitter card incompleta"],
    },
    {
      name: "Structured Data (JSON-LD)",
      status: "Fail",
      details: ["No se detecta Organization", "Schema incompleto"],
    },
    {
      name: "Crawling & Indexing",
      status: "Warning",
      details: ["Falta sitemap.xml", "robots.txt sin reglas para AI bots"],
    },
    {
      name: "AI Search Optimization",
      status: "Fail",
      details: ["Falta llms.txt", "No hay entity homepage"],
    },
    {
      name: "Content Structure",
      status: "Warning",
      details: ["H1 duplicado", "Falta bloque FAQ"],
    },
    {
      name: "Technical Rendering",
      status: "Pass",
      details: ["HTML inicial correcto", "No requiere JS hydration"],
    },
    {
      name: "Internal Linking",
      status: "Medium",
      details: ["Orphan pages detectadas", "Anchor text débil"],
    },
    {
      name: "Analytics & Data",
      status: "Warning",
      details: ["GA4 presente pero sin eventos personalizados"],
    },
    {
      name: "Core Web Vitals",
      status: "Medium",
      details: ["LCP subóptimo", "Font blocking detectado"],
    },
    {
      name: "Entity SEO",
      status: "Fail",
      details: ["No hay sameAs links", "Brand entity inconsistente"],
    },
    {
      name: "Information Architecture",
      status: "Medium",
      details: ["Faltan pillar pages", "Topic clusters incompletos"],
    },
    {
      name: "Internal Link Graph",
      status: "Medium",
      details: ["Authority flow débil", "Anchor diversity baja"],
    },
    {
      name: "Content Depth",
      status: "Warning",
      details: ["Cobertura semántica insuficiente", "Faltan entidades clave"],
    },
    {
      name: "Search Intent Coverage",
      status: "Medium",
      details: ["Faltan páginas transaccionales", "Intento navegacional débil"],
    },
    {
      name: "Indexation Health",
      status: "Warning",
      details: ["Orphan pages", "Conflictos de canonical"],
    },
    {
      name: "SERP Optimization",
      status: "Medium",
      details: ["No hay featured snippet targeting", "FAQ extraction ausente"],
    },
    {
      name: "Performance SEO",
      status: "Medium",
      details: ["No hay lazy loading", "Font loading subóptimo"],
    },
    {
      name: "Content Modularity",
      status: "Warning",
      details: ["Faltan answer blocks", "No hay snippet ready paragraphs"],
    },
  ],
  status_distribution: {
    Pass: 5,
    Fail: 3,
    Warning: 6,
    Medium: 4,
  },
};

function App() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  // Función para normalizar los datos del JSON cargado
  const normalizeData = (data: any) => {
    const normalized = { ...data };

    // Detectar versión del JSON
    const isV5 = data.audit_metadata !== undefined;
    const isAuditInfo = data.audit_info !== undefined && !isV5; // formato con audit_info + overall_scores
    const isV1 = data.project !== undefined && !data.audit_metadata && !isAuditInfo;
    const isV23 = isAuditInfo && data.detailed_layer_analysis !== undefined;
    const isV24 = isAuditInfo && !data.overall_scores && !data.detailed_layer_analysis && Array.isArray(data.layers);
    const hasScoreBreakdownObjects = data.score_breakdown && typeof data.score_breakdown === 'object' &&
                                      Object.values(data.score_breakdown)[0] &&
                                      typeof Object.values(data.score_breakdown)[0] === 'object' &&
                                      (Object.values(data.score_breakdown)[0] as any).score !== undefined;

    // Formato audit_info: extraer metadatos y scores
    if (isAuditInfo && data.audit_info) {
      normalized.site = data.audit_info.site_url || normalized.site;
      normalized.brand = data.brand || data.audit_info.site_url || normalized.brand;
      normalized.audit_date = data.audit_info.audit_date || normalized.audit_date;
      normalized.auditor = data.audit_info.auditor || normalized.auditor;
      normalized.pages_audited_count = data.audit_info.pages_audited ?? normalized.pages_audited_count;
    }

    // Formato audit_info: extraer overall_scores como campos de primer nivel
    if (isAuditInfo && data.overall_scores) {
      const os = data.overall_scores;
      normalized.seo_score = os.seo_score ?? normalized.seo_score;
      normalized.ai_visibility_score = os.ai_visibility_score ?? normalized.ai_visibility_score;
      normalized.technical_seo_score = os.technical_seo_score;
      normalized.content_seo_score = os.content_seo_score;
      normalized.user_experience_score = os.user_experience_score;
      normalized.local_seo_score = os.local_seo_score;
    }

    // v3.25: conservar el contrato canónico 2.6 y exponer metadatos de versión.
    if (data.schema_version || data.export_contract === "single_json") {
      normalized.audit_version = `Dashboard 3.25 · JSON ${data.schema_version || "2.6"}`;
      normalized.total_checks = data.data_quality?.counts?.checks ?? data.summary?.total_checks ?? data.checks?.length;
      normalized.layers_analyzed = data.data_quality?.counts?.layers ?? data.layers?.length;
      normalized.pages_audited_count =
        data.data_quality?.counts?.pages_audited ?? data.audit_info?.pages_audited;
      if (!Array.isArray(normalized.pages_audited)) {
        normalized.pages_audited = (data.pages || [])
          .filter((page: any) => page.audit_status === "AUDITED")
          .map((page: any) => page.url);
      }
      if (data.url_discovery) {
        normalized.url_discovery = {
          ...data.url_discovery,
          invalid_urls: data.url_discovery.invalid_urls ?? data.url_discovery.invalid_urls_404 ?? 0,
          sitemap_check_result:
            data.url_discovery.sitemap_check_result ??
            (data.url_discovery.sitemap_available ? "available" : "404_not_found"),
        };
      }
      if (data.local_seo_analysis) {
        const hasCanonicalLocalScore = Object.prototype.hasOwnProperty.call(
          data.local_seo_analysis,
          "local_seo_score",
        );
        normalized.local_seo_analysis = {
          ...data.local_seo_analysis,
          local_seo_score:
            (hasCanonicalLocalScore
              ? data.local_seo_analysis.local_seo_score
              : data.local_seo_analysis.local_optimization_score) ?? null,
        };
      }
    }

    // v2.3: detailed_layer_analysis (object) → layers array
    if (isV23 && !data.layers) {
      const statusMap: Record<string, string> = {
        good: "Pass", appears_good: "Pass", focused: "Pass", excellent: "Pass", strong: "Pass",
        critical_issues: "Fail", poor: "Fail", missing: "Fail", completely_missing: "Fail", concerning: "Fail",
        moderate_issues: "Warning", requires_live_testing: "Warning", requires_verification: "Warning",
        requires_check: "Warning", good_with_gaps: "Warning", moderate: "Warning", basic: "Warning",
        conservative: "Warning", mixed: "Warning",
      };

      normalized.layers = Object.entries(data.detailed_layer_analysis).map(([key, layerData]: [string, any]) => {
        const namePart = key.replace(/^layer_\d+_/, "").replace(/_/g, " ");
        const layerName = namePart.replace(/\b\w/g, (c) => c.toUpperCase());
        const rawStatus = String(layerData.status || "").toLowerCase().replace(/ /g, "_");
        const status = statusMap[rawStatus] || "Warning";
        const rawScore = layerData.score;
        const numericScore = typeof rawScore === "number" ? rawScore : undefined;

        const skipFields = new Set(["score", "status", "detailed_checks"]);
        const details: string[] = [];

        Object.entries(layerData).forEach(([k, v]) => {
          if (skipFields.has(k)) return;
          if (typeof v === "string" || typeof v === "number") {
            const fieldName = k.replace(/_/g, " ");
            const fieldValue = String(v).replace(/_/g, " ");
            details.push(`${fieldName}: ${fieldValue}`);
          }
        });

        // Flatten detailed_checks (layer 21)
        if (layerData.detailed_checks) {
          Object.entries(layerData.detailed_checks).forEach(([ck, cd]: [string, any]) => {
            const checkName = ck.replace(/^check_\d+_/, "").replace(/_/g, " ");
            if (cd.issues) details.push(`${checkName} — issues: ${String(cd.issues).replace(/_/g, " ")}`);
            if (cd.positives) details.push(`${checkName} — positives: ${String(cd.positives).replace(/_/g, " ")}`);
            if (cd.improvement) details.push(`${checkName} — improvement: ${String(cd.improvement).replace(/_/g, " ")}`);
          });
        }

        return { name: layerName, status, score: numericScore, details };
      });
    }

    // v2.3: priority_issues_summary → priority_fixes
    if (isV23 && data.priority_issues_summary && !data.priority_fixes) {
      const pis = data.priority_issues_summary;
      const map: [string, string][] = [
        ["Critical", "critical_immediate"],
        ["High", "high_priority_short_term"],
        ["Medium", "medium_priority_optimization"],
        ["Low", "low_priority_enhancement"],
      ];
      normalized.priority_fixes = map
        .filter(([, k]) => pis[k]?.length > 0)
        .map(([label, k]) => ({
          category: label,
          items: (pis[k] as string[]).map((s) => s.replace(/_/g, " ")),
        }));
    }

    // v2.3: implementation_timeline → implementation_roadmap
    if (isV23 && data.implementation_timeline && !data.implementation_roadmap) {
      const it = data.implementation_timeline;
      const roadmap: Record<string, string[]> = {};
      Object.entries(it).forEach(([key, tasks]) => {
        const m = key.match(/^(week_\d+)/);
        if (m && Array.isArray(tasks)) {
          roadmap[m[1]] = (tasks as string[]).map((t) => t.replace(/_/g, " "));
        }
      });
      normalized.implementation_roadmap = roadmap;
    }

    // v2.3: success_projections → expected_outcomes + estimated_impact
    if (isV23 && data.success_projections && !data.expected_outcomes) {
      const sp = data.success_projections;
      const clean = (obj: Record<string, any>) =>
        Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.replace(/_/g, " "), String(v).replace(/_/g, " ")]));
      const outcomes: Record<string, any> = {};
      if (sp["4_week_outcomes"]) outcomes["1_month"] = clean(sp["4_week_outcomes"]);
      if (sp["3_month_targets"]) outcomes["3_months"] = clean(sp["3_month_targets"]);
      if (sp.annual_roi_potential) outcomes["12_months"] = clean(sp.annual_roi_potential);
      normalized.expected_outcomes = outcomes;
    }

    // v2.3: pass through new sections
    if (isV23) {
      normalized.mexican_market_context = data.mexican_market_context;
      normalized.ai_visibility_opportunities = data.ai_visibility_opportunities;
      normalized.audit_completion = data.audit_completion;
    }

    // v2.3: synthesize critical_issues_summary from priority_issues_summary
    if (isV23 && data.priority_issues_summary && !normalized.critical_issues_summary) {
      const pis = data.priority_issues_summary;
      const criticals = (pis.critical_immediate || []) as string[];
      const highs = (pis.high_priority_short_term || []) as string[];
      const meds = (pis.medium_priority_optimization || []) as string[];
      normalized.critical_issues_summary = {
        total_critical_issues: criticals.length,
        total_high_priority_issues: highs.length,
        total_warnings: meds.length,
        blocking_issues: criticals.map((s: string) => s.replace(/_/g, " ")),
      };
    }

    // v2.3: synthesize local_seo_analysis from mexican_market_context + overall_scores
    if (isV23 && data.mexican_market_context && !normalized.local_seo_analysis) {
      const mmc = data.mexican_market_context;
      const la = mmc.local_seo_assessment || {};
      const ip = mmc.industry_positioning || {};
      const issues: string[] = [];
      const strengths: string[] = [];
      Object.entries(la).forEach(([k, v]) => {
        const text = `${k.replace(/_/g, " ")}: ${String(v).replace(/_/g, " ")}`;
        if (String(v).includes("missing") || String(v).includes("underutilized")) {
          issues.push(text);
        } else {
          strengths.push(text);
        }
      });
      Object.entries(ip).forEach(([k, v]) => {
        strengths.push(`${k.replace(/_/g, " ")}: ${String(v).replace(/_/g, " ")}`);
      });
      normalized.local_seo_analysis = {
        local_seo_score: data.overall_scores?.local_seo_score ?? 0,
        issues_found: issues.length > 0 ? issues : ["Revisar marcado LocalBusiness schema"],
        strengths: strengths.length > 0 ? strengths : [],
      };
    }

    // v2.3: synthesize competitive_analysis from ai_visibility_opportunities (partial)
    if (isV23 && data.ai_visibility_opportunities && !normalized.competitive_analysis) {
      const aio = data.ai_visibility_opportunities;
      const gaps: string[] = [];
      const advantages: string[] = [];
      Object.entries(aio.immediate_impact || {}).forEach(([k, v]) => {
        gaps.push(`${k.replace(/_/g, " ")}: ${String(v).replace(/_/g, " ")}`);
      });
      Object.entries(aio.long_term_positioning || {}).forEach(([k, v]) => {
        advantages.push(`${k.replace(/_/g, " ")}: ${String(v).replace(/_/g, " ")}`);
      });
      normalized.competitive_analysis = {
        market_position: "Ver análisis de mercado completo en Contexto de Mercado",
        competitive_gaps: gaps,
        competitive_advantages: advantages,
      };
    }

    // v2.3: synthesize recommendations_summary from success_projections + priority_issues_summary
    if (isV23 && data.success_projections && !normalized.recommendations_summary) {
      const sp = data.success_projections;
      const pis = data.priority_issues_summary || {};
      const critCount = (pis.critical_immediate || []).length;
      const highCount = (pis.high_priority_short_term || []).length;
      const w4 = sp["4_week_outcomes"] || {};
      const m3 = sp["3_month_targets"] || {};
      const focusItems = [
        ...Object.values(w4).slice(0, 2).map((v: any) => String(v).replace(/_/g, " ")),
      ];
      normalized.recommendations_summary = {
        critical_fixes: critCount,
        high_priority_fixes: highCount,
        total_implementation_hours: (critCount + highCount) * 3,
        primary_focus: focusItems.join(" · "),
        success_probability: Object.values(m3).slice(0, 1).map((v: any) => String(v).replace(/_/g, " ")).join(""),
      };
    }

    // v2.3: synthesize webmcp_readiness from layer_21 detailed_checks (AI readiness flavor)
    if (isV23 && data.detailed_layer_analysis?.layer_21_webmcp_ai_readiness && !normalized.webmcp_readiness) {
      const l21 = data.detailed_layer_analysis.layer_21_webmcp_ai_readiness;
      const checks = l21.detailed_checks || {};
      const checkEntries = Object.entries(checks);
      const passCount = checkEntries.filter(([, c]: [string, any]) =>
        ["good", "excellent", "strong"].includes(String(c.status).toLowerCase())
      ).length;
      const checksFormatted: Record<string, any> = {};
      checkEntries.forEach(([key, c]: [string, any]) => {
        const cleanKey = key.replace(/^check_\d+_/, "");
        const statusRaw = String(c.status || "").toLowerCase();
        const status = ["good", "excellent", "strong"].includes(statusRaw)
          ? "PASS"
          : ["moderate"].includes(statusRaw)
          ? "WARNING"
          : "FAIL";
        checksFormatted[cleanKey] = {
          status,
          issue: c.issues ? String(c.issues).replace(/_/g, " ") : c.improvement ? String(c.improvement).replace(/_/g, " ") : "",
        };
      });
      normalized.webmcp_readiness = {
        score: passCount,
        max_score: checkEntries.length,
        level: passCount >= 5 ? "High" : passCount >= 3 ? "Medium" : "Low",
        readiness_percentage: Math.round((passCount / Math.max(checkEntries.length, 1)) * 100),
        checks: checksFormatted,
      };
    }

    // Formato audit_info: normalizar priority_fixes de objeto {critical:[],high:[]} a array
    if (isAuditInfo && data.priority_fixes && !Array.isArray(data.priority_fixes)) {
      const pf = data.priority_fixes;
      const priorityMap: [string, string][] = [
        ["Critical", "critical"],
        ["High", "high"],
        ["Medium", "medium"],
        ["Low", "low"],
      ];
      normalized.priority_fixes = priorityMap
        .filter(([, key]) => pf[key] && pf[key].length > 0)
        .map(([label, key]) => ({
          category: label,
          items: pf[key].map((fix: any) =>
            typeof fix === "string" ? fix : `${fix.issue} — ${fix.impact || ""} (${fix.estimated_effort || ""})`
          ),
        }));
    }

    // Formato audit_info v2.2: pasar secciones nuevas directamente (no sobreescribir valores sintetizados)
    if (isAuditInfo) {
      if (data.url_discovery) normalized.url_discovery = data.url_discovery;
      else if (data.url_discovery_process) { /* ya mapeado en bloque v2.4 */ }
      if (data.critical_issues_summary && !isV24) normalized.critical_issues_summary = data.critical_issues_summary;
      if (data.local_seo_analysis && !isV24) normalized.local_seo_analysis = data.local_seo_analysis;
      if (data.competitive_analysis) normalized.competitive_analysis = data.competitive_analysis;
      if (data.expected_outcomes) normalized.expected_outcomes = data.expected_outcomes;
      if (data.recommendations_summary && !isV24) normalized.recommendations_summary = data.recommendations_summary;

      // Mapear implementation_priority → implementation_roadmap
      if (data.implementation_priority && !data.implementation_roadmap) {
        const ip = data.implementation_priority;
        const mapped: Record<string, any> = {};
        if (ip.immediate_critical) mapped["phase_1"] = { focus: "Crítico Inmediato", tasks: ip.immediate_critical };
        if (ip.week_1_high) mapped["phase_2"] = { focus: "Semana 1 — Alta prioridad", tasks: ip.week_1_high };
        if (ip.week_2_essential) mapped["phase_3"] = { focus: "Semana 2 — Esencial", tasks: ip.week_2_essential };
        if (ip.month_1_important) mapped["phase_4"] = { focus: "Mes 1 — Importante", tasks: ip.month_1_important };
        normalized.implementation_roadmap = mapped;
      }

      // Mapear expected_outcomes → estimated_impact
      if (data.expected_outcomes && !data.estimated_impact) {
        const o3 = data.expected_outcomes["3_months"] || {};
        normalized.estimated_impact = {
          traffic_increase: o3.organic_traffic_increase || "—",
          ai_search_visibility: o3.ai_visibility_improvement || "—",
          indexing_speed: o3.technical_score_improvement || "—",
        };
      }

      // v2.3: estimated_impact desde success_projections
      if (data.success_projections && !data.estimated_impact) {
        const sp = data.success_projections;
        const w4 = sp["4_week_outcomes"] || {};
        const m3 = sp["3_month_targets"] || {};
        normalized.estimated_impact = {
          traffic_increase: (m3.organic_traffic_growth || w4.search_visibility || "—").replace(/_/g, " "),
          ai_search_visibility: (m3.ai_visibility || w4.ai_readiness_score || "—").replace(/_/g, " "),
          indexing_speed: (w4.technical_compliance || "—").replace(/_/g, " "),
        };
      }

      // Generar priority_fixes desde critical_issues_summary si no existe
      if (data.critical_issues_summary && !data.priority_fixes) {
        const blocking = (data.critical_issues_summary.blocking_issues || []) as string[];
        if (blocking.length > 0) {
          normalized.priority_fixes = [
            { category: "Critical", items: blocking },
          ];
        }
      }

      // Extraer pages_found y pages_audited desde url_discovery si existen
      if (data.url_discovery) {
        normalized.pages_found = data.url_discovery.total_urls_discovered ?? normalized.pages_found;
        normalized.pages_audited = data.url_discovery.valid_urls_200 ?? normalized.pages_audited;
      }
    }

    // Si es v5, extraer datos de audit_metadata para compatibilidad
    if (isV5 && data.audit_metadata) {
      normalized.site = data.audit_metadata.url || normalized.site;
      normalized.brand = data.audit_metadata.platform || normalized.brand;
      normalized.audit_date = data.audit_metadata.date || normalized.audit_date;
      normalized.auditor = data.audit_metadata.auditor || normalized.auditor;
      normalized.audit_version = data.audit_metadata.audit_version;
      normalized.total_checks = data.audit_metadata.total_checks;
      normalized.layers_analyzed = data.audit_metadata.layers_analyzed;
      normalized.baseline_version = data.audit_metadata.baseline_version;
    }

    // Si es v1, extraer datos de campos diferentes
    if (isV1) {
      normalized.brand = data.project || normalized.brand;
    }

    // Si es v5, extraer composite_scores
    if (isV5 && data.composite_scores) {
      normalized.seo_score = data.composite_scores.seo_score || normalized.seo_score;
      normalized.ai_visibility_score = data.composite_scores.ai_visibility_score || normalized.ai_visibility_score;
      normalized.technical_seo_score = data.composite_scores.technical_seo_score;
      normalized.content_seo_score = data.composite_scores.content_seo_score;
      normalized.score_breakdown = data.composite_scores.score_breakdown;
    }

    // Si es v5, normalizar critical_fixes_v5 a priority_fixes
    if (isV5 && data.critical_fixes_v5 && Array.isArray(data.critical_fixes_v5)) {
      // Agrupar por prioridad
      const fixesByPriority: { [key: string]: string[] } = {
        Critical: [],
        High: [],
        Medium: [],
        Low: []
      };

      data.critical_fixes_v5.forEach((fix: any) => {
        const fixText = `[${fix.fix_id}] ${fix.title} - Layer ${fix.layer}: ${fix.impact}`;
        
        // Mapear prioridades P0, P1, P2 a Critical, High, Medium, Low
        if (fix.priority === 'P0') {
          fixesByPriority.Critical.push(fixText);
        } else if (fix.priority === 'P1') {
          fixesByPriority.High.push(fixText);
        } else if (fix.priority === 'P2') {
          fixesByPriority.Medium.push(fixText);
        } else {
          fixesByPriority.Low.push(fixText);
        }
      });

      // Convertir a formato priority_fixes
      normalized.priority_fixes = Object.keys(fixesByPriority)
        .filter(category => fixesByPriority[category].length > 0)
        .map(category => ({
          category,
          items: fixesByPriority[category]
        }));
      
      // Guardar también el formato original para uso posterior
      normalized.critical_fixes_v5 = data.critical_fixes_v5;
    }

    // Si es v1, normalizar priority_fixes (formato diferente)
    if (isV1 && data.priority_fixes && Array.isArray(data.priority_fixes)) {
      // v1 tiene objetos con severity, title, pages_affected, effort, reason
      const fixesByPriority: { [key: string]: string[] } = {
        Critical: [],
        High: [],
        Medium: [],
        Low: []
      };

      data.priority_fixes.forEach((fix: any) => {
        const severity = fix.severity || 'Medium';
        const fixText = `${fix.title} - ${fix.reason || ''} (Effort: ${fix.effort || 'Unknown'})`;
        
        if (fixesByPriority[severity]) {
          fixesByPriority[severity].push(fixText);
        } else {
          fixesByPriority.Medium.push(fixText);
        }
      });

      // Convertir a formato priority_fixes estándar
      normalized.priority_fixes = Object.keys(fixesByPriority)
        .filter(category => fixesByPriority[category].length > 0)
        .map(category => ({
          category,
          items: fixesByPriority[category]
        }));
    }

    // v2.4: normalizar formato sin overall_scores
    if (isV24) {
      // Calcular seo_score y ai_visibility_score desde layers
      const scoreLayers = (data.layers as any[]).filter(
        (l: any) => typeof l.score === "number" && l.id !== 21
      );
      const aiLayer = (data.layers as any[]).find((l: any) => l.id === 21);
      const avgScore =
        scoreLayers.length > 0
          ? scoreLayers.reduce((sum: number, l: any) => sum + l.score, 0) / scoreLayers.length
          : 0;
      normalized.seo_score = parseFloat(avgScore.toFixed(1));
      normalized.ai_visibility_score = aiLayer?.score ?? parseFloat((avgScore * 0.7).toFixed(1));

      // url_discovery_process → url_discovery
      if (data.url_discovery_process && !data.url_discovery) {
        const p = data.url_discovery_process;
        normalized.url_discovery = {
          method_used: p.discovery_method || "",
          sitemap_check_result: p.sitemap_status || "404_not_found",
          robots_txt_check_result: p.robots_txt_status || "404_not_found",
          total_urls_discovered: (p.discovered_urls || []).length,
          valid_urls_200: (p.discovered_urls || []).length,
          invalid_urls: (p.failed_urls || []).length,
          coverage_percentage: p.confidence_level || "",
          discovery_notes: `Confidence: ${p.confidence_level || ""}`,
          discovered_urls: p.discovered_urls || [],
        };
      }

      // Normalizar local_seo_analysis: local_strengths/local_gaps → strengths/issues_found
      if (data.local_seo_analysis) {
        const la = data.local_seo_analysis;
        normalized.local_seo_analysis = {
          ...la,
          local_seo_score: la.local_optimization_score ?? la.local_seo_score ?? 0,
          issues_found: la.local_gaps || la.issues_found || [],
          strengths: la.local_strengths || la.strengths || [],
        };
      }

      // Normalizar critical_issues_summary: immediate_actions → blocking_issues
      if (data.critical_issues_summary) {
        const cs = data.critical_issues_summary;
        normalized.critical_issues_summary = {
          ...cs,
          total_critical_issues: (cs.infrastructure_missing || []).length,
          total_high_priority_issues: (data.priority_fixes?.find((f: any) => f.category === "High")?.items || []).length,
          total_warnings: (data.priority_fixes?.find((f: any) => f.category === "Medium")?.items || []).length,
          blocking_issues: cs.immediate_actions || cs.blocking_issues || cs.infrastructure_missing || [],
        };
      }

      // recommendations_summary → también mapear como implementation_roadmap
      if (data.recommendations_summary && !data.implementation_roadmap) {
        const rs = data.recommendations_summary;
        const roadmap: Record<string, string[]> = {};
        if (rs.week_1_priorities) roadmap["week_1"] = rs.week_1_priorities;
        if (rs.week_2_priorities) roadmap["week_2"] = rs.week_2_priorities;
        if (rs.week_3_priorities) roadmap["week_3"] = rs.week_3_priorities;
        if (rs.week_4_priorities) roadmap["week_4"] = rs.week_4_priorities;
        if (Object.keys(roadmap).length > 0) normalized.implementation_roadmap = roadmap;
        // Normalizar el summary con campos esperados
        normalized.recommendations_summary = {
          ...rs,
          critical_fixes: (data.priority_fixes?.find((f: any) => f.category === "Critical")?.items || []).length,
          high_priority_fixes: (data.priority_fixes?.find((f: any) => f.category === "High")?.items || []).length,
          total_implementation_hours: parseInt(rs.estimated_total_effort || "0") || 60,
          primary_focus: rs.week_1_priorities?.[0] || "",
          success_probability: rs.expected_timeline || "",
        };
      }

      // Normalizar webmcp_readiness: mapear check keys al formato estándar si difieren
      if (data.webmcp_readiness) {
        const w = data.webmcp_readiness;
        const rawChecks = w.checks || {};
        // Intentar construir checks estándar si faltan las claves estándar
        const standardKeys = ["actions_json", "ai_entity_credibility", "hreflang_integrity", "missing_schemas", "pwa_manifest", "cta_clarity", "ai_visibility_manual"];
        const hasStandardKeys = standardKeys.some((k) => rawChecks[k]);
        if (!hasStandardKeys) {
          // Mapear lo que tengamos al formato estándar (primeros 7 checks del JSON)
          const entries = Object.entries(rawChecks);
          const mapped: Record<string, any> = {};
          const targetKeys = standardKeys;
          entries.forEach(([, val], i) => {
            if (i < targetKeys.length) mapped[targetKeys[i]] = val;
          });
          normalized.webmcp_readiness = { ...w, checks: { ...mapped, ...rawChecks } };
        }
      }

      // Estimated impact desde priority_fixes
      if (data.priority_fixes && !normalized.estimated_impact) {
        const critItems = data.priority_fixes.find((f: any) => f.category === "Critical")?.items || [];
        normalized.estimated_impact = {
          traffic_increase: "50-100% estimado en 3 meses",
          ai_search_visibility: "Mejora notable tras implementar schema markup",
          indexing_speed: "Optimizado tras robots.txt + sitemap.xml",
        };
      }
    }

    // Normalizar status de las capas
    if (normalized.layers && Array.isArray(normalized.layers)) {
      normalized.layers = normalized.layers.map((layer: any) => {
        let normalizedStatus = layer.status;

        // Convertir status a los valores esperados (acepta mayúsculas y minúsculas)
        const statusUpper = String(layer.status || "").toUpperCase();

        if (statusUpper === "PASS" || statusUpper === "OK" || statusUpper === "SUCCESS" || statusUpper === "APROBADO") {
          normalizedStatus = "Pass";
        } else if (statusUpper === "FAIL" || statusUpper === "FAILED" || statusUpper === "ERROR" || statusUpper === "FALLIDO" || statusUpper === "CRITICAL") {
          normalizedStatus = "Fail";
        } else if (statusUpper === "WARNING" || statusUpper === "WARN" || statusUpper === "ADVERTENCIA" || statusUpper === "ALERTA") {
          normalizedStatus = "Warning";
        } else if (statusUpper === "MEDIUM" || statusUpper === "MEDIO" || statusUpper === "INFO" || statusUpper === "INFORMACIÓN") {
          normalizedStatus = "Medium";
        }

        // Normalizar el nombre de la capa: audit_info usa "layer_name", v1 usa "layer", v2/v3/v5 usan "name"
        const layerName = layer.name || layer.layer_name || layer.layer || "Unknown Layer";

        // Normalizar los detalles: v5 usa "key_findings", v1 usa "details", v2/v3 usan "pass_items" y "fail_items"
        let details = [];
        let fail_items = layer.fail_items || [];
        let pass_items = layer.pass_items || [];
        let warning_items = layer.warning_items || [];
        
        if (layer.key_findings && Array.isArray(layer.key_findings)) {
          // v5 tiene key_findings - extraer FAILs y WARNINGs del texto
          details = layer.key_findings;
          
          // Extraer items con FAIL o WARNING del texto de key_findings
          layer.key_findings.forEach((finding: string) => {
            const findingUpper = finding.toUpperCase();
            if (findingUpper.includes("FAIL:") || findingUpper.startsWith("FAIL ")) {
              // Extraer el texto después de "FAIL:"
              const failText = finding.replace(/FAIL:\s*/i, '').trim();
              fail_items.push(failText);
            } else if (findingUpper.includes("WARNING:") || findingUpper.startsWith("WARNING ")) {
              // Extraer el texto después de "WARNING:"
              const warningText = finding.replace(/WARNING:\s*/i, '').trim();
              warning_items.push(warningText);
            } else {
              // Si no tiene FAIL ni WARNING, es un PASS
              pass_items.push(finding);
            }
          });
        } else if (layer.details && Array.isArray(layer.details)) {
          details = layer.details;
        } else if (layer.details && typeof layer.details === "string") {
          // audit_info format: details is a string, critical_issues is an array
          details = [layer.details, ...(layer.critical_issues || [])];
        } else {
          // Combinar pass_items y fail_items en un solo array de detalles
          if (layer.fail_items && Array.isArray(layer.fail_items)) {
            details = [...details, ...layer.fail_items];
          }
          if (layer.pass_items && Array.isArray(layer.pass_items)) {
            details = [...details, ...layer.pass_items];
          }
        }

        return {
          ...layer,
          name: layerName, // Asegurar que siempre hay un campo "name"
          status: normalizedStatus,
          details: details, // Asegurar que siempre hay un campo "details"
          fail_items: fail_items.length > 0 ? fail_items : undefined,
          pass_items: pass_items.length > 0 ? pass_items : undefined,
          warning_items: warning_items.length > 0 ? warning_items : undefined,
          // Preservar campos específicos de v5
          checks_passed: layer.checks_passed,
          checks_total: layer.checks_total,
          improvements_from_v4: layer.improvements_from_v4,
          score: layer.score,
          weight: layer.weight,
          key_findings: layer.key_findings
        };
      });
    }

    // Normalizar score_breakdown si existe con objetos complejos (v1/v3)
    if (hasScoreBreakdownObjects && !data.schema_version) {
      // Convertir score_breakdown de v1/v3 al formato simple de v5
      const simpleBreakdown: any = {};
      Object.keys(data.score_breakdown).forEach(key => {
        const item = data.score_breakdown[key];
        if (item && typeof item === 'object' && item.score !== undefined) {
          simpleBreakdown[key] = item.score;
        }
      });
      // Preservar el original y agregar versión simplificada
      normalized.score_breakdown_full = data.score_breakdown;
      normalized.score_breakdown = simpleBreakdown;
    } else if (normalized.score_breakdown && typeof normalized.score_breakdown === 'object') {
      // v5 o formato simple - solo normalizar status si existe
      Object.keys(normalized.score_breakdown).forEach(key => {
        const item = normalized.score_breakdown[key];
        if (item && item.status) {
          const statusUpper = String(item.status).toUpperCase();
          if (statusUpper === "PASS" || statusUpper === "OK") {
            item.status = "Pass";
          } else if (statusUpper === "FAIL" || statusUpper === "FAILED" || statusUpper === "ERROR") {
            item.status = "Fail";
          } else if (statusUpper === "WARNING" || statusUpper === "WARN") {
            item.status = "Warning";
          } else if (statusUpper === "MEDIUM" || statusUpper === "INFO") {
            item.status = "Medium";
          }
        }
      });
    }

    // Normalizar status_distribution (v3 usa mayúsculas, otros minúsculas)
    if (normalized.status_distribution) {
      const dist = normalized.status_distribution;
      normalized.status_distribution = {
        Pass: dist.Pass || dist.PASS || 0,
        Fail: dist.Fail || dist.FAIL || 0,
        Warning: dist.Warning || dist.WARNING || 0,
        Medium: dist.Medium || dist.MEDIUM || 0,
      };
    } else if (normalized.layers && Array.isArray(normalized.layers)) {
      // Si no hay status_distribution, calcularlo desde las capas
      const dist = { Pass: 0, Fail: 0, Warning: 0, Medium: 0 };
      normalized.layers.forEach((layer: any) => {
        const s = String(layer.status || "").toLowerCase();
        if (s === "pass") dist.Pass++;
        else if (s === "fail") dist.Fail++;
        else if (s === "warning") dist.Warning++;
        else dist.Medium++;
      });
      normalized.status_distribution = dist;
    }

    // Preservar pending_blockers y trend_data de v5
    if (isV5) {
      normalized.pending_blockers = data.pending_blockers;
      normalized.trend_data = data.trend_data;
    }

    // Extraer datos de WebMCP & AI-Readiness - puede estar en layers o en webmcp_readiness
    if (data.webmcp_readiness) {
      console.log('webmcp_readiness encontrado en nivel superior:', data.webmcp_readiness);
      
      const wmcp = data.webmcp_readiness;
      const checks = wmcp.checks || {};
      
      // Convertir los checks del formato v11 al formato esperado por el componente
      const webmcpChecks = [
        {
          id: "21.1",
          name: "actions.json",
          status: checks.actions_json?.status || "FAIL",
          detail: checks.actions_json?.issue || "No data available",
          manualCheck: false
        },
        {
          id: "21.2",
          name: "AI Entity Credibility",
          status: checks.ai_entity_credibility?.status || "FAIL",
          detail: checks.ai_entity_credibility?.issue || "No data available",
          manualCheck: false
        },
        {
          id: "21.3",
          name: "Hreflang Integrity",
          status: checks.hreflang_integrity?.status || "FAIL",
          detail: checks.hreflang_integrity?.issue || "No data available",
          manualCheck: false
        },
        {
          id: "21.4",
          name: "Critical Schemas",
          status: checks.missing_schemas?.status || "FAIL",
          detail: checks.missing_schemas?.issue || "No data available",
          manualCheck: false
        },
        {
          id: "21.5",
          name: "PWA Manifest",
          status: checks.pwa_manifest?.status || "FAIL",
          detail: checks.pwa_manifest?.issue || "No data available",
          manualCheck: false
        },
        {
          id: "21.6",
          name: "CTA Clarity",
          status: checks.cta_clarity?.status || "FAIL",
          detail: checks.cta_clarity?.issue || "No data available",
          manualCheck: false
        },
        {
          id: "21.7",
          name: "AI Visibility",
          status: checks.ai_visibility_manual?.status || "N/A",
          detail: checks.ai_visibility_manual?.issue || "Manual check required",
          manualCheck: true
        }
      ];
      
      // Extraer priority fixes
      const priorityFixes = (wmcp.priority_fixes || []).map((fix: any) => 
        `${fix.check_id}: ${fix.fix} (${fix.effort})`
      );
      
      normalized.webmcp_data = {
        layer_id: 21,
        score: wmcp.score || 0,
        total_checks: wmcp.max_score || 7,
        checks: webmcpChecks,
        priority_fixes: priorityFixes,
        last_ai_check_date: wmcp.checks?.ai_visibility_manual?.last_run || undefined
      };
      
      console.log('webmcp_data extraído:', normalized.webmcp_data);
    } else if (normalized.layers && Array.isArray(normalized.layers)) {
      // Buscar en layers si no está en nivel superior
      const layer21 = normalized.layers.find((layer: any) => 
        layer.layer_id === 21 || 
        layer.layer_id === "21" ||
        (layer.name && layer.name.toLowerCase().includes('webmcp')) ||
        (layer.name && layer.name.toLowerCase().includes('ai-readiness'))
      );
      
      if (layer21) {
        console.log('Layer 21 encontrada en layers:', layer21);
        
        // Intentar extraer datos en diferentes formatos posibles
        let webmcpChecks = layer21.webmcp_checks || layer21.checks || [];
        
        // Si webmcp_checks no existe, intentar construirlo desde key_findings o detalles
        if (!webmcpChecks || webmcpChecks.length === 0) {
          // Estructura por defecto basada en los 7 checks estándar
          const checkNames = [
            "actions.json",
            "AI Entity Credibility", 
            "Hreflang Integrity",
            "Critical Schemas",
            "PWA Manifest",
            "CTA Clarity",
            "AI Visibility"
          ];
          
          webmcpChecks = checkNames.map((name, index) => ({
            id: `21.${index + 1}`,
            name: name,
            status: layer21.status || "FAIL",
            detail: layer21.key_findings && layer21.key_findings[index] 
              ? layer21.key_findings[index] 
              : "Check details not available",
            manualCheck: index === 6 // 21.7 es manual check
          }));
        }
        
        normalized.webmcp_data = {
          layer_id: layer21.layer_id || 21,
          score: layer21.checks_passed || layer21.score || 0,
          total_checks: layer21.checks_total || 7,
          checks: webmcpChecks,
          priority_fixes: layer21.priority_fixes || [],
          last_ai_check_date: layer21.last_ai_check_date || layer21.last_check_date || undefined
        };
        
        console.log('webmcp_data extraído desde layers:', normalized.webmcp_data);
      } else {
        console.log('WebMCP data no encontrado');
      }
    }

    return normalized;
  };

  const handleFileUpload = (file: File) => {
    console.log("File received:", file);
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        console.log("JSON parsed:", json);
        const normalizedJson = normalizeData(json);
        console.log("Normalized JSON:", normalizedJson);
        setReportData(normalizedJson);
        setIsLoading(false);
      } catch (error) {
        alert("Error al leer el archivo JSON. Asegúrate de que sea un JSON válido.");
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      alert("Error al leer el archivo.");
      console.error("FileReader error");
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  // Loads the bundled fictional audit (samples/sample-audit.json) so the dashboard can be explored without an upload.
  const handleLoadSample = () => {
    setFileName("sample-audit.json");
    setReportData(normalizeData(JSON.parse(JSON.stringify(sampleAudit))));
  };

  const handleDownload = () => {
    const data = reportData || sampleData;
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `seo-audit-report-${timestamp}`;
    const doc = generateCanonicalPDF(data);
    doc.save(`${filename}.pdf`);
  };

  const handleReset = () => {
    setReportData(null);
    setFileName("");
  };

  const displayData = reportData || sampleData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <FileCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  SEO + AI Search Audit <span className="text-blue-600">v3.25</span>
                </h1>
                <p className="text-sm text-gray-600">
                  Análisis profesional y recomendaciones
                </p>
              </div>
            </div>

            <DownloadButtons reportData={displayData} onDownload={handleDownload} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="individual" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="individual">Reporte individual</TabsTrigger>
            <TabsTrigger value="comparison">Comparación</TabsTrigger>
          </TabsList>

          {/* Pestaña 1: Reporte Individual */}
          <TabsContent value="individual" className="space-y-8">
            {/* File Upload Section */}
            <section>
              <FileUpload onFileUpload={handleFileUpload} onLoadSample={handleLoadSample} />
              {!reportData && !isLoading && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Mostrando datos de ejemplo. Sube tu archivo JSON para ver tus resultados.
                </p>
              )}
              {reportData && (
                <div className="mt-4 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Archivo cargado correctamente: <span className="font-semibold">{fileName}</span>
                  </p>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Limpiar
                  </button>
                </div>
              )}
              {isLoading && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 text-center flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    Cargando archivo: {fileName}
                  </p>
                </div>
              )}
            </section>

            {/* Audit Info - Solo se muestra cuando hay datos reales cargados */}
            {reportData && (
              <section>
                <AuditInfo
                  site={displayData.site}
                  brand={displayData.brand}
                  auditDate={displayData.audit_date}
                  auditor={displayData.auditor}
                  pagesAudited={displayData.pages_audited}
                  technicalSeoScore={displayData.technical_seo_score}
                  contentSeoScore={displayData.content_seo_score}
                  auditVersion={displayData.audit_version}
                  totalChecks={displayData.total_checks}
                  layersAnalyzed={displayData.layers_analyzed}
                  baselineVersion={displayData.baseline_version}
                />
              </section>
            )}

            {/* Contrato canónico v3.25 / JSON 2.6 */}
            {reportData && (
              <section>
                <CanonicalAuditSections data={displayData} />
              </section>
            )}

            {/* Scores Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Puntuaciones Globales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard
                  title="SEO Score"
                  score={displayData.seo_score}
                  icon="seo"
                />
                <ScoreCard
                  title="AI Visibility Score"
                  score={displayData.ai_visibility_score}
                  icon="ai"
                />
              </div>
            </section>

            {/* Score Charts */}
            <section>
              <ScoreCharts
                seoScore={displayData.seo_score}
                aiVisibilityScore={displayData.ai_visibility_score}
                layers={displayData.layers}
                statusDistribution={displayData.status_distribution}
              />
            </section>

            {/* Layers Status Chart */}
            <section>
              <LayersStatusChart layers={displayData.layers} />
            </section>

            {/* Estimated Impact */}
            <section>
              <EstimatedImpact impact={displayData.estimated_impact} />
            </section>

            {/* Critical Fixes Section - v5 format */}
            <section>
              <CriticalFixesSection 
                criticalFixes={displayData.critical_fixes_v5}
                pendingBlockers={displayData.pending_blockers}
              />
            </section>

            {/* Priority Fixes */}
            <section>
              <PriorityFixesTable fixes={displayData.priority_fixes} />
            </section>

            {/* Priority Fixes Chart */}
            <section>
              <PriorityFixesChart fixes={displayData.priority_fixes} />
            </section>

            {/* Implementation Roadmap */}
            <section>
              <ImplementationRoadmap roadmap={displayData.implementation_roadmap} />
            </section>

            {/* Layers Analysis */}
            <section>
              <LayersAnalysisWithFilters layers={displayData.layers} />
            </section>

            {/* Score Breakdown */}
            <section>
              <ScoreBreakdown breakdown={displayData.score_breakdown} />
            </section>

            {/* Trend Data */}
            <section>
              <TrendData trendData={displayData.trend_data} />
            </section>

            {/* WebMCP Data */}
            {displayData.webmcp_data && (
              <section>
                <WebMCPCard data={displayData.webmcp_data} />
              </section>
            )}

            {/* URL Discovery — v2.2 */}
            {displayData.url_discovery && (
              <section>
                <URLDiscovery data={displayData.url_discovery} />
              </section>
            )}

            {/* Critical Issues Summary — v2.2 */}
            {displayData.critical_issues_summary && (
              <section>
                <CriticalIssuesSummary data={displayData.critical_issues_summary} />
              </section>
            )}

            {/* Local SEO Analysis — v2.2 */}
            {displayData.local_seo_analysis && (
              <section>
                <LocalSEOAnalysis data={displayData.local_seo_analysis} />
              </section>
            )}

            {/* Competitive Analysis — v2.2 */}
            {displayData.competitive_analysis && (
              <section>
                <CompetitiveAnalysis data={displayData.competitive_analysis} />
              </section>
            )}

            {/* Expected Outcomes — v2.2 */}
            {displayData.expected_outcomes && (
              <section>
                <ExpectedOutcomes data={displayData.expected_outcomes} />
              </section>
            )}

            {/* Recommendations Summary — v2.2 */}
            {displayData.recommendations_summary && (
              <section>
                <RecommendationsSummary data={displayData.recommendations_summary} />
              </section>
            )}

            {/* AI Visibility Opportunities — v2.3 */}
            {displayData.ai_visibility_opportunities && (
              <section>
                <AIVisibilityOpportunities data={displayData.ai_visibility_opportunities} />
              </section>
            )}

            {/* Market Context — v2.3 */}
            {displayData.mexican_market_context && (
              <section>
                <MarketContext data={displayData.mexican_market_context} />
              </section>
            )}
          </TabsContent>

          {/* Pestaña 2: Comparación */}
          <TabsContent value="comparison" className="space-y-8">
            <ComparisonView normalizeData={normalizeData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2026 SEO + AI Search Audit. Generado el {new Date().toLocaleDateString("es-ES")}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Todos los datos son confidenciales y para uso interno solamente.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
