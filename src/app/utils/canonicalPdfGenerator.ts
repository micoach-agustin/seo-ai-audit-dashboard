import jsPDF from "jspdf";

type RGB = [number, number, number];

const COLORS = {
  ink: [15, 23, 42] as RGB,
  muted: [100, 116, 139] as RGB,
  line: [226, 232, 240] as RGB,
  paper: [248, 250, 252] as RGB,
  blue: [37, 99, 235] as RGB,
  blueSoft: [239, 246, 255] as RGB,
  green: [22, 163, 74] as RGB,
  greenSoft: [240, 253, 244] as RGB,
  red: [220, 38, 38] as RGB,
  redSoft: [254, 242, 242] as RGB,
  amber: [202, 138, 4] as RGB,
  amberSoft: [254, 252, 232] as RGB,
  orange: [234, 88, 12] as RGB,
  purple: [124, 58, 237] as RGB,
  white: [255, 255, 255] as RGB,
};

function scalar(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") {
    if ("min" in (value as any) || "max" in (value as any)) {
      return `${(value as any).min ?? "—"}–${(value as any).max ?? "—"}`;
    }
    return JSON.stringify(value);
  }
  return String(value);
}

function score(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function generateCanonicalPDF(data: any) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 17;
  const contentWidth = width - margin * 2;
  const top = 25;
  const bottom = 18;
  let y = top;
  let chapter = "Informe";

  const split = (text: unknown, maxWidth = contentWidth) =>
    doc.splitTextToSize(scalar(text), maxWidth) as string[];

  const addChrome = () => {
    doc.setFillColor(...COLORS.ink);
    doc.rect(0, 0, width, 15, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.white);
    doc.text(
      `SEO + AI SEARCH / AUDITORÍA v3.25${data.prompt_version ? ` / PROMPT ${data.prompt_version}` : ""}`,
      margin,
      9.5,
    );
    doc.setFont("helvetica", "normal");
    doc.setTextColor(191, 219, 254);
    doc.text(chapter.toUpperCase(), width - margin, 9.5, { align: "right" });
  };

  const newPage = (nextChapter = chapter) => {
    chapter = nextChapter;
    doc.addPage();
    addChrome();
    y = top;
  };

  const ensure = (space: number, nextChapter = chapter) => {
    if (y + space > height - bottom) newPage(nextChapter);
  };

  const section = (title: string, kicker?: string) => {
    ensure(kicker ? 25 : 18, title);
    chapter = title;
    if (kicker) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.blue);
      doc.text(kicker.toUpperCase(), margin, y);
      y += 5;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.ink);
    doc.text(title, margin, y);
    y += 5;
    doc.setDrawColor(...COLORS.blue);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 18, y);
    y += 8;
  };

  const paragraph = (
    text: unknown,
    options: { color?: RGB; size?: number; indent?: number; gap?: number } = {},
  ) => {
    const fontSize = options.size ?? 9;
    const indent = options.indent ?? 0;
    const lineHeight = fontSize * 0.46;
    const lines = split(text, contentWidth - indent);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...(options.color || COLORS.ink));
    lines.forEach((line) => {
      ensure(lineHeight + 1);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    });
    y += options.gap ?? 3;
  };

  const bulletList = (items: unknown[], color: RGB = COLORS.ink) => {
    (items || []).forEach((item) => {
      const lines = split(item, contentWidth - 7);
      ensure(lines.length * 4.1 + 2);
      doc.setFillColor(...color);
      doc.circle(margin + 1.5, y - 1.2, 0.8, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.7);
      doc.setTextColor(...COLORS.ink);
      doc.text(lines, margin + 6, y);
      y += lines.length * 4.1 + 2;
    });
    y += 2;
  };

  const pill = (text: string, x: number, pillY: number, color: RGB, fill: RGB) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    const pillWidth = Math.min(doc.getTextWidth(text) + 6, 38);
    doc.setFillColor(...fill);
    doc.roundedRect(x, pillY, pillWidth, 6, 2, 2, "F");
    doc.setTextColor(...color);
    doc.text(text, x + 3, pillY + 4.1);
    return pillWidth;
  };

  const statRow = (items: Array<{ label: string; value: unknown; color?: RGB }>) => {
    ensure(25);
    const gap = 3;
    const boxWidth = (contentWidth - gap * (items.length - 1)) / items.length;
    items.forEach((item, index) => {
      const x = margin + index * (boxWidth + gap);
      doc.setFillColor(...COLORS.paper);
      doc.setDrawColor(...COLORS.line);
      doc.roundedRect(x, y, boxWidth, 20, 2, 2, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...(item.color || COLORS.ink));
      doc.text(scalar(item.value), x + 4, y + 9);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.7);
      doc.setTextColor(...COLORS.muted);
      doc.text(item.label.toUpperCase(), x + 4, y + 15);
    });
    y += 26;
  };

  const scoreBar = (label: string, value: unknown, color: RGB) => {
    ensure(13);
    const numeric = Math.max(0, Math.min(10, score(value)));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.ink);
    doc.text(label, margin, y);
    doc.text(`${numeric.toFixed(1)}/10`, width - margin, y, { align: "right" });
    y += 3;
    doc.setFillColor(...COLORS.line);
    doc.roundedRect(margin, y, contentWidth, 3, 1.5, 1.5, "F");
    doc.setFillColor(...color);
    doc.roundedRect(margin, y, contentWidth * (numeric / 10), 3, 1.5, 1.5, "F");
    y += 9;
  };

  const itemCard = (
    title: string,
    meta: string[],
    body: Array<{ label: string; text: unknown }>,
    accent: RGB = COLORS.blue,
  ) => {
    const titleLines = split(title, contentWidth - 10);
    const bodyLines = body.map((entry) => ({
      ...entry,
      lines: split(entry.text, contentWidth - 10),
    }));
    const estimated = 10 + titleLines.length * 4.2 + bodyLines.reduce((sum, entry) => sum + 5 + entry.lines.length * 3.8, 0);
    ensure(Math.min(estimated, height - top - bottom));
    doc.setDrawColor(...COLORS.line);
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(margin, y, contentWidth, Math.min(estimated, height - bottom - y), 2, 2, "S");
    const cardTop = y;
    doc.setFillColor(...accent);
    doc.rect(margin, y, 2, Math.min(estimated, height - bottom - y), "F");
    y += 6;
    let metaX = margin + 6;
    meta.filter(Boolean).forEach((value) => {
      metaX += pill(value, metaX, y - 4, accent, COLORS.paper) + 2;
    });
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.ink);
    doc.text(titleLines, margin + 6, y);
    y += titleLines.length * 4.2 + 2;
    bodyLines.forEach((entry) => {
      ensure(entry.lines.length * 3.8 + 7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.muted);
      doc.text(entry.label.toUpperCase(), margin + 6, y);
      y += 4;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.2);
      doc.setTextColor(...COLORS.ink);
      doc.text(entry.lines, margin + 6, y);
      y += entry.lines.length * 3.8 + 3;
    });
    if (y - cardTop < estimated) y = cardTop + estimated;
    y += 5;
  };

  // Cover
  doc.setFillColor(...COLORS.ink);
  doc.rect(0, 0, width, height, "F");
  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, 8, height, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(147, 197, 253);
  doc.text(
    `INFORME CANÓNICO / v3.25${data.prompt_version ? ` / PROMPT ${data.prompt_version}` : ""}`,
    25,
    36,
  );
  doc.setFontSize(30);
  doc.setTextColor(...COLORS.white);
  doc.text(["SEO + AI Search", "Audit Report"], 25, 58);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(203, 213, 225);
  doc.text(split(data.brand || data.site || "Auditoría digital", 155), 25, 88);
  doc.setDrawColor(51, 65, 85);
  doc.line(25, 108, width - 25, 108);
  const coverMeta = [
    ["Sitio", data.site],
    ["Fecha", data.audit_date],
    ["Auditor", data.auditor],
    [
      "Contrato",
      data.schema_version
        ? `JSON ${data.schema_version} / ${data.export_contract || "single_json"}${data.prompt_version ? ` / prompt ${data.prompt_version}` : ""}`
        : "Compatible legacy",
    ],
  ];
  let coverY = 122;
  coverMeta.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(label.toUpperCase(), 25, coverY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.white);
    doc.text(split(value, 105), 62, coverY);
    coverY += 14;
  });
  const seo = score(data.seo_score ?? data.overall_scores?.seo_score);
  const ai = score(data.ai_visibility_score ?? data.overall_scores?.ai_visibility_score);
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(25, 205, 72, 36, 4, 4, "F");
  doc.roundedRect(103, 205, 72, 36, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.white);
  doc.text(seo.toFixed(1), 33, 224);
  doc.text(ai.toFixed(1), 111, 224);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("SEO SCORE / 10", 33, 233);
  doc.text("AI VISIBILITY / 10", 111, 233);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Composición propia a partir del contrato de datos. No es una impresión de la web.", 25, 274);

  newPage("Síntesis");
  section("Síntesis ejecutiva", "01 / decisión");
  if (data.executive_report?.overview) paragraph(data.executive_report.overview, { size: 10, gap: 6 });
  statRow([
    { label: "SEO score", value: seo.toFixed(1), color: COLORS.blue },
    { label: "AI visibility", value: ai.toFixed(1), color: COLORS.purple },
    { label: "Checks", value: data.summary?.total_checks ?? data.checks?.length ?? "—" },
    { label: "Bloqueos", value: data.summary?.critical_blockers ?? data.critical_issues_summary?.total_critical_issues ?? "—", color: COLORS.red },
  ]);
  scoreBar("SEO global", seo, COLORS.blue);
  scoreBar("Visibilidad en AI Search", ai, COLORS.purple);
  if (data.technical_seo_score ?? data.overall_scores?.technical_seo_score) {
    scoreBar("SEO técnico", data.technical_seo_score ?? data.overall_scores?.technical_seo_score, COLORS.green);
  }
  paragraph(
    `Lectura: ${scalar(data.summary?.note || data.executive_report?.recommended_focus || "Las barras resumen la puntuación canónica; los capítulos siguientes explican causas, evidencia y plan de cierre.")}`,
    { color: COLORS.muted, size: 8, gap: 6 },
  );

  if (data.executive_report?.strengths?.length) {
    section("Fortalezas verificadas", "señales positivas");
    bulletList(data.executive_report.strengths, COLORS.green);
  }
  if (data.executive_report?.weaknesses?.length) {
    section("Riesgos prioritarios", "brechas");
    bulletList(data.executive_report.weaknesses, COLORS.red);
  }
  if (data.executive_report?.recommended_focus) {
    section("Foco recomendado", "próxima decisión");
    paragraph(data.executive_report.recommended_focus, { size: 10 });
  }

  const httpValidation = data.url_discovery?.http_validation;
  const classificationCounts = data.data_quality?.counts?.classification || {};
  if (httpValidation || Object.keys(classificationCounts).length) {
    newPage("Cobertura");
    section("Cobertura y validación HTTP", "02 / descubrimiento");
    if (data.url_discovery?.discovery_notes) {
      paragraph(data.url_discovery.discovery_notes, { size: 9.5, gap: 6 });
    }
    if (httpValidation) {
      statRow([
        { label: "Respuestas", value: httpValidation.responses_received },
        { label: "HTTP 200", value: httpValidation.status_200, color: COLORS.green },
        { label: "HTTP 404", value: httpValidation.status_404, color: COLORS.red },
        { label: "Sin recuperar", value: httpValidation.not_retrieved, color: COLORS.amber },
      ]);
      statRow([
        { label: "Rate limited", value: httpValidation.status_429_rate_limited, color: COLORS.amber },
        { label: "Red / timeout", value: httpValidation.timeouts_or_network_errors, color: COLORS.red },
        { label: "Soft 404 en 200", value: httpValidation.soft_404_home_among_200, color: COLORS.orange },
        { label: "Shell stubs", value: httpValidation.shell_stubs_among_200, color: COLORS.orange },
      ]);
      paragraph(httpValidation.denominator, { color: COLORS.muted, size: 8 });
    }
    const classificationEntries = Object.entries(classificationCounts);
    if (classificationEntries.length) {
      section("Clasificación de URLs", "inventario");
      for (let index = 0; index < classificationEntries.length; index += 4) {
        statRow(
          classificationEntries.slice(index, index + 4).map(([label, value]) => ({
            label: label.replace(/_/g, " "),
            value,
          })),
        );
      }
    }
  }

  const issues = data.issues || [];
  if (issues.length) {
    newPage("Problemas");
    section("Problemas y causas raíz", "03 / diagnóstico");
    paragraph(
      `${issues.length} problemas conectados con sus checks, evidencias, fixes y pruebas de validación.`,
      { color: COLORS.muted },
    );
    issues.forEach((issue: any) => {
      const accent = String(issue.priority).toLowerCase() === "critical" ? COLORS.red
        : String(issue.priority).toLowerCase() === "high" ? COLORS.orange : COLORS.amber;
      itemCard(
        issue.title,
        [issue.id, issue.priority, issue.status],
        [
          { label: "Causa raíz", text: issue.cause },
          { label: "Impacto", text: issue.impact },
          { label: "Trazabilidad", text: [...(issue.check_ids || []), ...(issue.evidence_ids || []), ...(issue.fix_ids || [])].join(" · ") },
        ],
        accent,
      );
    });
  } else if (data.priority_fixes?.length) {
    newPage("Prioridades");
    section("Correcciones prioritarias", "03 / diagnóstico");
    data.priority_fixes.forEach((group: any) => {
      section(group.category, `${(group.items || []).length} acciones`);
      bulletList((group.items || []).map((item: any) => typeof item === "string" ? item : item.issue || item.title));
    });
  }

  const layers = data.layers || [];
  if (layers.length) {
    newPage("Capas");
    section("Análisis por capas", "04 / cobertura");
    layers.forEach((layer: any) => {
      const status = String(layer.status || "").toUpperCase();
      const accent = status === "PASS" ? COLORS.green : status === "FAIL" ? COLORS.red : COLORS.amber;
      const details = [
        ...(layer.fail_items || []),
        ...(layer.warning_items || []),
        ...(layer.pass_items || []),
        ...(layer.details || []),
      ].slice(0, 8);
      itemCard(
        `${layer.id ? `Capa ${layer.id} · ` : ""}${layer.name}`,
        [status, layer.score !== undefined ? `${Number(layer.score).toFixed(1)}/10` : ""],
        [{ label: "Hallazgos", text: details.join(" • ") || layer.dependency_note || "Sin detalle adicional." }],
        accent,
      );
    });
  }

  const fixes = data.fixes || [];
  if (fixes.length) {
    newPage("Soluciones");
    section("Soluciones implementables", "05 / fixes");
    fixes.forEach((fix: any) => {
      itemCard(
        fix.title,
        [fix.id, fix.implementation_status, `${fix.estimated_hours ?? 0} h`],
        [
          { label: "Por qué", text: fix.rationale },
          { label: "Cómo", text: (fix.instructions || []).join(" • ") },
          { label: "Riesgo y rollback", text: `${scalar(fix.risk)} · ${scalar(fix.rollback)}` },
        ],
        COLORS.purple,
      );
      (fix.code_snippets || []).forEach((snippet: any) => {
        section(`${fix.id} · ${snippet.language}`, snippet.target_file_or_location);
        paragraph(snippet.code, { size: 7.2, color: COLORS.ink, indent: 3 });
        if (snippet.caution) paragraph(`Precaución: ${snippet.caution}`, { size: 8, color: COLORS.orange });
      });
    });
  }

  const tasks = data.roadmap_tasks || [];
  if (tasks.length || data.implementation_roadmap) {
    newPage("Roadmap");
    section("Roadmap de implementación", "06 / ejecución");
    if (tasks.length) {
      const groups = tasks.reduce((acc: Record<string, any[]>, task: any) => {
        (acc[String(task.week)] ||= []).push(task);
        return acc;
      }, {});
      Object.entries(groups).forEach(([week, weekTasks]: [string, any]) => {
        section(week === "backlog" ? "Backlog" : `Semana ${week}`, `${weekTasks.length} tareas`);
        weekTasks.forEach((task: any) => itemCard(
          task.title,
          [task.id, task.priority, task.owner_role, `${task.estimated_hours ?? 0} h`],
          [
            { label: "Aceptación", text: (task.acceptance_criteria || []).join(" • ") },
            { label: "Dependencias", text: (task.depends_on_task_ids || []).join(", ") || "Sin dependencias" },
          ],
          COLORS.blue,
        ));
      });
    } else {
      Object.entries(data.implementation_roadmap).forEach(([period, value]: [string, any]) => {
        section(period.replace(/_/g, " "), "plan");
        bulletList(Array.isArray(value) ? value : value.tasks || []);
      });
    }
  }

  const validations = data.validation_plan || [];
  if (validations.length) {
    newPage("Validación");
    section("Plan de validación", "07 / cierre");
    validations.forEach((validation: any) => itemCard(
      validation.test_name,
      [validation.id, validation.status, validation.tool],
      [
        { label: "Método", text: validation.method },
        { label: "Resultado esperado", text: validation.expected_result },
        ...(validation.observed_result ? [{ label: "Resultado observado", text: validation.observed_result }] : []),
      ],
      COLORS.green,
    ));
  }

  const evidence = data.evidence || [];
  if (evidence.length) {
    newPage("Evidencias");
    section("Registro de evidencias", "08 / trazabilidad");
    evidence.forEach((item: any) => itemCard(
      item.observation,
      [item.id, item.kind, item.confidence],
      [
        { label: "Fuente", text: item.source_url },
        { label: "Método", text: item.method },
        ...(item.sample ? [{ label: "Muestra", text: item.sample }] : []),
      ],
      COLORS.blue,
    ));
  }

  const pages = data.pages || [];
  if (pages.length) {
    newPage("Inventario");
    section("Inventario completo de URLs", "09 / cobertura");
    paragraph(
      `${pages.length} URLs. El estado HTTP no sustituye la clasificación: una respuesta 200 puede ser una página válida, un soft 404 o un shell sin contenido.`,
      { color: COLORS.muted, size: 8.5, gap: 6 },
    );
    pages.forEach((page: any) => {
      const legacy = data.page_summary?.[page.url] || {};
      const urlLines = split(page.url, contentWidth - 48);
      const titleLines = legacy.title ? split(legacy.title, contentWidth - 8) : [];
      const rowHeight = Math.max(9, urlLines.length * 3.3 + titleLines.length * 3.3 + 4);
      ensure(rowHeight + 2, "Inventario");
      doc.setDrawColor(...COLORS.line);
      doc.line(margin, y + rowHeight, width - margin, y + rowHeight);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.ink);
      doc.text(page.id || "—", margin, y + 3);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.blue);
      doc.text(urlLines, margin + 14, y + 3);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.ink);
      doc.text(String(page.fetch_status ?? "—"), width - margin - 3, y + 3, { align: "right" });
      let detailY = y + urlLines.length * 3.3 + 4;
      if (titleLines.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.7);
        doc.setTextColor(...COLORS.muted);
        doc.text(titleLines, margin + 14, detailY);
        detailY += titleLines.length * 3.3;
      }
      doc.setFontSize(6.2);
      doc.setTextColor(...COLORS.muted);
      doc.text(
        `${scalar(page.classification).replace(/_/g, " ")} · ${scalar(page.audit_status).replace(/_/g, " ")}`,
        margin + 14,
        detailY,
      );
      y += rowHeight + 2;
    });
  }

  if (data.data_quality || data.source_provenance) {
    newPage("Calidad");
    section("Calidad y procedencia", "10 / gobernanza");
    const quality = data.data_quality || {};
    statRow([
      { label: "Esquema válido", value: quality.schema_valid ? "Sí" : "No", color: quality.schema_valid ? COLORS.green : COLORS.red },
      { label: "Checks", value: quality.counts?.checks ?? data.checks?.length ?? "—" },
      { label: "Evidencias", value: quality.counts?.evidence ?? evidence.length },
      { label: "Páginas", value: quality.counts?.pages ?? data.pages?.length ?? "—" },
    ]);
    if (quality.coverage_notes) paragraph(quality.coverage_notes, { size: 9.5 });
    if (quality.warnings?.length) {
      section("Advertencias de calidad");
      bulletList(quality.warnings, COLORS.amber);
    }
    const compatibility = quality.compatibility_validation;
    if (compatibility) {
      section("Compatibilidad de campos legacy", compatibility.passed ? "validación superada" : "validación con brechas");
      statRow([
        {
          label: "Resultado",
          value: compatibility.passed ? "PASS" : "FAIL",
          color: compatibility.passed ? COLORS.green : COLORS.red,
        },
        { label: "Rutas revisadas", value: compatibility.checked_paths },
        { label: "Ausentes", value: compatibility.missing_paths?.length ?? 0, color: COLORS.red },
        { label: "Tipos incompatibles", value: compatibility.type_mismatches?.length ?? 0, color: COLORS.red },
      ]);
      paragraph(`Referencia: ${scalar(compatibility.reference_schema)}`, { size: 8, color: COLORS.muted });
      if (compatibility.nullable_exceptions_note) {
        paragraph(compatibility.nullable_exceptions_note, { size: 8, color: COLORS.muted });
      }
      if (compatibility.not_applicable_paths?.length) {
        paragraph(
          `No aplicables: ${compatibility.not_applicable_paths.join(", ")}`,
          { size: 8, color: COLORS.muted },
        );
      }
    }
    if (data.source_provenance) {
      section("Procedencia");
      paragraph(`Origen: ${scalar(data.source_provenance.audit_source)}`);
      paragraph(`Motor: ${scalar(data.source_provenance.audit_engine_version)}`);
      bulletList(data.source_provenance.methods || []);
    }
    if (data.executive_report?.limitations?.length) {
      section("Limitaciones");
      bulletList(data.executive_report.limitations, COLORS.muted);
    }
  }

  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let page = 2; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...COLORS.line);
    doc.line(margin, height - 13, width - margin, height - 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text(data.site || data.brand || "SEO + AI Search Audit", margin, height - 8);
    doc.text(`${page - 1} / ${totalPages - 1}`, width - margin, height - 8, { align: "right" });
  }

  return doc;
}
