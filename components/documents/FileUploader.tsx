'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Folder } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (files: FileList, metadata: any) => void;
  uploading?: boolean;
  chantiers?: Array<{ id: string; nom: string }>;
}

export default function FileUploader({ onUpload, uploading = false, chantiers = [] }: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [metadata, setMetadata] = useState({
    chantierId: '',
    dossier: 'Documents'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, []);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} est trop volumineux (max 50MB)`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 fichiers
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;
    
    // Créer un FileList fake à partir de notre array
    const dt = new DataTransfer();
    selectedFiles.forEach(file => dt.items.add(file));
    
    onUpload(dt.files, metadata);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else {
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Zone de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-white/50 bg-white/5' : 'border-white/30 hover:border-white/40'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-white/70 mx-auto mb-4" />
        <p className="text-lg font-medium text-white mb-2">
          Glissez vos fichiers ici ou cliquez pour sélectionner
        </p>
        <p className="text-sm text-white/60">
          Maximum 10 fichiers, 50MB chacun
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
        className="hidden"
      />

      {/* Métadonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-medium mb-2">
            Chantier (optionnel)
          </label>
          <select
            value={metadata.chantierId}
            onChange={(e) => setMetadata(prev => ({ ...prev, chantierId: e.target.value }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="" style={{ color: '#000' }}>Aucun chantier</option>
            {chantiers.map(chantier => (
              <option key={chantier.id} value={chantier.id} style={{ color: '#000' }}>
                {chantier.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Dossier
          </label>
          <select
            value={metadata.dossier}
            onChange={(e) => setMetadata(prev => ({ ...prev, dossier: e.target.value }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="Documents" style={{ color: '#000' }}>📄 Documents</option>
            <option value="Photos" style={{ color: '#000' }}>📸 Photos</option>
            <option value="Plans" style={{ color: '#000' }}>📐 Plans</option>
            <option value="Factures" style={{ color: '#000' }}>🧾 Factures</option>
          </select>
        </div>
      </div>

      {/* Liste des fichiers sélectionnés */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3">
            Fichiers sélectionnés ({selectedFiles.length}/10)
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-white/60">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="p-1 hover:bg-white/10 rounded disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton d'upload */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedFiles.length === 0 || uploading}
          className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {uploading ? 'Upload en cours...' : `Uploader ${selectedFiles.length} fichier(s)`}
        </button>
      </div>
    </div>
  );
}
