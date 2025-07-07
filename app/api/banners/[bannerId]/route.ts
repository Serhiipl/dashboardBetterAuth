import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  params: { params: Promise<{ bannerId: string }> }
) {
  try {
    const body = await request.json();
    const { title, description, ctaText, ctaLink, imageUrl } = body;

    // Отримати serviceId з асинхронного params
    const { bannerId } = await params.params;

    if (!bannerId) {
      return new NextResponse("Banner ID is required", { status: 400 });
    }

    const banner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        title: title || "",
        description: description || "",
        ctaText: ctaText || "",
        ctaLink: ctaLink || "",
        imageUrl,
      },
    });

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.error("Error updating banner:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  params: { params: Promise<{ bannerId: string }> }
) {
  try {
    const { bannerId } = await params.params;

    if (!params || !params.params) {
      return NextResponse.json("Invalid request format", { status: 400 });
    }

    if (!bannerId) {
      return NextResponse.json("Service ID is required", { status: 400 });
    }

    const banner = await prisma.banner.delete({
      where: { id: bannerId },
    });

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
