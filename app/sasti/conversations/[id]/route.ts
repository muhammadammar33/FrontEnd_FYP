import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get conversation with participants
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' }, 
        { status: 404 }
      );
    }
    
    // Get messages with pagination
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    // Get total message count for pagination
    const totalMessages = await prisma.message.count({
      where: { conversationId }
    });
    
    const totalPages = Math.ceil(totalMessages / limit);
    
    return NextResponse.json({
      success: true,
      data: {
        conversation: {
          ...conversation,
          messages
        },
        pagination: {
          page,
          limit,
          totalMessages,
          totalPages
        }
      },
      message: 'Conversation retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const body = await request.json();
    const { userId } = body;
    
    // Verify user is part of the conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId
        }
      }
    });
    
    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to delete this conversation' }, 
        { status: 403 }
      );
    }
    
    // Delete the conversation (cascade will delete participants and messages)
    await prisma.conversation.delete({
      where: { id: conversationId }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}
