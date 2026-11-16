import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Database,
  FileSearch,
  Filter,
  FlaskConical,
  Search,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CanonicalAuditSectionsProps {
  data: any;
}

const statusStyles: Record<string, string> = {
  PASS: "border-green-200 bg-green-50 text-green-700",
  FAIL: "border-red-200 bg-red-50 text-red-700",
  WARNING: "border-yellow-200 bg-yellow-50 text-yellow-800",
  NOT_TESTED: "border-blue-200 bg-blue-50 text-blue-700",
  "N/A": "border-gray-200 bg-gray-50 text-gray-600",
  DETECTED: "border-red-200 bg-red-50 text-red-700",
  PENDING: "border-blue-200 bg-blue-50 text-blue-700",
  PROPOSED: "border-purple-200 bg-purple-50 text-purple-700",
};

const priorityStyles: Record<string, string> = {
  Critical: "border-red-200 bg-red-50 text-red-700",
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Medium: "border-yellow-200 bg-yellow-50 text-yellow-800",
  Low: "border-blue-200 bg-blue-50 text-blue-700",
};

function StatusBadge({ value }: { value?: string }) {
  const normalized = String(value || "N/A").toUpperCase();
  return (
    <Badge variant="outline" className={statusStyles[normalized] || "border-gray-200 bg-gray-50 text-gray-700"}>
      {normalized.replace("_", " ")}
    </Badge>
  );
}

function PriorityBadge({ value }: { value?: string }) {
  const label = value || "Low";
  return (
    <Badge variant="outline" className={priorityStyles[label] || priorityStyles.Low}>
      {label}
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center">
      <FileSearch className="mx-auto mb-3 h-8 w-8 text-gray-400" />
      <p className="text-sm font-medium text-gray-700">No hay resultados para estos filtros.</p>
    </div>
  );
}

export function CanonicalAuditSections({ data }: CanonicalAuditSectionsProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [classification, setClassification] = useState("ALL");
  const [pageLimit, setPageLimit] = useState(50);
  const checks = data.checks || [];
  const issues = data.issues || [];
  const fixes = data.fixes || [];
  const evidence = data.evidence || [];
  const pages = data.pages || [];
  const tasks = data.roadmap_tasks || [];
  const validations = data.validation_plan || [];
  const report = data.executive_report;
  const quality = data.data_quality;
  const provenance = data.source_provenance;

  const searchable = useMemo(() => {
    const term = query.trim().toLowerCase();
    const includes = (item: any) => !term || JSON.stringify(item).toLowerCase().includes(term);
    const hasStatus = (item: any) =>
      status === "ALL" ||
      String(item.status || item.priority || "").toUpperCase() === status;
    return {
      checks: checks.filter((item: any) => includes(item) && hasStatus(item)),
      issues: issues.filter((item: any) => includes(item) && hasStatus(item)),
      fixes: fixes.filter((item: any) => includes(item) && hasStatus(item)),
      evidence: evidence.filter(includes),
      pages: pages.filter((item: any) =>
        includes(item) &&
        hasStatus(item) &&
        (classification === "ALL" || item.classification === classification),
      ),
    };
  }, [checks, classification, evidence, fixes, issues, pages, query, status]);

  const isCanonical = Boolean(
    data.schema_version || report || checks.length || issues.length || fixes.length,
  );
  if (!isCanonical) return null;

  const counts = quality?.counts || {};
  const httpValidation = data.url_discovery?.http_validation;
  const compatibility = quality?.compatibility_validation;
  const classifications = Object.entries(counts.classification || {}) as Array<[string, number]>;
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-slate-800 bg-slate-950 text-white shadow-xl">
        <CardHeader className="border-b border-slate-800 bg-gradient-to-r from-slate-950 to-blue-950">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-500 text-white">Dashboard v3.25</Badge>
                {data.prompt_version && (
                  <Badge variant="outline" className="border-blue-400 text-blue-200">
                    Prompt {data.prompt_version}
                  </Badge>
                )}
                <Badge variant="outline" className="border-slate-600 text-slate-200">
                  JSON {data.schema_version || "legacy"}
                </Badge>
                {data.export_contract && (
                  <Badge variant="outline" className="border-slate-600 text-slate-200">
                    {data.export_contract}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl text-white">Inteligencia de auditoría canónica</CardTitle>
              <CardDescription className="mt-2 max-w-3xl text-slate-300">
                Checks, evidencias, problemas, soluciones y validaciones conectados por identificadores.
              </CardDescription>
            </div>
            <ShieldCheck className="h-12 w-12 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Checks", counts.checks ?? checks.length],
            ["Issues", counts.issues ?? issues.length],
            ["Evidencias", counts.evidence ?? evidence.length],
            ["Fixes", counts.fixes ?? fixes.length],
            ["Páginas", counts.pages ?? pages.length],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{String(value ?? 0)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {httpValidation && (
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-5 w-5 text-blue-600" />
              Validación HTTP y cobertura real
            </CardTitle>
            <CardDescription>{httpValidation.denominator}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {[
                ["Respuestas", httpValidation.responses_received],
                ["HTTP 200", httpValidation.status_200],
                ["HTTP 404", httpValidation.status_404],
                ["Rate limited", httpValidation.status_429_rate_limited],
                ["Errores de red", httpValidation.timeouts_or_network_errors],
                ["No recuperadas", httpValidation.not_retrieved],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-lg border border-blue-100 bg-white p-4">
                  <p className="text-2xl font-bold text-gray-950">{String(value ?? 0)}</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
                </div>
              ))}
            </div>
            {(httpValidation.soft_404_home_among_200 > 0 || httpValidation.shell_stubs_among_200 > 0) && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    {httpValidation.soft_404_home_among_200} soft 404 entre respuestas 200
                  </p>
                </div>
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <p className="text-sm font-semibold text-orange-900">
                    {httpValidation.shell_stubs_among_200} shells vacíos entre respuestas 200
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {report && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Waypoints className="h-5 w-5 text-blue-600" />
              Informe ejecutivo
            </CardTitle>
            <CardDescription>{report.scope}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base leading-7 text-gray-700">{report.overview}</p>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-green-50 p-5">
                <p className="mb-3 font-semibold text-green-900">Fortalezas verificadas</p>
                <div className="space-y-2">
                  {(report.strengths || []).map((item: string, index: number) => (
                    <div key={index} className="flex gap-2 text-sm leading-6 text-green-900">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                <p className="mb-3 font-semibold text-red-900">Debilidades prioritarias</p>
                <div className="space-y-2">
                  {(report.weaknesses || []).map((item: string, index: number) => (
                    <div key={index} className="flex gap-2 text-sm leading-6 text-red-900">
                      <AlertCircle className="mt-1 h-4 w-4 shrink-0" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {report.recommended_focus && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Foco recomendado
                </p>
                <p className="mt-2 leading-7 text-blue-950">{report.recommended_focus}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Database className="h-5 w-5 text-blue-600" />
            Explorador de inteligencia
          </CardTitle>
          <CardDescription>
            Busca texto, IDs, URLs o responsables y filtra los estados operativos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar en todo el contrato canónico…"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              {["ALL", "FAIL", "WARNING", "PASS", "NOT_TESTED"].map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={status === value ? "default" : "outline"}
                  onClick={() => setStatus(value)}
                >
                  {value.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="issues">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 lg:grid-cols-5">
              <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
              <TabsTrigger value="checks">Checks ({checks.length})</TabsTrigger>
              <TabsTrigger value="fixes">Fixes ({fixes.length})</TabsTrigger>
              <TabsTrigger value="evidence">Evidencias ({evidence.length})</TabsTrigger>
              <TabsTrigger value="pages">Páginas ({pages.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="mt-5 space-y-3">
              {!searchable.issues.length ? <EmptyState /> : searchable.issues.map((issue: any) => (
                <div key={issue.id} className="rounded-lg border border-gray-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{issue.id}</Badge>
                        <PriorityBadge value={issue.priority} />
                        <StatusBadge value={issue.status} />
                      </div>
                      <p className="font-semibold leading-6 text-gray-950">{issue.title}</p>
                    </div>
                    <Badge variant="secondary">{(issue.affected_url_ids || []).length} URLs</Badge>
                  </div>
                  <div className="mt-4 grid gap-4 text-sm lg:grid-cols-2">
                    <div>
                      <p className="mb-1 font-semibold text-gray-700">Causa raíz</p>
                      <p className="leading-6 text-gray-600">{issue.cause}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-semibold text-gray-700">Impacto</p>
                      <p className="leading-6 text-gray-600">{issue.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="checks" className="mt-5">
              {!searchable.checks.length ? <EmptyState /> : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {searchable.checks.map((check: any) => (
                      <div key={check.id} className="grid gap-3 p-4 lg:grid-cols-[7rem_1fr_auto] lg:items-start">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{check.id}</Badge>
                          <StatusBadge value={check.status} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{check.name}</p>
                          <p className="mt-1 text-sm leading-6 text-gray-600">{check.detail}</p>
                        </div>
                        <PriorityBadge value={check.priority} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="fixes" className="mt-5 space-y-4">
              {!searchable.fixes.length ? <EmptyState /> : searchable.fixes.map((fix: any) => (
                <div key={fix.id} className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="flex flex-wrap items-start justify-between gap-3 bg-gray-50 p-5">
                    <div>
                      <div className="mb-2 flex gap-2">
                        <Badge variant="outline">{fix.id}</Badge>
                        <StatusBadge value={fix.implementation_status} />
                      </div>
                      <p className="font-semibold text-gray-950">{fix.title}</p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{fix.rationale}</p>
                    </div>
                    <Badge variant="secondary">{fix.estimated_hours ?? 0} h</Badge>
                  </div>
                  <div className="space-y-4 p-5">
                    {(fix.instructions || []).map((item: string, index: number) => (
                      <div key={index} className="flex gap-3 text-sm leading-6 text-gray-700">
                        <span className="font-semibold text-blue-600">{index + 1}.</span>
                        <p>{item}</p>
                      </div>
                    ))}
                    {(fix.code_snippets || []).map((snippet: any, index: number) => (
                      <div key={index} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-4 py-3">
                          <div className="flex items-center gap-2 text-sm text-slate-200">
                            <Code2 className="h-4 w-4 text-blue-400" />
                            <span>{snippet.target_file_or_location}</span>
                          </div>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {snippet.language}
                          </Badge>
                        </div>
                        <pre className="overflow-x-auto p-4 text-xs leading-5 text-slate-200">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="evidence" className="mt-5">
              {!searchable.evidence.length ? <EmptyState /> : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {searchable.evidence.map((item: any) => (
                    <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{item.id}</Badge>
                        <Badge variant="secondary">{item.kind}</Badge>
                        {item.confidence && <Badge variant="outline">{item.confidence}</Badge>}
                      </div>
                      <p className="text-sm leading-6 text-gray-700">{item.observation}</p>
                      {item.source_url && (
                        <p className="mt-3 break-all text-xs text-blue-700">{item.source_url}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pages" className="mt-5">
              {!searchable.pages.length ? <EmptyState /> : (
                <div className="space-y-4">
                  {classifications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={classification === "ALL" ? "default" : "outline"}
                        onClick={() => {
                          setClassification("ALL");
                          setPageLimit(50);
                        }}
                      >
                        Todas ({pages.length})
                      </Button>
                      {classifications.map(([label, count]) => (
                        <Button
                          key={label}
                          type="button"
                          size="sm"
                          variant={classification === label ? "default" : "outline"}
                          onClick={() => {
                            setClassification(label);
                            setPageLimit(50);
                          }}
                        >
                          {label.replaceAll("_", " ")} ({count})
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="divide-y divide-gray-200">
                    {searchable.pages.slice(0, pageLimit).map((page: any) => {
                      const legacy = data.page_summary?.[page.url] || {};
                      return (
                      <div key={page.id} className="grid gap-3 p-4 lg:grid-cols-[5rem_1fr_auto_auto] lg:items-center">
                        <Badge variant="outline">{page.id}</Badge>
                        <div className="min-w-0">
                          <p className="break-all text-sm font-medium text-gray-900">{page.url}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {[page.content_type, page.classification?.replaceAll("_", " ")].filter(Boolean).join(" · ")}
                          </p>
                          {legacy.title && <p className="mt-2 text-sm text-gray-700">{legacy.title}</p>}
                          {legacy.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{legacy.description}</p>
                          )}
                          {legacy.canonical_url && (
                            <p className="mt-1 break-all text-xs text-blue-700">Canonical: {legacy.canonical_url}</p>
                          )}
                          {legacy.verification_note && (
                            <p className="mt-1 text-xs italic leading-5 text-gray-500">{legacy.verification_note}</p>
                          )}
                        </div>
                        <Badge variant="secondary">HTTP {page.fetch_status ?? "—"}</Badge>
                        <StatusBadge value={page.audit_status} />
                      </div>
                      );
                    })}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                      Mostrando {Math.min(pageLimit, searchable.pages.length)} de {searchable.pages.length} páginas
                    </p>
                    {pageLimit < searchable.pages.length && (
                      <Button type="button" variant="outline" onClick={() => setPageLimit((value) => value + 50)}>
                        Mostrar 50 más
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {(tasks.length > 0 || validations.length > 0) && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                Roadmap enlazado
              </CardTitle>
              <CardDescription>{tasks.length} tareas con responsable y criterios de aceptación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task: any) => (
                <div key={task.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{task.id}</Badge>
                    <PriorityBadge value={task.priority} />
                    <StatusBadge value={task.status} />
                    <Badge variant="secondary">Semana {String(task.week)}</Badge>
                  </div>
                  <p className="font-medium leading-6 text-gray-900">{task.title}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {task.owner_role} · {task.estimated_hours ?? 0} h
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FlaskConical className="h-5 w-5 text-purple-600" />
                Plan de validación
              </CardTitle>
              <CardDescription>{validations.length} pruebas para cerrar el ciclo de implementación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {validations.map((validation: any) => (
                <div key={validation.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{validation.id}</Badge>
                    <StatusBadge value={validation.status} />
                    <Badge variant="secondary">{validation.tool}</Badge>
                  </div>
                  <p className="font-medium text-gray-900">{validation.test_name}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{validation.expected_result}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {(quality || provenance) && (
        <Card className="border-slate-200 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-xl">Calidad y procedencia</CardTitle>
            <CardDescription>
              Trazabilidad del origen, metodología y advertencias del reporte.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <StatusBadge value={quality?.schema_valid ? "PASS" : "FAIL"} />
                <p className="text-sm font-semibold text-gray-800">Validación del esquema</p>
              </div>
              <p className="text-sm leading-6 text-gray-600">{quality?.coverage_notes}</p>
              {(quality?.warnings || []).map((warning: string, index: number) => (
                <p key={index} className="mt-2 text-sm leading-6 text-amber-800">{warning}</p>
              ))}
              {compatibility && (
                <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge value={compatibility.passed ? "PASS" : "FAIL"} />
                    <p className="text-sm font-semibold text-gray-900">Compatibilidad legacy</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Rutas comprobadas</p>
                      <p className="font-semibold text-gray-900">{compatibility.checked_paths ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Secciones raíz</p>
                      <p className="font-semibold text-gray-900">{compatibility.reference_root_sections ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Campos ausentes</p>
                      <p className="font-semibold text-gray-900">{compatibility.missing_paths?.length ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tipos incompatibles</p>
                      <p className="font-semibold text-gray-900">{compatibility.type_mismatches?.length ?? 0}</p>
                    </div>
                  </div>
                  {compatibility.nullable_exceptions_note && (
                    <p className="mt-3 text-xs leading-5 text-gray-500">{compatibility.nullable_exceptions_note}</p>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{provenance?.audit_source}</p>
              <p className="mt-1 text-sm text-gray-600">{provenance?.audit_engine_version}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(provenance?.methods || []).map((method: string) => (
                  <Badge key={method} variant="outline">{method}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
