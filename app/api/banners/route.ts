import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authClient } from "@/auth-client";

// GET /api/banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/banners
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const session = await authClient.getSession({
    fetchOptions: { headers: { cookie: cookieHeader } },
  });

  if (!session.data?.user || session.data.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, description, ctaText, ctaLink, imageUrl } =
      await request.json();

    if (!title || !imageUrl) {
      return new NextResponse("imageUrl and title are required", {
        status: 400,
      });
    }

    const newBanner = await prisma.banner.create({
      data: {
        title,
        description: description || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        imageUrl,
      },
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// DELETE /api/banners/[id]
// export async function DELETE(request: Request) {
//   const url = new URL(request.url);
//   const id = url.searchParams.get("id");

//   const cookieHeader = cookies().toString();
//   const session = await authClient.getSession({
//     fetchOptions: { headers: { cookie: cookieHeader } },
//   });

//   if (!session.data?.user || session.data.user.role !== "admin") {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   if (!id) {
//     return new NextResponse("Missing banner ID", { status: 400 });
//   }

//   try {
//     await prisma.banner.delete({
//       where: { id },
//     });
//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error("Error deleting banner:", error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }
