import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { pricingAPI } from "../services/api";

// Default packages as fallback
const DEFAULT_PACKAGES = [
  { 
    name: "Starter Package", 
    price: "Contact for pricing", 
    description: "",
    features: ["Package details", "Will be added", "Very soon"],
    recommended: false
  },
  { 
    name: "Premium Package", 
    price: "Contact for pricing", 
    description: "",
    features: ["Package details", "Will be added", "Very soon"],
    recommended: true
  },
  { 
    name: "Luxury Package", 
    price: "Contact for pricing", 
    description: "",
    features: ["Package details", "Will be added", "Very soon"],
    recommended: false
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPricing = useCallback(async () => {
    try {
      const res = await pricingAPI.getAll();
      const rawData = res?.data !== undefined ? res.data : res;
      let pkgList = [];
      if (Array.isArray(rawData)) {
        pkgList = rawData;
      } else if (rawData && typeof rawData === 'object') {
        pkgList = rawData.packages || rawData.pricing || rawData.items || rawData.data || [];
      }
      if (Array.isArray(pkgList) && pkgList.length > 0) {
        setPackages(pkgList);
      } else {
        setPackages(DEFAULT_PACKAGES);
      }
    } catch (error) {
      console.log('Using fallback pricing', error);
      setPackages(DEFAULT_PACKAGES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchPricing, 15000);
    
    return () => clearInterval(interval);
  }, [fetchPricing]);

  return (
    <section 
      id="pricing" 
      className="relative section-padding overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F5F2EE 0%, #EFE9E4 50%, #FAF8F5 100%)" }}
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
              Pricing
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
            Investment in Memories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base max-w-2xl mx-auto leading-[1.7]"
            style={{ color: "#6B5F5A" }}
          >
            Tailored packages to suit every celebration. Get in touch for detailed pricing.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-14 max-w-6xl mx-auto">
          {loading ? (
            [0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="glass-strong soft-shadow-lg rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 md:p-8 min-h-[420px] skeleton"
              />
            ))
          ) : (
            packages.map((pkg, i) => (
              <motion.div
                key={pkg._id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative glass-strong soft-shadow-lg rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 md:p-8 transition-smooth ${
                  pkg.recommended ? 'ring-2 ring-[#C56A45]/30' : ''
                }`}
              >
                {pkg.recommended && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-xs font-medium text-white"
                    style={{ background: "linear-gradient(135deg, #C56A45, #B85A38)" }}
                  >
                    Most Popular
                  </motion.div>
                )}

                <div className="text-center mb-7">
                  <h3 className="font-display text-[22px] font-light mb-3" style={{ color: "#1A1614", letterSpacing: "-0.01em" }}>
                    {pkg.name}
                  </h3>
                  <div className="font-display text-[17px] font-light" style={{ color: "#C56A45" }}>
                    {pkg.price}
                  </div>
                  {pkg.description && (
                    <p className="text-xs mt-2" style={{ color: "#6B5F5A" }}>{pkg.description}</p>
                  )}
                </div>

                <ul className="space-y-4 mb-10">
                  {pkg.features && pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "#6B5F5A" }}>
                      <FiCheck className="text-[#C56A45] mt-0.5 flex-shrink-0" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full py-4 rounded-full text-sm font-medium transition-smooth"
                  style={{
                    background: pkg.recommended 
                      ? "linear-gradient(135deg, #C56A45, #B85A38)" 
                      : "transparent",
                    color: pkg.recommended ? "#FFF" : "#C56A45",
                    border: pkg.recommended ? "none" : "1px solid rgba(197, 106, 69, 0.3)"
                  }}
                >
                  Get in Touch
                </motion.button>
              </motion.div>
            ))
          )}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center glass rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <p className="text-sm leading-relaxed" style={{ color: "#6B5F5A" }}>
            Every wedding and event is unique. Our packages are fully customizable to meet your specific needs. 
            Contact us for a detailed quote tailored to your celebration.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
