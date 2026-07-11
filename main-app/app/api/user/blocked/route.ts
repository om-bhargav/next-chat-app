import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/config/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? "";
    const skip = (page - 1) * limit;

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

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
        { status: 404 }
      );
    }
    const where: any = {
      blockedById: currentUser.id,
      OR: search
        ? [
            {
              user1: {
                OR: [
                  { fullname: { contains: search, mode: "insensitive" } },
                  { username: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              },
            },
            {
              user2: {
                OR: [
                  { fullname: { contains: search, mode: "insensitive" } },
                  { username: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              },
            },
          ]
        : undefined,
    };
    const [blockedContacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: {
          ...where,
        },
        include: {
          user1: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          user2: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: {
          blockedAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.contact.count({
        where: where,
      }),
    ]);

    const blockedUsers = blockedContacts.map((contact) => ({
      conversationId: contact.id,
      blockedAt: contact.blockedAt,
      ...{user: contact.user1Id === currentUser.id ? contact.user2 : contact.user1},
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: blockedUsers,
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
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
