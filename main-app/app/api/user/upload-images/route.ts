import { NextRequest, NextResponse } from "next/server";
import { uploadImages } from "@/helpers/cloudinary-helpers";
import { AuthWrapper } from "@/lib/api/middlewares/AuthWrapper";

export const POST = AuthWrapper(async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json(
        {
          success: false,
          message: "No images uploaded.",
        },
        { status: 400 }
      );
    }

    const uploads = await uploadImages(files);

    return NextResponse.json({
      success: true,
      urls: uploads,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed.",
      },
      { status: 500 }
    );
  }
});
