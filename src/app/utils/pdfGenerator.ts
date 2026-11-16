import jsPDF from "jspdf";

export function generateProfessionalPDF(data: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin; // Ancho útil del contenido
  let yPos = margin;

  // Helper function to safely split text within bounds
  const safeSplitText = (text: string, maxWidth: number): string[] => {
    if (!text) return [""];
    return doc.splitTextToSize(String(text), maxWidth);
  };

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin - 15) { // Reserve space for footer
      doc.addPage();
      yPos = margin;
      addHeader();
      return true;
    }
    return false;
  };

  // Header function
  const addHeader = () => {
    doc.setFillColor(30, 64, 175); // Blue
    doc.rect(0, 0, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("SEO + AI Search Audit Report", margin, 10);
    doc.setTextColor(0, 0, 0);
    yPos = 25;
  };

  // Footer function
  const addFooter = () => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${pageCount} - Generado el ${new Date().toLocaleDateString("es-ES")}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  };

  // Title Page
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.text("SEO + AI Search", pageWidth / 2, 60, { align: "center" });
  doc.text("Audit Report", pageWidth / 2, 75, { align: "center" });
  
  // Brand and Site info if available
  if (data.brand || data.site) {
    doc.setFontSize(16);
    if (data.brand) {
      doc.text(data.brand, pageWidth / 2, 95, { align: "center" });
    }
    if (data.site) {
      doc.setFontSize(10);
      doc.text(data.site, pageWidth / 2, 105, { align: "center" });
    }
  }
  
  doc.setFontSize(12);
  const auditDate = data.audit_date 
    ? new Date(data.audit_date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("es-ES");
  doc.text(`Fecha de Auditoría: ${auditDate}`, pageWidth / 2, 120, { align: "center" });
  
  if (data.auditor) {
    doc.setFontSize(9);
    doc.text(`Auditor: ${data.auditor}`, pageWidth / 2, 128, { align: "center" });
  }
  
  // Score circles
  const drawScoreCircle = (x: number, y: number, score: number, label: string) => {
    const radius = 25;
    const percentage = (score / 10) * 100;
    
    // Background circle
    doc.setFillColor(255, 255, 255);
    doc.circle(x, y, radius, "F");
    
    // Score
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(24);
    doc.text(score.toFixed(1), x, y - 2, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("/10", x, y + 6, { align: "center" });
    
    // Label
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(label, x, y + 40, { align: "center" });
  };

  drawScoreCircle(pageWidth / 2 - 40, 170, data.seo_score, "SEO Score");
  drawScoreCircle(pageWidth / 2 + 40, 170, data.ai_visibility_score, "AI Visibility");

  // New page - Executive Summary
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  yPos = margin;
  addHeader();

  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text("Resumen Ejecutivo", margin, yPos);
  yPos += 12;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Site Information (if available)
  if (data.site || data.brand || data.pages_audited) {
    const maxPagesToShow = 5;
    const pagesCount = data.pages_audited?.length || 0;
    const pagesListHeight = pagesCount > 0 ? Math.min(maxPagesToShow * 4, pagesCount * 4) + 6 : 0;
    const infoBoxHeight = 16 + pagesListHeight;
    
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, yPos, contentWidth, infoBoxHeight, 3, 3, "F");
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    let infoYPos = yPos + 7;
    
    if (data.brand) {
      const brandText = safeSplitText(`Marca: ${data.brand}`, contentWidth - 10);
      doc.text(brandText, margin + 5, infoYPos);
      infoYPos += 6;
    }
    
    if (data.site) {
      const siteText = safeSplitText(`Sitio: ${data.site}`, contentWidth - 10);
      doc.text(siteText, margin + 5, infoYPos);
      infoYPos += 6;
    }
    
    if (pagesCount > 0) {
      doc.text(`Páginas auditadas: ${pagesCount}`, margin + 5, infoYPos);
      infoYPos += 6;
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      data.pages_audited.slice(0, maxPagesToShow).forEach((page: string) => {
        const truncatedPage = page.length > 70 ? page.substring(0, 67) + "..." : page;
        const pageText = safeSplitText(`• ${truncatedPage}`, contentWidth - 16);
        doc.text(pageText, margin + 8, infoYPos);
        infoYPos += 4;
      });
      
      if (pagesCount > maxPagesToShow) {
        doc.text(`... y ${pagesCount - maxPagesToShow} más`, margin + 8, infoYPos);
      }
    }
    
    yPos += infoBoxHeight + 8;
  }

  // Scores Summary
  doc.setFillColor(240, 240, 240);
  const scoresBoxHeight = (data.technical_seo_score !== undefined || data.content_seo_score !== undefined) ? 35 : 25;
  doc.roundedRect(margin, yPos, contentWidth, scoresBoxHeight, 3, 3, "F");
  
  const leftColX = margin + 5;
  const rightColX = margin + contentWidth / 2 + 5;
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Puntuación SEO:", leftColX, yPos + 8);
  doc.setFontSize(16);
  doc.setTextColor(30, 64, 175);
  doc.text(`${(data.seo_score || 0).toFixed(1)}/10`, leftColX + 45, yPos + 9);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("AI Visibility:", leftColX, yPos + 20);
  doc.setFontSize(16);
  doc.setTextColor(147, 51, 234); // Purple
  doc.text(`${(data.ai_visibility_score || 0).toFixed(1)}/10`, leftColX + 45, yPos + 21);
  
  // Additional scores if available
  if (data.technical_seo_score !== undefined || data.content_seo_score !== undefined) {
    if (data.technical_seo_score !== undefined) {
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Technical SEO:", rightColX, yPos + 8);
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text(`${data.technical_seo_score.toFixed(1)}/10`, rightColX + 35, yPos + 9);
    }
    
    if (data.content_seo_score !== undefined) {
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Content SEO:", rightColX, yPos + 20);
      doc.setFontSize(16);
      doc.setTextColor(168, 85, 247);
      doc.text(`${data.content_seo_score.toFixed(1)}/10`, rightColX + 35, yPos + 21);
    }
  }
  
  yPos += scoresBoxHeight + 10;

  // Score Breakdown Section (NEW)
  if (data.score_breakdown) {
    checkPageBreak(40);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("Desglose Detallado de Puntuaciones", margin, yPos);
    yPos += 10;

    // Main Categories
    const mainCategories = [
      { key: "on_page_seo", label: "On-Page SEO" },
      { key: "technical_seo", label: "Technical SEO" },
      { key: "content_seo", label: "Content SEO" },
      { key: "local_seo", label: "Local SEO" },
    ];

    mainCategories.forEach((category) => {
      const catData = data.score_breakdown[category.key];
      if (!catData) return;

      checkPageBreak(20);

      // Category header
      const isObject = typeof catData === 'object' && catData.score !== undefined;
      const score = isObject ? catData.score : catData;
      const status = isObject ? catData.status : (score >= 7 ? "PASS" : score >= 4 ? "WARNING" : "FAIL");
      const max = isObject ? catData.max : 10;

      // Status color
      const statusColors: any = {
        PASS: { bg: [220, 252, 231], text: [21, 128, 61] },
        WARNING: { bg: [254, 249, 195], text: [161, 98, 7] },
        FAIL: { bg: [254, 226, 226], text: [185, 28, 28] },
        "N/A": { bg: [243, 244, 246], text: [100, 116, 139] }
      };

      const colors = statusColors[status] || statusColors["N/A"];

      // For N/A items
      if (score === null && isObject && catData.note) {
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 10, 2, 2, "F");
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(category.label, margin + 3, yPos + 4);
        
        doc.setFontSize(7);
        doc.text("N/A", pageWidth - margin - 12, yPos + 4);
        
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(catData.note, margin + 3, yPos + 8);
        
        yPos += 12;
        return;
      }

      if (score === null) return;

      // Category box
      doc.setFillColor(...colors.bg);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, "F");

      // Category name
      doc.setFontSize(10);
      doc.setTextColor(...colors.text);
      doc.text(category.label, margin + 3, yPos + 5.5);

      // Score
      doc.setFontSize(10);
      doc.text(`${score.toFixed(1)}/${max}`, margin + 50, yPos + 5.5);

      // Status badge
      doc.setFontSize(7);
      doc.text(status, pageWidth - margin - 20, yPos + 5.5);

      // Components count
      if (isObject && catData.components && catData.components.length > 0) {
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(`${catData.components.length} componentes`, margin + 80, yPos + 5.5);
      }

      yPos += 10;
    });

    yPos += 5;

    // Sub-categories detailed section
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text("Métricas Detalladas:", margin, yPos);
    yPos += 8;

    const subCategories = [
      "metadata_head", "open_graph_sharing", "structured_data", 
      "crawling_indexing", "ai_search", "content_structure",
      "technical_rendering", "internal_linking", "analytics_data",
      "core_web_vitals", "hreflang", "h1_presence",
      "navigation_consistency", "mobile_responsive", "image_seo",
      "https_protocol", "charset_utf8", "viewport_tag", "google_fonts_preconnect"
    ];

    const subCategoryLabels: any = {
      metadata_head: "Metadata & Head",
      open_graph_sharing: "Open Graph",
      structured_data: "Structured Data",
      crawling_indexing: "Crawling & Indexing",
      ai_search: "AI Search",
      content_structure: "Content Structure",
      technical_rendering: "Technical Rendering",
      internal_linking: "Internal Linking",
      analytics_data: "Analytics & Data",
      core_web_vitals: "Core Web Vitals",
      hreflang: "Hreflang",
      h1_presence: "H1 Presence",
      navigation_consistency: "Navigation",
      mobile_responsive: "Mobile Responsive",
      image_seo: "Image SEO",
      https_protocol: "HTTPS Protocol",
      charset_utf8: "Charset UTF-8",
      viewport_tag: "Viewport Tag",
      google_fonts_preconnect: "Google Fonts Preconnect"
    };

    let columnIndex = 0;
    const columnWidth = (contentWidth - 5) / 2;

    subCategories.forEach((subKey) => {
      const subData = data.score_breakdown[subKey];
      if (!subData) return;

      const isObject = typeof subData === 'object' && subData.score !== undefined;
      const score = isObject ? subData.score : subData;
      
      if (score === null) return;

      checkPageBreak(12);

      const status = isObject ? subData.status : (score >= 7 ? "PASS" : score >= 4 ? "WARNING" : "FAIL");
      const max = isObject ? subData.max : 10;
      const weight = isObject && subData.weight ? subData.weight : null;
      const detailsCount = isObject && subData.details_count ? subData.details_count : null;

      // Calculate x position for 2-column layout
      const xPos = margin + (columnIndex % 2) * (columnWidth + 5);

      // Status colors (simplified for PDF)
      const statusColorSimple: any = {
        PASS: [34, 197, 94],
        WARNING: [234, 179, 8],
        FAIL: [239, 68, 68]
      };
      const statusColor = statusColorSimple[status] || [100, 100, 100];

      // Box background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(xPos, yPos, columnWidth, 10, 1, 1, "F");

      // Sub-category name
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      const label = subCategoryLabels[subKey] || subKey;
      doc.text(label, xPos + 2, yPos + 4);

      // Score
      doc.setFontSize(9);
      doc.setTextColor(...statusColor);
      doc.text(`${score.toFixed(1)}`, xPos + 2, yPos + 8);

      // Weight badge
      if (weight) {
        doc.setFontSize(6);
        doc.setTextColor(100, 116, 139);
        doc.text(`×${weight}`, xPos + 15, yPos + 8);
      }

      // Pass/Fail counts
      if (detailsCount) {
        doc.setFontSize(6);
        doc.setTextColor(34, 197, 94);
        doc.text(`${detailsCount.pass}✓`, xPos + columnWidth - 20, yPos + 4);
        doc.setTextColor(239, 68, 68);
        doc.text(`${detailsCount.fail}✗`, xPos + columnWidth - 20, yPos + 8);
      }

      // Progress bar
      const barWidth = columnWidth - 30;
      const barX = xPos + 25;
      const barY = yPos + 6;
      doc.setFillColor(229, 231, 235);
      doc.rect(barX, barY, barWidth, 2, "F");
      doc.setFillColor(...statusColor);
      doc.rect(barX, barY, (score / max) * barWidth, 2, "F");

      columnIndex++;

      // Move to next row after every 2 items
      if (columnIndex % 2 === 0) {
        yPos += 12;
      }
    });

    // Move yPos if we ended on odd column
    if (columnIndex % 2 !== 0) {
      yPos += 12;
    }

    yPos += 5;
  }

  // ── Critical Issues Summary ──────────────────────────────────────────────
  if (data.critical_issues_summary) {
    checkPageBreak(50);
    doc.setFontSize(14);
    doc.setTextColor(185, 28, 28);
    doc.text("Resumen de Problemas Críticos", margin, yPos);
    yPos += 10;

    const cis = data.critical_issues_summary;
    const cisStats = [
      { label: "Críticos", value: cis.total_critical_issues ?? 0, bg: [254, 226, 226] as [number,number,number], text: [185, 28, 28] as [number,number,number] },
      { label: "Alta Prioridad", value: cis.total_high_priority_issues ?? 0, bg: [255, 237, 213] as [number,number,number], text: [234, 88, 12] as [number,number,number] },
      { label: "Advertencias", value: cis.total_warnings ?? 0, bg: [254, 249, 195] as [number,number,number], text: [161, 98, 7] as [number,number,number] },
    ];
    const cisBoxW = (contentWidth - 10) / 3;
    cisStats.forEach((s, i) => {
      doc.setFillColor(...s.bg);
      doc.roundedRect(margin + i * (cisBoxW + 5), yPos, cisBoxW, 18, 2, 2, "F");
      doc.setFontSize(16);
      doc.setTextColor(...s.text);
      doc.text(String(s.value), margin + i * (cisBoxW + 5) + cisBoxW / 2, yPos + 10, { align: "center" });
      doc.setFontSize(7);
      doc.text(s.label, margin + i * (cisBoxW + 5) + cisBoxW / 2, yPos + 16, { align: "center" });
    });
    yPos += 24;

    if (cis.blocking_issues && cis.blocking_issues.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Issues bloqueantes:", margin, yPos);
      yPos += 6;
      cis.blocking_issues.forEach((issue: string) => {
        checkPageBreak(6);
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(margin, yPos - 3, pageWidth - 2 * margin, 6, 1, 1, "F");
        doc.setFontSize(8);
        doc.setTextColor(185, 28, 28);
        const split = doc.splitTextToSize(`• ${issue}`, pageWidth - 2 * margin - 6);
        doc.text(split, margin + 3, yPos + 1);
        yPos += 6 * split.length;
      });
    }
    yPos += 8;
  }

  // ── Estimated Impact ─────────────────────────────────────────────────────
  if (data.estimated_impact) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("Impacto Estimado", margin, yPos);
    yPos += 10;

    const impacts = [
      { label: "Incremento de Tráfico", value: data.estimated_impact.traffic_increase },
      { label: "Visibilidad AI Search", value: data.estimated_impact.ai_search_visibility },
      { label: "Velocidad de Indexación", value: data.estimated_impact.indexing_speed },
    ].filter(i => i.value);

    impacts.forEach((impact) => {
      const valueLines = safeSplitText(String(impact.value), contentWidth - 70);
      const boxHeight = Math.max(12, valueLines.length * 4 + 6);
      
      checkPageBreak(boxHeight + 3);
      
      doc.setFillColor(240, 249, 255);
      doc.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, "F");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(impact.label + ":", margin + 3, yPos + 6);
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(valueLines, margin + 65, yPos + 6);
      yPos += boxHeight + 3;
    });
    yPos += 5;
  }

  // ── Priority Fixes ───────────────────────────────────────────────────────
  if (data.priority_fixes && Array.isArray(data.priority_fixes) && data.priority_fixes.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("Correcciones Prioritarias", margin, yPos);
    yPos += 10;

  const categoryColors: any = {
    Critical: { bg: [254, 226, 226], text: [185, 28, 28] },
    High: { bg: [255, 237, 213], text: [234, 88, 12] },
    Medium: { bg: [254, 249, 195], text: [161, 98, 7] },
    Low: { bg: [219, 234, 254], text: [30, 64, 175] },
  };

  data.priority_fixes.forEach((fix: any) => {
    // Validación defensiva: asegurar que items sea un array
    const items = fix.items || [];
    checkPageBreak(15 + items.length * 8);
    
    const colors = categoryColors[fix.category] || { bg: [240, 240, 240], text: [0, 0, 0] };
    
    doc.setFillColor(...colors.bg);
    doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, "F");
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.text);
    doc.text(fix.category, margin + 3, yPos + 7);
    
    doc.setFontSize(8);
    doc.text(`${items.length} items`, margin + contentWidth - 20, yPos + 7);
    
    yPos += 12;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    
    items.forEach((item: any) => {
      // Soportar tanto strings como objetos
      const itemText = typeof item === 'string' ? item : item.issue || '';
      const splitText = safeSplitText(itemText, contentWidth - 20);
      
      checkPageBreak(5 * splitText.length + 2);
      
      doc.text("•", margin + 5, yPos);
      doc.text(splitText, margin + 10, yPos);
      yPos += 5 * splitText.length + 1;
    });
    
    yPos += 4;
  });
  } // end priority_fixes block

  // Critical Fixes Section (v5)
  if (data.critical_fixes_v5 && data.critical_fixes_v5.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setTextColor(239, 68, 68); // Red color
    doc.text("⚠ Problemas Críticos (Top Priority)", margin, yPos);
    yPos += 10;

    data.critical_fixes_v5.forEach((fix: any, index: number) => {
      checkPageBreak(25);
      
      // Critical fix box
      doc.setFillColor(254, 242, 242); // Light red background
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, "F");
      
      // Priority badge
      const priorityColors: any = {
        critical: [220, 38, 38],
        high: [249, 115, 22],
        medium: [234, 179, 8],
        low: [59, 130, 246]
      };
      const badgeColor = priorityColors[fix.priority?.toLowerCase()] || [128, 128, 128];
      doc.setFillColor(...badgeColor);
      doc.roundedRect(margin + 3, yPos + 1.5, 18, 5, 1, 1, "F");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(fix.priority?.toUpperCase() || "N/A", margin + 5, yPos + 4.5);
      
      // Issue title
      doc.setFontSize(10);
      doc.setTextColor(220, 38, 38);
      const issueTitle = typeof fix.issue === 'string' ? fix.issue : (fix.name || `Critical Fix ${index + 1}`);
      const splitTitle = doc.splitTextToSize(issueTitle, pageWidth - 2 * margin - 25);
      doc.text(splitTitle, margin + 25, yPos + 5);
      
      yPos += Math.max(8, 4 + splitTitle.length * 4);

      // Issue details
      if (fix.details) {
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        const splitDetails = doc.splitTextToSize(fix.details, pageWidth - 2 * margin - 10);
        doc.text(splitDetails, margin + 5, yPos);
        yPos += 4 * splitDetails.length + 2;
      }

      // Suggested fix
      if (fix.suggested_fix) {
        doc.setFontSize(8);
        doc.setTextColor(21, 128, 61); // Green
        doc.text("→ Solución:", margin + 5, yPos);
        const splitFix = doc.splitTextToSize(fix.suggested_fix, pageWidth - 2 * margin - 20);
        doc.text(splitFix, margin + 22, yPos);
        yPos += 4 * splitFix.length;
      }

      yPos += 5;
    });
    
    yPos += 5;
  }

  // WebMCP & AI-Readiness Section (NEW)
  if (data.webmcp_data) {
    checkPageBreak(60);
    
    doc.setFillColor(15, 23, 42); // Dark background
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, "F");
    
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // Green neon
    doc.text("WebMCP & AI-Readiness (Layer 21)", margin + 3, yPos + 6);
    
    // Score badge
    const score = data.webmcp_data.score || 0;
    const totalChecks = data.webmcp_data.total_checks || 7;
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${score}/${totalChecks}`, margin + contentWidth - 15, yPos + 6);
    
    yPos += 12;

    // AI-Readiness Level
    const getReadinessLevel = (score: number) => {
      if (score >= 6) return { level: "High", color: [34, 197, 94] };
      if (score >= 3) return { level: "Medium", color: [245, 158, 11] };
      return { level: "Low", color: [239, 68, 68] };
    };
    const readiness = getReadinessLevel(score);
    
    doc.setFillColor(...readiness.color);
    doc.roundedRect(margin, yPos, 30, 6, 1, 1, "F");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`${readiness.level} AI-Readiness`, margin + 2, yPos + 4);
    
    yPos += 10;

    // Checks
    if (data.webmcp_data.checks && data.webmcp_data.checks.length > 0) {
      const statusIcons: any = {
        PASS: "✓",
        WARNING: "⚠",
        FAIL: "✗",
        "N/A": "○"
      };
      
      const statusColorsPDF: any = {
        PASS: [34, 197, 94],
        WARNING: [245, 158, 11],
        FAIL: [239, 68, 68],
        "N/A": [100, 116, 139]
      };

      data.webmcp_data.checks.forEach((check: any) => {
        const icon = statusIcons[check.status] || "○";
        const color = statusColorsPDF[check.status] || [100, 100, 100];
        
        // Calculate space needed
        const detailLines = check.detail ? safeSplitText(check.detail, contentWidth - 25) : [];
        const spaceNeeded = 8 + (detailLines.length * 3) + 2;
        checkPageBreak(spaceNeeded);
        
        // Check line background
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, yPos, contentWidth, 7, 1, 1, "F");
        
        // Check ID
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(check.id, margin + 2, yPos + 4.5);
        
        // Status icon
        doc.setFontSize(9);
        doc.setTextColor(...color);
        doc.text(icon, margin + 15, yPos + 5);
        
        // Check name
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const nameText = safeSplitText(check.name, contentWidth - 80)[0]; // Truncate if too long
        doc.text(nameText, margin + 22, yPos + 4.5);
        
        // Manual check badge if applicable
        if (check.manualCheck) {
          doc.setFillColor(51, 65, 85);
          doc.roundedRect(margin + contentWidth - 22, yPos + 1.5, 20, 4, 1, 1, "F");
          doc.setFontSize(6);
          doc.setTextColor(203, 213, 225);
          doc.text("manual", margin + contentWidth - 20, yPos + 4);
        }
        
        yPos += 8;
        
        // Detail text
        if (check.detail && detailLines.length > 0) {
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text(detailLines, margin + 22, yPos);
          yPos += 3 * detailLines.length + 2;
        }
      });
    }

    // Priority Fixes for WebMCP
    if (data.webmcp_data.priority_fixes && data.webmcp_data.priority_fixes.length > 0) {
      yPos += 5;
      checkPageBreak(20);
      
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text("Priority Fixes:", margin, yPos);
      yPos += 6;
      
      data.webmcp_data.priority_fixes.slice(0, 5).forEach((fix: string) => {
        checkPageBreak(5);
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(margin + 2, yPos - 2, pageWidth - 2 * margin - 4, 5, 1, 1, "F");
        
        doc.setFontSize(7);
        doc.setTextColor(220, 38, 38);
        const splitFix = doc.splitTextToSize(fix, pageWidth - 2 * margin - 10);
        doc.text(splitFix, margin + 4, yPos);
        yPos += 3 * splitFix.length + 3;
      });
    }

    // Last AI check date
    if (data.webmcp_data.last_ai_check_date) {
      yPos += 3;
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Last AI visibility check: ${data.webmcp_data.last_ai_check_date}`, margin, yPos);
      yPos += 5;
    }
    
    yPos += 10;
  }

  // ── URL Discovery ─────────────────────────────────────────────────────────
  if (data.url_discovery) {
    doc.addPage();
    yPos = margin;
    addHeader();

    doc.setFontSize(18);
    doc.setTextColor(67, 56, 202);
    doc.text("URL Discovery", margin, yPos);
    yPos += 12;

    const ud = data.url_discovery;
    const udStats = [
      { label: "Descubiertas", value: ud.total_urls_discovered ?? 0, bg: [238, 242, 255] as [number,number,number], text: [67, 56, 202] as [number,number,number] },
      { label: "Válidas (200)", value: ud.valid_urls_200 ?? 0, bg: [220, 252, 231] as [number,number,number], text: [21, 128, 61] as [number,number,number] },
      { label: "Inválidas", value: ud.invalid_urls ?? 0, bg: [254, 226, 226] as [number,number,number], text: [185, 28, 28] as [number,number,number] },
      { label: "Cobertura", value: `${ud.coverage_percentage ?? 0}%`, bg: [219, 234, 254] as [number,number,number], text: [30, 64, 175] as [number,number,number] },
    ];
    const udW = (contentWidth - 15) / 4;
    udStats.forEach((s, i) => {
      doc.setFillColor(...s.bg);
      doc.roundedRect(margin + i * (udW + 5), yPos, udW, 16, 2, 2, "F");
      doc.setFontSize(13);
      doc.setTextColor(...s.text);
      doc.text(String(s.value), margin + i * (udW + 5) + udW / 2, yPos + 9, { align: "center" });
      doc.setFontSize(6);
      doc.text(s.label, margin + i * (udW + 5) + udW / 2, yPos + 14, { align: "center" });
    });
    yPos += 22;

    const udMeta = [
      { label: "Método", value: (ud.method_used || "—").replace(/_/g, " ") },
      { label: "Sitemap XML", value: ud.sitemap_check_result === "404_not_found" ? "No encontrado (404)" : ud.sitemap_check_result || "—" },
      { label: "Robots.txt", value: ud.robots_txt_check_result === "404_not_found" ? "No encontrado (404)" : ud.robots_txt_check_result || "—" },
    ];
    udMeta.forEach(m => {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`${m.label}:`, margin, yPos);
      doc.setTextColor(0, 0, 0);
      doc.text(m.value, margin + 30, yPos);
      yPos += 6;
    });
    yPos += 4;

    if (ud.discovery_notes) {
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      const noteLines = doc.splitTextToSize(ud.discovery_notes, pageWidth - 2 * margin);
      doc.setFillColor(238, 242, 255);
      doc.roundedRect(margin, yPos - 2, pageWidth - 2 * margin, noteLines.length * 4 + 6, 2, 2, "F");
      doc.text(noteLines, margin + 3, yPos + 2);
      yPos += noteLines.length * 4 + 10;
    }

    if (ud.discovered_urls && ud.discovered_urls.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175);
      doc.text(`URLs descubiertas (${ud.discovered_urls.length})`, margin, yPos);
      yPos += 6;
      ud.discovered_urls.forEach((url: string) => {
        checkPageBreak(5);
        doc.setFontSize(7);
        doc.setTextColor(60, 60, 60);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, yPos - 3, pageWidth - 2 * margin, 5, 1, 1, "F");
        doc.text(url, margin + 3, yPos + 1);
        yPos += 6;
      });
    }
    yPos += 5;
  }

  // ── Local SEO Analysis ───────────────────────────────────────────────────
  if (data.local_seo_analysis) {
    checkPageBreak(60);
    doc.setFontSize(18);
    doc.setTextColor(4, 120, 87);
    doc.text("Local SEO Analysis", margin, yPos);
    yPos += 10;

    const lsa = data.local_seo_analysis;
    const info = lsa.business_info || {};

    if (info.name || info.address || info.email) {
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 36, 3, 3, "F");
      let infoY = yPos + 7;
      doc.setFontSize(11);
      doc.setTextColor(4, 120, 87);
      if (info.name) { doc.text(`Empresa: ${info.name}`, margin + 4, infoY); infoY += 6; }
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      if (info.industry) { doc.text(`Industria: ${info.industry}`, margin + 4, infoY); infoY += 5; }
      if (info.address) { doc.text(`Dirección: ${info.address}`, margin + 4, infoY); infoY += 5; }
      if (info.email) { doc.text(`Email: ${info.email}`, margin + 4, infoY); infoY += 5; }
      if (info.phone && info.phone.length > 0) { doc.text(`Tel: ${info.phone.join(" / ")}`, margin + 4, infoY); }
      yPos += 40;
    }

    if (info.service_areas && info.service_areas.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text("Áreas de servicio: " + info.service_areas.join(", "), margin, yPos);
      yPos += 8;
    }

    const lsaScore = lsa.local_seo_score;
    if (lsaScore !== undefined) {
      doc.setFontSize(9); doc.setTextColor(100, 100, 100);
      doc.text(`Local SEO Score: `, margin, yPos);
      doc.setFontSize(11); doc.setTextColor(4, 120, 87);
      doc.text(`${lsaScore}/10`, margin + 32, yPos);
      yPos += 8;
    }

    const halfW = (contentWidth - 5) / 2;
    const colStart = yPos;
    let leftY = colStart, rightY = colStart;

    if (lsa.issues_found && lsa.issues_found.length > 0) {
      doc.setFontSize(9); doc.setTextColor(185, 28, 28);
      doc.text("Problemas encontrados", margin, leftY); leftY += 5;
      lsa.issues_found.forEach((issue: string) => {
        const s = safeSplitText(`• ${issue}`, halfW - 4);
        doc.setFontSize(7); doc.setTextColor(100, 0, 0);
        doc.text(s, margin, leftY); leftY += 4 * s.length;
      });
    }
    if (lsa.strengths && lsa.strengths.length > 0) {
      doc.setFontSize(9); doc.setTextColor(21, 128, 61);
      doc.text("Puntos fuertes", margin + halfW + 5, rightY); rightY += 5;
      lsa.strengths.forEach((s: string) => {
        const split = safeSplitText(`• ${s}`, halfW - 4);
        doc.setFontSize(7); doc.setTextColor(0, 80, 0);
        doc.text(split, margin + halfW + 5, rightY); rightY += 4 * split.length;
      });
    }
    yPos = Math.max(leftY, rightY) + 8;
  }

  // ── Competitive Analysis ─────────────────────────────────────────────────
  if (data.competitive_analysis) {
    checkPageBreak(50);
    doc.setFontSize(18);
    doc.setTextColor(109, 40, 217);
    doc.text("Análisis Competitivo", margin, yPos);
    yPos += 10;

    const ca = data.competitive_analysis;
    if (ca.market_position) {
      doc.setFillColor(245, 243, 255);
      const mpLines = safeSplitText(ca.market_position, contentWidth - 8);
      doc.roundedRect(margin, yPos - 2, contentWidth, mpLines.length * 5 + 8, 2, 2, "F");
      doc.setFontSize(8); doc.setTextColor(109, 40, 217);
      doc.text(mpLines, margin + 4, yPos + 4);
      yPos += mpLines.length * 5 + 12;
    }

    const halfW2 = (contentWidth - 5) / 2;
    let gapY = yPos, advY = yPos;

    if (ca.competitive_gaps && ca.competitive_gaps.length > 0) {
      doc.setFontSize(9); doc.setTextColor(185, 28, 28);
      doc.text("Brechas competitivas", margin, gapY); gapY += 5;
      ca.competitive_gaps.forEach((g: string) => {
        const s = safeSplitText(`• ${g}`, halfW2 - 4);
        doc.setFontSize(7); doc.setTextColor(100, 0, 0);
        doc.text(s, margin, gapY); gapY += 4 * s.length;
      });
    }
    if (ca.competitive_advantages && ca.competitive_advantages.length > 0) {
      doc.setFontSize(9); doc.setTextColor(21, 128, 61);
      doc.text("Ventajas competitivas", margin + halfW2 + 5, advY); advY += 5;
      ca.competitive_advantages.forEach((a: string) => {
        const s = safeSplitText(`• ${a}`, halfW2 - 4);
        doc.setFontSize(7); doc.setTextColor(0, 80, 0);
        doc.text(s, margin + halfW2 + 5, advY); advY += 4 * s.length;
      });
    }
    yPos = Math.max(gapY, advY) + 8;
  }

  // ── Expected Outcomes ────────────────────────────────────────────────────
  if (data.expected_outcomes) {
    checkPageBreak(60);
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175);
    doc.text("Resultados Esperados", margin, yPos);
    yPos += 10;

    const eo = data.expected_outcomes;
    const periods: Array<{ key: string; label: string; bg: [number,number,number]; text: [number,number,number] }> = [
      { key: "3_months", label: "3 Meses", bg: [219, 234, 254], text: [30, 64, 175] },
      { key: "6_months", label: "6 Meses", bg: [243, 232, 255], text: [109, 40, 217] },
      { key: "12_months", label: "12 Meses", bg: [220, 252, 231], text: [21, 128, 61] },
    ];

    const labelMap: Record<string, string> = {
      organic_traffic_increase: "Tráfico orgánico",
      ranking_improvements: "Mejora posiciones",
      technical_score_improvement: "Score técnico",
      ai_visibility_improvement: "Visibilidad IA",
      lead_generation_increase: "Generación leads",
      local_search_visibility: "Visibilidad local",
      rich_results_eligibility: "Rich results",
      market_authority: "Autoridad mercado",
      ai_readiness: "IA readiness",
      roi_achievement: "ROI",
    };

    periods.forEach(({ key, label, bg, text }) => {
      const period = eo[key];
      if (!period) return;
      const entries = Object.entries(period).filter(([, v]) => v !== undefined);
      if (!entries.length) return;

      checkPageBreak(12 + entries.length * 8);
      doc.setFillColor(...bg);
      doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, "F");
      doc.setFontSize(11); doc.setTextColor(...text);
      doc.text(label, margin + 4, yPos + 5.5);
      yPos += 10;

      entries.forEach(([field, value]) => {
        const valueText = safeSplitText(String(value), contentWidth - 60);
        checkPageBreak(4 * valueText.length + 2);
        
        doc.setFontSize(8); doc.setTextColor(80, 80, 80);
        doc.text(`${labelMap[field] || field.replace(/_/g, " ")}:`, margin + 4, yPos);
        doc.setTextColor(0, 0, 0);
        doc.text(valueText, margin + 55, yPos);
        yPos += 4 * valueText.length + 1;
      });
      yPos += 4;
    });
    yPos += 4;
  }

  // ── Recommendations Summary ───────────────────────────────────────────────
  if (data.recommendations_summary) {
    checkPageBreak(50);
    doc.setFontSize(18);
    doc.setTextColor(51, 65, 85);
    doc.text("Resumen de Recomendaciones", margin, yPos);
    yPos += 10;

    const rs = data.recommendations_summary;
    const rsStats = [
      { label: "Fixes Críticos", value: rs.critical_fixes ?? 0, bg: [254, 226, 226] as [number,number,number], text: [185, 28, 28] as [number,number,number] },
      { label: "Alta Prioridad", value: rs.high_priority_fixes ?? 0, bg: [255, 237, 213] as [number,number,number], text: [234, 88, 12] as [number,number,number] },
      { label: "Horas estimadas", value: rs.total_implementation_hours ?? 0, bg: [219, 234, 254] as [number,number,number], text: [30, 64, 175] as [number,number,number] },
    ];
    const rsW = (contentWidth - 10) / 3;
    rsStats.forEach((s, i) => {
      doc.setFillColor(...s.bg);
      doc.roundedRect(margin + i * (rsW + 5), yPos, rsW, 18, 2, 2, "F");
      doc.setFontSize(14); doc.setTextColor(...s.text);
      doc.text(String(s.value), margin + i * (rsW + 5) + rsW / 2, yPos + 10, { align: "center" });
      doc.setFontSize(6); doc.text(s.label, margin + i * (rsW + 5) + rsW / 2, yPos + 16, { align: "center" });
    });
    yPos += 24;

    if (rs.primary_focus) {
      const focusLines = safeSplitText(rs.primary_focus, contentWidth - 40);
      const boxHeight = Math.max(10, focusLines.length * 4 + 4);
      
      doc.setFillColor(219, 234, 254);
      doc.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, "F");
      doc.setFontSize(8); doc.setTextColor(30, 64, 175);
      doc.text("Foco principal:", margin + 3, yPos + 4);
      doc.setTextColor(0, 0, 0);
      doc.text(focusLines, margin + 35, yPos + 4);
      yPos += boxHeight + 4;
    }
    if (rs.success_probability) {
      const probLines = safeSplitText(rs.success_probability, contentWidth - 55);
      const boxHeight = Math.max(10, probLines.length * 4 + 4);
      
      doc.setFillColor(254, 249, 195);
      doc.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, "F");
      doc.setFontSize(8); doc.setTextColor(161, 98, 7);
      doc.text("Probabilidad de éxito:", margin + 3, yPos + 4);
      doc.setTextColor(0, 0, 0);
      doc.text(probLines, margin + 50, yPos + 4);
      yPos += boxHeight + 4;
    }
    yPos += 4;
  }

  // ── Implementation Roadmap ────────────────────────────────────────────────
  if (data.implementation_roadmap && Object.keys(data.implementation_roadmap).length > 0) {
  doc.addPage();
  yPos = margin;
  addHeader();

  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text("Roadmap de Implementación", margin, yPos);
  yPos += 12;

  const weeks = Object.entries(data.implementation_roadmap);
  weeks.forEach(([week, tasks]: [string, any]) => {
    const taskList = Array.isArray(tasks) ? tasks : (tasks?.tasks || []);
    const focus = !Array.isArray(tasks) && tasks?.focus ? tasks.focus : null;
    const estimatedHours = !Array.isArray(tasks) && tasks?.estimated_hours ? tasks.estimated_hours : null;
    checkPageBreak(15 + taskList.length * 6);

    const weekLabel = week.replace("week_", "Semana ").replace("phase_", "Fase ");

    doc.setFillColor(30, 64, 175);
    doc.circle(margin + 5, yPos + 3, 3, "F");

    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text(weekLabel, margin + 12, yPos + 5);

    if (focus) {
      doc.setFontSize(9); doc.setTextColor(80, 80, 80);
      doc.text(focus, margin + 12, yPos + 10);
      yPos += 4;
    }
    if (estimatedHours) {
      doc.setFontSize(7); doc.setTextColor(130, 130, 130);
      doc.text(`${estimatedHours}h estimadas`, pageWidth - margin - 25, yPos + 5);
    }
    yPos += 12;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    taskList.forEach((task: string) => {
      const splitText = safeSplitText(task, contentWidth - 25);
      checkPageBreak(5 * splitText.length + 2);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(margin + 5, yPos - 3, margin + 5, yPos + 3);
      doc.text("✓", margin + 12, yPos);
      doc.text(splitText, margin + 18, yPos);
      yPos += 5 * splitText.length + 1;
    });

    yPos += 5;
  });
  } // end implementation_roadmap block

  // ── Layers Analysis ───────────────────────────────────────────────────────
  if (data.layers && Array.isArray(data.layers) && data.layers.length > 0) {
  doc.addPage();
  yPos = margin;
  addHeader();

  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text("Análisis Detallado por Capas", margin, yPos);
  yPos += 12;

  const statusColors: any = {
    Pass: { bg: [220, 252, 231], text: [21, 128, 61], badge: [22, 163, 74] },
    Fail: { bg: [254, 226, 226], text: [185, 28, 28], badge: [220, 38, 38] },
    Warning: { bg: [254, 249, 195], text: [161, 98, 7], badge: [202, 138, 4] },
    Medium: { bg: [255, 237, 213], text: [234, 88, 12], badge: [249, 115, 22] },
  };

  data.layers.forEach((layer: any, index: number) => {
    // Validación defensiva: soportar nuevo formato con pass_items/fail_items/warning_items
    const allDetails = [
      ...(layer.pass_items || []),
      ...(layer.fail_items || []),
      ...(layer.warning_items || []),
      ...(layer.details || [])
    ];
    
    // Calculate space needed for this layer
    let detailsSpace = 0;
    allDetails.forEach((detail: string) => {
      const lines = safeSplitText(detail, contentWidth - 12);
      detailsSpace += 4 * lines.length;
    });
    
    checkPageBreak(20 + detailsSpace);
    
    const colors = statusColors[layer.status] || { bg: [240, 240, 240], text: [0, 0, 0], badge: [128, 128, 128] };
    
    // Layer header
    doc.setFillColor(...colors.bg);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, "F");
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    const layerName = safeSplitText(layer.name, contentWidth - 80)[0]; // Truncate if too long
    doc.text(layerName, margin + 3, yPos + 8);

    // Score badge
    if (layer.score !== undefined) {
      doc.setFontSize(8); doc.setTextColor(...colors.text);
      doc.text(`${Number(layer.score).toFixed(1)}/10`, margin + contentWidth - 50, yPos + 8);
    }

    // Status badge
    doc.setFillColor(...colors.badge);
    const statusText = String(layer.status || "N/A");
    const statusWidth = Math.min(doc.getTextWidth(statusText) + 6, 35);
    doc.roundedRect(margin + contentWidth - statusWidth - 2, yPos + 2, statusWidth, 8, 2, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(statusText, margin + contentWidth - statusWidth + 1, yPos + 7.5);
    
    yPos += 14;

    // Details
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    
    allDetails.forEach((detail: string) => {
      const splitText = safeSplitText(detail, contentWidth - 12);
      checkPageBreak(4 * splitText.length + 1);
      
      doc.text("•", margin + 5, yPos);
      doc.text(splitText, margin + 10, yPos);
      yPos += 4 * splitText.length;
    });
    
    yPos += 6;
  });
  } // end layers block

  // Add footers to all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  return doc;
}

export function generateComparisonPDF(
  oldData: any,
  newData: any,
  improvements: any[],
  degraded: any[],
  stillPending: any[],
  scoreComparison: any
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      addHeader();
      return true;
    }
    return false;
  };

  // Header function
  const addHeader = () => {
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Comparación de Auditorías SEO", margin, 10);
    doc.setTextColor(0, 0, 0);
    yPos = 25;
  };

  // Footer function
  const addFooter = () => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${pageCount} - Generado el ${new Date().toLocaleDateString("es-ES")}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  };

  // Title Page
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("Comparación de", pageWidth / 2, 60, { align: "center" });
  doc.text("Auditorías SEO", pageWidth / 2, 75, { align: "center" });

  doc.setFontSize(14);
  doc.text("Análisis de Mejoras y Cambios", pageWidth / 2, 95, { align: "center" });

  // Dates comparison
  doc.setFontSize(11);
  const oldDate = oldData.audit_date
    ? new Date(oldData.audit_date).toLocaleDateString("es-ES")
    : "Auditoría anterior";
  const newDate = newData.audit_date
    ? new Date(newData.audit_date).toLocaleDateString("es-ES")
    : "Auditoría nueva";

  doc.text(`${oldDate}  →  ${newDate}`, pageWidth / 2, 110, { align: "center" });

  // Summary boxes
  const boxY = 140;
  const boxWidth = 50;
  const boxHeight = 40;

  // Improvements box
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(pageWidth / 2 - boxWidth - 10, boxY, boxWidth, boxHeight, 5, 5, "F");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(improvements.length.toString(), pageWidth / 2 - boxWidth / 2 - 10, boxY + 20, { align: "center" });
  doc.setFontSize(10);
  doc.text("Mejoras", pageWidth / 2 - boxWidth / 2 - 10, boxY + 32, { align: "center" });

  // Degraded box
  doc.setFillColor(239, 68, 68);
  doc.roundedRect(pageWidth / 2 + 10, boxY, boxWidth, boxHeight, 5, 5, "F");
  doc.setFontSize(24);
  doc.text(degraded.length.toString(), pageWidth / 2 + boxWidth / 2 + 10, boxY + 20, { align: "center" });
  doc.setFontSize(10);
  doc.text("Empeoradas", pageWidth / 2 + boxWidth / 2 + 10, boxY + 32, { align: "center" });

  // New page - Score Comparison
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  yPos = margin;
  addHeader();

  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175);
  doc.text("Comparación de Puntuaciones", margin, yPos);
  yPos += 15;

  // SEO Score comparison
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, "F");

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("SEO Score", margin + 5, yPos + 10);

  doc.setFontSize(14);
  doc.setTextColor(150, 150, 150);
  doc.text(scoreComparison.seo.old.toFixed(1), margin + 60, yPos + 10);

  doc.setTextColor(0, 0, 0);
  doc.text("→", margin + 80, yPos + 10);

  const seoChange = scoreComparison.seo.change;
  doc.setTextColor(seoChange > 0 ? 34 : seoChange < 0 ? 239 : 0, seoChange > 0 ? 197 : seoChange < 0 ? 68 : 0, seoChange > 0 ? 94 : seoChange < 0 ? 68 : 0);
  doc.text(scoreComparison.seo.new.toFixed(1), margin + 95, yPos + 10);

  doc.setFontSize(10);
  doc.text(`${seoChange > 0 ? "+" : ""}${seoChange.toFixed(1)} puntos`, margin + 5, yPos + 20);

  yPos += 30;

  // AI Visibility Score comparison
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, "F");

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("AI Visibility Score", margin + 5, yPos + 10);

  doc.setFontSize(14);
  doc.setTextColor(150, 150, 150);
  doc.text(scoreComparison.ai.old.toFixed(1), margin + 60, yPos + 10);

  doc.setTextColor(0, 0, 0);
  doc.text("→", margin + 80, yPos + 10);

  const aiChange = scoreComparison.ai.change;
  doc.setTextColor(aiChange > 0 ? 34 : aiChange < 0 ? 239 : 0, aiChange > 0 ? 197 : aiChange < 0 ? 68 : 0, aiChange > 0 ? 94 : aiChange < 0 ? 68 : 0);
  doc.text(scoreComparison.ai.new.toFixed(1), margin + 95, yPos + 10);

  doc.setFontSize(10);
  doc.text(`${aiChange > 0 ? "+" : ""}${aiChange.toFixed(1)} puntos`, margin + 5, yPos + 20);

  yPos += 35;

  // Improvements Section
  if (improvements.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(`✓ Mejoras Implementadas (${improvements.length})`, margin, yPos);
    yPos += 10;

    improvements.forEach((item) => {
      checkPageBreak(25);

      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 2, 2, "F");

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(item.name, margin + 3, yPos + 7);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${item.oldStatus} → ${item.newStatus}`, margin + 3, yPos + 13);

      if (item.oldScore !== undefined && item.newScore !== undefined) {
        doc.text(
          `Score: ${item.oldScore.toFixed(1)} → ${item.newScore.toFixed(1)} (+${(item.newScore - item.oldScore).toFixed(1)})`,
          margin + 3,
          yPos + 17
        );
      }

      yPos += 23;
    });

    yPos += 5;
  }

  // Degraded Section
  if (degraded.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setTextColor(239, 68, 68);
    doc.text(`✗ Áreas que Empeoraron (${degraded.length})`, margin, yPos);
    yPos += 10;

    degraded.forEach((item) => {
      checkPageBreak(30);

      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 2, 2, "F");

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(item.name, margin + 3, yPos + 7);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${item.oldStatus} → ${item.newStatus}`, margin + 3, yPos + 13);

      if (item.oldScore !== undefined && item.newScore !== undefined) {
        doc.text(
          `Score: ${item.oldScore.toFixed(1)} → ${item.newScore.toFixed(1)} (${(item.newScore - item.oldScore).toFixed(1)})`,
          margin + 3,
          yPos + 17
        );
      }

      // Details preview
      if (item.details && item.details.length > 0) {
        doc.setFontSize(7);
        doc.text(`• ${item.details[0].substring(0, 80)}${item.details[0].length > 80 ? "..." : ""}`, margin + 5, yPos + 21);
      }

      yPos += 28;
    });

    yPos += 5;
  }

  // Still Pending Section
  if (stillPending.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setTextColor(251, 146, 60);
    doc.text(`⚠ Pendientes por Resolver (${stillPending.length})`, margin, yPos);
    yPos += 10;

    stillPending.forEach((item) => {
      checkPageBreak(25);

      doc.setFillColor(255, 247, 237);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 2, 2, "F");

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(item.name, margin + 3, yPos + 7);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Estado: ${item.newStatus}`, margin + 3, yPos + 13);

      if (item.newScore !== undefined) {
        doc.text(`Score: ${item.newScore.toFixed(1)}/10`, margin + 3, yPos + 17);
      }

      yPos += 23;
    });
  }

  // Add footers to all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  return doc;
}