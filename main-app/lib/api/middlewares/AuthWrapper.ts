import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/config/db";

type AuthUser = {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  fullname: string | null;
  image: string | null;
};

export function AuthWrapper<TContext = {}>(
  handler: (
    req: NextRequest,
    context: TContext,
    currentUser: AuthUser
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: TContext) => {
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

      const currentUser = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
        select: {
          id: true,
          clerkId: true,
          email: true,
          username: true,
          fullname: true,
          image: true,
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

      return handler(req, context, currentUser);
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
  };
}