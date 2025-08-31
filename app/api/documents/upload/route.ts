import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  console.log('🚀 Upload API called');
  console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Vérifier si c'est bien multipart/form-data
    const contentType = request.headers.get('content-type');
    console.log('📝 Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      console.log('❌ Content-Type incorrect');
      return NextResponse.json({ 
        error: 'Content-Type doit être multipart/form-data',
        received: contentType 
      }, { status: 400 });
    }

    // Parser le FormData
    console.log('📦 Parsing FormData...');
    const formData = await request.formData();
    
    // Debug: lister tous les champs
    console.log('📋 Champs FormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size}b)` : value);
    }
    
    const file = formData.get('files') as File;
    
    if (!file || !(file instanceof File)) {
      console.log('❌ Pas de fichier trouvé ou type incorrect');
      console.log('🔍 Type reçu:', typeof file);
      return NextResponse.json({ 
        error: 'Fichier manquant ou format incorrect',
        debug: {
          fileExists: !!file,
          fileType: typeof file,
          isFile: file instanceof File
        }
      }, { status: 400 });
    }

    console.log('✅ Fichier trouvé:', {
      nom: file.name,
      taille: file.size,
      type: file.type
    });

    // Validation
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Type non autorisé: ${file.type}. Autorisés: ${allowedTypes.join(', ')}` 
      }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB (max 10MB)` 
      }, { status: 400 });
    }

    // Créer le dossier
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents');
    await mkdir(uploadDir, { recursive: true });

    // Nom de fichier sécurisé
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || '';
    const safeName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${timestamp}_${safeName}.${extension}`;
    const filePath = join(uploadDir, fileName);

    // Sauvegarder
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);
    
    console.log('✅ Fichier sauvé:', filePath);

    // Type de document
    let docType = 'AUTRE';
    if (file.type.startsWith('image/')) docType = 'PHOTO';
    else if (file.type === 'application/pdf') docType = 'PDF';

    // Optionnel: sauver en base (commenté pour debug)
    try {
      const document = await db.document.create({
        data: {
          nom: fileName,
          nomOriginal: file.name,
          type: docType as any,
          taille: file.size,
          url: `/uploads/documents/${fileName}`,
          uploaderId: 'test-user',
          public: false
        }
      });
      
      console.log('✅ Sauvé en base:', document.id);
      
      return NextResponse.json({
        success: true,
        document: {
          id: document.id,
          nom: document.nom,
          nomOriginal: document.nomOriginal,
          url: document.url,
          taille: document.taille
        }
      });
      
    } catch (dbError) {
      console.log('⚠️ Erreur DB, mais fichier sauvé:', dbError);
      
      return NextResponse.json({
        success: true,
        document: {
          id: `temp_${timestamp}`,
          nom: fileName,
          nomOriginal: file.name,
          url: `/uploads/documents/${fileName}`,
          taille: file.size
        },
        warning: 'Fichier sauvé mais pas en base'
      });
    }

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erreur serveur',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
