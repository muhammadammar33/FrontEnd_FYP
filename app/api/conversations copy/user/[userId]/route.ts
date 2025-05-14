import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    console.log(`Fetching conversations for user: ${userId}`);
    
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId
          }
        }
      },
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
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    console.log(`Successfully fetched ${conversations.length} conversations`);
    
    // Format the response for easier frontend consumption
    const formattedConversations = conversations.map((conversation: { participants: any[]; id: any; messages: any[]; createdAt: any; updatedAt: any; }) => {
      // Find the other participants (not the current user)
      const otherParticipants = conversation.participants
        .filter(p => p.userId !== userId)
        .map(p => p.user);
      
      return {
        id: conversation.id,
        participants: conversation.participants,
        otherParticipants: otherParticipants,
        lastMessage: conversation.messages[0] || null,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      };
    });
    
    return NextResponse.json({
      success: true,
      data: formattedConversations,
      message: formattedConversations.length ? 'Conversations found' : 'No conversations found'
    });
  } catch (error) {
    console.error('Error in conversations API route:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }, 
      { status: 500 }
    );
  }
}
