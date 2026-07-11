import { NextResponse } from "next/server";
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
      receiverId: currentUser.id,
      status: InvitationStatus.PENDING,
      ...(search && {
        sender: {
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
          sender: {
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
        ...invitation.sender,
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