import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Upload", href: "/upload" },
    { label: "Analytics", href: "/analytics" },
    { label: "Reports", href: "/reports" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Research Papers", href: "#research" },
    { label: "Case Studies", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/[0.06] bg-navy-950/40">
      <div className="section-pad py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-xs leading-relaxed">
              AI-powered MRI enhancement and ROI segmentation for clinical decision support.
              Built for radiologists, validated by research.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Mail, Github, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-sm font-semibold text-white mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) =>
                  link.href.startsWith("/") ? (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © 2024 MedhaDrishti AI. All rights reserved. CE-Class IIa medical device software.
          </p>
          <p className="text-xs text-slate-500">
            Built with PyTorch · Vision Transformers · UNet · Grad-CAM
          </p>
        </div>
      </div>
    </footer>
  );
}
