import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authClient } from "@/auth-client";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieHeader = cookies().toString();

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
    const { name, slug } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Slug is required", { status: 400 });
    }

    // Tworzenie nowego zapisu w bazie danych
    const generatedSlug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || generatedSlug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    return new NextResponse("Failed to add category, Internal server error", {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieHeader = cookies().toString();

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
    const { name, slug } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Slug is required", { status: 400 });
    }

    // aktualizujemy usługę za pomocą id kategorii z params
    const category = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        slug,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("Błąd przy zmianie kategorii", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    const category = await prisma.category.delete({
      where: { id: params.id },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[Błąd przy usunięciu usługi", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
