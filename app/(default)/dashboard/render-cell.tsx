"use client";

import {
  Button,
  Chip,
  getKeyValue,
  Link,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { EllipsisVertical, Trash2, Pencil, Dot } from "lucide-react";
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
              key="edit"
              startContent={<Pencil size={13} />}
              onPress={() => {
                router.push(`${constants.path.DASHBOARD}/edit/${item.id}`);
              }}
            >
              Edit
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={13} />}
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
    
    case "name":
      return (
        <Link href={`${constants.path.DASHBOARD}/overview/${item.id}`} className="text-sm" underline="hover">{cellValue}</Link>
      )

    case "status":
      if (cellValue == 'online') {
        return (
          <Chip color="success" variant="flat">
            <div className="flex items-center">
              <div
                className="rounded-full bg-success mr-1"
                style={{
                  width: '10px',
                  height: '10px',
                }}
              />
              {cellValue}
            </div>
          </Chip>
        )
      }
      return (
        <Chip color="danger" variant="flat">
          <div className="flex items-center">
            <div
              className="rounded-full bg-danger mr-1"
              style={{
                width: '10px',
                height: '10px',
              }}
            />
            {cellValue}
          </div>
        </Chip>
      )

    default:
      return cellValue;
  }
}
