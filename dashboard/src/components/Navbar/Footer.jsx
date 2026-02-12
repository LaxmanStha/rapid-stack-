import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-15 mb-5">
          
          {/* Brand - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex flex-row items-center gap-2 mb-3">
              <img src="src/assets/logo (1).png" className="w-10 h-10 sm:w-15 sm:h-15" />
              <h2 className="text-yellow-100 text-lg sm:text-xl font-semibold tracking-tight flex flex-col">
                <span className="text-green-500 text-xl sm:text-2xl">Eco-Vital</span>
                HealthCare
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-500 max-w-xs">
              Building digital products with clarity and purpose.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-zinc-200 text-sm font-medium mb-3 sm:mb-4">Product</h3>
            <ul className="space-y-1">
              {['Features', 'Pricing', 'Changelog', 'Docs'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs sm:text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-zinc-200 text-sm font-medium mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-1">
              {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs sm:text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-zinc-200 text-sm font-medium mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-1">
              {['Privacy', 'Terms', 'Security'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs sm:text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800/60 mb-4" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-zinc-600 text-center sm:text-left">
            © {new Date().getFullYear()} RapidStack. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {/* GitHub */}
            <a href="https://github.com/ratish-hmg" className="text-zinc-500 hover:text-white transition-colors duration-200" aria-label="GitHub">
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" className="text-zinc-500 hover:text-white transition-colors duration-200" aria-label="X">
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-zinc-500 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;