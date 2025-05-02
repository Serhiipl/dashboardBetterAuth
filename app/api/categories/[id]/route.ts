import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    const { id } = await context.params;

    if (!name) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: id },
      data: { name, slug },
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

    const category = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
