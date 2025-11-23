"use client";

import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import AppTextInput from "@/components/common/app-text-input";
import { Button, Card, CardBody, Form, Image } from "@heroui/react";
import Footer from "@/components/footer";
import logo from "@/assets/images/logo.png"
import AppTextInputPassword from "@/components/common/app-text-input-password";
import { showSuccessToast } from "@/utils/common";
import { isMobile } from "react-device-detect";
import constants from "@/utils/constants";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    showSuccessToast(constants.toast.SUCCESS_LOGIN)
    router.push("/")
  };

  const form = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <AppTextInput
          isRequired
          key='email'
          name='email'
          label='Email'
          type="email"
        />
        <AppTextInputPassword
          isRequired
          key='password'
          name='password'
          label='Password'
        />
        <Button
          type="submit"
          color="primary"
          className="w-full mt-5"
          startContent={<LogIn size={15} />}
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
        <Image src={logo.src} alt="Logo" height={70} />
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
          <div className="w-full h-full bg-[url('https://heroui.com/images/hero-card-complete.jpeg')] bg-cover bg-center rounded-l-xl">
            <div className="absolute left-3 top-3">
              <Image src={logo.src} alt="Logo" height={70} />
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
