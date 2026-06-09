import { Github, Activity, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative z-10 mt-auto border-t border-[#1e1e1e] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col items-center gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <Activity className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">HealthAI</span>
          </div>

          {/* Links — stacked vertically */}
          <nav className="flex flex-col items-center gap-3" aria-label="Footer links">
            <a
              href="https://alibuildswebsites.me"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-[#737373] hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <span className="text-sm transition-colors duration-200 group-hover:text-white">Built by alibuildswebsites</span>
              <ArrowUpRight className="h-3 w-3 text-[#525252] group-hover:text-white transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://github.com/alibuildswebsites-ux/patient-health-risk-predictor"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-[#737373] hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <Github className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              <span>GitHub</span>
              <ArrowUpRight className="h-3 w-3 text-[#525252] group-hover:text-white transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100" />
            </a>
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
