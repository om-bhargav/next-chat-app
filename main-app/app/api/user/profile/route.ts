import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/db";
import { profileSchema } from "@/validations/panel/ProfileValidations";

// GET - Return logged in user's profile
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        username: true,
        bio: true,
        fullname: true,
        image: true
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({success: true,data: user});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update logged in user's profile
export async function PUT(req: NextRequest) {
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

    const body = await req.json();

    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullname, username, bio, image } = parsed.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        NOT: {
          clerkId: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        fullname,
        username,
        bio,
        image,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
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