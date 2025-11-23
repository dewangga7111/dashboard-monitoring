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
        <span className={title()}>Dashboard&nbsp;</span>
        <span className={title({ color: "yellow" })}>Monitoring&nbsp;</span>
        <br />
        <span className={title()}>
          for your network infrastructure.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Monitor your network devices, detect anomalies, and visualize traffic patterns in real-time.
        </div>
      </div>
    </section>
  );
}
