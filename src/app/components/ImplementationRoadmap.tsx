import { Calendar, CheckCircle2 } from "lucide-react";

interface ImplementationRoadmapProps {
  roadmap?: {
    [key: string]: string[] | {
      window?: string;
      goal?: string;
      tasks?: string[];
    };
  };
}

export function ImplementationRoadmap({ roadmap }: ImplementationRoadmapProps) {
  // Si no hay roadmap, no renderizar nada
  if (!roadmap) return null;
  
  const weeks = Object.entries(roadmap);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Implementation Roadmap</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Plan de implementación semanal
        </p>
      </div>

      <div className="p-6">
        {weeks.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 md:left-1/2 md:-ml-px" />

            <div className="space-y-8">
              {weeks.map(([week, data], index) => {
                const weekNumber = week.replace("week_", "");
                
                // Normalizar datos: v1 usa objetos con {window, goal, tasks}, otros usan arrays directos
                let taskList: string[] = [];
                let weekGoal: string | undefined;
                let weekWindow: string | undefined;
                
                if (Array.isArray(data)) {
                  taskList = data;
                } else if (data && typeof data === 'object') {
                  taskList = (data as any).tasks || [];
                  weekGoal = (data as any).goal || (data as any).focus;
                  weekWindow = (data as any).window || (data as any).estimated_hours ? `${(data as any).estimated_hours}h estimadas` : undefined;
                }
                
                return (
                  <div key={week} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-8 w-4 h-4 bg-blue-600 rounded-full ring-4 ring-white md:left-1/2 md:-ml-2" />

                    {/* Content */}
                    <div className={`ml-20 md:ml-0 ${index % 2 === 0 ? "md:mr-[calc(50%+2rem)]" : "md:ml-[calc(50%+2rem)]"}`}>
                      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                            Semana {weekNumber}
                          </span>
                        </div>
                        
                        {weekWindow && (
                          <p className="text-xs text-gray-500 mb-2">📅 {weekWindow}</p>
                        )}
                        
                        {weekGoal && (
                          <p className="text-sm font-semibold text-gray-800 mb-3">🎯 {weekGoal}</p>
                        )}
                        
                        <ul className="space-y-2">
                          {taskList.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay tareas en el roadmap de implementación.</p>
        )}
      </div>
    </div>
  );
}