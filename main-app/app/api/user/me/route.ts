import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {prisma} from "@/config/db";

export async function GET() {
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

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found in Clerk.",
        },
        { status: 404 }
      );
    }

    let user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          username:
            clerkUser.username ??
            `user_${Math.random().toString(36).slice(2, 10)}`,
          fullname: clerkUser.fullName ?? "Not Provided",
          bio: "Hey, there I'm using FluxChat",
          image: clerkUser.imageUrl
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}