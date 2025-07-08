"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Jesteś pewny/a?"
      description="Usunięcie nie odwrotne =)"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pt-6 space-x-2 flex items-center justify-end w-full"
      >
        <Button
          className="font-bold"
          disabled={loading}
          variant="outline"
          onClick={onClose}
        >
          NIE
        </Button>
        <Button
          className="bg-red-400 text-white font-bold"
          disabled={loading}
          variant="outline"
          onClick={onConfirm}
        >
          Usuń!
        </Button>
      </div>
    </Modal>
  );
};
