import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";
function FlashMessages() {
  const { flash } = usePage().props;
  useEffect(() => {
    if (flash == null ? void 0 : flash.success) {
      toast.success(flash.success);
    }
    if (flash == null ? void 0 : flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  return null;
}
export {
  FlashMessages as F
};
