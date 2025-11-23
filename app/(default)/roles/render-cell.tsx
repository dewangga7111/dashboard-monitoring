"use client";

import {
  Button,
  getKeyValue,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { EllipsisVertical, Trash2, Pencil, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import constants from "@/utils/constants";
import { RenderCellProps } from "@/types/table";
import { showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/context/confirmation-context";
import { ManagedPopover } from "@/components/common/managed-popover";

export default function RolesRenderCell({ item, columnKey }: RenderCellProps) {
  const key = String(columnKey);
  const cellValue = getKeyValue(item, key);
  const router = useRouter();
  const { confirm } = useConfirmation();

  switch (key) {
    case "action":
      return (
        <ManagedPopover
          placement="right"
          trigger={ 
            <Button
              variant="light"
              size="sm"
              isIconOnly
            >
              <EllipsisVertical size={18} />
            </Button>
          }
        >
          <Listbox aria-label="User actions" variant="flat">
            <ListboxItem
              key="permission"
              startContent={<Lock size={13}/>}
              onPress={() => {
                router.push(`${constants.path.ROLES}/permission/${item.id}`);
              }}
            >
              Permission
            </ListboxItem>
            <ListboxItem
              key="edit"
              startContent={<Pencil size={13}/>}
              onPress={() => {
                router.push(`${constants.path.ROLES}/edit/${item.id}`);
              }}
            >
              Edit
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={13}/>}
              onPress={() => {
                confirm({
                  message: constants.confirmation.DELETE,
                  onConfirm: () => {
                    showSuccessToast(constants.toast.SUCCESS_DELETE);
                  },
                });
              }}
            >
              Delete
            </ListboxItem>
          </Listbox>
        </ManagedPopover>
      );

    default:
      return cellValue;
  }
}
