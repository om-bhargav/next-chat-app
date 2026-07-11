import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/config/db";
import { AuthWrapper } from "@/lib/api/middlewares/AuthWrapper";

export const GET = AuthWrapper(async (req, params, dbUser) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          {
            user1Id: dbUser.id,
          },
          {
            user2Id: dbUser.id,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user1: {
          select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        user2: {
          select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        messages: { orderBy: { createdAt: "desc" } ,take: 15},
      },
    });
    const data = contacts.map((contact) => {
      const otherUser = contact.user1Id === dbUser.id ? contact.user2 : contact.user1;
      const messages = contact.messages || [];
      const unReadCount = (messages.filter((message)=>{
        return !message.isSeen && message.senderId!==dbUser.id;
      }));
      const date = new Date();
      return {
        id: contact.id,
        createdAt: messages[0]?.createdAt || date,
        blockedAt: contact.blockedAt,
        blockedById: contact.blockedById,
        user: otherUser,
        unReadCount: unReadCount.length
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error.",
      },
      { status: 500 }
    );
  }
});
