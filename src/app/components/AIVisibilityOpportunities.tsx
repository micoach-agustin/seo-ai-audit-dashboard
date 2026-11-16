import { Zap, Clock, TrendingUp } from "lucide-react";

interface AIVisibilityOpportunitiesProps {
  data: {
    immediate_impact?: Record<string, string>;
    medium_term_benefits?: Record<string, string>;
    long_term_positioning?: Record<string, string>;
  };
}

export function AIVisibilityOpportunities({ data }: AIVisibilityOpportunitiesProps) {
  if (!data) return null;

  const sections = [
    {
      key: "immediate_impact",
      label: "Impacto Inmediato",
      icon: Zap,
      bg: "from-orange-500 to-red-500",
      cardBg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      dot: "bg-orange-500",
    },
    {
      key: "medium_term_benefits",
      label: "Beneficios a Mediano Plazo",
      icon: Clock,
      bg: "from-blue-500 to-indigo-500",
      cardBg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    {
      key: "long_term_positioning",
      label: "Posicionamiento a Largo Plazo",
      icon: TrendingUp,
      bg: "from-purple-500 to-violet-500",
      cardBg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      dot: "bg-purple-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden mt-6">
      <div className="px-6 py-5 bg-gradient-to-r from-violet-600 to-indigo-600">
        <h3 className="text-xl font-bold text-white">Oportunidades de Visibilidad AI</h3>
        <p className="text-sm text-violet-100 mt-1">
          Estrategia de optimización para motores de búsqueda con IA
        </p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map(({ key, label, icon: Icon, bg, cardBg, border, text, dot }) => {
          const entries = data[key as keyof typeof data];
          if (!entries || Object.keys(entries).length === 0) return null;
          return (
            <div key={key} className="flex flex-col gap-3">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${bg} shadow-md`}>
                <Icon className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-sm font-bold text-white">{label}</span>
              </div>
              <div className={`${cardBg} ${border} border rounded-xl p-4 flex-1`}>
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
