import { Textarea, extendVariants } from "@heroui/react";

const AppTextarea = extendVariants(Textarea, {
  defaultVariants: {
    labelPlacement: "outside",
    size: "sm",
  },
});

export default AppTextarea;