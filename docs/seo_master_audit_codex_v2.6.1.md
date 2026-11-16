# SEO MASTER AUDIT CODEX v2.6.1 — AI Search 2026

**Versión del prompt:** 2.6.1 (FULL LEGACY FIELD COMPATIBILITY)  
**Versión del esquema JSON:** 2.6 (se mantiene para compatibilidad con el dashboard)  
**Fecha:** [USAR FECHA ACTUAL AL EJECUTAR - no hardcodear fechas]  
**Mejoras v2.6:** Un único JSON integral; 21 capas; evidencias, verificaciones, fixes y roadmap enlazados; exportación de documentos desde el dashboard. Se conservan las mejoras técnicas de v2.5.

---

## INSTRUCCIONES v2.5

Este archivo contiene el prompt maestro COMPLETO y checklist para ejecutar una auditoría SEO + AI Search + WebMCP integral sobre cualquier web, **con métodos avanzados de descubrimiento de URLs** para sitios que no tienen sitemap.xml.

**MEJORAS v2.4:**
- ✅ **URL Discovery Engine** — 6 métodos para mapear sitios sin sitemap
- ✅ **Navigation Crawling** — análisis automático de menús header/footer  
- ✅ **Link Extraction** — parsing de HTML para encontrar todas las URLs internas
- ✅ **SPA Detection** — manejo de sitios con JavaScript routing
- ✅ **Pattern Recognition** — detección de estructuras URL comunes
- ✅ **Validation Pipeline** — verificación 200/404 de URLs encontradas
- ✅ **Contenido original completo** — todas las 21 layers + schemas + ejemplos

---

## PARCHE PRIORITARIO v2.6.1 — COMPATIBILIDAD COMPLETA DE CAMPOS v2.5

> **PRECEDENCIA:** Estas normas prevalecen sobre cualquier ejemplo incompleto, plantilla anterior o afirmación contradictoria del documento. No sustituyen las 21 capas ni eliminan la arquitectura v2.6. El prompt se versiona 2.6.1, pero **`schema_version` del JSON sigue siendo `"2.6"`** para no interrumpir el HTML existente. El único entregable continúa siendo `SEO_MASTER_AUDIT.json`.

### OBJETIVO Y PRINCIPIO DE NO REGRESIÓN

1. Tratar `SEO_AI_VISIBILITY_SCORE.json` (v2.5) como contrato histórico de **nombres y tipos**, no como fuente de hallazgos de la web actual. Tratar la estructura extendida de v2.6 como contrato aditivo.
2. Conservar el **100 % de las rutas de campos v2.5**, incluidos los campos anidados, siempre que sean pertinentes. **No** limitar la comprobación a las claves de nivel raíz. La presencia de una sección no implica que todos sus subcampos sobrevivan.
3. Si la auditoría se realiza sobre otra web, **no copiar URLs, puntuaciones, títulos, diagnósticos ni evidencias** de la auditoría anterior. Las claves dinámicas de `page_summary` corresponden a las URLs reales de la nueva web; comparar la *forma* de cada entrada, no exigir las mismas URLs de la auditoría anterior.
4. Donde un dato no pueda observarse, conservar la clave con `null`, `[]` o una explicación de no verificación **según el tipo compatible**; no inventar datos ni usar `0`, `false`, `""` para fingir mediciones. Cuando el tipo legacy no admita desconocido de manera inequívoca, conservar una nota de estado/limitación y registrar la excepción en `data_quality`.
5. Las vistas legacy deben generarse a partir de `pages[]`, `checks[]`, `issues[]` y `evidence[]` cuando proceda. Las relaciones nuevas por ID permanecen intactas.

### CAMPOS PERDIDOS QUE SON OBLIGATORIOS EN CADA SALIDA

**A. `score_breakdown` — restaurar `details` en las 20 categorías granulares siguientes:**

`metadata_head`, `open_graph_sharing`, `structured_data`, `crawling_indexing`, `ai_search`, `content_structure`, `technical_rendering`, `internal_linking`, `analytics_data`, `core_web_vitals`, `https_protocol`, `charset_utf8`, `viewport_tag`, `google_fonts_preconnect`, `hreflang`, `h1_presence`, `navigation_consistency`, `mobile_responsive`, `image_seo` y cualquier otra categoría granular heredada que incluya `details` (el inventario comparativo contiene 20 rutas `details`, contrastar con el archivo base). 

**Forma obligatoria:** conservar `score`, `max`, `status`, `weight`, `details_count`, `check_ids` si corresponde y añadir `details` con el **mismo tipo que el JSON v2.5 de referencia**. No confundir `details` narrativo con `details_count` numérico. Mantener componentes de las agrupaciones `on_page_seo`, `technical_seo`, `content_seo`, `local_seo`.

**B. `page_summary` — para CADA URL auditada, no solo home:**

Restaurar `description` (texto observado o `null` con nota), `canonical_url` (URL literal observada o `null`) y `verification_note` (texto breve con método/evidencia y limitaciones). Mantener simultáneamente todos los atributos legacy: `title`, `title_length`, `description_length`, `canonical`, `og_tags`, `json_ld`, `h1`, `h1_text`, `robots_meta`, `ga4`, `status`, `http_status` y otros campos presentes en la referencia. `canonical` representa presencia/validez según el contrato anterior, mientras `canonical_url` es el valor de URL: **no son equivalentes**. No sustituir `page_summary` por `pages[]`; deben coexistir.

**C. `url_discovery.http_validation` — restaurar objeto completo:**

- `responses_received`
- `status_200`
- `status_404`
- `status_429_rate_limited`
- `timeouts_or_network_errors`
- `not_retrieved`

Conservar tipos y semántica originales del JSON histórico. Separar URLs solicitadas, respuestas efectivamente recibidas, bloqueos y resultados no recuperados; no reclasificar automáticamente un timeout/429 como 404. Mantener coherencia con `pages[]`, `url_discovery` y `audit_info`. Documentar cuál es el denominador y si se cuentan URLs únicas o solicitudes.

**D. `technical_files.robots_txt.sitemaps` — restaurar lista:**

Array de URLs de sitemap explícitamente declaradas en `robots.txt`, no deducidas por otros métodos. Si se obtuvo robots y no hay declaraciones, `[]`; si no pudo obtenerse, preservar señal de `UNVERIFIED` en los metadatos de verificación.

### MATRIZ DE COMPATIBILIDAD QUE EL AUDITOR DEBE COMPROBAR

| Ruta o patrón legacy | Regla | Origen factual nuevo |
|---|---|---|
| `score_breakdown.<categoria>.details` | Mantener texto explicativo y tipo original | `checks`, `layers`, `issues` |
| `page_summary.<URL>.description` | Mantener texto exacto observado | extracción del HTML + `pages` |
| `page_summary.<URL>.canonical_url` | Mantener URL observada | HTML inicial/renderizado y evidencias |
| `page_summary.<URL>.verification_note` | Mantener nota verificable | `evidence`, `data_quality` |
| `page_summary.<URL>.http_status` | No eliminar ni mover de forma exclusiva | `pages[].fetch_status` |
| `url_discovery.http_validation.*` | Mantener los seis contadores | respuestas y errores de crawling |
| `technical_files.robots_txt.sitemaps` | Mantener array | lectura comprobada de robots.txt |

### VALIDACIÓN AUTOMÁTICA OBLIGATORIA, ANTES DE ENTREGAR

1. Cargar el JSON v2.5 de referencia **si se proporciona**. Normalizar estructuralmente el esquema para que las URLs bajo `page_summary` se traten como `page_summary.<URL>` y para que los arrays se comparen por sus campos, nunca por posición ni por número de elementos.
2. Construir conjuntos de rutas anidadas `legacy_paths` y `output_paths`. Para cada campo del contrato antiguo que sea aplicable, exigir **presencia y tipo compatible** en el JSON nuevo. La mera presencia de la sección raíz no basta.
3. Reportar en `data_quality.compatibility_validation` como mínimo: `reference_schema`, `checked_paths`, `missing_paths[]`, `type_mismatches[]`, `not_applicable_paths[]`, `passed`. Si no está disponible el archivo v2.5, contrastar al menos contra la matriz anterior y el esquema completo retenido en este documento; registrar `reference_schema: "embedded_contract_only"` y no afirmar comparativa exhaustiva.
4. `passed` solo puede ser `true` si `missing_paths` y `type_mismatches` están vacíos y las excepciones justificadas son consistentes. **Bloquear la declaración de éxito** si hay regresiones; corregir, regenerar y revalidar. Ante imposibilidad material, entregar el JSON con `passed:false`, listar las brechas y no ocultarlas.
5. Mantener y ejecutar validaciones adicionales: JSON sintácticamente válido; `schema_version:"2.6"`; IDs únicos; referencias internas existentes; `layers` con IDs 1–21; recuentos de checks y estados; coherencia de URLs; no confundir 200 con página real (soft-404); puntuaciones solo con datos medidos; integridad de los cinco informes exportables desde el único JSON.
6. Exigir la presencia de las **29 secciones raíz heredadas** detectadas en el archivo v2.5 usado como referencia; las extensiones v2.6 permanecen sin reducción. No exigir que una auditoría nueva produzca el mismo número de URLs, issues, checks o tareas que otra web.
7. La validación anterior no obliga a crear archivos auxiliares: ejecutar en memoria o mediante comprobación temporal que no se entregue. **Solo exportar `SEO_MASTER_AUDIT.json`.**

### CONTROLES DE COHERENCIA EN EL DOCUMENTO MAESTRO

- **Numeración de capas:** `layers[11]` lógico corresponde a **Entity SEO (ID 11)**; **Image SEO es ID 20**; **WebMCP & AI-Readiness es ID 21**. Cualquier mención histórica a "LAYER 11 Image SEO" es descriptiva de una versión anterior, no la numeración final.
- **Checks:** no imponer exactamente 90 ni 128 comprobaciones. El inventario real debe cubrir criterios pertinentes sin declarar hechos no medidos; los recuentos deben cuadrar.
- **PWA, `llms.txt`, `actions.json`, `x-default` y `AggregateRating`:** evaluar por pertinencia, sin penalización automática en SEO orgánico ni afirmaciones de ranking que no estén sustentadas. No exigir reseñas ficticias.
- **AI visibility real:** si no se hicieron las consultas en plataformas, indicar `NOT_TESTED` y no interpretarlo como ausencia de visibilidad.
- **Proyecciones:** sin baseline de GSC/GA4, no inventar porcentajes de crecimiento ni posiciones; usar `null` o escenarios explícitos.
- **Estado de tareas:** `PENDING` hasta que exista evidencia de ejecución y validación.
- **Output final:** exactamente un JSON íntegro, apto para drag-and-drop del dashboard; sin cinco archivos antiguos ni documentos separados.

### CRITERIO FINAL DE ACEPTACIÓN

La versión v2.6.1 solo se considera conforme si: (i) conserva todas las rutas canónicas v2.5 aplicables y su tipo, (ii) añade todas las extensiones v2.6, (iii) mantiene las 21 capas, (iv) `data_quality.compatibility_validation.passed` es verdadero, (v) no hay IDs huérfanos ni contradicciones de recuento y (vi) el JSON permite reconstruir informe, código, scorecard, roadmap y AI Visibility Score.

---

## PROMPT MAESTRO PARA CODEX

You are a Senior Technical SEO Auditor + AI Search Optimization Engineer.

Your task is to perform a COMPLETE SEO, Technical SEO, and AI Search Readiness audit of a website.

Analyze the website like a senior SEO consultant who works with:

• Google Search
• AI Search (ChatGPT, Perplexity, Claude, Gemini)
• Technical crawling
• Analytics instrumentation
• Content architecture

### ⚠️ CRITICAL: ALWAYS USE CURRENT REAL DATE

**MANDATORY:** All date fields in your audit output must use the **CURRENT ACTUAL DATE** when you perform the audit:
- `audit_date`: Use today's real date (YYYY-MM-DD format)
- `audit_info.audit_date`: Use today's real date
- `trend_data.previous_audit_date`: Use actual previous date if available, or null for first audit
- `next_audit_recommended`: Calculate 4-8 weeks from today's date

**NEVER use placeholder dates like "2026-05-21" or future dates. Use the real execution date.**

### ⚠️ CRITICAL: FOLLOW EXACT CANONICAL SCHEMA

**MANDATORY:** The JSON output MUST follow exactly the **CANONICAL SCHEMA** defined at the end of this codex:

**REQUIRED STRUCTURE (NO EXCEPTIONS):**
- `schema_version`: `2.6` y `audit_id` únicos; `export_contract`: `single_json`
- `executive_report`, `checks`, `issues`, `fixes`, `roadmap_tasks`, `validation_plan`, `data_quality`, `source_provenance` (ver extensión v2.6)
- `layers[]` — ARRAY with objects containing `pass_items`/`fail_items` arrays  
- `priority_fixes[]` — ARRAY with objects containing `category`, `items[]`
- `webmcp_readiness` — Object with `score`, `level`, `checks`
- `local_seo_analysis` — Object with complete local SEO evaluation
- `competitive_analysis` — Object with competitor assessment  
- `critical_issues_summary` — Object with critical problems overview
- `recommendations_summary` — Object with actionable next steps
- `expected_outcomes` — Object with projected results

**FORBIDDEN PATTERNS:**
❌ `detailed_layer_analysis` (use `layers[]` instead)
❌ `priority_issues_summary` (use `priority_fixes[]` instead)  
❌ `implementation_timeline` (use `implementation_roadmap` instead)
❌ Any underscore_case summary strings (use structured objects)

**NEW SECTIONS ALLOWED:** Additional context like `mexican_market_context`, `ai_visibility_opportunities` can be added BUT NOT replace canonical sections.

### ⚠️ CRITICAL: REQUIRED OUTPUT FIELDS

**MANDATORY:** The JSON output MUST include ALL these fields with EXACT structure. Missing fields break dashboard rendering:

**TOP-LEVEL REQUIRED:**
```json
{
  "overall_scores": {
    "seo_score": 0.0,
    "ai_visibility_score": 0.0, 
    "technical_seo_score": 0.0,
    "content_seo_score": 0.0,
    "user_experience_score": 0.0,
    "local_seo_score": 0.0
  },
  
  "expected_outcomes": {
    "traffic_increase": "15-25% within 3 months",
    "ranking_improvements": "Top 10 positions for 5+ keywords",
    "conversion_impact": "20-30% improvement in qualified leads",
    "timeline_to_results": "2-4 months for significant gains"
  },
  
  "implementation_roadmap": {
    "week_1": ["Specific actionable tasks with effort estimates"],
    "week_2": ["Specific actionable tasks with effort estimates"], 
    "week_3": ["Specific actionable tasks with effort estimates"],
    "week_4": ["Specific actionable tasks with effort estimates"]
  }
}
```

**SUB-OBJECT REQUIRED:**
```json
{
  "local_seo_analysis": {
    "business_info": {
      "business_type": "Industry classification",
      "primary_location": "Full address",
      "service_areas": ["Location 1", "Location 2"]
    },
    "local_optimization_score": 0.0,
    "gmb_status": "verified|unverified|missing",
    "issues_found": ["Issue 1 found during audit", "Issue 2 identified"],
    "strengths": ["Strength 1 identified", "Strength 2 confirmed"]
  },
  
  "critical_issues_summary": {
    "total_critical_issues": 0,
    "total_high_priority_issues": 0,
    "total_warnings": 0,
    "blocking_issues": ["Issue description 1", "Issue description 2"]
  },
  
  "competitive_analysis": {
    "market_position": "Brief position description",
    "competitive_gaps": ["Gap 1", "Gap 2"],
    "competitive_advantages": ["Advantage 1", "Advantage 2"]
  },
  
  "recommendations_summary": {
    "critical_fixes": 0,
    "high_priority_fixes": 0,
    "total_implementation_hours": 0,
    "primary_focus": "Main recommendation",
    "success_probability": "Expected outcome timeline"
  }
}
```

**DASHBOARD BREAKS IF MISSING:** `overall_scores`, `expected_outcomes`, `implementation_roadmap`, `local_seo_analysis.business_info`, `critical_issues_summary`, `competitive_analysis`, `recommendations_summary`

---

### ⚠️ REGLA CRÍTICA — COBERTURA TOTAL DE PÁGINAS

**DEBES auditar TODAS las páginas del sitio. No te detengas en 5, 10 o 20.**

Ejemplo ilustrativo (sitio ficticio Northwind Coffee Roasters, `https://www.example-coffee.com`): el inventario completo incluye más de 40 URLs. Debes cubrir:

**Páginas principales:** `/`, `/shop`, `/subscriptions`, `/wholesale`, `/cafes`, `/about`

**Páginas de comparación (vs-*):** `/vs-example-roastery`, `/vs-sample-beans-club` y todas las demás

**Landing pages por audiencia:** `/coffee-for-offices`, `/wholesale/cafes`, `/what-is-specialty-coffee`

**Blog:** Todas las entradas en `/blog/*` — auditarlas individualmente por Article schema, H1, og:image, canonical

**Páginas de idioma:** `/es/*`, `/fr/*` — verificar hreflang, canonical, duplicación

**Otras:** `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/.well-known/actions.json`

En el `page_summary` del JSON de salida, INCLUIR una entrada por cada URL auditada, no solo index.html.

Indicar explícitamente al inicio del reporte: "Páginas auditadas: N/M (N encontradas, M auditadas)" — si el número es inferior a 40, justificar por qué.

---

## 🔍 URL DISCOVERY ENGINE v2.2 — MÉTODOS OBLIGATORIOS

### ⚠️ PROBLEMA CRÍTICO: Sitios sin sitemap.xml

**Muchos sitios (especialmente SMBs) NO tienen sitemap.xml pero SÍ tienen enlaces importantes en:**
- Menú principal header
- Footer navigation  
- Sidebar menus
- Breadcrumbs
- Context links dentro del content
- JavaScript navigation (SPAs)

**SOLUCIÓN v2.2:** Usar 6 métodos de descubrimiento ANTES de auditar.

---

### MÉTODO 1 — HTML Navigation Parsing (CRÍTICO)

**Extraer TODOS los enlaces internos del homepage:**

```bash
# Extraer todos los enlaces internos del homepage
curl -s "[SITE_URL]" | grep -oP 'href="[^"]*"' | grep -v 'http' | grep -v 'mailto:' | grep -v 'tel:' | sort -u

# Versión más robusta con filtros
curl -s "[SITE_URL]" | \
grep -oE 'href="[^"]*"' | \
sed 's/href="//g; s/"//g' | \
grep -E '^(/|[^:]+)' | \
grep -v '^#' | \
sort -u
```

**Áreas específicas a extraer:**
- `<nav>` principal — menú header
- `<footer>` — enlaces footer
- `.sidebar` o `aside` — navegación lateral
- Breadcrumb navigation
- Enlaces contextuales en content

---

### MÉTODO 2 — Recursive Link Following (AUTOMÁTICO)

Una vez tengas las URLs del homepage, **visitar cada una y extraer MÁS enlaces:**

```bash
# Por cada URL encontrada, extraer sus enlaces internos
for url in $(cat urls_found.txt); do
  echo "Crawling: $url"
  curl -s "[SITE_URL]$url" | \
  grep -oE 'href="[^"]*"' | \
  sed 's/href="//g; s/"//g' | \
  grep -E '^(/|[^:]+)' | \
  grep -v '^#' | \
  sort -u >> all_urls_raw.txt
done

# Deduplicar y limpiar
sort all_urls_raw.txt | uniq > all_urls_clean.txt
```

**Limite:** Máximo 3 niveles de profundidad para evitar crawling infinito.

---

### MÉTODO 3 — JavaScript Navigation Detection (SPAs)

**Para sitios con routing JavaScript (React, Vue, Angular):**

```bash
# Buscar rutas en JavaScript files
curl -s "[SITE_URL]" | grep -oP 'src="[^"]*\.js"' | while read js_file; do
  echo "Checking JS: $js_file"
  curl -s "$js_file" | grep -oE '["'"'"']/[a-zA-Z0-9/_-]+["'"'"']' | sort -u
done

# Buscar patrones de routing comunes
curl -s "[SITE_URL]" | grep -oE '(Route|path|href).*["'"'"']/[^"'"'"']*["'"'"']'
```

**Patrones de routing a detectar:**
- React Router: `<Route path="/services" />`
- Vue Router: `path: '/about'`
- Angular: `{ path: 'contact', component: ContactComponent }`

---

### MÉTODO 4 — Common URL Pattern Probing (INTELIGENTE)

**Testear URLs comunes que suelen existir:**

```bash
# URLs estándar que probar
common_urls=(
  "/"
  "/about" "/acerca" "/nosotros" "/empresa"
  "/services" "/servicios" "/productos" 
  "/contact" "/contacto" "/contactar"
  "/blog" "/noticias" "/news"
  "/pricing" "/precios" "/tarifas"
  "/portfolio" "/trabajos" "/proyectos"
  "/team" "/equipo" "/staff"
  "/careers" "/trabajo" "/empleo"
  "/support" "/soporte" "/ayuda"
  "/faq" "/preguntas"
  "/terms" "/terminos" "/condiciones"
  "/privacy" "/privacidad"
)

# Verificar cuáles existen (200 vs 404)
for url in "${common_urls[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "[SITE_URL]$url")
  if [ "$status" = "200" ]; then
    echo "FOUND: $url"
  fi
done
```

---

### MÉTODO 5 — Industry-Specific Pattern Probing

**Extensión por tipo de industria:**
- **SaaS:** `/demo`, `/pricing`, `/features`, `/integrations`, `/api`, `/docs`
- **Ecommerce:** `/shop`, `/products`, `/cart`, `/checkout`, `/account`
- **Service Business:** `/services`, `/portfolio`, `/testimonials`, `/case-studies`
- **Blog/Media:** `/category`, `/tag`, `/archive`, `/author`

---

### MÉTODO 6 — Manual Inspection Backup

**Si los métodos automáticos fallan:**

1. **Visitar homepage** — anotar todos los enlaces visibles
2. **Inspeccionar menú mobile** — puede tener enlaces diferentes
3. **Revisar footer completo** — often has comprehensive link list  
4. **Buscar "sitemap" link** — a veces hay sitemap HTML aunque no XML
5. **Verificar breadcrumbs** — revelan estructura de jerarquía

---

### 📋 URL DISCOVERY WORKFLOW v2.2

```bash
# PASO 1: Verificar sitemap.xml
curl -s -o /dev/null -w "%{http_code}" "[SITE_URL]/sitemap.xml"
curl -s -o /dev/null -w "%{http_code}" "[SITE_URL]/sitemap-index.xml"

# PASO 2: Si no hay sitemap, aplicar Discovery Engine
echo "=== MÉTODO 1: Homepage Navigation ==="
curl -s "[SITE_URL]" | grep -oE 'href="[^"]*"' > homepage_links.txt

echo "=== MÉTODO 4: Common URL Patterns ==="
# [aplicar common_urls array]

# PASO 3: Validar URLs encontradas
while read url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "[SITE_URL]$url")
  echo "$status: $url"
done < final_urls.txt | grep "^200" > verified_urls.txt
```

---

### 📊 JSON OUTPUT — URL Discovery Section

```json
{
  "audit_info": {
    "site_url": "[SITE_URL]",
    "audit_date": "YYYY-MM-DD",
    "auditor": "AI SEO Codex — seo_master_audit_codex_v2.6.md",
    "pages_found": 28,
    "pages_audited": 28,
    "audit_completion": "100%",
    "url_discovery_method": "navigation_parsing + pattern_probing",
    "sitemap_available": false,
    "discovery_confidence": "high"
  },
  
  "url_discovery": {
    "method_used": "navigation_parsing|recursive_crawling|pattern_probing|manual",
    "sitemap_available": false,
    "homepage_links_found": 15,
    "recursive_links_found": 8,
    "js_routes_found": 3,
    "common_patterns_found": 5,
    "total_urls_discovered": 31,
    "valid_urls_200": 28,
    "invalid_urls_404": 3,
    "coverage_percentage": 90,
    "discovery_notes": "Main navigation in header yielded most URLs. No sitemap present."
  }
}
```

---

Your audit must follow these layers:

---

### LAYER 1 — METADATA & HEAD TAGS

Check:
• title
• meta description
• meta keywords
• canonical
• meta robots
• viewport
• theme-color
• favicon
• manifest

Evaluate:
• duplication
• length optimization
• intent alignment
• SERP CTR potential

Output:
• PASS / WARNING / FAIL
• suggested optimized version

---

### LAYER 2 — OPEN GRAPH & SHARING

Check presence of:
og:title
og:description
og:url
og:image
og:site_name
og:type
twitter:card
twitter:title
twitter:description
twitter:image

Evaluate:
• preview quality
• image size
• social share optimization

---

### LAYER 3 — STRUCTURED DATA (JSON-LD)

Detect presence of:
Organization
WebSite
BreadcrumbList
Product / Service
FAQPage
Article
VideoObject
SoftwareApplication
LocalBusiness

Validate:
• syntax errors
• missing properties
• schema conflicts

Output:
• schema missing
• schema incomplete
• schema errors

Include example code to fix.

---

### LAYER 4 — CRAWLING & INDEXING

Check:
robots.txt
sitemap.xml
sitemap index
hreflang
canonical conflicts

Evaluate:
• crawl accessibility
• orphan pages
• indexability risks

Detect:
• noindex tags
• redirect chains
• canonical mismatches
• www vs non-www redirect consistency
• HTTP → HTTPS redirect active
• Mixed content (HTTP resources on HTTPS pages)
• Redirect chains (301 → 301 chains)
• Redirect loops

---

### LAYER 5 — AI SEARCH OPTIMIZATION

Check presence of:
llms.txt
robots rules for:
GPTBot
ChatGPT-User
Claude-Web
Google-Extended
Perplexity
CCBot

Check if website exposes:
• semantic structure
• clear entity definitions
• machine readable summaries

Output:
AI Search readiness score.

---

### LAYER 6 — CONTENT STRUCTURE

Analyze:
H1 structure
H2 hierarchy
semantic sections

Detect:
• headings used for styling
• thin content
• missing FAQ blocks
• lack of intent targeting

Evaluate:
• intent coverage
• semantic completeness

---

### LAYER 7 — TECHNICAL RENDERING

Check if HTML initial render includes:
title
description
canonical
schema
H1

Test if page requires full JS hydration.

---

### LAYER 8 — INTERNAL LINKING

Analyze:
internal links
navigation structure
anchor text

Detect:
• orphan pages
• weak contextual linking
• missing authority pages

---

### LAYER 9 — ANALYTICS & DATA

Check:
GA4 presence
custom events
CTA tracking
section tracking

Check presence of:
- Google Tag Manager (GTM-XXXXXXX pattern in HTML or scripts)
- Meta Pixel / Facebook Pixel (fbq, pixel.js patterns)
- LinkedIn Insight Tag
- Other third-party trackers

Flag:
• Any tracker firing before consent
• Duplicate tracking (GTM + direct GA4 simultaneously)

Detect if website can answer:
• which page ranks
• which section retains
• which CTA converts

---

### LAYER 10 — CORE WEB VITALS

Evaluate potential issues affecting:
LCP
CLS
INP

Check:
video backgrounds
image loading
font blocking

---

### CAPA DE CONTROL COMPLEMENTARIO — IMAGE SEO (ID CANÓNICO 20)

Check:
- img tags with missing or empty alt attributes
- Image formats: PNG/JPG vs WebP (prefer WebP for internal images)
- Image lazy loading (loading="lazy" on below-fold images)
- Image file sizes (flag >200KB per image)
- og:image format (PNG/JPG required, SVG not supported by social crawlers)

Evaluate:
• ALT coverage percentage
• WebP adoption rate
• Total image weight impact on LCP

Note: og:image MUST be PNG/JPG — never SVG. Internal decorative images should be WebP.

---

### ⚠️ ENHANCED SSL/HTTPS DETECTION PROTOCOL v2.5

**PROBLEM IDENTIFIED:** Standard `curl -L` commands silently follow redirects, causing false negatives where auditor reports "no SSL" when HTTPS actually exists but requires redirect from HTTP.

**ENHANCED METHODOLOGY:** Use specific curl commands that don't follow redirects and can detect the actual SSL/redirect behavior.

#### STEP 1 — Direct HTTPS Test (No Redirect Following)

```bash
# Test direct HTTPS without following redirects
curl -s -o /dev/null -w "%{http_code}|%{redirect_url}|%{ssl_verify_result}" https://example.com/

# Test HTTP to see if it redirects to HTTPS
curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" http://example.com/
```

#### STEP 2 — Certificate Validation

```bash
# Check SSL certificate validity and details
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates

# Alternative using curl with certificate info
curl -s -o /dev/null -w "SSL_VERIFY:%{ssl_verify_result}|CERT_SERIAL:%{certs}" https://example.com/
```

#### STEP 3 — Mixed Content Detection

```bash
# Extract all HTTP resources on HTTPS pages
curl -s https://example.com/ | grep -oE 'src="http://[^"]*"|href="http://[^"]*"' | sort -u
```

#### STEP 4 — Redirect Chain Analysis

```bash
# Follow redirects step by step to understand the full chain
curl -s -o /dev/null -w "STEP1: %{http_code} -> %{redirect_url}\n" http://example.com/
curl -s -o /dev/null -w "STEP2: %{http_code} -> %{redirect_url}\n" https://example.com/
```

#### EVALUATION CRITERIA

**PASS (Score: 10/10):**
- Direct HTTPS works (200 status)
- Valid SSL certificate
- HTTP→HTTPS redirect active (301/302)
- No mixed content found
- Certificate not expired

**WARNING (Score: 6/10):**
- HTTPS works but HTTP doesn't redirect
- Mixed content detected
- Certificate expires within 30 days
- Redirect chain >1 hop

**FAIL (Score: 0/10):**
- HTTPS returns error (4xx/5xx)
- Invalid/expired SSL certificate
- No HTTPS redirect from HTTP
- Critical mixed content (scripts, stylesheets)

#### JSON OUTPUT STRUCTURE

```json
{
  "https_protocol": {
    "score": 10,
    "status": "PASS",
    "https_direct_status": 200,
    "http_to_https_redirect": true,
    "ssl_certificate_valid": true,
    "certificate_expiry": "2025-12-31",
    "mixed_content_found": false,
    "redirect_chain_length": 1,
    "ssl_verify_result": 0,
    "issues_found": []
  }
}
```

**This enhanced protocol eliminates false negatives and provides accurate SSL/HTTPS assessment even when sites use redirects.**

---

### FINAL OUTPUT — v2.6: UN ÚNICO ARCHIVO OBLIGATORIO

Genera **solo `SEO_MASTER_AUDIT.json`**. No generar `.md`, `.csv`, `.txt` ni reportes complementarios durante la auditoría. El JSON debe contener los datos íntegros que antes ocupaban `SEO_AUDIT_REPORT.md`, `SEO_FIXES_CODE.md`, `SEO_SCORECARD.csv`, `SEO_ROADMAP.md` y `SEO_AI_VISIBILITY_SCORE.json`.

El archivo es para arrastrar a un HTML dinámico: debe permitir visualizar informe ejecutivo, 21 capas, checks, páginas, errores, soluciones con código, próximos pasos, calendario de cuatro semanas y validación. Los formatos PDF/MD/CSV son **exportaciones opcionales del dashboard** posteriores, nunca requisitos de ejecución del auditor.

**Compatibilidad:** mantener todos los nombres Y SUBCAMPOS canónicos v2.5 que el HTML ya consume (`overall_scores`, `score_breakdown`, `layers`, `page_summary`, `priority_fixes`, `implementation_roadmap`, etc.). Añadir campos v2.6, sin borrar ni renombrar los existentes. Evitar duplicación de hechos mediante IDs y referencias; los campos legacy pueden ser vistas resumidas derivadas de los registros v2.6.

---

## ÁREAS ADICIONALES PARA AUDITORÍA COMPLETA

### 1. ENTITY SEO
• entity homepage definida
• knowledge graph hints
• brand entity consistency
• sameAs links
• author entity
• organization entity

### 2. AI SEARCH OPTIMIZATION
• llms.txt
• ai metadata
• entity extraction readiness
• semantic clustering
• content citations readiness

### 3. INFORMATION ARCHITECTURE
• pillar pages
• topic clusters
• semantic categories
• content hubs
• taxonomy structure

### 4. INTERNAL LINK GRAPH
• authority flow
• contextual links
• anchor diversity
• depth of pages

### 5. CONTENT DEPTH
• semantic coverage
• entities covered
• search intent completeness

### 6. SEARCH INTENT COVERAGE
• Clasificar páginas en:
  - informational
  - commercial
  - transactional
  - navigational

### 7. INDEXATION HEALTH
• orphan pages
• duplicate URLs
• canonical conflicts
• pagination
• tag pages

### 8. SERP OPTIMIZATION
• CTR optimization
• featured snippet targeting
• FAQ extraction

### 9. PERFORMANCE SEO
• lazy loading
• font loading
• script blocking

### 10. CONTENT MODULARITY
• section indexing
• answer blocks
• snippet ready paragraphs

---

## EXTERNAL DATA REQUIRED (not checkable via code)

These items appear in the Semrush standard checklist but CANNOT be verified through static code analysis. Mark as "N/A — External Tool Required" in scorecard:

| Check | Tool required |
|---|---|
| Backlinks / Domain Authority | Ahrefs, SEMrush |
| Toxic links | SEMrush Backlink Audit |
| Keywords ranked | Google Search Console, Ahrefs |
| Keyword cannibalization | GSC + Ahrefs |
| Crawl errors (actual) | Google Search Console |
| Pages indexed (actual) | GSC / site: operator |
| Competitor keyword gaps | SEMrush Keyword Gap |

These are P2-P3 priority items — address after technical SEO is solid.

---

## NOTAS Y ROADMAP — v2.6

- Un solo agente puede ejecutar el proceso. La orquestación multiagente es opcional.
- **Una ejecución = un entregable: `SEO_MASTER_AUDIT.json`.**
- No crear `SEO_AUDIT_REPORT.md`, `SEO_FIXES_CODE.md`, `SEO_SCORECARD.csv` ni `SEO_ROADMAP.md` como archivos independientes.
- Todos sus contenidos, incluyendo el texto narrativo y snippets, son propiedades tipadas dentro del JSON.
- El dashboard HTML debe poder crear exportaciones bajo demanda desde el JSON, sin necesitar leer esos archivos antiguos.
- Mantener evidencias de lo observado y distinguirlo de recomendaciones, inferencias y pruebas pendientes.

---

## DESCARGA

Archivo generado: seo_master_audit_codex.txt

Incluye:
- Prompt maestro para Codex
- Checklist completo SEO
- Checklist AI search
- Checklist analytics
- Checklist performance
- Checklist content

---

## Ejemplo de hallazgos reales

- Falta JSON-LD completamente
- Falta sitemap.xml
- Falta llms.txt

Esto reduce visibilidad tanto en Google como en AI Search.

---

## Checklist reutilizable

Este checklist cubre 128 verificaciones técnicas, suficiente para auditorías profesionales.

---

## Framework de Auditoría SEO para AI Search 2026

Analiza:
- Google SEO
- ChatGPT SEO
- Perplexity SEO
- Claude SEO
- Gemini SEO

Y genera un AI Visibility Score.

---

## Para llevarlo a nivel PRO

Puedes crear un sistema:

- agent 1  crawler
- agent 2  metadata analyzer
- agent 3  schema validator
- agent 4  AI search validator
- agent 5  analytics validator
- agent 6  content semantic analyzer
- agent 7  internal linking graph
- agent 8  final report generator

---

## Output esperado — un archivo obligatorio

| Archivo | Descripción |
|---|---|
| `SEO_MASTER_AUDIT.json` | Datos canónicos v2.5 + extensiones v2.6: informe narrativo, checks completos, código propuesto, tareas y evidencias de validación, todo vinculado por IDs. |

**PROHIBIDO:** generar los cinco archivos antiguos. Solo el HTML podrá exportar informes, código, scorecard y roadmap después de cargar el JSON.

---

## ESTRUCTURA JSON PARA REPORTE AUTOMATIZADO — SCHEMA OBLIGATORIO

> ⚠️ REGLA DE GENERACIÓN: El JSON que produces SIEMPRE debe seguir exactamente este schema. No simplifiques ni omitas ningún campo. Los valores deben ser REALES del sitio auditado, nunca de ejemplo.

### REGLAS ESTRICTAS DEL JSON

1. **`summary`** — Siempre al inicio: `total_checks`, `passed`, `warnings`, `failed`, `health_percentage`, `critical_blockers`, `note`.

2. **`visual_config`** — Siempre presente: `brand_color`, `success_threshold` (7.0), `warning_threshold` (4.0), `show_charts`, `chart_type`, `dark_mode`.

3. **`trend_data`** — Siempre presente. Si es primera auditoría, `previous_*` = null. Incluir `next_audit_recommended`.

4. **`score_breakdown`** — Todos los checks con status real (`PASS`/`WARNING`/`FAIL`) + `weight` (peso en score global) + `details_count` (`{pass: N, fail: N}`).

5. **`status_distribution`** — Siempre presente. Cuenta checks del `score_breakdown` y calcula porcentajes para el donut chart.

6. **`quick_wins`** — Array de 5-10 tareas de alto impacto / bajo esfuerzo: `task`, `impact`, `effort`, `category`, `impact_score`.

7. **`priority_fixes`** — Siempre 4 categorías (`Critical`, `High`, `Medium`, `Low`) con `count`, `estimated_time`. Cada ítem: `issue`, `solution`, `effort`, `impact_score`.

8. **`action_items`** — Array de tareas procesables: `id`, `title`, `priority`, `assignee`, `estimated_hours`, `layer_id`.

9. **`layers`** — Cada layer OBLIGATORIAMENTE tiene:
   - `pass_items`: lo que SÍ está bien (array vacío `[]` si nada pasa, nunca omitir)
   - `fail_items`: lo que hay que corregir
   - `related_layers`: IDs de layers que se ven afectados
   - `dependency_note`: explicación de dependencias entre layers
   - NUNCA usar un solo array `details` mezclado

10. **`page_summary`** y **`technical_files`** — Un objeto por URL auditada y los 5 archivos técnicos fijos (robots, sitemap, llms, manifest, favicon).

## EXTENSIÓN OBLIGATORIA v2.6 — CONTRATO DE DATOS ÚNICO

### Principio de integración

Conservar **todos** los campos canónicos v2.5 tal como los consume el HTML. Añadir la siguiente estructura al nivel raíz; nunca sustituir un campo legacy sin migrar explícitamente el parser. **Las 21 capas son obligatorias**: el array `layers` debe contener IDs 1..21 y el ID 21 debe representar WebMCP & AI-Readiness; el documento v2.5 enumeraba 20 en su plantilla y describía la 21 fuera de ella. Cada capa debe tener `pass_items`, `fail_items`, `related_layers`, `dependency_note`, `pages_affected`, `checks_ids` e `issue_ids`.

### Campos nuevos obligatorios

- `schema_version`: string `"2.6"`; `audit_id`: string estable identificando la ejecución; `export_contract`: `"single_json"`.
- `executive_report`: `overview`, `scope`, `strengths[]`, `weaknesses[]`, `key_findings[]`, `limitations[]`, `recommended_focus`, `next_steps[]`; texto claro para clientes, con referencias a IDs cuando corresponda.
- `checks[]`: inventario de verificaciones **sin imponer número fijo**; `{id, layer_id, name, criterion, status, severity, priority, affected_url_ids[], evidence_ids[], issue_ids[], detail, method, verified_at, applicability}`. Estados uniformes `PASS|WARNING|FAIL|NOT_TESTED|N/A`. Una comprobación no ejecutada nunca es PASS o FAIL. `N/A` no participa en denominadores.
- `issues[]`: `{id, title, layer_ids[], check_ids[], affected_url_ids[], severity, priority, status, cause, impact, evidence_ids[], fix_ids[], task_ids[], verification_ids[]}`. Estado de incidencia `DETECTED|PLANNED|IN_PROGRESS|APPLIED|VALIDATED|REJECTED`; no equiparar propuesta a aplicación.
- `evidence[]`: `{id, kind, source_url, observed_at, observation, http_status, sample, confidence, method, limitation}`; preservar registros de error, 429, timeouts y datos ausentes como no verificados.
- `fixes[]`: `{id, issue_ids[], title, rationale, instructions[], code_snippets[], platform_constraints[], prerequisites[], estimated_hours, risk, rollback, validation_ids[], implementation_status}`. Cada `code_snippets[]` con `{language, target_file_or_location, code, placeholders[], ready_to_apply, caution}`; marcar ejemplos como referencias si contienen placeholders o requieren configuración. No inventar credenciales ni propiedades reales.
- `roadmap_tasks[]`: `{id, title, issue_ids[], fix_ids[], week, priority, owner_role, estimated_hours, depends_on_task_ids[], acceptance_criteria[], validation_ids[], status, due_date, completed_at}`; semana 1–4 o `backlog`. Si no hay responsable, `null`; status `PENDING` por defecto, nunca completado sin evidencia.
- `validation_plan[]`: `{id, issue_ids[], task_ids[], test_name, method, tool, expected_result, observed_result, status, executed_at, evidence_ids[]}`; `NOT_TESTED` cuando solo se propone la prueba.
- `pages[]`: inventario normalizado de URLs `{id, url, discovery_sources[], fetch_status, audit_status, content_type, redirect_target, check_ids[], issue_ids[], evidence_ids[]}`. Mantener `pages_audited` y `page_summary` legacy como vistas derivadas, **sin confundir URL descubierta con página verificada**.
- `data_quality`: `{schema_valid, errors[], warnings[], counts, unresolved_discrepancies[], coverage_notes, assumptions[]}`. Reconciliar capa 20/21, conteos de checks, URLs, 404/429/timeouts; si no se logra, declarar la discrepancia sin ocultarla.
- `source_provenance`: `{audit_source, audit_engine_version, generated_at, methods[], external_access[], previous_audit_available}`; `history[]` con auditorías previas **solo si existen**.
- `export_views`: `{report_section_ids[], scorecard_check_ids[], code_fix_ids[], roadmap_task_ids[]}`. Son referencias, no cuatro copias completas de contenido.

### Reglas de calidad y cálculo

1. El esquema debe validarse automáticamente; `schema_version=2.6`; IDs únicos y todas las referencias válidas.
2. `summary.total_checks` debe cuadrar con `checks.length` según definición documentada; `PASS+WARNING+FAIL+NOT_TESTED+N/A=total_checks`. `status_distribution` puede excluir `NOT_TESTED` y `N/A` de porcentajes medidos, indicando su número aparte.
3. Calcular puntuaciones únicamente con verificaciones aplicables y realmente ejecutadas, con pesos explícitos. Si no hay suficiente evidencia, score `null` y justificación; no rellenar ceros arbitrarios.
4. Las proyecciones (`expected_outcomes`, `estimated_impact`) deben ser `null` o escenarios **claramente etiquetados** cuando no haya baseline; nunca afirmar aumento de tráfico, posiciones o conversión sin datos.
5. Las páginas con 429, timeout o bloqueo no se deben etiquetar como 404 ni como errores SEO confirmados; `audit_status=UNVERIFIED`.
6. No exigir `AggregateRating` sin reseñas auténticas visibles, ni tratar `actions.json`, `llms.txt`, PWA manifest o x-default como condiciones universales de posicionamiento. Usar `N/A` cuando no aplique, y razonar el criterio.
7. No convertir `robots.txt`, `sitemap.xml` o JSON-LD de plataforma en snippets listos para pegar si puede crear duplicados, conflictos o afectar la indexación. Incluir validación, limitaciones y rollback.
8. Mantener el HTML existente operativo con v2.5 mediante compatibilidad aditiva y comprobaciones de regresión; si el HTML está disponible, actualizar parser y vistas. Si no está disponible, documentar los campos adicionales que debe leer, sin afirmar que se modificó.
9. Verificar que el JSON por sí solo puede reconstruir el contenido informativo de los cinco entregables previos, sin producirlos en disco. Al terminar, informar solo ruta del JSON, conteos y validación.

### Ejemplo de relación entre elementos (ilustrativo, NO datos de auditoría)

```json
{
  "schema_version": "2.6",
  "export_contract": "single_json",
  "issues": [{"id":"ISS-001","title":"Canonical incorrecta","check_ids":["CHK-004"],"fix_ids":["FIX-001"],"task_ids":["TASK-001"],"verification_ids":["VAL-001"]}],
  "fixes": [{"id":"FIX-001","issue_ids":["ISS-001"],"title":"Corregir canonical","code_snippets":[{"language":"html","target_file_or_location":"head","code":"<link rel=\"canonical\" href=\"https://example.com/\">","placeholders":["example.com"],"ready_to_apply":false,"caution":"Verificar URL canónica"}]}],
  "roadmap_tasks": [{"id":"TASK-001","issue_ids":["ISS-001"],"fix_ids":["FIX-001"],"week":1,"status":"PENDING"}]
}
```

El ejemplo es **parcial y solo ilustra relaciones**; el JSON real debe incluir todos los campos canónicos y nuevos descritos.

---

### SCHEMA CANÓNICO v2.5 RETENIDO POR COMPATIBILIDAD (añadir todos los campos v2.6)

```json
{
  "site": "URL_DEL_SITIO",
  "brand": "NOMBRE_DE_MARCA",
  "audit_date": "YYYY-MM-DD",
  "auditor": "AI SEO Codex — seo_master_audit_codex_v2.6.md",
  "pages_audited": ["URL1", "URL2"],
  
  "audit_info": {
    "site_url": "URL_DEL_SITIO",
    "audit_date": "YYYY-MM-DD",
    "auditor": "AI SEO Codex — seo_master_audit_codex_v2.6.md",
    "pages_found": 28,
    "pages_audited": 28,
    "audit_completion": "100%",
    "url_discovery_method": "navigation_parsing + pattern_probing",
    "sitemap_available": false,
    "discovery_confidence": "high|medium|low",
    "audit_duration_minutes": 45,
    "scope": "full|partial",
    "methodology_version": "v2.2"
  },
  
  "url_discovery": {
    "method_used": "navigation_parsing|recursive_crawling|pattern_probing|manual",
    "sitemap_available": false,
    "homepage_links_found": 15,
    "recursive_links_found": 8,
    "js_routes_found": 3,
    "common_patterns_found": 5,
    "total_urls_discovered": 31,
    "valid_urls_200": 28,
    "invalid_urls_404": 3,
    "coverage_percentage": 90,
    "discovery_notes": "Main navigation in header yielded most URLs. No sitemap present.",
    "missed_pages_likely": [
      "Potential blog posts not linked from main nav",
      "Archive pages beyond current year",
      "User dashboard pages (login required)"
    ]
  },

  "summary": {
    "total_checks": 0,
    "passed": 0,
    "warnings": 0,
    "failed": 0,
    "health_percentage": 0,
    "critical_blockers": 0,
    "note": "Resumen ejecutivo del estado del sitio."
  },

  "overall_scores": {
    "seo_score": 0.0,
    "ai_visibility_score": 0.0,
    "technical_seo_score": 0.0,
    "content_seo_score": 0.0,
    "user_experience_score": 0.0,
    "local_seo_score": 0.0
  },

  "visual_config": {
    "brand_color": "#3b82f6",
    "success_threshold": 7.0,
    "warning_threshold": 4.0,
    "show_charts": true,
    "chart_type": "donut",
    "dark_mode": false
  },

  "trend_data": {
    "previous_audit_date": null,
    "previous_seo_score": null,
    "previous_ai_score": null,
    "improvement": "Primera auditoría — sin datos históricos",
    "next_audit_recommended": "YYYY-MM-DD",
    "methodology_note": "ai_visibility_score is a defined weighted composite of applicable audited layers, NOT only the AI Search layer score. The AI Search layer score appears separately in score_breakdown.ai_search.score. This prevents conflating 'AI bots allowed' with overall AI discoverability."
  },

  "score_breakdown": {
    "_note": "OBLIGATORIO: los 4 campos agrupados (on_page_seo, technical_seo, content_seo, local_seo) deben estar siempre presentes — son los que lee el dashboard. Los campos granulares debajo son el detalle.",
    "on_page_seo":   { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "components": ["metadata_head", "open_graph_sharing", "structured_data", "h1_presence", "content_structure", "navigation_consistency"] },
    "technical_seo": { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "components": ["crawling_indexing", "technical_rendering", "core_web_vitals", "hreflang", "mobile_responsive"] },
    "content_seo":   { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "components": ["content_structure", "internal_linking", "analytics_data", "image_seo"] },
    "local_seo":     { "score": null, "max": 10, "status": "N/A|FAIL|WARNING|PASS", "note": "null si es SaaS global sin presencia física; rellenar si el sitio tiene ubicaciones locales" },
    "metadata_head":          { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.5, "details_count": { "pass": 0, "fail": 0 } },
    "open_graph_sharing":     { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.2, "details_count": { "pass": 0, "fail": 0 } },
    "structured_data":        { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.8, "details_count": { "pass": 0, "fail": 0 } },
    "crawling_indexing":      { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 2.0, "details_count": { "pass": 0, "fail": 0 } },
    "ai_search":              { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.5, "details_count": { "pass": 0, "fail": 0 } },
    "content_structure":      { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.2, "details_count": { "pass": 0, "fail": 0 } },
    "technical_rendering":    { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.3, "details_count": { "pass": 0, "fail": 0 } },
    "internal_linking":       { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.0, "details_count": { "pass": 0, "fail": 0 } },
    "analytics_data":         { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.5, "details_count": { "pass": 0, "fail": 0 } },
    "core_web_vitals":        { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.0, "details_count": { "pass": 0, "fail": 0 } },
    "https_protocol":         { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 2.0, "details_count": { "pass": 0, "fail": 0 } },
    "charset_utf8":           { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 0.5, "details_count": { "pass": 0, "fail": 0 } },
    "viewport_tag":           { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 0.8, "details_count": { "pass": 0, "fail": 0 } },
    "google_fonts_preconnect":{ "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 0.5, "details_count": { "pass": 0, "fail": 0 } },
    "hreflang":               { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 0.5, "details_count": { "pass": 0, "fail": 0 } },
    "h1_presence":            { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 1.0, "details_count": { "pass": 0, "fail": 0 } },
    "navigation_consistency": { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 0.8, "details_count": { "pass": 0, "fail": 0 } },
    "mobile_responsive":      { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 0.8, "details_count": { "pass": 0, "fail": 0 } },
    "image_seo":              { "score": 0.0, "max": 10, "status": "FAIL|WARNING|PASS", "weight": 0.8, "details_count": { "pass": 0, "fail": 0 } }
  },

  "status_distribution": {
    "PASS": 0, "WARNING": 0, "FAIL": 0,
    "total_checks": 0, "pass_pct": 0, "warning_pct": 0, "fail_pct": 0
  },

  "quick_wins": [
    { "task": "", "impact": "Critical|High|Medium", "effort": "X min", "category": "Layer name", "impact_score": 0 }
  ],

  "priority_fixes": [
    {
      "category": "Critical", "count": 0, "estimated_time": "",
      "items": [{ "issue": "", "solution": "", "effort": "", "impact_score": 0 }]
    },
    { "category": "High",   "count": 0, "estimated_time": "", "items": [] },
    { "category": "Medium", "count": 0, "estimated_time": "", "items": [] },
    { "category": "Low",    "count": 0, "estimated_time": "", "items": [] }
  ],

  "estimated_impact": {
    "traffic_increase": "", "ai_search_visibility": "",
    "indexing_speed": "", "rich_snippets": "", "social_ctr_increase": ""
  },

  "implementation_roadmap": { "week_1": [], "week_2": [], "week_3": [], "week_4": [] },

  "action_items": [
    { "id": 1, "title": "", "priority": "Critical|High|Medium|Low", "assignee": "Developer|Designer|Copywriter|Legal", "estimated_hours": 0.0, "layer_id": 0 }
  ],

  "layers": [
    {
      "id": 1, "name": "Metadata & Head Tags", "status": "FAIL|WARNING|PASS", "score": 0.0,
      "related_layers": [], "dependency_note": "Describe cómo este layer afecta o depende de otros.",
      "pass_items": [], "fail_items": [], "pages_affected": []
    },
    { "id": 2,  "name": "Open Graph & Sharing",      "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 3,  "name": "Structured Data (JSON-LD)",  "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 4,  "name": "Crawling & Indexing",        "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 5,  "name": "AI Search Optimization",     "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 6,  "name": "Content Structure",          "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 7,  "name": "Technical Rendering",        "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 8,  "name": "Internal Linking",           "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 9,  "name": "Analytics & Data",           "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 10, "name": "Core Web Vitals",            "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 11, "name": "Entity SEO",                 "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 12, "name": "Information Architecture",   "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 13, "name": "Internal Link Graph",        "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 14, "name": "Content Depth",              "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 15, "name": "Search Intent Coverage",     "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 16, "name": "Indexation Health",          "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 17, "name": "SERP Optimization",          "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 18, "name": "Performance SEO",            "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 19, "name": "Content Modularity",         "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [], "dependency_note": "", "pass_items": [], "fail_items": [], "pages_affected": [] },
    { "id": 20, "name": "Image SEO", "status": "FAIL|WARNING|PASS", "score": 0.0, "related_layers": [7, 10], "dependency_note": "Image optimization directly affects LCP (Layer 10) and rendering performance (Layer 7). Missing ALT affects accessibility and Google Image Search.", "pass_items": [], "fail_items": [], "pages_affected": [] }
  ],

  "page_summary": {
    "index.html": {
      "title": "", "title_length": 0, "description": "", "description_length": 0,
      "canonical": false, "og_tags": false, "json_ld": false,
      "h1": false, "h1_text": "", "robots_meta": false, "ga4": false,
      "status": "FAIL|WARNING|PASS"
    }
  },

  "technical_files": {
    "robots_txt":    { "exists": false, "status": "PASS|WARNING|CRITICAL_ERROR|404_NOT_FOUND", "issue": "", "ai_bots_rules": false },
    "sitemap_xml":   { "exists": false, "status": "PASS|404_NOT_FOUND", "issue": "" },
    "llms_txt":      { "exists": false, "status": "PASS|404_NOT_FOUND", "issue": "" },
    "manifest_json": { "exists": false, "status": "PASS|NOT_FOUND" },
    "favicon":       { "declared_in_html": false, "status": "PASS|WARNING" }
  }
}
```

> El JSON maestro v2.6 es el único entregable del auditor y alimenta un dashboard HTML. Debe reflejar hallazgos REALES del sitio auditado — nunca dejar valores de ejemplo o ceros sin justificación.

---

---

## LAYER 21 — WEBMCP & AI-READINESS *(sección estándar — incluir en TODAS las auditorías)*

> **Qué es esto:** WebMCP y la preparación para agentes web agrupan señales experimentales y capacidades de interacción que deben evaluarse por separado del SEO convencional. La ausencia de un endpoint no demuestra invisibilidad en buscadores o asistentes. Esta sección audita los 5 gaps críticos de WebMCP + AI-Readiness en cada auditoría.

---

### CHECK 21.1 — Endpoint `/.well-known/actions.json` (Transactional Clarity)

**Qué auditar:**
- `GET /.well-known/actions.json` → responde 200 con JSON válido
- JSON contiene al menos: `name`, `description`, `actions[]` con `type`, `url`, `method`, `parameters`
- Acciones mínimas esperadas para un SaaS: `signup`, `request_demo`, `pricing`
- `Content-Type: application/json` en headers de respuesta

**Cómo verificar:**
```bash
curl -s -o /dev/null -w "%{http_code}" https://www.example-coffee.com/.well-known/actions.json
curl -s https://www.example-coffee.com/.well-known/actions.json | python3 -m json.tool
```

**Criterios:**
- PASS: 200 + JSON válido + mínimo 3 acciones documentadas
- WARNING: 200 pero JSON incompleto o sin acciones de conversión
- N/A: endpoint no implementado o no pertinente; FAIL solo si se declara implementado y falla una funcionalidad prometida

---

### CHECK 21.2 — AI Entity Credibility (Confianza para agentes)

**Qué auditar:**
- `<link rel="me">` o `sameAs` en JSON-LD `Organization` apunta a perfiles verificados (LinkedIn, Twitter/X, Crunchbase, G2, Capterra)
- `llms.txt` existe en `/.well-known/llms.txt` o `/llms.txt` — describe el producto en lenguaje optimizado para LLMs
- `Organization` JSON-LD incluye: `foundingDate`, `numberOfEmployees`, `areaServed`, `knowsAbout`
- Reviews o testimonios marcados con schema `Review` o `AggregateRating`

**Cómo verificar:**
```bash
# llms.txt
curl -s -o /dev/null -w "%{http_code}" https://www.example-coffee.com/llms.txt
# sameAs en JSON-LD homepage
curl -s https://www.example-coffee.com | grep -o '"sameAs":\[[^]]*\]'
```

**Criterios:**
- PASS: identidad consistente y datos verificables pertinentes al tipo de sitio (no exigir reseñas inexistentes ni llms.txt como estándar de ranking)
- WARNING: solo 1-2 de los 3 elementos
- FAIL: ninguno de los 3 presente

---

### CHECK 21.3 — Hreflang Integrity (Sin falsos positivos para agentes multilingüe)

**Qué auditar:**
- Todas las páginas con hreflang tienen el `x-default` declarado
- No hay hreflang apuntando a URLs que devuelvan 404 o redirect
- Mapa de consistencia: si `/es/pricing` declara hreflang `en` → `/pricing`, verificar que `/pricing` también declara hreflang `es` → `/es/pricing` (bidireccional)
- `ja` hreflang solo declarado si la página JA tiene contenido real (no placeholder)

**Cómo verificar:**
```bash
# Extraer todos los hreflang del sitemap o páginas
curl -s https://www.example-coffee.com/sitemap.xml | grep -o 'hreflang="[^"]*"'
# Verificar URLs hreflang devuelven 200
# (para cada href en hreflang, curl -o /dev/null -w "%{http_code}")
```

**Criterios:**
- PASS: 100% bidireccional + x-default en todas + 0 links rotos
- WARNING: x-default ausente en algunas páginas o <5% links rotos
- FAIL: >5% links rotos o idiomas con hreflang declarado pero sin contenido real

---

### CHECK 21.4 — Schemas faltantes críticos para AI Search

**Qué auditar:**
- `AggregateRating` en homepage o página de reviews (necesario para rich snippet en AI Overview)
- `BreadcrumbList` en páginas de profundidad ≥2 (blog posts, vs-*, landing pages secundarias)
- `FAQPage` en páginas con preguntas frecuentes
- `SoftwareApplication` o `Product` en página de pricing
- `Review` individual con `author`, `reviewRating`, `reviewBody` en páginas de testimonios

**Cómo verificar:**
```bash
# Verificar JSON-LD en homepage
curl -s https://www.example-coffee.com | python3 -c "
import sys, json, re
html = sys.stdin.read()
scripts = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
for s in scripts:
    obj = json.loads(s)
    print(obj.get('@type'))
"
```

**Criterios:**
- PASS: AggregateRating + BreadcrumbList en ≥80% de páginas elegibles + FAQPage donde aplica
- WARNING: AggregateRating ausente o BreadcrumbList en <50% de páginas elegibles
- FAIL: 0 schemas de conversión/confianza en todo el sitio

---

### CHECK 21.5 — PWA Manifest & Offline Readiness

**Qué auditar:**
- `manifest.json` o `manifest.webmanifest` existe y es válido
- Incluye: `name`, `short_name`, `icons` (mínimo 192×192 y 512×512), `theme_color`, `background_color`, `display`, `start_url`
- `<link rel="manifest">` declarado en `<head>` de todas las páginas principales
- Service Worker registrado (verifica en Sources > Service Workers en DevTools o `navigator.serviceWorker`)

**Cómo verificar:**
```bash
curl -s -o /dev/null -w "%{http_code}" https://www.example-coffee.com/manifest.json
curl -s https://www.example-coffee.com/manifest.json | python3 -m json.tool | grep -E '"name"|"icons"|"display"'
curl -s https://www.example-coffee.com | grep 'rel="manifest"'
```

**Criterios:**
- PASS: manifest válido + icons 192+512 + SW registrado
- WARNING: manifest existe pero incompleto (faltan icons o SW)
- N/A: sitio que no ofrece experiencia PWA; FAIL solo si la experiencia PWA se anuncia o requiere y no funciona

---

### CHECK 21.6 — CTA Transactional Clarity (sin CTAs muertas)

**Qué auditar:**
Revisar todos los CTAs primarios del landing (hero, pricing, demo, comparación, footer, nav móvil) y detectar destinos no funcionales:
- `href="#"` o `href=""` sin handler JS real
- `onClick` que ejecuta `alert()` o console.log
- Botones sin `href` ni `onClick` definido
- Links que apuntan a rutas inexistentes (`/signup`, `/demo-request`, `/contact` → verificar que devuelven 200)

**CTAs críticos a verificar (ejemplo: www.example-coffee.com):**
| CTA | Destino esperado | Verificación |
|---|---|---|
| "Shop now" / "Start subscription" | `https://www.example-coffee.com/checkout?plan=subscription` o ruta real | curl -o /dev/null -w "%{http_code}" |
| "Wholesale enquiry" | `/wholesale` o destino real de contacto | idem |
| "View Pricing" | `/#pricing` o `/pricing` | idem |
| Comparación /vs-* | Página existente, no 404 | idem |
| Footer CTA | Mismo target que hero | idem |

**Cómo verificar en código:**
```bash
# Buscar CTAs muertos en el repo de landing
grep -r 'href="#"' src/ --include="*.tsx" --include="*.jsx" --include="*.html"
grep -r "alert(" src/ --include="*.tsx" --include="*.jsx"
grep -rn 'onClick.*=.*{[[:space:]]*}' src/ --include="*.tsx"
```

**Criterios:**
- PASS: 0 CTAs primarios con destino muerto + todas las URLs devuelven 200
- WARNING: CTAs secundarios con href="#" o 1-2 rutas que redirigen en lugar de 200 directo
- FAIL: ≥1 CTA primario (hero, pricing, demo) sin destino funcional

---

### CHECK 21.7 — Manual AI Visibility Queries

> Estas verificaciones NO se pueden automatizar desde código. Deben ejecutarse manualmente en ChatGPT, Perplexity y Google AI Overview.

**Queries a validar (copiar y ejecutar en cada plataforma):**

| Query | Plataforma | Resultado esperado |
|---|---|---|
| "best specialty coffee subscription" | ChatGPT / Perplexity / Gemini | Northwind mencionado o alternativa comparable |
| "alternative to Example Roastery for espresso beans" | ChatGPT / Perplexity | Northwind en lista de alternativas |
| "how to brew pour-over coffee" | Google AI Overview | Guía de Northwind aparece con snippet |
| "best coffee roaster for offices" | Perplexity | Northwind en top 3-5 |
| "Northwind Coffee Roasters review" | ChatGPT | descripción correcta del negocio |

**Qué buscar en cada respuesta AI:**
- ¿Menciona la marca auditada? (sí/no)
- ¿La descripción es correcta? (nombre, categoría, propuesta de valor)
- ¿Cita fuentes? ¿Cuáles? (indica qué contenido está siendo indexado por los LLMs)
- ¿Aparece en lista de alternativas vs competidores directos (p. ej. Example Roastery / Sample Beans Club)?

**Output esperado en el reporte:**
```
### AI Visibility Manual Check (fecha: YYYY-MM-DD)
| Query | ChatGPT | Perplexity | Google AI |
|---|---|---|---|
| best specialty coffee subscription | ❌ no aparece | ✅ #3 | ⚠️ mencionado sin link |
...
AI Visibility Score: X/5 queries con mención positiva
```

**Criterios:**
- PASS: la marca auditada es mencionada positivamente en ≥3/5 queries en al menos 2 plataformas
- WARNING: mencionado en 1-2 queries o solo en 1 plataforma
- FAIL: no aparece en ninguna query o descripción incorrecta

---

### OUTPUT LAYER 21 — Formato de reporte WebMCP

Al final del reporte de auditoría, incluir siempre esta sección con resultado real:

```
## WebMCP & AI-Readiness — Resultados

| Check | Estado | Detalle |
|---|---|---|
| 21.1 actions.json | PASS/WARNING/FAIL | [descripción concreta] |
| 21.2 AI Entity Credibility | PASS/WARNING/FAIL | [descripción concreta] |
| 21.3 Hreflang Integrity | PASS/WARNING/FAIL | [descripción concreta] |
| 21.4 Schemas críticos | PASS/WARNING/FAIL | [descripción concreta] |
| 21.5 PWA Manifest | PASS/WARNING/FAIL | [descripción concreta] |
| 21.6 CTA Transactional Clarity | PASS/WARNING/FAIL | [N CTAs muertos encontrados] |
| 21.7 AI Visibility (manual) | PASS/WARNING/FAIL | [fecha + N/5 queries con mención] |

**WebMCP Score: X/Y checks aplicables con PASS (indicar N/A y no verificados)**
**AI-Readiness Level:** Low (0-2) / Medium (3-5) / High (6-7)

### Gaps prioritarios WebMCP (ordenar por impacto en AI Search):
1. [gap 1] — [acción específica de fix]
2. [gap 2] — [acción específica de fix]
...
```

---

### EXTENSIÓN JSON — Campos WebMCP para el dashboard

Añadir al JSON de salida de auditoría los siguientes campos de nivel raíz:

```json
"webmcp_readiness": {
  "score": 0,
  "max_score": 7,
  "level": "Low|Medium|High",
  "checks": {
    "actions_json": {
      "status": "PASS|WARNING|FAIL",
      "url_status": 0,
      "actions_count": 0,
      "issue": ""
    },
    "ai_entity_credibility": {
      "status": "PASS|WARNING|FAIL",
      "llms_txt": false,
      "same_as_count": 0,
      "aggregate_rating": false,
      "issue": ""
    },
    "hreflang_integrity": {
      "status": "PASS|WARNING|FAIL",
      "bidirectional_ok": false,
      "x_default_present": false,
      "broken_hreflang_count": 0,
      "issue": ""
    },
    "missing_schemas": {
      "status": "PASS|WARNING|FAIL",
      "aggregate_rating_present": false,
      "breadcrumb_coverage_pct": 0,
      "faq_page_present": false,
      "software_application_present": false,
      "issue": ""
    },
    "pwa_manifest": {
      "status": "PASS|WARNING|FAIL",
      "manifest_exists": false,
      "icons_192": false,
      "icons_512": false,
      "service_worker": false,
      "issue": ""
    },
    "cta_clarity": {
      "status": "PASS|WARNING|FAIL",
      "dead_ctas_found": 0,
      "issue": ""
    },
    "ai_visibility_manual": {
      "status": "PASS|WARNING|FAIL|N/A",
      "last_run": null,
      "queries_passing": 0,
      "issue": "Manual check required"
    }
  },
  "priority_fixes": [
    { "check_id": "21.1", "fix": "", "effort": "X min", "ai_search_impact": "Critical|High|Medium" }
  ]
},
"ai_agent_readiness": {
  "discoverable_by_ai_agents": false,
  "transactional_clarity": false,
  "entity_trust_signals": false,
  "multilingual_ai_safe": false,
  "note": "Evaluación consolidada de si los agentes de IA pueden descubrir, entender y transaccionar con el sitio correctamente."
}
```

---

---

## PROMPT PARA FIGMA — Sección WebMCP & AI-Readiness

> Usar en Figma Make / Figma AI / v0 para diseñar la tarjeta de dashboard de auditoría

```
Design a "WebMCP & AI-Readiness" audit results card for a technical SEO dashboard.

Visual style: dark background (#0F172A), neon accent colors (green #22C55E for PASS, amber #F59E0B for WARNING, red #EF4444 for FAIL), Inter font, clean data-viz aesthetic.

Card layout (850×640px):

HEADER row:
- Icon: robot/AI icon (24px)
- Title: "WebMCP & AI-Readiness" (18px semibold, white)
- Badge: "Layer 21" (tag style, slate-600 bg)
- Right: large score "X / 7" with ring progress indicator (0-7 scale)
- Below score: AI-Readiness Level pill — "Low 0-2" (red) / "Medium 3-5" (amber) / "High 6-7" (green)

BODY: 7-row checklist table, each row:
- Narrow left column: check number "21.1" through "21.7" (slate-400, 12px mono)
- Status icon: filled circle — green checkmark / amber warning / red X
- Check name (14px white):
  21.1 → "actions.json"
  21.2 → "AI Entity Credibility"
  21.3 → "Hreflang Integrity"
  21.4 → "Critical Schemas"
  21.5 → "PWA Manifest"
  21.6 → "CTA Clarity" (dead CTAs audit)
  21.7 → "AI Visibility" (manual — show calendar icon to indicate requires human check)
- Right: detail text (12px slate-300, max 60 chars, truncate)
- Row height: 44px, subtle separator between rows
- Row 21.7 has a subtle "manual check" badge (slate-500, 10px) to distinguish it from automated checks

FOOTER row:
- Left: "Priority fixes" label (12px slate-400)
- Up to 3 pill tags with impact color border (e.g., "Add actions.json", "Fix dead CTAs", "Add AggregateRating")
- Right: small CTA "View fixes →" (slate-300, 12px)

SECOND FOOTER row (below priority fixes):
- Label: "Last AI visibility check:" (slate-500, 11px)
- Date value: "YYYY-MM-DD" or "Not run yet" (slate-300, 11px mono)
- This row only visible when 21.7 status is present

States to design:
1. All PASS (score 7/7, High level — all green, 21.7 shows last check date)
2. Mixed (score 3/7, Medium level — mix of colors, 21.7 shows WARNING with "Not run yet")
3. All FAIL (score 0/7, Low level — all red, urgent priority fixes visible)

Deliver as: Figma component with variants for each state (Property: "State" = Pass / Mixed / Fail), auto-layout, responsive to 320px mobile width.
```

---

## FIN DEL ARCHIVO v2.5

**Versión del prompt:** 2.6.1; **schema_version del JSON:** 2.6  
**Contenido completo:** ✅ 21 layers + URL Discovery Engine + JSON unificado  
**Mejoras v2.2:** Descubrimiento automático de URLs para sitios sin sitemap  
**Tamaño completo:** ~38 KB (contenido original completo restaurado)  
**Compatibilidad:** Dashboard HTML + auditorías profesionales  

**PROMPT DE ACTIVACIÓN v2.6.1:**

```
You are a Senior Technical SEO Auditor using seo_master_audit_codex_v2.6.1.md.

CRITICAL REQUIREMENTS:

A. **USE CURRENT REAL DATE:** All date fields must use TODAY'S ACTUAL DATE, not placeholder dates.

B. **URL Discovery:** This site may not have sitemap.xml. Use the URL Discovery Engine v2.5:

1. **Check for sitemap.xml first**
2. **If no sitemap:** Apply Discovery Methods 1-6
3. **Document discovery process** in audit_info
4. **Report URL coverage confidence**  
5. **Flag potentially missing pages**

⚠️ **CRITICAL SCHEMA ENFORCEMENT:** The JSON output MUST follow exactly the CANONICAL SCHEMA defined at the end of this codex. In particular: use `layers[]` (array, NOT `detailed_layer_analysis` object), `priority_fixes[]` (array with items as objects), `webmcp_readiness`, `competitive_analysis`, `local_seo_analysis`, `recommendations_summary`, `critical_issues_summary`. New sections like `mexican_market_context`, `ai_visibility_opportunities` and `success_projections` can be added ADDITIONALLY but NOT replace canonical sections.

Audit [SITE_URL] with complete URL discovery + SEO analysis.

Generate exactly ONE output file, SEO_MASTER_AUDIT.json, using the v2.6 unified schema with mandatory v2.6.1 backward-compatible fields. Include:
- URL discovery section in report
- Discovery confidence metrics in JSON
- Recommendations for missing pages
- Complete 21-layer analysis
- WebMCP readiness assessment

Site URL: [SITE_URL]
Output directory: [DIRECTORY_PATH]

Begin v2.6 comprehensive audit with enhanced SSL detection, full field coverage and single-JSON output. Do not generate separate Markdown or CSV files.
```

