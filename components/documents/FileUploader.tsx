'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';

interface FileUploaderProps {
 onUpload: (files: FileList, metadata: any) => void;
 uploading: boolean;
 chantiers: Array<{ id: string; nom: string }>;
}

export default function FileUploader({ onUpload, uploading, chantiers }: FileUploaderProps) {
 const [dragActive, setDragActive] = useState(false);
 const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
 const [metadata, setMetadata] = useState({
   chantierId: '',
   dossier: 'Documents'
 });
 
 const inputRef = useRef<HTMLInputElement>(null);

 const handleDrag = (e: React.DragEvent) => {
   e.preventDefault();
   e.stopPropagation();
   if (e.type === 'dragenter' || e.type === 'dragover') {
     setDragActive(true);
   } else if (e.type === 'dragleave') {
     setDragActive(false);
   }
 };

 const handleDrop = (e: React.DragEvent) => {
   e.preventDefault();
   e.stopPropagation();
   setDragActive(false);
   
   if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
     handleFiles(e.dataTransfer.files);
   }
 };

 const handleFiles = (fileList: FileList) => {
   const files = Array.from(fileList);
   const validFiles = files.filter(file => {
     const validTypes = [
       'image/jpeg', 'image/png', 'image/heic', 'image/webp',
       'application/pdf',
       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
     ];
     return validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024; // 50MB max
   });
   
   setSelectedFiles(prev => [...prev, ...validFiles]);
 };

 const removeFile = (index: number) => {
   setSelectedFiles(prev => prev.filter((_, i) => i !== index));
 };

 const handleSubmit = () => {
   if (selectedFiles.length === 0) return;
   
   const fileList = new DataTransfer();
   selectedFiles.forEach(file => fileList.items.add(file));
   
   onUpload(fileList.files, metadata);
 };

 const getFileIcon = (file: File) => {
   if (file.type.startsWith('image/')) {
     return <Image className="w-6 h-6 text-green-400" />;
   }
   return <FileText className="w-6 h-6 text-blue-400" />;
 };

 const formatFileSize = (bytes: number) => {
   if (bytes === 0) return '0 B';
   const k = 1024;
   const sizes = ['B', 'KB', 'MB', 'GB'];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
 };

 return (
   <div className="space-y-6">
     <div
       className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
         dragActive 
           ? 'border-blue-400 bg-blue-400/10' 
           : 'border-white/30 hover:border-blue-400/50'
       }`}
       onDragEnter={handleDrag}
       onDragLeave={handleDrag}
       onDragOver={handleDrag}
       onDrop={handleDrop}
     >
       <div className="flex flex-col items-center">
         <Upload className="w-12 h-12 text-blue-300 mb-4" />
         <h3 className="text-xl font-semibold text-white mb-2">
           Glissez vos fichiers ici
         </h3>
         <p className="text-blue-100 mb-4">
           ou cliquez pour sélectionner des fichiers
         </p>
         
         <button
           onClick={() => inputRef.current?.click()}
           disabled={uploading}
           className="btn btn-primary"
         >
           Sélectionner des fichiers
         </button>
         
         <input
           ref={inputRef}
           type="file"
           multiple
           className="hidden"
           accept="image/*,.pdf,.doc,.docx,.xlsx"
           onChange={(e) => e.target.files && handleFiles(e.target.files)}
         />
         
         <p className="text-sm text-blue-300 mt-4">
           Formats supportés: JPG, PNG, HEIC, PDF, DOC, XLSX (max 50MB)
         </p>
       </div>
     </div>

     {selectedFiles.length > 0 && (
       <div>
         <h3 className="text-white font-semibold mb-4">
           Fichiers sélectionnés ({selectedFiles.length})
         </h3>
         
         <div className="space-y-2 max-h-60 overflow-y-auto">
           {selectedFiles.map((file, index) => (
             <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
               {getFileIcon(file)}
               <div className="flex-1 min-w-0">
                 <p className="text-white font-medium truncate">{file.name}</p>
                 <p className="text-blue-200 text-sm">{formatFileSize(file.size)}</p>
               </div>
               <button
                 onClick={() => removeFile(index)}
                 className="p-1 text-red-400 hover:bg-red-400/20 rounded"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
           ))}
         </div>
       </div>
     )}

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div>
         <label className="block text-blue-100 text-sm mb-2">
           Chantier associé
         </label>
         <select
           value={metadata.chantierId}
           onChange={(e) => setMetadata(prev => ({ ...prev, chantierId: e.target.value }))}
           className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
         >
           <option value="">Aucun chantier</option>
           {chantiers.map((chantier) => (
             <option key={chantier.id} value={chantier.id}>
               {chantier.nom}
             </option>
           ))}
         </select>
       </div>

       <div>
         <label className="block text-blue-100 text-sm mb-2">
           Dossier de destination
         </label>
         <select
           value={metadata.dossier}
           onChange={(e) => setMetadata(prev => ({ ...prev, dossier: e.target.value }))}
           className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
         >
           <option value="Documents">Documents</option>
           <option value="Photos avant travaux">Photos avant travaux</option>
           <option value="Photos pendant travaux">Photos pendant travaux</option>
           <option value="Photos finition">Photos finition</option>
           <option value="Plans techniques">Plans techniques</option>
           <option value="Factures">Factures</option>
           <option value="Contrats">Contrats</option>
         </select>
       </div>
     </div>

     {selectedFiles.length > 0 && (
       <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/20">
         <button
           onClick={() => setSelectedFiles([])}
           className="px-6 py-3 text-blue-200 hover:text-white transition-colors"
         >
           Annuler
         </button>
         
         <button
           onClick={handleSubmit}
           disabled={uploading || selectedFiles.length === 0}
           className="btn btn-primary flex items-center gap-2"
         >
           {uploading ? (
             <>
               <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
               Upload en cours...
             </>
           ) : (
             <>
               <Upload className="w-4 h-4" />
               Uploader {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''}
             </>
           )}
         </button>
       </div>
     )}
   </div>
 );
}
