import { prisma } from "@/config/db";
import { uploadImages } from "@/helpers/cloudinary-helpers";
import { AuthWrapper } from "@/lib/api/middlewares/AuthWrapper";
import { NextRequest, NextResponse } from "next/server";
import { messageSchema } from "@/validations/panel/MessageSchema";
type Params = Promise<{
  id: string;
}>;

export const GET = AuthWrapper(
  async (req: NextRequest, { params }: { params: Params }, dbUser) => {
    const { id } = await params;
    const conversation = await prisma.contact.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    await prisma.contact.update({
      where: {
        id,
      },
      data: {
        messages: {
          updateMany: {
            where: {
              senderId: {
                not: dbUser.id,
              },
              isSeen: false,
            },
            data: {
              isSeen: true,
            },
          },
        },
      },
      include: {
        messages: true,
      },
    });
    return NextResponse.json({
      success: true,
      data: conversation?.messages,
    });
  }
);

export const POST = AuthWrapper(
  async (req: NextRequest, { params }: { params: Params }, dbUser) => {
    try {
      const { id: contactId } = await params;
      const body = await req.formData();
      const parsedData = messageSchema.safeParse({
        content: body.get("content"),
      });
      const images = body
        .getAll("images")
        .filter((item): item is File => item instanceof File);
      if (!parsedData.success && images.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: parsedData.error.flatten().formErrors,
          },
          { status: 400 }
        );
      }
      const imageUrls = await uploadImages(images);
      const safeData = parsedData.data;
      const contact = await prisma.contact.findUnique({
        where: {
          id: contactId,
        },
      });

      if (!contact) {
        return NextResponse.json(
          {
            success: false,
            message: "Conversation not found.",
          },
          { status: 404 }
        );
      }

      // Ensure the user is a participant
      if (contact.user1Id !== dbUser.id && contact.user2Id !== dbUser.id) {
        return NextResponse.json(
          {
            success: false,
            message: "Forbidden.",
          },
          { status: 403 }
        );
      }

      const message = await prisma.message.create({
        data: {
          contactId,
          senderId: dbUser.id,
          content: safeData?.content,
          images: imageUrls,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullname: true,
              username: true,
              image: true,
            },
          },
        },
      });
      return NextResponse.json({
        success: true,
        message: "Message sent successfully.",
        data: message,
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
);

export const PUT = AuthWrapper(
  async (req: NextRequest, { params }: { params: Params }) => {
    const { id } = await params;
    const body = await req.json();

    return NextResponse.json({
      success: true,
      message: "Message updated successfully.",
      chatId: id,
      data: body,
    });
  }
);

export const DELETE = AuthWrapper(
  async (_req: NextRequest, { params }: { params: Params }) => {
    const { id } = await params;

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
      chatId: id,
    });
  }
);
