import { NextRequest, NextResponse } from 'next/server';
import { messageStore } from '@/lib/messageStore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    console.log(`Récupération messages pour conversation ${conversationId}, utilisateur ${userId}`);

    const storedMessages = messageStore.getMessages(conversationId);
    
    console.log(`${storedMessages.length} messages trouvés pour la conversation ${conversationId}`);

    const messages = storedMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderName: msg.senderName,
      timestamp: msg.timestamp,
      type: msg.type,
      photos: msg.photos
    }));

    return NextResponse.json({
      messages,
      success: true,
      conversationId,
      messageCount: messages.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API messages conversation:', error);
    return NextResponse.json({
      error: 'Erreur lors du chargement des messages',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const conversationId = params.id;
    
    console.log('Données reçues:', data);
    console.log('Conversation ID:', conversationId);
    
    const content = data.content || data.message || '';
    const userId = data.userId || data.expediteurId || '';
    const senderName = data.senderName || 'Utilisateur';
    
    if (!content || !userId) {
      return NextResponse.json({ 
        error: 'content et userId requis' 
      }, { status: 400 });
    }

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      senderId: userId,
      senderName: senderName,
      conversationId,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text' as const,
      photos: []
    };
    
    messageStore.addMessage(conversationId, newMessage);
    
    console.log(`Message sauvegardé avec l'ID: ${newMessage.id}`);
    
    return NextResponse.json({
      message: newMessage,
      success: true,
      conversationId,
      totalMessages: messageStore.getMessageCount(conversationId),
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création message:', error);
    return NextResponse.json({
      error: 'Erreur lors de la création du message',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
