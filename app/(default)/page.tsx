import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { Card, CardBody } from "@heroui/card";
import { button as buttonStyles } from "@heroui/theme";
import { Palette, Shield, Github } from "lucide-react";

import { title, subtitle } from "@/utils/primitives";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* Hero Section */}
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "yellow" })}>beautiful&nbsp;</span>
        <br />
        <span className={title()}>
          websites regardless of your design experience.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library. awdas
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
        >
          <Github size={20} />
          GitHub
        </Link>
      </div>

      {/* Snippet */}
      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>

      {/* New Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl px-4">
        <Card shadow="sm" className="rounded-2xl">
          <CardBody className="flex flex-col items-center text-center p-6">
            <h3 className="font-semibold text-lg mb-2">Fast & Responsive</h3>
            <p className="text-default-500 text-sm">
              Optimized for performance with built-in responsive design.
            </p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="rounded-2xl">
          <CardBody className="flex flex-col items-center text-center p-6">
            <Palette className="text-violet-500 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Beautiful UI</h3>
            <p className="text-default-500 text-sm">
              Pre-styled components and theming to match your brand.
            </p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="rounded-2xl">
          <CardBody className="flex flex-col items-center text-center p-6">
            <Shield className="text-success mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Secure by Default</h3>
            <p className="text-default-500 text-sm">
              Built with best practices to keep your app safe.
            </p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
