import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaEnvelope, FaArrowUp } from "react-icons/fa";
import logo from "../assets/images/logo-white.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: "#1A1614", color: "#FAF8F5" }}>
      {/* Main Footer */}
      <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              src={logo}
              alt="Studio Y7"
              className="h-10 sm:h-11 w-auto object-contain mb-5"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-sm leading-[1.7] mb-6 max-w-md"
              style={{ color: "#6B5F5A" }}
            >
              Capturing real stories and timeless memories through premium photography. Based in Tiruchengode, Tamil Nadu, serving weddings, portraits, birthdays, outdoor shoots, baby shoots, corporate events, cinematic reels, and special occasions.
            </motion.p>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex gap-3"
            >
              {[
                { icon: FaWhatsapp, link: "https://wa.me/919976356377", label: "WhatsApp" },
                { icon: FaInstagram, link: "https://www.instagram.com/studio_y7?igsh=MXdoMGozbWgxOTBzdg==", label: "Instagram" },
                { icon: FaEnvelope, link: "mailto:studioy7@gmail.com", label: "Email" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-smooth"
                  style={{ background: "rgba(250, 248, 245, 0.05)" }}
                >
                  <social.icon className="text-lg" style={{ color: "#FAF8F5" }} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="text-[13px] font-medium mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Portfolio", href: "#portfolio" },
                { label: "Pricing", href: "#pricing" },
              ].map((link, i) => (
                <li key={i}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    whileHover={{ x: 3 }}
                    className="text-[13px] transition-colors inline-block"
                    style={{ color: "#6B5F5A" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FAF8F5")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6B5F5A")}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h4 className="text-[13px] font-medium mb-5 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5 text-[13px]" style={{ color: "#6B5F5A" }}>
              <li>
                <a href="tel:+919976356377" className="hover:text-[#FAF8F5] transition-colors">
                  +91 99763 56377
                </a>
              </li>
              <li>
                <a href="mailto:studioy7@gmail.com" className="hover:text-[#FAF8F5] transition-colors">
                  studioy7@gmail.com
                </a>
              </li>
              <li>Midhun Apartment, Opposite V School</li>
              <li>Valaraigate, Suriyampalayam</li>
              <li>Tiruchengode - 637209, Tamil Nadu</li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-6" style={{ background: "rgba(250, 248, 245, 0.1)" }} />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs"
            style={{ color: "#6B5F5A" }}
          >
            © 2024 Studio Y7. All rights reserved.
          </motion.p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-smooth"
            style={{ background: "rgba(250, 248, 245, 0.05)" }}
          >
            <FaArrowUp style={{ color: "#FAF8F5" }} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
