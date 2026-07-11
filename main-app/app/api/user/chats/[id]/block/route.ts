import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/config/db";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id: contactId } = await params;

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
      select: {
        id: true,
        blockedById: true,
        user1Id: true,
        user2Id: true,
      },
    });

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact not found.",
        },
        {
          status: 404,
        }
      );
    }

    const isParticipant =
      contact.user1Id === currentUser.id || contact.user2Id === currentUser.id;

    if (!isParticipant) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not a member of this contact.",
        },
        {
          status: 403,
        }
      );
    }

    if (contact.blockedById) {
    await prisma.contact.update({
      where: {
        id: contact.id,
      },
      data: {
        blockedById: null,
        blockedAt: null,
      },
    });
      return NextResponse.json(
        {
          success: true,
          message: "User Unblocked Successfully.",
        }
      );
    }

    await prisma.contact.update({
      where: {
        id: contact.id,
      },
      data: {
        blockedById: currentUser.id,
        blockedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "User blocked successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}
