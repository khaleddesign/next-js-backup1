'use client';

import { useState } from 'react';
import { Upload, ArrowLeft, File, X, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/documents/FileUploader';
import { useToasts } from '@/hooks/useToasts';

export default function UploadPage() {
 const router = useRouter();
 const { success, error: showError } = useToasts();
 
 const [uploading, setUploading] = useState(false);
 const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
 const [uploadResults, setUploadResults] = useState<{
   success: any[];
   errors: any[];
 }>({ success: [], errors: [] });

 const handleUpload = async (files: FileList, metadata: any) => {
   if (files.length === 0) return;

   setUploading(true);
   setUploadProgress({});
   setUploadResults({ success: [], errors: [] });

   try {
     const formData = new FormData();
     
     Array.from(files).forEach(file => {
       formData.append('files', file);
     });
     
     formData.append('chantierId', metadata.chantierId || '');
     formData.append('uploaderId', 'test-user-123');
     formData.append('dossier', metadata.dossier || 'Documents');

     Array.from(files).forEach((file, index) => {
       setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
       
       const interval = setInterval(() => {
         setUploadProgress(prev => {
           const newProgress = Math.min((prev[file.name] || 0) + 10, 90);
           if (newProgress >= 90) {
             clearInterval(interval);
           }
           return { ...prev, [file.name]: newProgress };
         });
       }, 200);
     });

     const response = await fetch('/api/documents/upload', {
       method: 'POST',
       body: formData
     });

     const result = await response.json();

     Array.from(files).forEach(file => {
       setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
     });

     if (response.ok) {
       setUploadResults(result);
       success(
         'Upload terminé', 
         `${result.uploaded}/${result.total} fichier(s) uploadé(s) avec succès`
       );
       
       setTimeout(() => {
         router.push('/dashboard/documents');
       }, 2000);
     } else {
       throw new Error(result.error || 'Erreur lors de l\'upload');
     }

   } catch (error) {
     showError('Erreur', 'Erreur lors de l\'upload des fichiers');
   } finally {
     setUploading(false);
   }
 };

 const mockChantiers = [
   { id: 'chantier-1', nom: 'Rénovation Villa Moderne' },
   { id: 'chantier-2', nom: 'Extension Maison Familiale' },
   { id: 'chantier-3', nom: 'Construction Pavillon Neuf' }
 ];

 return (
   <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #ea580c 100%)' }}>
     <div className="container mx-auto px-4 py-8">
       <div className="flex items-center gap-4 mb-8">
         <Link
           href="/dashboard/documents"
           className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
         >
           <ArrowLeft className="w-6 h-6" />
         </Link>
         
         <div>
           <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
             <Upload className="w-10 h-10" />
             Upload de fichiers
           </h1>
           <p className="text-blue-100">Ajoutez vos photos, plans et documents</p>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
           <div className="glass p-6">
             <FileUploader
               onUpload={handleUpload}
               uploading={uploading}
               chantiers={mockChantiers}
             />

             {Object.keys(uploadProgress).length > 0 && (
               <div className="mt-8">
                 <h3 className="text-white font-semibold mb-4">Progression de l'upload</h3>
                 <div className="space-y-3">
                   {Object.entries(uploadProgress).map(([fileName, progress]) => (
                     <div key={fileName} className="bg-white/10 rounded-lg p-4">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-white text-sm truncate flex-1">{fileName}</span>
                         <span className="text-blue-200 text-sm ml-4">{progress}%</span>
                       </div>
                       <div className="w-full bg-white/20 rounded-full h-2">
                         <div
                           className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                           style={{ width: `${progress}%` }}
                         ></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {uploadResults.success.length > 0 && (
               <div className="mt-8">
                 <h3 className="text-green-300 font-semibold mb-4 flex items-center gap-2">
                   <Check className="w-5 h-5" />
                   Fichiers uploadés avec succès ({uploadResults.success.length})
                 </h3>
                 <div className="space-y-2">
                   {uploadResults.success.map((doc: any, index: number) => (
                     <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                       <div className="flex items-center justify-between">
                         <span className="text-green-200">{doc.nomOriginal}</span>
                         <span className="text-green-300 text-sm">{doc.type}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {uploadResults.errors.length > 0 && (
               <div className="mt-8">
                 <h3 className="text-red-300 font-semibold mb-4 flex items-center gap-2">
                   <AlertCircle className="w-5 h-5" />
                   Erreurs d'upload ({uploadResults.errors.length})
                 </h3>
                 <div className="space-y-2">
                   {uploadResults.errors.map((error: any, index: number) => (
                     <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                       <div className="flex items-center justify-between">
                         <span className="text-red-200">{error.fileName}</span>
                         <span className="text-red-300 text-sm">{error.error}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>

         <div className="lg:col-span-1 space-y-6">
           <div className="glass p-6">
             <h3 className="text-white font-semibold mb-4">Types de fichiers supportés</h3>
             <div className="space-y-3 text-sm">
               <div className="flex items-start gap-3">
                 <div className="w-3 h-3 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                 <div>
                   <div className="text-white font-medium">Photos</div>
                   <div className="text-blue-100">JPG, PNG, HEIC, WebP</div>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                 <div className="w-3 h-3 bg-red-400 rounded-full mt-1 flex-shrink-0"></div>
                 <div>
                   <div className="text-white font-medium">Documents</div>
                   <div className="text-blue-100">PDF, DOC, XLSX</div>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                 <div className="w-3 h-3 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
                 <div>
                   <div className="text-white font-medium">Plans</div>
                   <div className="text-blue-100">DWG, PDF techniques</div>
                 </div>
               </div>
             </div>
           </div>

           <div className="glass p-6">
             <h3 className="text-white font-semibold mb-4">Conseils d'upload</h3>
             <div className="space-y-3 text-sm text-blue-100">
               <div className="flex items-start gap-2">
                 <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                 <p>Les images de plus de 2MB seront automatiquement compressées</p>
               </div>
               
               <div className="flex items-start gap-2">
                 <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                 <p>Les métadonnées GPS seront extraites des photos</p>
               </div>
               
               <div className="flex items-start gap-2">
                 <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                 <p>Vous pouvez uploader jusqu'à 10 fichiers simultanément</p>
               </div>
               
               <div className="flex items-start gap-2">
                 <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                 <p>Taille maximale : 50MB par fichier</p>
               </div>
             </div>
           </div>

           <div className="glass p-6">
             <h3 className="text-white font-semibold mb-4">Organisation automatique</h3>
             <div className="text-sm text-blue-100">
               <p className="mb-3">Vos fichiers seront automatiquement organisés par :</p>
               <ul className="space-y-2">
                 <li>• Type de fichier</li>
                 <li>• Chantier associé</li>
                 <li>• Date d'upload</li>
                 <li>• Métadonnées détectées</li>
               </ul>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}
