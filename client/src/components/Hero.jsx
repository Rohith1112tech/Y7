import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroAPI } from "../services/api";
import { getOptimizedImageUrl } from "../services/cloudinaryUpload";
import couple from "../assets/images/couple.jpg";

export default function Hero() {
  const [heroImage, setHeroImage] = useState(couple);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    heroAPI.get()
      .then(res => {
        if (!isMounted) return;
        const data = res?.data !== undefined ? res.data : res;
        if (data?.imageUrl) {
          setHeroImage(data.imageUrl);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-[#2C2826]"
    >
      {/* Left Side - Text Content with Dark Background */}
      <motion.div
        style={{ y: contentY, opacity, background: "#2C2826" }}
        className="relative z-20 w-full lg:w-[45%] lg:h-full flex items-center justify-center px-5 sm:px-10 lg:px-16 xl:px-20 pt-28 pb-16 sm:py-20"
      >
        <div className="max-w-lg w-full">
          {/* Pre-label */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 sm:mb-8 lg:mb-10 flex items-center gap-4"
          >
            <span className="block w-10 sm:w-12 h-[1px]" style={{ background: "#C56A45" }} />
            <span
              className="text-[9px] tracking-[0.4em] uppercase font-semibold"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              STUDIO Y7
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mb-4 sm:mb-7"
            style={{ 
              color: "#FFFFFF",
              fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.01em"
            }}
          >
            Where Every Moment
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#D17A56" }}>Becomes Timeless</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] sm:text-[15px] mb-6 sm:mb-10 lg:mb-12 leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Premium photography for weddings, portraits,
            <br className="hidden sm:inline" />
            {" "}and life's most meaningful celebrations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <motion.button
              onClick={() => document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-[13px] font-medium text-white transition-all duration-300 cursor-pointer shadow-md"
              style={{
                background: "#C56A45",
                letterSpacing: "0.02em"
              }}
            >
              Explore Our Work
            </motion.button>

            <motion.button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ y: -2, scale: 1.02, borderColor: "rgba(255,255,255,0.6)" }}
              whileTap={{ scale: 0.98 }}
              className="px-5 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-300 cursor-pointer"
              style={{
                color: "#FFFFFF",
                border: "1.5px solid rgba(255,255,255,0.35)",
                letterSpacing: "0.02em"
              }}
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Hero Image */}
      <motion.div 
        style={{ y: imageY }} 
        className="absolute lg:relative right-0 top-0 w-full lg:w-[55%] h-full lg:h-full z-10 opacity-25 lg:opacity-100 overflow-hidden"
      >
        <div className="w-full h-full relative">
          <img
            src={getOptimizedImageUrl(heroImage, { width: 2560, quality: 'auto:best' })}
            alt="Studio Y7 Photography"
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: "center center"
            }}
            loading="eager"
          />
          
          {/* Gradient blend on mobile */}
          <div
            className="absolute inset-0 lg:hidden pointer-events-none"
            style={{
              background: "linear-gradient(to right, #2C2826 0%, rgba(44,40,38,0.8) 30%, transparent 70%)",
            }}
          />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="hidden sm:flex absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2.5 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
        <span
          className="text-[8px] uppercase tracking-[0.35em] font-medium"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          SCROLL TO EXPLORE
        </span>
      </motion.div>
    </section>
  );
}
