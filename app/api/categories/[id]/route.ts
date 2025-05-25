import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { removePolishChars } from "@/lib/utils";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name } = body;
    const { id } = await context.params;

    if (!name) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const generatedSlug = removePolishChars(name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    // Sprawdzamy, czy kategoria o danej nazwie już istnieje
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

    // aktualizujemy usługę za pomocą id kategorii z params

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
  context: { params: { id: string } }
) {
  try {
    if (!context || !context.params) {
      return NextResponse.json("Invalid request format", { status: 400 });
    }
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json("Category ID is required", { status: 400 });
    }

    const servicesUsingCategory = await prisma.service.findFirst({
      where: { categoryId: id },
    });

    if (servicesUsingCategory) {
      return NextResponse.json(
        "Cannot delete category because it is used in services",
        { status: 409 }
      );
    }

    const category = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
