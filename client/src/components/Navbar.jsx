import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/logo.png";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const scrollTo = (href, cb) => {
  cb?.();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "top-3 sm:top-4" : "top-4 sm:top-8"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <nav
            className={`glass-strong soft-shadow-lg transition-all duration-500 ${scrolled ? "py-2 sm:py-2.5 md:py-3" : "py-3 sm:py-3.5 md:py-4"}`}
            style={{ borderRadius: "24px", border: "1px solid rgba(107, 95, 90, 0.08)" }}
          >
            <div className="flex items-center justify-between px-3 sm:px-6">
              {/* Logo */}
              <motion.a
                href="#hero"
                onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 cursor-pointer"
              >
                <img src={logo} alt="Studio Y7" className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-500" />
              </motion.a>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.3, duration: 0.6 }}
                    whileHover={{ y: -3 }}
                    className="relative px-5 py-2.5 text-sm font-medium transition-colors duration-300 group cursor-pointer"
                    style={{ color: "#6B5F5A" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C56A45")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6B5F5A")}
                  >
                    {link.label}
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#C56A45] to-[#B85A38] group-hover:w-2/3 transition-all duration-500" />
                  </motion.button>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => scrollTo("#booking")}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ y: -3, scale: 1.04, boxShadow: "0 6px 24px rgba(197, 106, 69, 0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="hidden md:flex items-center px-7 py-2.5 rounded-full text-sm font-medium text-white cursor-pointer transition-smooth"
                style={{
                  background: "linear-gradient(135deg, #C56A45, #B85A38)",
                  boxShadow: "0 4px 16px rgba(197, 106, 69, 0.25)",
                }}
              >
                Book Session
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-pointer"
                aria-label="Toggle menu"
              >
                <motion.span
                  animate={menuOpen 
                    ? { rotate: 45, y: 6, backgroundColor: "#C56A45" }
                    : { rotate: 0, y: 0, backgroundColor: "#1A1614" }
                  }
                  transition={{ duration: 0.3 }}
                  className="block w-6 h-0.5 origin-center"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block w-6 h-0.5"
                  style={{ backgroundColor: "#1A1614" }}
                />
                <motion.span
                  animate={menuOpen 
                    ? { rotate: -45, y: -6, backgroundColor: "#C56A45" }
                    : { rotate: 0, y: 0, backgroundColor: "#1A1614" }
                  }
                  transition={{ duration: 0.3 }}
                  className="block w-6 h-0.5 origin-center"
                />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden overflow-y-auto"
          >
            <div
              className="fixed inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(250, 248, 245, 0.98), rgba(245, 242, 238, 0.98))",
                backdropFilter: "blur(32px)",
              }}
            />

            <div className="relative min-h-full flex flex-col items-center justify-center gap-2 px-6 py-16">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollTo(link.href, () => setMenuOpen(false))}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.95 }}
                  className="font-display text-3xl sm:text-4xl md:text-5xl font-light cursor-pointer transition-colors duration-300 py-1"
                  style={{ color: "#1A1614" }}
                  onTouchStart={(e) => (e.currentTarget.style.color = "#C56A45")}
                  onTouchEnd={(e) => (e.currentTarget.style.color = "#1A1614")}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.button
                onClick={() => scrollTo("#booking", () => setMenuOpen(false))}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-10 py-3.5 rounded-full text-sm font-medium text-white cursor-pointer shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #C56A45, #B85A38)",
                  boxShadow: "0 8px 32px rgba(197, 106, 69, 0.3)",
                }}
              >
                Book a Session
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
