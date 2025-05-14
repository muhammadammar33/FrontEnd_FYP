import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIds } = body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length < 2) {
      return NextResponse.json(
        { success: false, message: 'At least two user IDs are required' }, 
        { status: 400 }
      );
    }
    
    // Check if all users exist
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      }
    });
    
    if (users.length !== userIds.length) {
      return NextResponse.json(
        { success: false, message: 'One or more users do not exist' }, 
        { status: 400 }
      );
    }
    
    // Check if conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: userIds.map(userId => ({
          participants: {
            some: {
              userId
            }
          }
        })),
        participants: {
          every: {
            userId: {
              in: userIds
            }
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
        }
      }
    });
    
    if (existingConversation) {
      return NextResponse.json({
        success: true,
        data: existingConversation,
        message: 'Conversation already exists'
      });
    }
    
    // Create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          create: userIds.map(userId => ({
            user: {
              connect: { id: userId }
            }
          }))
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
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newConversation,
      message: 'Conversation created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
