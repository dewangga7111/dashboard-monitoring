"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AppTextInput from "./app-text-input";
import { InputProps } from "@heroui/react";

export default function AppTextInputPassword(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <AppTextInput
      {...props}
      type={isVisible ? "text" : "password"}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-solid outline-transparent"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeOff className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <Eye className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
    />
  );
}
