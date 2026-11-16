import { MapPin, Briefcase } from "lucide-react";

interface MarketContextProps {
  data: {
    local_seo_assessment?: Record<string, string>;
    industry_positioning?: Record<string, string>;
  };
}

export function MarketContext({ data }: MarketContextProps) {
  if (!data) return null;

  const sections = [
    {
      key: "local_seo_assessment",
      label: "Evaluación SEO Local",
      icon: MapPin,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      header: "from-emerald-500 to-teal-500",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    {
      key: "industry_positioning",
      label: "Posicionamiento en el Sector",
      icon: Briefcase,
      bg: "bg-blue-50",
      border: "border-blue-200",
      header: "from-blue-500 to-indigo-500",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden mt-6">
      <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600">
        <h3 className="text-xl font-bold text-white">Contexto de Mercado</h3>
        <p className="text-sm text-emerald-100 mt-1">
          Análisis del mercado local y posicionamiento sectorial
        </p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(({ key, label, icon: Icon, bg, border, header, text, dot }) => {
          const entries = data[key as keyof typeof data];
          if (!entries || Object.keys(entries).length === 0) return null;
          return (
            <div key={key} className="flex flex-col gap-3">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${header} shadow-md`}>
                <Icon className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-sm font-bold text-white">{label}</span>
              </div>
              <div className={`${bg} ${border} border rounded-xl p-4`}>
                <ul className="space-y-3">
                  {Object.entries(entries).map(([k, v]) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className={`mt-1.5 block w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                      <div>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${text}`}>
                          {k.replace(/_/g, " ")}
                        </span>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {String(v).replace(/_/g, " ")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
