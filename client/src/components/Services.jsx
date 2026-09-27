import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FiArrowUpRight, FiX, FiCheck, FiChevronRight } from "react-icons/fi";
import { serviceAPI } from "../services/api";
import { useBookingStore } from "../services/store";
import { getOptimizedImageUrl } from "../services/cloudinaryUpload";

import weddingImg from "../assets/images/wedding.jpg";
import wedding2Img from "../assets/images/wedding2.jpg";
import coupleImg from "../assets/images/couple.jpg";
import portraitImg from "../assets/images/portrait1.jpg";
import outdoorImg from "../assets/images/outdoor.jpg";
import corporateImg from "../assets/images/corporate.jpg";
import cinematicImg from "../assets/images/cinematic.jpg";
import portrait2Img from "../assets/images/portrait2.jpg";

const DEFAULT_SERVICES = [
  { 
    _id: "default-1",
    title: "Wedding Photography", 
    imageUrl: weddingImg,
    description: "Capturing love stories with timeless elegance, sacred rituals, and candid emotion in high definition.",
    packages: [
      { name: "Mini", price: "₹35,000", description: "Half-day coverage, 150 edited high-res photos & online gallery" },
      { name: "Premium", price: "₹65,000", description: "Full-day ceremony & reception, 350+ edited photos, cinematic teaser" },
      { name: "Luxury", price: "₹1,10,000", description: "Complete multi-day coverage, premium leather album, drone shots & 4K film" }
    ]
  },
  { 
    _id: "default-2",
    title: "Traditional Wedding", 
    imageUrl: wedding2Img,
    description: "Vibrant traditions and sacred wedding ceremonies documented with cultural grandeur and authentic warmth.",
    packages: [
      { name: "Mini", price: "₹30,000", description: "Essential traditional rituals coverage with 120 edited photos" },
      { name: "Premium", price: "₹55,000", description: "Full ceremony documentation, candid moments & family portraiture" },
      { name: "Luxury", price: "₹95,000", description: "Complete ritual suite, candid master album & heirloom photobook" }
    ]
  },
  { 
    _id: "default-3",
    title: "Couple Shoot", 
    imageUrl: coupleImg,
    description: "Intimate and authentic romantic moments captured in breathtaking natural and curated studio settings.",
    packages: [
      { name: "Mini", price: "₹12,000", description: "1-2 hours outdoor session, 25 high-resolution retouched photos" },
      { name: "Premium", price: "₹20,000", description: "Half-day scenic shoot, 2 outfit changes, 60 retouched photos & 1 reel" },
      { name: "Luxury", price: "₹30,000", description: "Full-day multi-location experience, 3 outfits, 120 photos & 4K video reel" }
    ]
  },
  { 
    _id: "default-4",
    title: "Portrait Photography", 
    imageUrl: portraitImg,
    description: "Editorial & studio portraits tailored with artistic lighting, precise composition, and personal expression.",
    packages: [
      { name: "Mini", price: "₹8,000", description: "1-hour studio session, 15 magazine-grade retouched photos" },
      { name: "Premium", price: "₹15,000", description: "2-hour studio & outdoor shoot, 35 retouched photos & creative lighting" },
      { name: "Luxury", price: "₹25,000", description: "Full editorial session, styling assistance, 75 retouched photos & print prints" }
    ]
  },
  { 
    _id: "default-5",
    title: "Outdoor Photography", 
    imageUrl: outdoorImg,
    description: "Natural light photography in scenic locations that bring life, golden warmth, and serenity to your memories.",
    packages: [
      { name: "Mini", price: "₹10,000", description: "90-minute golden hour shoot, 25 curated photos" },
      { name: "Premium", price: "₹18,000", description: "Half-day destination session, 60 color-graded photos" },
      { name: "Luxury", price: "₹28,000", description: "Full-day landscape session, drone views, 100+ photos & social clips" }
    ]
  },
  { 
    _id: "default-6",
    title: "Corporate Events", 
    imageUrl: corporateImg,
    description: "Professional coverage for company milestones, executive summits, keynote speeches, and corporate gatherings.",
    packages: [
      { name: "Mini", price: "₹15,000", description: "Up to 3 hours coverage, high-res digital gallery for press/web" },
      { name: "Premium", price: "₹28,000", description: "Full-day event coverage, rapid same-day highlights delivery" },
      { name: "Luxury", price: "₹50,000", description: "Multi-photographer team, live highlights, executive portraits & full gallery" }
    ]
  },
  { 
    _id: "default-7",
    title: "Birthday Shoot", 
    imageUrl: portrait2Img,
    description: "Memorable celebration and milestone captures full of authentic joy, spontaneous laughter, and family warmth.",
    packages: [
      { name: "Mini", price: "₹8,000", description: "2 hours party coverage & 40 edited memories" },
      { name: "Premium", price: "₹15,000", description: "Full event coverage, candid guest portraits & cake-cutting highlights" },
      { name: "Luxury", price: "₹25,000", description: "Complete celebration package, customized photobook & video highlight" }
    ]
  },
  { 
    _id: "default-8",
    title: "Cinematic Reels", 
    imageUrl: cinematicImg,
    description: "Stunning cinematic visuals, 4K motion portraits, and high-impact social media reels designed to captivate.",
    packages: [
      { name: "Mini", price: "₹12,000", description: "1 polished 4K reel (30-60s) with sound design & color grading" },
      { name: "Premium", price: "₹22,000", description: "3 high-impact reels with creative transitions & viral-ready framing" },
      { name: "Luxury", price: "₹38,000", description: "Full cinematic story suite (5 reels + 2-min 4K film) with drone" }
    ]
  },
];

function ServiceDetailModal({ service, onClose, onBook }) {
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    // If service has packages, default select the first or middle one if desired
    if (service?.packages && service.packages.length > 0) {
      setSelectedPkg(service.packages[0]);
    } else {
      setSelectedPkg(null);
    }
  }, [service]);

  if (!service) return null;
  const imgSrc = service.imageUrl || service.image;
  const packages = Array.isArray(service.packages) ? service.packages : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(26, 22, 20, 0.82)",
          backdropFilter: "blur(20px)",
        }}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] max-h-[90dvh] flex flex-col rounded-[24px] sm:rounded-[28px] overflow-hidden soft-shadow-lg"
        style={{
          background: "linear-gradient(180deg, #FAF8F5 0%, #F5F2EE 100%)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
        }}
      >
        {/* Close Button */}
        <motion.button
          type="button"
          aria-label="Close service details"
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md"
          style={{ background: "rgba(255, 255, 255, 0.92)", backdropFilter: "blur(8px)" }}
        >
          <FiX className="text-lg text-[#1A1614]" />
        </motion.button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Large Service Image */}
          <div className="relative w-full h-44 sm:h-64 md:h-80 overflow-hidden">
            <img
              src={typeof imgSrc === 'string' && imgSrc.includes('http') ? getOptimizedImageUrl(imgSrc, { width: 1600, quality: 'auto:best' }) : imgSrc}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(26,22,20,0.7) 0%, rgba(26,22,20,0.2) 50%, transparent 100%)",
              }}
            />
            <div className="absolute bottom-3.5 left-4 sm:bottom-4 sm:left-7">
              <span
                className="inline-block text-[10px] sm:text-[11px] font-semibold px-3 sm:px-3.5 py-1 rounded-full text-white uppercase tracking-wider shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #C56A45, #B85A38)",
                }}
              >
                Studio Y7 Photography
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-4 sm:p-7 md:p-9 space-y-5 sm:space-y-6">
            {/* Title and Full Description */}
            <div>
              <h2
                className="font-display text-xl sm:text-3xl md:text-4xl font-light tracking-tight text-[#1A1614] mb-2 sm:mb-3"
                style={{ letterSpacing: "-0.02em" }}
              >
                {service.title}
              </h2>
              <p className="text-xs sm:text-base leading-[1.75] text-[#6B5F5A]">
                {service.description || "Comprehensive luxury photography tailored with elegance, authenticity, and editorial style to capture your life's most precious celebrations."}
              </p>
            </div>

            {/* Packages Section */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#6B5F5A]">
                  Available Packages
                </h3>
                {packages.length > 0 && (
                  <span className="text-[11px] text-[#C56A45] font-medium">
                    {packages.length} package options
                  </span>
                )}
              </div>

              {packages.length > 0 ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  {packages.map((pkg, idx) => {
                    const isSelected = selectedPkg?.name === pkg.name;
                    return (
                      <motion.div
                        key={pkg._id || idx}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between ${
                          isSelected 
                            ? "bg-white shadow-md border-[#C56A45]" 
                            : "bg-white/60 hover:bg-white/90 border-black/5"
                        }`}
                        style={{
                          boxShadow: isSelected ? "0 4px 20px rgba(197, 106, 69, 0.15)" : "none"
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-semibold text-sm text-[#1A1614]">{pkg.name}</h4>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                              isSelected ? "border-[#C56A45] bg-[#C56A45] text-white" : "border-gray-300"
                            }`}>
                              {isSelected && <FiCheck className="text-[10px]" />}
                            </div>
                          </div>
                          <p className="font-semibold text-base sm:text-lg text-[#C56A45] mb-2">
                            {pkg.price.startsWith('₹') ? pkg.price : `₹${pkg.price}`}
                          </p>
                        </div>
                        {pkg.description ? (
                          <p className="text-[11px] leading-relaxed text-[#6B5F5A] mt-1 line-clamp-3">
                            {pkg.description}
                          </p>
                        ) : (
                          <p className="text-[11px] text-[#6B5F5A]/60 italic mt-1">
                            Standard coverage tailored to service
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/70 border border-black/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6B5F5A] font-semibold">Pricing</p>
                    <p className="text-sm font-medium text-[#1A1614]">Custom Package Available</p>
                  </div>
                  <span className="text-xs font-semibold text-[#C56A45]">Contact us for pricing</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <motion.button
                type="button"
                onClick={() => onBook(service, selectedPkg)}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex-1 py-4 px-8 rounded-full text-sm font-semibold text-white cursor-pointer transition-smooth text-center flex items-center justify-center gap-2 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #C56A45, #B85A38)",
                  boxShadow: "0 8px 24px rgba(197, 106, 69, 0.3)",
                }}
              >
                <span>Book This Service</span>
                <FiChevronRight className="text-base" />
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto py-4 px-7 rounded-full text-sm font-medium text-[#6B5F5A] bg-black/5 hover:bg-black/10 hover:text-[#1A1614] transition-colors cursor-pointer text-center"
              >
                Close Details
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const selectServiceAndPackage = useBookingStore((state) => state.selectServiceAndPackage);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const fetchServices = useCallback(async () => {
    try {
      const res = await serviceAPI.getAll();
      const rawData = res?.data !== undefined ? res.data : res;
      let list = [];
      if (Array.isArray(rawData)) {
        list = rawData;
      } else if (rawData && typeof rawData === 'object') {
        list = rawData.services || rawData.items || rawData.data || [];
      }

      if (Array.isArray(list) && list.length > 0) {
        setServices(list);
      } else {
        setServices(DEFAULT_SERVICES);
      }
    } catch (err) {
      console.log('Using default services:', err);
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 15000);
    return () => clearInterval(interval);
  }, [fetchServices]);

  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  const handleServiceCardClick = (service) => {
    setSelectedService(service);
  };

  const handleBookSession = (service, pkg) => {
    selectServiceAndPackage(service, pkg);
    setSelectedService(null);
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <>
      <section 
        id="services" 
        className="relative section-padding overflow-hidden"
        style={{ background: "linear-gradient(180deg, #F5F2EE 0%, #FAF8F5 50%, #F5F2EE 100%)" }}
      >
        <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          {/* Section Header */}
          <div ref={ref} className="text-center mb-14 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center gap-4 mb-6 sm:mb-8"
            >
              <span className="block w-12 sm:w-16 h-[1px]" style={{ background: "linear-gradient(to right, transparent, rgba(197,106,69,0.4))" }} />
              <span className="text-[10px] uppercase tracking-[0.35em] font-medium" style={{ color: "#6B5F5A" }}>
                What We Offer
              </span>
              <span className="block w-12 sm:w-16 h-[1px]" style={{ background: "linear-gradient(to left, transparent, rgba(197,106,69,0.4))" }} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(1.85rem,4.5vw,3.25rem)] font-light tracking-tight mb-4 sm:mb-6"
              style={{ color: "#1A1614", letterSpacing: "-0.02em" }}
            >
              Photography Services
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base max-w-2xl mx-auto leading-[1.7]"
              style={{ color: "#6B5F5A" }}
            >
              From intimate moments to grand celebrations, we offer comprehensive photography services tailored to your unique story
            </motion.p>
          </div>

          {/* Services Responsive Grid */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6 auto-rows-[180px] sm:auto-rows-[210px] md:auto-rows-[250px]">
            {loading ? (
              <>
                <div className="col-span-1 min-[480px]:col-span-2 min-[480px]:row-span-2 lg:col-span-2 lg:row-span-2 min-h-[220px] min-[480px]:min-h-[360px] lg:min-h-[520px] rounded-[20px] sm:rounded-[24px] skeleton" />
                <div className="col-span-1 min-h-[180px] sm:min-h-[210px] md:min-h-[250px] rounded-[20px] sm:rounded-[24px] skeleton" />
                <div className="col-span-1 min-h-[180px] sm:min-h-[210px] md:min-h-[250px] rounded-[20px] sm:rounded-[24px] skeleton" />
                <div className="col-span-1 min-h-[180px] sm:min-h-[210px] md:min-h-[250px] rounded-[20px] sm:rounded-[24px] skeleton" />
                <div className="col-span-1 min-h-[180px] sm:min-h-[210px] md:min-h-[250px] rounded-[20px] sm:rounded-[24px] skeleton" />
                <div className="col-span-1 min-h-[180px] sm:min-h-[210px] md:min-h-[250px] rounded-[20px] sm:rounded-[24px] skeleton" />
              </>
            ) : (
              displayServices.map((service, i) => {
                const isFeatured = i === 0;
                const spanClass = isFeatured 
                  ? "col-span-1 min-[480px]:col-span-2 min-[480px]:row-span-2 lg:col-span-2 lg:row-span-2 min-h-[220px] min-[480px]:min-h-[360px] lg:min-h-[520px]" 
                  : "col-span-1 min-h-[180px] sm:min-h-[210px] md:min-h-[250px]";
                const imgSrc = service.imageUrl || service.image;

                return (
                  <motion.div
                    key={service._id || i}
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleServiceCardClick(service)}
                    className={`group relative overflow-hidden rounded-[20px] sm:rounded-[24px] cursor-pointer ${spanClass}`}
                    style={{ 
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      border: "1px solid rgba(255,255,255,0.4)"
                    }}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                      <motion.img
                        src={typeof imgSrc === 'string' && imgSrc.includes('http') ? getOptimizedImageUrl(imgSrc, { width: 1600, quality: 'auto:best' }) : imgSrc}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(0.9) saturate(1.1)" }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>

                    {/* Dark Gradient Overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{
                        background: "linear-gradient(to top, rgba(26,22,20,0.92) 0%, rgba(26,22,20,0.55) 45%, rgba(26,22,20,0.25) 70%, transparent 100%)",
                      }}
                    />

                    {/* Hover Gradient */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: "linear-gradient(to top, rgba(197,106,69,0.7) 0%, rgba(197,106,69,0.3) 50%, transparent 100%)",
                      }}
                    />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 md:p-6 z-10">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 
                            className="font-display text-white text-sm sm:text-lg md:text-[22px] font-light leading-tight group-hover:translate-y-[-2px] transition-transform duration-500 line-clamp-1"
                            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                          >
                            {service.title}
                          </h3>
                          {service.description && (
                            <p className="text-white/80 text-[11px] sm:text-xs mt-1 font-light line-clamp-2 leading-relaxed max-w-md">
                              {service.description}
                            </p>
                          )}
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 45 }}
                          transition={{ duration: 0.3 }}
                          className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                          }}
                        >
                          <FiArrowUpRight className="text-xs sm:text-base md:text-lg" style={{ color: "#1A1614" }} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Glass Border on Hover */}
                    <div 
                      className="absolute inset-0 rounded-[20px] sm:rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ border: "1px solid rgba(255,255,255,0.5)" }} 
                    />
                  </motion.div>
                );
              })
            )}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 sm:mt-16 text-center"
          >
            <p className="text-xs sm:text-sm mb-5 sm:mb-6" style={{ color: "#6B5F5A" }}>
              Not sure which service fits your needs?
            </p>
            <motion.button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 sm:px-10 py-3.5 sm:py-[15px] rounded-full text-xs sm:text-[13px] font-medium glass-strong transition-smooth"
              style={{
                color: "#1A1614",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)",
                letterSpacing: "0.01em"
              }}
            >
              Let's Talk About Your Project
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBook={handleBookSession}
          />
        )}
      </AnimatePresence>
    </>
  );
}

