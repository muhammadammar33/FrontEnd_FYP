import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const data = await req.json();
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 400 });
  }
}
