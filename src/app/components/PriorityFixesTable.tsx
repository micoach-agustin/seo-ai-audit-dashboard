import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

interface PriorityFix {
  category: string;
  items: (string | {
    issue: string;
    solution?: string;
    effort?: string;
    impact_score?: number;
  })[];
}

interface PriorityFixesTableProps {
  fixes?: PriorityFix[];
}

export function PriorityFixesTable({ fixes }: PriorityFixesTableProps) {
  // Si no hay fixes o no es un array válido, no renderizar nada
  if (!fixes || !Array.isArray(fixes) || fixes.length === 0) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
        };
      case "High":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
        };
      case "Medium":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          icon: <Info className="w-5 h-5 text-yellow-600" />,
        };
      case "Low":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: <Info className="w-5 h-5 text-gray-600" />,
        };
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Priority Fixes</h3>
        <p className="text-sm text-gray-600 mt-1">
          Correcciones organizadas por nivel de prioridad
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {(fixes || []).map((fix, fixIndex) => {
          const colors = getCategoryColor(fix.category);
          // Validación defensiva
          const items = fix.items || [];
          
          return (
            <div key={`${fix.category}-${fixIndex}`} className="p-6">
              <div className="flex items-center gap-3 mb-3">
                {colors.icon}
                <h4 className={`font-semibold ${colors.text}`}>{fix.category}</h4>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <ul className="space-y-2">
                {items.map((item, index) => {
                  // Soportar tanto strings como objetos
                  const isString = typeof item === 'string';
                  const itemText = isString ? item : item.issue;
                  const itemObj = isString ? null : item;
                  
                  return (
                    <li
                      key={`${fix.category}-${fixIndex}-item-${index}`}
                      className={`flex items-start gap-2 p-3 rounded-lg border ${colors.border} ${colors.bg}`}
                    >
                      <span className={`mt-0.5 block w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text.replace('text-', 'bg-')}`} />
                      <div className="flex-1 text-sm">
                        <p className="text-gray-900 font-medium">{itemText}</p>
                        
                        {itemObj && (
                          <div className="mt-2 space-y-1 text-gray-600">
                            {itemObj.solution && (
                              <div className="flex gap-2">
                                <span className="font-semibold">Solución:</span>
                                <span>{itemObj.solution}</span>
                              </div>
                            )}
                            {itemObj.effort && (
                              <div className="flex gap-2">
                                <span className="font-semibold">Esfuerzo:</span>
                                <span className="px-2 py-0.5 bg-white rounded text-xs">{itemObj.effort}</span>
                              </div>
                            )}
                            {itemObj.impact_score !== undefined && (
                              <div className="flex gap-2">
                                <span className="font-semibold">Impacto:</span>
                                <span className="px-2 py-0.5 bg-white rounded text-xs font-bold">{itemObj.impact_score}/10</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}