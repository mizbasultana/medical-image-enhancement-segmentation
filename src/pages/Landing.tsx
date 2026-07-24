import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Workflow } from "@/components/landing/Workflow";
import { Technology } from "@/components/landing/Technology";
import { Research } from "@/components/landing/Research";
import { Footer } from "@/components/landing/Footer";

export function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Technology />
        <Research />
      </main>
      <Footer />
    </div>
  );
}
