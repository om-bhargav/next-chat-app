import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/config/db";
import { AuthWrapper } from "@/lib/api/middlewares/AuthWrapper";

type Params = Promise<{
  id: string;
}>;

export const GET = AuthWrapper(
  async (_req: NextRequest, { params }: { params: Params }, currentUser) => {
    const { id } = await params;

    const contact = await prisma.contact.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
      },
    });

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation not found.",
        },
        { status: 404 }
      );
    }

    if (
      contact.user1Id !== currentUser.id &&
      contact.user2Id !== currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        contactId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            fullname: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  }
);
