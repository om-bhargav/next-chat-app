import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/db";
import { InvitationStatus } from "@prisma/client";
import { AuthWrapper } from "@/lib/api/middlewares/AuthWrapper";

export const GET = AuthWrapper(async (req, params, currentUser) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? "";

    const skip = (page - 1) * limit;

    const where = {
      senderId: currentUser.id,
      ...(search && {
        receiver: {
          OR: [
            {
              fullname: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              username: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        },
      }),
    };

    const [invitations, total] = await Promise.all([
      prisma.contactInvitation.findMany({
        where,
        orderBy: {
          id: "desc",
        },
        skip,
        take: limit,
        include: {
          receiver: {
            select: {
              id: true,
              fullname: true,
              username: true,
              email: true,
              image: true,
            },
          },
        },
      }),

      prisma.contactInvitation.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: invitations.map((invitation) => ({
        ...invitation.receiver,
        ...invitation,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
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
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const sender = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!sender) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const receiver = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (receiver.id === sender.id) {
      return NextResponse.json(
        { success: false, message: "You cannot invite yourself." },
        { status: 400 }
      );
    }

    const alreadyExists = await prisma.contactInvitation.findFirst({
      where: {
        OR: [
          {
            senderId: sender.id,
            receiverId: receiver.id,
          },
          {
            senderId: receiver.id,
            receiverId: sender.id,
          },
        ],
      },
    });

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "An invitation already exists.",
        },
        { status: 409 }
      );
    }

    await prisma.contactInvitation.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        status: InvitationStatus.PENDING,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully.",
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
 