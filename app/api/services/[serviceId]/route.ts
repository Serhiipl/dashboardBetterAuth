import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ serviceId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    const service = await prisma.service.findUnique({
      where: { serviceId },
      include: {
        category: true,
        images: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   params: { params: Promise<{ serviceId: string }> }
// ) {
//   try {
//     const body = await request.json();
//     const { name, description, price, duration, active } = body;

//     // Отримати serviceId з асинхронного params
//     const { serviceId } = await params.params;

//     if (!name || !description || price == null || !duration) {
//       return new NextResponse("All fields are required", { status: 400 });
//     }

//     const parsedPrice = parseFloat(price);
//     const parsedDuration = parseInt(duration);

//     if (isNaN(parsedPrice)) {
//       return new NextResponse("Invalid price format", { status: 400 });
//     }

//     if (isNaN(parsedDuration)) {
//       return new NextResponse("Invalid duration format", { status: 400 });
//     }

//     const service = await prisma.service.update({
//       where: { serviceId },
//       data: {
//         name,
//         description,
//         price: parsedPrice,
//         duration: parsedDuration,
//         active,
//       },
//     });

//     return NextResponse.json(service);
//   } catch (error) {
//     console.error("Error updating service:", error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }
// export async function DELETE(
//   request: Request,
//   params: { params: Promise<{ serviceId: string }> }
// ) {
//   try {
//     const { serviceId } = await params.params;

//     if (!params || !params.params) {
//       return NextResponse.json("Invalid request format", { status: 400 });
//     }

//     if (!serviceId) {
//       return NextResponse.json("Service ID is required", { status: 400 });
//     }

//     const service = await prisma.service.delete({
//       where: { serviceId },
//     });

//     return NextResponse.json(service, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting service:", error);
//     return NextResponse.json("Internal server error", { status: 500 });
//   }
// }

// для оновлення та видалення послуги на пробу , вище залишив закоментовані працюючі функції PATCH та DELETE, якщо вони не потрібні, то можна видалити
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { name, description, price, duration, active } = body;
    const { serviceId } = await params;

    if (!name || !description || price == null || !duration) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    const parsedDuration = parseInt(duration);

    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: "Invalid price format" },
        { status: 400 }
      );
    }

    if (isNaN(parsedDuration)) {
      return NextResponse.json(
        { error: "Invalid duration format" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.delete({
      where: { serviceId },
    });

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
