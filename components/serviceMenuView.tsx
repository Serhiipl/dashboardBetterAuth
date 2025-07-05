import React, { useState, useMemo } from "react";
import useServiceStore from "@/lib/serviceStore";
import ShowServices from "@/components/showServices";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const ServiceMenuView: React.FC = () => {
  const { services, serviceCategories } = useServiceStore();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    if (!activeCategoryId) return services;
    return services.filter((s) => s.categoryId === activeCategoryId);
  }, [services, activeCategoryId]);

  return (
    <div className="w-full">
      {/* Desktop Tabs */}
      <div className="hidden md:flex justify-center mb-6">
        <Tabs defaultValue="all" value={activeCategoryId || "all"}>
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveCategoryId(null)}>
              Всі
            </TabsTrigger>
            {serviceCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Sheet */}
      <div className="md:hidden flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu className="w-5 h-5 mr-2" /> Меню
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="space-y-3 mt-4">
              <Button
                variant={activeCategoryId === null ? "default" : "ghost"}
                onClick={() => setActiveCategoryId(null)}
                className="w-full"
              >
                Всі
              </Button>
              {serviceCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategoryId === cat.id ? "default" : "ghost"}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className="w-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ShowServices services={filteredServices} />
    </div>
  );
};

export default ServiceMenuView;
