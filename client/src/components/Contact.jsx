import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { contactAPI } from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.create(formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus("Failed to send message");
    }
  };

  return (
    <section 
      id="contact" 
      className="relative section-padding overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FAF8F5 0%, #EFE9E4 100%)" }}
    >
      <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        {/* Section Header */}
        <div ref={ref} className="text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6 sm:mb-8"
          >
            <span className="block w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#C56A45]/30 to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#6B5F5A" }}>
              Get in Touch
            </span>
            <span className="block w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#C56A45]/30 to-transparent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[clamp(1.85rem,4.5vw,3.25rem)] font-light tracking-tight mb-4 sm:mb-5"
            style={{ color: "#1A1614", letterSpacing: "-0.02em" }}
          >
            Let's Start a
            <br />
            Conversation
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                  style={{ border: "1px solid rgba(107, 95, 90, 0.1)", outline: "none", color: "#1A1614" }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                  style={{ border: "1px solid rgba(107, 95, 90, 0.1)", outline: "none", color: "#1A1614" }}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                style={{ border: "1px solid rgba(107, 95, 90, 0.1)", outline: "none", color: "#1A1614" }}
              />
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                style={{ border: "1px solid rgba(107, 95, 90, 0.1)", outline: "none", color: "#1A1614" }}
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows="5"
                className="w-full px-5 py-3.5 rounded-2xl glass text-sm resize-none transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                style={{ border: "1px solid rgba(107, 95, 90, 0.1)", outline: "none", color: "#1A1614" }}
              />
              {status && (
                <p className="text-sm text-center" style={{ color: status.includes("success") ? "#73856D" : "#C56A45" }}>
                  {status}
                </p>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-full text-sm font-medium text-white transition-smooth"
                style={{ background: "linear-gradient(135deg, #C56A45, #B85A38)", boxShadow: "0 8px 24px rgba(197, 106, 69, 0.25)" }}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Google Map */}
            <a
              href="https://maps.app.goo.gl/imgeZUAyfEzAg2DV7"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-strong soft-shadow-lg rounded-[28px] overflow-hidden h-56 block transition-smooth hover:scale-[1.02]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.8574288!2d77.56396!3d11.36456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f9c9c9c9c9d%3A0x1234567890abcdef!2sMidhun%20Apartment!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Studio Y7 Location"
              />
            </a>

            {/* Contact Details */}
            <div className="glass-strong soft-shadow-lg rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 space-y-4 sm:space-y-5">
              {[
                { icon: FaPhone, label: "Phone", value: "+91 99763 56377", link: "tel:+919976356377" },
                { icon: FaEnvelope, label: "Email", value: "studioy7@gmail.com", link: "mailto:studioy7@gmail.com" },
                { icon: FaMapMarkerAlt, label: "Location", value: "Midhun Apartment, Opposite V School, Valaraigate, Suriyampalayam, Tiruchengode – 637209, Tamil Nadu" },
                { icon: FaClock, label: "Hours", value: "Mon - Sat: 10AM - 6PM" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3.5 sm:gap-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(197, 106, 69, 0.1), rgba(197, 106, 69, 0.05))" }}>
                    <item.icon className="text-base sm:text-lg" style={{ color: "#C56A45" }} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-medium mb-1" style={{ color: "#6B5F5A" }}>
                      {item.label}
                    </h4>
                    {item.link ? (
                      <a href={item.link} className="text-xs sm:text-sm hover:text-[#C56A45] transition-smooth break-words" style={{ color: "#1A1614" }}>
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#1A1614" }}>{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex gap-3 sm:gap-4"
            >
              {[
                { icon: FaWhatsapp, link: "https://wa.me/919976356377", color: "#25D366" },
                { icon: FaInstagram, link: "https://www.instagram.com/studio_y7?igsh=MXdoMGozbWgxOTBzdg==", color: "#E4405F" },
                { icon: FaEnvelope, link: "mailto:studioy7@gmail.com", color: "#C56A45" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass-strong flex items-center justify-center transition-smooth"
                >
                  <social.icon className="text-lg sm:text-xl" style={{ color: social.color }} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
