import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/db";
import { InvitationStatus } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { invitationId, status } = await req.json();

    if (!invitationId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Invitation ID and status are required.",
        },
        { status: 400 }
      );
    }

    if (!Object.values(InvitationStatus).includes(status)) {
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
        id: invitationId,
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
          message: "You are not allowed to update this invitation.",
        },
        { status: 403 }
      );
    }

    await prisma.contactInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Invitation updated successfully.",
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