"use client";

import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import AppTextInput from "@/components/common/app-text-input";
import { Button, Card, CardBody, Form, Image, Checkbox } from "@heroui/react";
import Footer from "@/components/footer";
import logo from "@/assets/images/logo.png"
import server from "@/assets/images/server.jpg"
import AppTextInputPassword from "@/components/common/app-text-input-password";
import { showSuccessToast, showErrorToast } from "@/utils/common";
import { isMobile } from "react-device-detect";
import constants from "@/utils/constants";
import { login } from "@/redux/api/auth-api";
import { Permission } from "@/types/permission";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const getFirstAccessibleRoute = (permissions: Permission[]) => {
    for (const route of constants.menuRoutes) {
      const perm = permissions.find(p => p.function_id === route.functionId);
      if (perm && (perm as any)[constants.permission.READ] === 'Y') {
        return route.path;
      }
    }
    return constants.path.UNAUTHORIZED;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    setIsLoading(true);
    try {
      const response = await login({
        user_id: formData.user_id as string,
        password: formData.password as string,
        remember_me: rememberMe,
        recaptcha_token: "", // Add recaptcha if needed
      });

      showSuccessToast(constants.toast.SUCCESS_LOGIN);

      // Get first accessible route based on permissions
      const firstRoute = getFirstAccessibleRoute(response.data.permissions);

      // Use window.location.href for a full page reload to ensure contexts are fresh
      window.location.href = firstRoute;
    } catch (error: any) {
      showErrorToast(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const form = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <AppTextInput
          isRequired
          key='user_id'
          name='user_id'
          label='Username'
          isDisabled={isLoading}
        />
        <AppTextInputPassword
          isRequired
          key='password'
          name='password'
          label='Password'
          isDisabled={isLoading}
        />
        <Checkbox
          isSelected={rememberMe}
          onValueChange={setRememberMe}
          className="mt-4"
          isDisabled={isLoading}
        >
          Remember me
        </Checkbox>
        <Button
          type="submit"
          color="primary"
          className="w-full mt-5"
          startContent={<LogIn size={15} />}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Login
        </Button>
      </Form>
    )
  }

  if (!mounted) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col justify-between px-5 h-full">
        <Image src={logo.src} alt="Logo" width={100} />
        <div className="w-full">
          <div className="flex flex-col mb-12">
            <span className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary-300">Welcome Back</span>
            <span className="text-sm text-default-600 mt-3">Enter your email and password to access your account</span>
          </div>
          {form()}
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[70%] h-[85%] shadow-2xl">
        <CardBody className="grid grid-cols-2 p-0 h-full">
          <div className="w-full h-full bg-[url('@/assets/images/server.jpg')] bg-cover bg-center rounded-l-xl">
            <div className="absolute left-3 top-3">
              <Image src={logo.src} alt="Logo" width={180} />
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="w-full py-5 px-15 flex-grow flex flex-col justify-center">
              <div className="flex flex-col justify-center items-start mb-12">
                <span className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary-300">Welcome Back</span>
                <span className="text-sm text-default-600 mt-3">Enter your email and password to access your account</span>
              </div>
              {form()}
            </div>
            <Footer />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
