import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FiCheck, FiCalendar, FiMapPin, FiUser, FiMail, FiPhone, FiCamera, FiTag, FiFileText, FiRefreshCw } from "react-icons/fi";
import { bookingAPI, serviceAPI } from "../services/api";
import { useBookingStore } from "../services/store";

const STEPS = ["Details", "Service & Date", "Package", "Summary"];

const DEFAULT_FALLBACK_SERVICES = [
  { 
    _id: "default-1",
    title: "Wedding Photography", 
    packages: [
      { name: "Mini", price: "₹35,000", description: "Half-day coverage, 150 edited high-res photos & online gallery" },
      { name: "Premium", price: "₹65,000", description: "Full-day ceremony & reception, 350+ edited photos, cinematic teaser" },
      { name: "Luxury", price: "₹1,10,000", description: "Complete multi-day coverage, premium leather album, drone shots & 4K film" }
    ]
  },
  { 
    _id: "default-2",
    title: "Traditional Wedding", 
    packages: [
      { name: "Mini", price: "₹30,000", description: "Essential traditional rituals coverage with 120 edited photos" },
      { name: "Premium", price: "₹55,000", description: "Full ceremony documentation, candid moments & family portraiture" },
      { name: "Luxury", price: "₹95,000", description: "Complete ritual suite, candid master album & heirloom photobook" }
    ]
  },
  { 
    _id: "default-3",
    title: "Couple Shoot", 
    packages: [
      { name: "Mini", price: "₹12,000", description: "1-2 hours outdoor session, 25 high-resolution retouched photos" },
      { name: "Premium", price: "₹20,000", description: "Half-day scenic shoot, 2 outfit changes, 60 retouched photos & 1 reel" },
      { name: "Luxury", price: "₹30,000", description: "Full-day multi-location experience, 3 outfits, 120 photos & 4K video reel" }
    ]
  },
  { 
    _id: "default-4",
    title: "Portrait Photography", 
    packages: [
      { name: "Mini", price: "₹8,000", description: "1-hour studio session, 15 magazine-grade retouched photos" },
      { name: "Premium", price: "₹15,000", description: "2-hour studio & outdoor shoot, 35 retouched photos & creative lighting" },
      { name: "Luxury", price: "₹25,000", description: "Full editorial session, styling assistance, 75 retouched photos & print prints" }
    ]
  },
  { 
    _id: "default-5",
    title: "Outdoor Photography", 
    packages: [
      { name: "Mini", price: "₹10,000", description: "90-minute golden hour shoot, 25 curated photos" },
      { name: "Premium", price: "₹18,000", description: "Half-day destination session, 60 color-graded photos" },
      { name: "Luxury", price: "₹28,000", description: "Full-day landscape session, drone views, 100+ photos & social clips" }
    ]
  },
  { 
    _id: "default-6",
    title: "Corporate Events", 
    packages: [
      { name: "Mini", price: "₹15,000", description: "Up to 3 hours coverage, high-res digital gallery for press/web" },
      { name: "Premium", price: "₹28,000", description: "Full-day event coverage, rapid same-day highlights delivery" },
      { name: "Luxury", price: "₹50,000", description: "Multi-photographer team, live highlights, executive portraits & full gallery" }
    ]
  },
  { 
    _id: "default-7",
    title: "Birthday Shoot", 
    packages: [
      { name: "Mini", price: "₹8,000", description: "2 hours party coverage & 40 edited memories" },
      { name: "Premium", price: "₹15,000", description: "Full event coverage, candid guest portraits & cake-cutting highlights" },
      { name: "Luxury", price: "₹25,000", description: "Complete celebration package, customized photobook & video highlight" }
    ]
  },
  { 
    _id: "default-8",
    title: "Cinematic Reels", 
    packages: [
      { name: "Mini", price: "₹12,000", description: "1 polished 4K reel (30-60s) with sound design & color grading" },
      { name: "Premium", price: "₹22,000", description: "3 high-impact reels with creative transitions & viral-ready framing" },
      { name: "Luxury", price: "₹38,000", description: "Full cinematic story suite (5 reels + 2-min 4K film) with drone" }
    ]
  },
];

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [servicesList, setServicesList] = useState([]);
  
  const { selectedService, selectedPackage, setSelectedService, setSelectedPackage, clearBookingSelection } = useBookingStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceId: "",
    serviceTitle: "",
    packageId: "",
    packageName: "",
    packagePrice: "",
    eventDate: "",
    location: "",
    message: ""
  });

  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Fetch active services dynamically from backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await serviceAPI.getAll();
        const rawData = res?.data !== undefined ? res.data : res;
        let list = [];
        if (Array.isArray(rawData)) {
          list = rawData;
        } else if (rawData && typeof rawData === 'object') {
          list = rawData.services || rawData.items || rawData.data || [];
        }
        if (list && list.length > 0) {
          setServicesList(list);
        } else {
          setServicesList(DEFAULT_FALLBACK_SERVICES);
        }
      } catch (err) {
        console.warn("Could not load dynamic services, using defaults:", err);
        setServicesList(DEFAULT_FALLBACK_SERVICES);
      }
    };
    loadServices();
  }, []);

  // Synchronize store selection with form data
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        serviceId: selectedService._id || "",
        serviceTitle: selectedService.title || "",
        packageId: selectedPackage?._id || "",
        packageName: selectedPackage?.name || "",
        packagePrice: selectedPackage?.price || ""
      }));
    }
  }, [selectedService, selectedPackage]);

  // Find active service object matching current selection
  const activeServiceObj = servicesList.find(s => s._id === formData.serviceId || s.title === formData.serviceTitle) 
    || selectedService 
    || null;

  const availablePackages = activeServiceObj?.packages && Array.isArray(activeServiceObj.packages) 
    ? activeServiceObj.packages 
    : [];

  const handleServiceChange = (e) => {
    const serviceTitle = e.target.value;
    const found = servicesList.find(s => s.title === serviceTitle);
    if (found) {
      setSelectedService(found);
      setSelectedPackage(found.packages?.[0] || null);
      setFormData(prev => ({
        ...prev,
        serviceId: found._id || "",
        serviceTitle: found.title,
        packageId: found.packages?.[0]?._id || "",
        packageName: found.packages?.[0]?.name || "",
        packagePrice: found.packages?.[0]?.price || ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        serviceId: "",
        serviceTitle: serviceTitle,
        packageId: "",
        packageName: "",
        packagePrice: ""
      }));
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      packageId: pkg._id || "",
      packageName: pkg.name,
      packagePrice: pkg.price
    }));
  };

  const handleCustomPackage = () => {
    setSelectedPackage(null);
    setFormData(prev => ({
      ...prev,
      packageId: "",
      packageName: "Custom Package",
      packagePrice: "Contact for pricing"
    }));
  };

  const validateCurrentStep = () => {
    setErrorMessage("");
    if (currentStep === 0) {
      if (!formData.name.trim()) {
        setErrorMessage("Please enter your name");
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMessage("Please enter your phone number");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMessage("Please enter a valid email address");
        return false;
      }
    } else if (currentStep === 1) {
      if (!formData.serviceTitle) {
        setErrorMessage("Please select a photography service");
        return false;
      }
      if (!formData.eventDate) {
        setErrorMessage("Please select your preferred event date");
        return false;
      }
      if (!formData.location.trim()) {
        setErrorMessage("Please enter the event location");
        return false;
      }
    } else if (currentStep === 2) {
      // If service has packages and none selected, auto-select first or custom
      if (availablePackages.length > 0 && !formData.packageName) {
        handleSelectPackage(availablePackages[0]);
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setErrorMessage("");
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceId: formData.serviceId || undefined,
        serviceTitle: formData.serviceTitle || 'Photography Session',
        eventType: formData.serviceTitle || 'Photography Session',
        packageId: formData.packageId || undefined,
        packageName: formData.packageName || 'Custom Package',
        packagePrice: formData.packagePrice || 'Contact for pricing',
        package: formData.packageName || 'Custom Package',
        eventDate: formData.eventDate,
        location: formData.location.trim(),
        message: formData.message.trim(),
        notes: formData.message.trim()
      };

      await bookingAPI.create(payload);
      setStatus("success");
      clearBookingSelection();

      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          email: "",
          serviceId: "",
          serviceTitle: "",
          packageId: "",
          packageName: "",
          packagePrice: "",
          eventDate: "",
          location: "",
          message: ""
        });
        setCurrentStep(0);
        setStatus("");
        setIsSubmitting(false);
      }, 4000);
    } catch (error) {
      console.error("Booking error:", error);
      setStatus("error");
      setErrorMessage(error.response?.data?.message || error.message || "Failed to submit booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="booking" 
      className="relative section-padding overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EFE9E4 0%, #FAF8F5 100%)" }}
    >
      <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
        {/* Section Header */}
        <div ref={ref} className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6 sm:mb-8"
          >
            <span className="block w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#C56A45]/30 to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#6B5F5A" }}>
              Book a Session
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
            Let's Create
            <br />
            Something Beautiful
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base leading-[1.7] max-w-lg mx-auto"
            style={{ color: "#6B5F5A" }}
          >
            Select your photography service & package, share your event details, and we will get back to you promptly.
          </motion.p>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-between mb-8 sm:mb-10 max-w-2xl mx-auto px-2"
        >
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  animate={{
                    background: i <= currentStep 
                      ? "linear-gradient(135deg, #C56A45, #B85A38)" 
                      : "rgba(107, 95, 90, 0.12)",
                    scale: i === currentStep ? 1.08 : 1
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-smooth shadow-sm"
                  style={{ color: i <= currentStep ? "#FFF" : "#6B5F5A" }}
                >
                  {i < currentStep ? <FiCheck size={14} /> : i + 1}
                </motion.div>
                <span className="text-[11px] sm:text-xs mt-1.5 hidden sm:block font-medium" style={{ color: i === currentStep ? "#1A1614" : "#6B5F5A" }}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-1 sm:mx-2" style={{ background: "rgba(107, 95, 90, 0.15)" }}>
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: i < currentStep ? "100%" : "0%" }}
                    className="h-full"
                    style={{ background: "linear-gradient(135deg, #C56A45, #B85A38)" }}
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-strong soft-shadow-lg rounded-[24px] sm:rounded-[28px] p-5 sm:p-8"
        >
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-700 text-center font-medium">
              {errorMessage}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 0: Customer Details */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                      style={{ border: "1px solid rgba(107, 95, 90, 0.15)", outline: "none", color: "#1A1614" }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                      style={{ border: "1px solid rgba(107, 95, 90, 0.15)", outline: "none", color: "#1A1614" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                      style={{ border: "1px solid rgba(107, 95, 90, 0.15)", outline: "none", color: "#1A1614" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Service & Event Date / Location */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A]">
                      Photography Service *
                    </label>
                    {formData.serviceTitle && (
                      <span className="text-[11px] font-medium text-[#C56A45]">
                        Selected
                      </span>
                    )}
                  </div>

                  {formData.serviceTitle ? (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-[#C56A45]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C56A45]/10 flex items-center justify-center text-[#C56A45] flex-shrink-0">
                          <FiCamera className="text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#1A1614]">{formData.serviceTitle}</p>
                          <p className="text-[11px] text-[#6B5F5A]">Photography Service selected</p>
                        </div>
                      </div>
                      <select
                        value={formData.serviceTitle}
                        onChange={handleServiceChange}
                        className="text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white text-[#6B5F5A] cursor-pointer hover:border-[#C56A45] w-full sm:w-auto"
                      >
                        {servicesList.map(s => (
                          <option key={s._id || s.title} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <select
                      value={formData.serviceTitle}
                      onChange={handleServiceChange}
                      className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20 cursor-pointer"
                      style={{ border: "1px solid rgba(107, 95, 90, 0.15)", outline: "none", color: "#1A1614" }}
                    >
                      <option value="">Select Photography Service *</option>
                      {servicesList.map(s => (
                        <option key={s._id || s.title} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] mb-1.5">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                      style={{ border: "1px solid rgba(107, 95, 90, 0.15)", outline: "none", color: "#1A1614" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] mb-1.5">
                      Event Location / Venue *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore, ITC Gardenia"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl glass text-sm transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                      style={{ border: "1px solid rgba(107, 95, 90, 0.15)", outline: "none", color: "#1A1614" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Package Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A]">
                      Select Package for {formData.serviceTitle || "Service"}
                    </label>
                    {formData.packageName && (
                      <span className="text-[11px] font-semibold text-[#C56A45]">
                        {formData.packageName} {formData.packagePrice ? `(${formData.packagePrice.startsWith('₹') ? formData.packagePrice : `₹${formData.packagePrice}`})` : ''}
                      </span>
                    )}
                  </div>

                  {availablePackages.length > 0 ? (
                    <div className="grid sm:grid-cols-3 gap-3 mb-4">
                      {availablePackages.map((pkg, idx) => {
                        const isSelected = formData.packageName === pkg.name;
                        const formattedPrice = pkg.price?.startsWith('₹') ? pkg.price : `₹${pkg.price}`;
                        return (
                          <motion.button
                            key={pkg._id || idx}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectPackage(pkg)}
                            className={`p-4 rounded-2xl text-left transition-smooth flex flex-col justify-between border ${
                              isSelected 
                                ? "bg-white shadow-md border-[#C56A45]" 
                                : "bg-white/60 hover:bg-white/90 border-black/5"
                            }`}
                            style={{
                              boxShadow: isSelected ? "0 4px 18px rgba(197, 106, 69, 0.18)" : "none"
                            }}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-sm text-[#1A1614]">{pkg.name}</span>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                  isSelected ? "border-[#C56A45] bg-[#C56A45] text-white" : "border-gray-300"
                                }`}>
                                  {isSelected && <FiCheck className="text-[10px]" />}
                                </div>
                              </div>
                              <p className="font-bold text-base text-[#C56A45] mb-2">{formattedPrice}</p>
                            </div>
                            {pkg.description && (
                              <p className="text-[11px] text-[#6B5F5A] line-clamp-2 leading-relaxed">
                                {pkg.description}
                              </p>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/70 border border-black/5 mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#1A1614]">Custom Photography Package</p>
                        <p className="text-xs text-[#6B5F5A]">Contact us for a bespoke quote tailored to your exact event requirements.</p>
                      </div>
                      <span className="text-xs font-bold text-[#C56A45] shrink-0 ml-3">Custom Quote</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] mb-1.5">
                    Special Requests & Additional Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Tell us more about your event timing, themes, specific shots or special requests..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="3"
                    className="w-full px-5 py-3.5 rounded-2xl glass text-sm resize-none transition-smooth focus:ring-2 focus:ring-[#C56A45]/20"
                    style={{ border: "1px solid rgba(107, 95, 90, 0.15)", outline: "none", color: "#1A1614" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Booking Summary & Final Confirmation */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {status === "success" ? (
                  <div className="text-center py-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
                      style={{ background: "linear-gradient(135deg, #73856D, #8A9B84)" }}
                    >
                      <FiCheck className="text-white text-3xl" />
                    </motion.div>
                    <h3 className="font-display text-2xl sm:text-3xl font-light mb-2 text-[#1A1614]">
                      Booking Request Submitted!
                    </h3>
                    <p className="text-sm text-[#6B5F5A] max-w-md mx-auto">
                      Thank you, <span className="font-semibold text-[#1A1614]">{formData.name}</span>. We have received your booking request for <span className="font-semibold text-[#1A1614]">{formData.serviceTitle}</span> and will reach out within 24 hours.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h3 className="font-semibold text-base text-[#1A1614] mb-1">Review Your Booking Summary</h3>
                      <p className="text-xs text-[#6B5F5A]">Please verify your booking details before final confirmation.</p>
                    </div>

                    <div className="glass rounded-2xl p-4 sm:p-6 space-y-3.5 text-sm border border-white/60">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-black/5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] flex items-center gap-2">
                          <FiCamera className="text-[#C56A45]" /> Photography Service
                        </span>
                        <span className="font-semibold text-[#1A1614] sm:text-right">{formData.serviceTitle}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-black/5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] flex items-center gap-2">
                          <FiTag className="text-[#C56A45]" /> Package & Price
                        </span>
                        <div className="sm:text-right">
                          <span className="font-semibold text-[#1A1614] mr-2">{formData.packageName || "Standard"}</span>
                          {formData.packagePrice && (
                            <span className="font-bold text-[#C56A45]">
                              {formData.packagePrice.startsWith('₹') ? formData.packagePrice : `₹${formData.packagePrice}`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-black/5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] flex items-center gap-2">
                          <FiCalendar className="text-[#C56A45]" /> Event Date
                        </span>
                        <span className="font-medium text-[#1A1614] sm:text-right">
                          {formData.eventDate ? new Date(formData.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not specified'}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-black/5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] flex items-center gap-2">
                          <FiMapPin className="text-[#C56A45]" /> Location
                        </span>
                        <span className="font-medium text-[#1A1614] sm:text-right">{formData.location}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-black/5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] flex items-center gap-2">
                          <FiUser className="text-[#C56A45]" /> Customer
                        </span>
                        <div className="sm:text-right">
                          <p className="font-medium text-[#1A1614]">{formData.name}</p>
                          <p className="text-xs text-[#6B5F5A]">{formData.phone} • {formData.email}</p>
                        </div>
                      </div>

                      {formData.message && (
                        <div className="pt-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5F5A] block mb-1">
                            Notes / Message:
                          </span>
                          <p className="text-xs text-[#1A1614] bg-white/50 p-3 rounded-xl border border-black/5">
                            {formData.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {status !== "success" && (
            <div className="flex gap-2.5 sm:gap-4 mt-7 sm:mt-8">
              {currentStep > 0 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-semibold transition-smooth text-center"
                  style={{ color: "#C56A45", border: "1px solid rgba(197, 106, 69, 0.4)", background: "rgba(197, 106, 69, 0.05)" }}
                >
                  Back
                </motion.button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={currentStep === 3 ? handleSubmit : nextStep}
                disabled={isSubmitting}
                className="flex-1 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-semibold text-white transition-smooth shadow-md text-center flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #C56A45, #B85A38)" }}
              >
                {isSubmitting ? (
                  <>
                    <FiRefreshCw className="animate-spin text-base" />
                    <span>Submitting Booking...</span>
                  </>
                ) : (
                  <span>{currentStep === 3 ? "Confirm & Submit Booking" : "Continue"}</span>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

