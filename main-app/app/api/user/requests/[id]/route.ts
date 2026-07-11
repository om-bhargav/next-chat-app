import { auth } from "@clerk/nextjs/server";
import { InvitationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/db";

type Params = Promise<{
  id: string;
}>;

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { status } = await req.json();

    if (
      status !== InvitationStatus.ACCEPTED &&
      status !== InvitationStatus.REJECTED
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid invitation status.",
        },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
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
        { status: 404 }
      );
    }

    const invitation = await prisma.contactInvitation.findUnique({
      where: {
        id,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          message: "Invitation not found.",
        },
        { status: 404 }
      );
    }

    if (invitation.receiverId !== currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    if (status === InvitationStatus.ACCEPTED) {
      await prisma.$transaction(async (tx) => {
        await tx.contact.create({
          data: {
            user1Id: invitation.senderId,
            user2Id: invitation.receiverId,
          },
        });

        await tx.contactInvitation.delete({
          where: {
            id: invitation.id,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Invitation accepted.",
      });
    }

    await prisma.contactInvitation.delete({
      where: {
        id: invitation.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Invitation rejected.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
