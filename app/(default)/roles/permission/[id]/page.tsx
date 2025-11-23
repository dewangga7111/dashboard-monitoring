"use client";

import {
  Button,
  Card,
  CardBody,
  Form,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/context/confirmation-context";
import { RootState } from "@/redux/store";
import { actionButtons, button, form } from "@/utils/primitives";
import constants from "@/utils/constants";

export default function EditPermissionPage() {
  const router = useRouter();
  const store = useSelector((state: RootState) => state.roles);
  const { confirm } = useConfirmation();

  const [permissions, setPermissions] = useState([
    { id: 1, name: "Home", read: false, add: false, edit: false, delete: false },
    { id: 2, name: "Users", read: false, add: false, edit: false, delete: false },
    { id: 3, name: "Roles", read: false, add: false, edit: false, delete: false },
    { id: 4, name: "Division", read: false, add: false, edit: false, delete: false },
  ]);

  useEffect(() => {
    if (store.success) {
      showSuccessToast(constants.toast.SUCCESS_SAVE);
      router.push(constants.path.ROLES);
    } else if (store.error) {
      showErrorToast(store.error);
    }
  }, [store.loading]);

  const handleToggle = (menuId: number, key: keyof Omit<typeof permissions[0], "id" | "name">) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.id === menuId ? { ...item, [key]: !item[key] } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    confirm({
      message: constants.confirmation.SAVE,
      onConfirm: () => {
        doSave();
      },
    });
  };

  const doSave = () => {
    console.log("Saving permissions:", permissions);
    showSuccessToast(constants.toast.SUCCESS_SAVE);
    router.push(constants.path.ROLES);
  };

  return (
    <div>
      <Card className="px-1">
        <CardBody>
          <span className="text-lg">Role: <span className="font-medium">Admin</span></span>

          <Form className="mt-3" onSubmit={handleSubmit}>
            <div className={form()}>
              <Table removeWrapper aria-label="Permissions table">
                <TableHeader>
                  <TableColumn>Menu</TableColumn>
                  <TableColumn width={150} align="center">Read</TableColumn>
                  <TableColumn width={150} align="center">Add</TableColumn>
                  <TableColumn width={150} align="center">Edit</TableColumn>
                  <TableColumn width={150} align="center">Delete</TableColumn>
                </TableHeader>

                <TableBody>
                  {permissions.map((menu) => (
                    <TableRow key={menu.id}>
                      <TableCell>{menu.name}</TableCell>
                      <TableCell>
                        <Switch
                          isSelected={menu.read}
                          onValueChange={() => handleToggle(menu.id, "read")}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          isSelected={menu.add}
                          onValueChange={() => handleToggle(menu.id, "add")}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          isSelected={menu.edit}
                          onValueChange={() => handleToggle(menu.id, "edit")}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          isSelected={menu.delete}
                          onValueChange={() => handleToggle(menu.id, "delete")}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className={`${actionButtons()} mt-3`}>
                <Button
                  type="button"
                  color="primary"
                  variant="flat"
                  className={button()}
                  onPress={router.back}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className={button()}
                  startContent={<Save size={15} />}
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
