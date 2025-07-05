import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authClient } from "@/auth-client";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const session = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: cookieHeader,
      },
    },
  });

  try {
    const userId = session.data?.user.id;

    const body = await request.json();
    const { name, description, price, duration, active, images, categoryId } =
      body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }
    if (price == null) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!duration) {
      return new NextResponse("Time is required", { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        active,
        images:
          Array.isArray(images) && images.length > 0
            ? {
                createMany: {
                  data: images.map((image: { url: string }) => ({
                    url: image.url,
                  })),
                },
              }
            : undefined,

        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error adding service:", error);
    return new NextResponse("Failed to add service, Internal server error", {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   { params }: { params: { serviceId: string } }
// ) {
//   try {
//     const userId = authClient.useSession();
//     const body = await request.json();
//     const { name, description, price, duration, active } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }
//     if (!description) {
//       return new NextResponse("Description is required", { status: 400 });
//     }
//     if (price == null) {
//       return new NextResponse("Price is required", { status: 400 });
//     }
//     if (!duration) {
//       return new NextResponse("Time is required", { status: 400 });
//     }
//     // aktualizujemy usługę za pomocą serviceId z params
//     const service = await prisma.service.update({
//       where: {
//         serviceId: params.serviceId,
//       },
//       data: {
//         name,
//         description,
//         price,
//         duration,
//         active,
//       },
//     });
//     return NextResponse.json(service);
//   } catch (error) {
//     console.log("[Błąd przy zmianie usługi", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { serviceId: string } }
// ) {
//   try {
//     if (!params.serviceId) {
//       return new NextResponse("Service id is required", { status: 400 });
//     }
//     const service = await prisma.service.delete({
//       where: { serviceId: params.serviceId },
//     });
//     return NextResponse.json(service);
//   } catch (error) {
//     console.log("[Błąd przy usunięciu usługi", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
