import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: { serviceId: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, duration, active } = body;

    // Отримати serviceId з асинхронного params
    const { serviceId } = await context.params;

    if (!name || !description || price == null || !duration) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    const parsedDuration = parseInt(duration);

    if (isNaN(parsedPrice)) {
      return new NextResponse("Invalid price format", { status: 400 });
    }

    if (isNaN(parsedDuration)) {
      return new NextResponse("Invalid duration format", { status: 400 });
    }

    const service = await prisma.service.update({
      where: { serviceId },
      data: {
        name,
        description,
        price: parsedPrice,
        duration: parsedDuration,
        active,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  context: { params: { serviceId: string } }
) {
  try {
    if (!context || !context.params) {
      return NextResponse.json("Invalid request format", { status: 400 });
    }

    // Отримати serviceId безпечно
    const { serviceId } = await context.params;

    if (!serviceId) {
      return NextResponse.json("Service ID is required", { status: 400 });
    }

    const service = await prisma.service.delete({
      where: { serviceId },
    });

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
