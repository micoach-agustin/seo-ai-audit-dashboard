import { TrendingUp, Bot } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: "seo" | "ai";
}

export function ScoreCard({ title, score, icon }: ScoreCardProps) {
  const percentage = ((score || 0) / 10) * 100;
  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excelente";
    if (score >= 6) return "Bueno";
    if (score >= 4) return "Necesita Mejoras";
    return "Crítico";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        {icon === "seo" ? (
          <TrendingUp className="w-5 h-5 text-blue-600" />
        ) : (
          <Bot className="w-5 h-5 text-purple-600" />
        )}
      </div>
      
      <div className="flex items-end gap-2 mb-3">
        <span className="text-4xl font-bold text-gray-900">{(score || 0).toFixed(1)}</span>
        <span className="text-gray-500 text-lg mb-1">/10</span>
      </div>

      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${getScoreColor(score || 0)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${
          score >= 8 ? "text-green-600" : score >= 6 ? "text-yellow-600" : "text-red-600"
        }`}>
          {getScoreLabel(score || 0)}
        </span>
        <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  );
}