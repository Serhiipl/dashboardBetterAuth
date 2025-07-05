import { NextResponse } from "next/server";
// import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { removePolishChars } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const generatedSlug = removePolishChars(name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const existingCategory = await prisma.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: name }, { slug: generatedSlug }],
          },
          {
            NOT: {
              id: id,
            },
          },
        ],
      },
    });

    if (existingCategory) {
      return new NextResponse(
        "Category with this name or slug already exists",
        {
          status: 409,
        }
      );
    }

    const category = await prisma.category.update({
      where: { id: id },
      data: { name, slug: generatedSlug },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const servicesUsingCategory = await prisma.service.findFirst({
      where: { categoryId: id },
    });

    if (servicesUsingCategory) {
      return new NextResponse(
        "Cannot delete category because it is used in services",
        { status: 409 }
      );
    }

    const category = await prisma.category.delete({
      where: { id: id },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
