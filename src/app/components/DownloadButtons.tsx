import { Download, FileText } from "lucide-react";

interface DownloadButtonsProps {
  reportData: any;
  onDownload: () => void;
}

export function DownloadButtons({ reportData, onDownload }: DownloadButtonsProps) {
  return (
    <button
      onClick={onDownload}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      <FileText className="w-5 h-5" />
      <span>Descargar Reporte PDF</span>
      <Download className="w-4 h-4" />
    </button>
  );
}