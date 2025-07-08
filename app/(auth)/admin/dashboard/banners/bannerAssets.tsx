// "use client";

// import useServiceStore from "@/lib/serviceStore";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Trash2 } from "lucide-react";
// import { AlertModal } from "@/components/modals/alertModal";
// import toast from "react-hot-toast";

// export default function BannerAssets() {
//   // Fetch banners from API
//   const {
//     banners = [],
//     fetchBanners,
//     updateBanner,
//     isLoading,
//   } = useServiceStore();
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const deleteBanner = useServiceStore((state) => state.deleteBanner);

//   useEffect(() => {
//     const loadBanners = async () => {
//       try {
//         await fetchBanners();
//       } catch (error) {
//         console.error("Error fetching banners:", error);
//       }
//     };
//     loadBanners();
//   }, [fetchBanners]);

//   if (isLoading) return <div>Loading...</div>;

//   const handleEdit = (
//     bannerId: string,
//     currentTitle: string,
//     currentDescription: string
//   ) => {
//     setEditingId(bannerId);
//     setEditTitle(currentTitle);
//     setEditDescription(currentDescription);
//   };
//   const handleSave = async () => {
//     if (!editingId || !editTitle.trim() || !editDescription.trim()) return;
//     const originalBanner = banners.find((b) => b.id === editingId);
//     if (!originalBanner) return;
//     try {
//       await updateBanner({
//         ...originalBanner,
//         title: editTitle,
//         description: editDescription,
//       });
//       setEditingId(null);
//     } catch (error) {
//       console.error("Failed to update banner:", error);
//     }
//   };

//   const handleDelete = async (bannerId: string) => {
//     try {
//       await deleteBanner(bannerId);
//       setLoading(true);
//       toast.success("Banner deleted.");
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error("Failed to delete banner:", error);
//       setLoading(false);
//       setOpen(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-fit bg-white rounded-lg shadow-md">
//       <AlertModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={handleDelete}
//         loading={loading}
//       />
//       <h2 className="text-xl font-bold mb-4">Manage Banners</h2>
//       <ul className="space-y-4 min-h-fit flex flex-col gap-5 h-28 ">
//         {banners.map((banner) => (
//           <li key={banner.id} className="flex  items-center space-x-4">
//             {banner.imageUrl ? (
//               <div className="w-40 h-20 relative">
//                 <Image
//                   src={banner.imageUrl}
//                   alt={banner.title}
//                   width={160}
//                   height={80}
//                   className="rounded object-cover "
//                 />

//                 <div className="absolute top-0 right-0 flex space-x-1 mr-3 ">
//                   <Button
//                     onClick={() =>
//                       handleEdit(
//                         banner.id,
//                         banner.title,
//                         banner.description || ""
//                       )
//                     }
//                     className="bg-blue-500/50 text-white  rounded mr-2"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     onClick={() => handleDelete(banner.id)}
//                     variant={"destructive"}
//                   >
//                     <Trash2 />
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="w-40 h-20 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
//                 No image
//               </div>
//             )}
//             {editingId === banner.id ? (
//               <>
//                 <Input
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   className="w-64"
//                 />
//                 <Input
//                   value={editDescription}
//                   onChange={(e) => setEditDescription(e.target.value)}
//                   className="w-64"
//                 />
//                 <Button onClick={() => handleSave()} className="bg-green-600">
//                   Save
//                 </Button>
//                 <Button
//                   onClick={() => setEditingId(null)}
//                   className="bg-gray-300 px-2 py-1 rounded"
//                 >
//                   Cancel
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <span className="flex-1">{banner.title}</span>
//                 <Button
//                   onClick={() =>
//                     handleEdit(
//                       banner.id,
//                       banner.title,
//                       banner.description || ""
//                     )
//                   }
//                   className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   onClick={() => handleDelete(banner.id)}
//                   variant={"destructive"}
//                 >
//                   Delete
//                 </Button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
"use client";

import useServiceStore from "@/lib/serviceStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilRuler, Trash2 } from "lucide-react";
import { AlertModal } from "@/components/modals/alertModal";
import toast from "react-hot-toast";
import { EditBannerModal } from "@/components/modals/editBannerModal";

export default function BannerAssets() {
  const {
    banners = [],
    fetchBanners,
    updateBanner,
    isLoading,
  } = useServiceStore();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const [editBannerId, setEditBannerId] = useState<string | null>(null);
  const deleteBanner = useServiceStore((state) => state.deleteBanner);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        await fetchBanners();
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    loadBanners();
  }, [fetchBanners]);

  if (isLoading) return <div>Loading...</div>;

  const handleDelete = async () => {
    if (!selectedBannerId) return;
    try {
      await deleteBanner(selectedBannerId);
      setLoading(true);
      toast.success("Banner deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Failed to delete banner:", error);
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  const selectedBanner = banners.find((b) => b.id === editBannerId);

  return (
    <div className="w-96 md:w-full flex flex-col p-6 h-48 bg-white rounded-lg shadow-md">
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <EditBannerModal
        isOpen={!!editBannerId && !!selectedBanner}
        onClose={() => setEditBannerId(null)}
        banner={selectedBanner}
        onSave={async (updated) => {
          if (!selectedBanner) return;
          try {
            await updateBanner({ ...selectedBanner, ...updated });
            setEditBannerId(null);
          } catch (error) {
            console.log(error);
            toast.error("Failed to update banner");
          }
        }}
      />
      <h2 className="text-xl font-bold mb-4">Manage Banners</h2>
      <ul className="flex overflow-x-auto space-x-5 min-h-fit h-36 mx-2">
        {banners.map((banner) => (
          <li key={banner.id} className="flex-none w-48 h-24 relative">
            {banner.imageUrl ? (
              <>
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  width={160}
                  height={80}
                  className="rounded object-cover w-full h-full"
                />
                <div className="absolute top-0 right-0 flex space-x-1 mr-3">
                  <Button
                    onClick={() => setEditBannerId(banner.id)}
                    className="bg-blue-500/50 text-white rounded mr-2"
                  >
                    <PencilRuler />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedBannerId(banner.id);
                      setOpenDelete(true);
                    }}
                    variant={"destructive"}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-2 py-0.5 rounded text-xs text-center">
                  {banner.title}
                </span>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                No image
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs">
                  {banner.title}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
