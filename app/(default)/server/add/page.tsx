"use client";

import { Button, Card, CardBody, Form } from "@heroui/react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import AppTextInput from "@/components/common/app-text-input";
import AppTextarea from "@/components/common/app-textarea";
import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/context/confirmation-context";
import { RootState } from "@/redux/store";
import { actionButtons, button, form, inputContainer } from "@/utils/primitives";
import constants from "@/utils/constants"

export default function AddServerPage() {
  const router = useRouter();
  const store = useSelector((state: RootState) => state.server);
  const { confirm } = useConfirmation();

  useEffect(() => {
    if (store.success) {
      showSuccessToast(constants.toast.SUCCESS_SAVE)
      router.push(constants.path.SERVER)
    } else if (store.error) {
      showErrorToast(store.error)
    }
  }, [store.loading])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    confirm({
      message: constants.confirmation.SAVE,
      onConfirm: () => {
        doSave(data)
      },
    });
  };

  const doSave = (data: any) => {
    showSuccessToast(constants.toast.SUCCESS_SAVE);
    router.push(constants.path.SERVER);
  }

  return (
    <div>
      <Card className="px-1">
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <div className={form()}>
              <div className={inputContainer()}>
                <AppTextInput
                  isRequired
                  key='server_name'
                  name='server_name'
                  label='Name'
                />
                <AppTextInput
                  isRequired
                  key='server_host'
                  name='server_host'
                  label='Host'
                />
                <AppTextarea
                  isRequired
                  key='description'
                  name='description'
                  label='Description'
                />
              </div>

              <div className={actionButtons()}>
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
