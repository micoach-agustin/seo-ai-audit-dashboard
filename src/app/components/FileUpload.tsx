import { Upload, FileText, Sparkles } from "lucide-react";
import { useRef } from "react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  /** Optional: when provided, shows a "Load sample audit" button under the drop zone. */
  onLoadSample?: () => void;
}

export function FileUpload({ onFileUpload, onLoadSample }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("handleFileChange triggered, file:", file);
    if (file) {
      console.log("Calling onFileUpload with file:", file.name);
      onFileUpload(file);
      // Reset input para permitir seleccionar el mismo archivo nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    console.log("handleDrop triggered, file:", file);
    if (file && (file.type === "application/json" || file.name.endsWith(".json"))) {
      console.log("Calling onFileUpload with dropped file:", file.name);
      onFileUpload(file);
    } else {
      console.warn("File dropped is not a JSON file:", file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Sube tu archivo JSON
          </h3>
          <p className="text-sm text-gray-600">
            Arrastra y suelta o haz clic para seleccionar
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <FileText className="w-4 h-4" />
          <span>Soporta archivos JSON con los hallazgos de auditoría</span>
        </div>
      </div>
    </div>
    {onLoadSample && (
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Load sample audit
        </button>
      </div>
    )}
    </div>
  );
}
