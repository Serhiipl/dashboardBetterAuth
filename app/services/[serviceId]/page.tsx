import { notFound } from "next/navigation";
import Image from "next/image";
import { BackButton } from "@/components/back-button";
import { NextPage } from "next";

interface ServicePageProps {
  params: Promise<{ serviceId: string }>;
}
const ServicePage: NextPage<ServicePageProps> = async ({ params }) => {
  const { serviceId } = await params;
  if (!serviceId) {
    return notFound();
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${serviceId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const service = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
      {service.images?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {service.images.map(
            (img: { id?: string | number; url: string }, index: number) => (
              <Image
                key={img.id || index}
                src={img.url}
                alt={service.name}
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            )
          )}
        </div>
      )}
      <p className="text-gray-600 mb-4">
        <strong>Kategoria:</strong> {service.category?.name || "Brak kategorii"}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Cena:</strong> {service.price} zł
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Trwanie:</strong> {service.duration} min
      </p>
      <p className="text-gray-600">{service.description}</p>
      <BackButton />
    </div>
  );
};
export default ServicePage;
