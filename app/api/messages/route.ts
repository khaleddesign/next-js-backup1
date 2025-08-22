import { NextRequest, NextResponse } from 'next/server';
import { messageStore } from '@/lib/messageStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    console.log(`Récupération conversations pour utilisateur: ${userId}`);

    const allConversationIds = messageStore.getAllConversations();
    console.log(`Conversations trouvées: ${allConversationIds.length}`);

    const conversations = allConversationIds.map(conversationId => {
      const messages = messageStore.getMessages(conversationId);
      const lastMessage = messages[messages.length - 1];
      
      return {
        id: conversationId,
        nom: `Conversation ${conversationId}`,
        photo: null,
        participants: [
          { id: 'other-user', name: 'Autre utilisateur', role: 'CLIENT' }
        ],
        lastMessage: lastMessage ? {
          text: lastMessage.content,
          time: new Date().toISOString(),
          expediteur: lastMessage.senderName
        } : undefined,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
        type: 'chantier'
      };
    });

    if (conversations.length === 0) {
      conversations.push({
        id: '1',
        nom: 'Conversation de test',
        photo: null,
        participants: [
          { id: 'test-user', name: 'Utilisateur test', role: 'CLIENT' }
        ],
        lastMessage: {
          text: 'Messages de démonstration',
          time: new Date().toISOString(),
          expediteur: 'Système'
        },
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
        type: 'chantier'
      });
    }

    console.log(`Retour de ${conversations.length} conversations`);

    return NextResponse.json({
      conversations,
      success: true,
      userRole: 'CLIENT',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API messages GET:', error);
    return NextResponse.json({
      error: 'Erreur lors du chargement des conversations',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('POST message data:', data);
    
    const {
      expediteurId,
      message,
      chantierId,
      destinataireId,
      photos = [],
      senderName,
      userId,
      content
    } = data;
    
    const finalContent = content || message || '';
    const finalUserId = userId || expediteurId || 'unknown';
    const finalSenderName = senderName || 'Utilisateur';
    const finalConversationId = chantierId || destinataireId || '1';
    
    if (!finalContent.trim()) {
      return NextResponse.json({ 
        error: 'Message vide' 
      }, { status: 400 });
    }

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: finalContent.trim(),
      senderId: finalUserId,
      senderName: finalSenderName,
      conversationId: finalConversationId,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text' as const,
      photos: photos || []
    };
    
    messageStore.addMessage(finalConversationId, newMessage);
    
    console.log(`Message sauvegardé dans conversation ${finalConversationId}:`, newMessage.content);
    
    return NextResponse.json({
      message: newMessage,
      success: true,
      conversationId: finalConversationId,
      totalMessages: messageStore.getMessageCount(finalConversationId),
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur API messages POST:', error);
    return NextResponse.json({
      error: 'Erreur lors de la création du message',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
