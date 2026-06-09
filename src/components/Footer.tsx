import { Github, Globe, Activity, ArrowUpRight } from 'lucide-react';

interface FooterLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const FooterLink = ({ href, icon, label }: FooterLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-2 text-sm text-[#737373] hover:text-white transition-colors duration-200 cursor-pointer"
  >
    <span className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
      {icon}
    </span>
    <span>{label}</span>
    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-60 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
  </a>
);

export const Footer = () => {
  return (
    <footer className="relative z-10 mt-auto border-t border-[#1e1e1e] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <Activity className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">HealthAI</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 sm:gap-6" aria-label="Footer links">
            <FooterLink
              href="https://github.com/alibuildswebsites-ux/patient-health-risk-predictor"
              icon={<Github className="h-full w-full" strokeWidth={1.5} />}
              label="GitHub"
            />
            <FooterLink
              href="https://alibuildswebsites.me"
              icon={<Globe className="h-full w-full" strokeWidth={1.5} />}
              label="alibuildswebsites.me"
            />
          </nav>

          {/* Copyright */}
          <p className="text-xs text-[#525252] font-mono">
            &copy; {new Date().getFullYear()} HealthAI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
