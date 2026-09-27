import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { FiX, FiCheckCircle, FiUpload, FiMessageSquare } from "react-icons/fi";
import { testimonialAPI } from "../services/api";
import { getOptimizedImageUrl, formatFileSize, validateImageFile } from "../services/cloudinaryUpload";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Public Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await testimonialAPI.getAll();
      const rawData = res?.data !== undefined ? res.data : res;
      let list = [];
      if (Array.isArray(rawData)) {
        list = rawData;
      } else if (rawData && typeof rawData === 'object') {
        list = rawData.testimonials || rawData.items || rawData.data || [];
      }
      setTestimonials(Array.isArray(list) ? list : []);
    } catch (error) {
      console.log('Failed to fetch testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
    const interval = setInterval(fetchTestimonials, 15000);
    return () => clearInterval(interval);
  }, [fetchTestimonials]);

  const handleFileChange = (e) => {
    setFormError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      return;
    }
    try {
      validateImageFile(file);
      setSelectedFile(file);
    } catch (err) {
      setFormError(err.message);
      e.target.value = '';
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.content.trim()) {
      setFormError("Please enter your name and review.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = new FormData();
      submission.append("name", formData.name.trim());
      submission.append("role", formData.role.trim() || "Client");
      submission.append("content", formData.content.trim());
      submission.append("rating", String(formData.rating));
      if (selectedFile) {
        submission.append("image", selectedFile);
      }

      await testimonialAPI.submit(submission);

      setSubmitSuccess(true);
      setFormData({ name: "", role: "", content: "", rating: 5 });
      setSelectedFile(null);
      const fileInput = document.getElementById("public-testimonial-file");
      if (fileInput) fileInput.value = "";

      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to submit testimonial. Please try again.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="testimonials" 
      className="relative section-padding overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FAF8F5 0%, #F5F2EE 100%)" }}
    >
      <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        {/* Section Header */}
        <div ref={ref} className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6 sm:mb-8"
          >
            <span className="block w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#C56A45]/30 to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#6B5F5A" }}>
              Testimonials
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
            Kind Words from Clients
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base max-w-2xl mx-auto leading-[1.7]"
            style={{ color: "#6B5F5A" }}
          >
            What our clients say about their experience with Studio Y7
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="glass-strong soft-shadow-lg rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 min-h-[220px] skeleton"
              />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial._id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-strong soft-shadow-lg rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 transition-smooth flex flex-col justify-between"
              >
                <div>
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating || 5)].map((_, starIndex) => (
                      <motion.div
                        key={starIndex}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + starIndex * 0.1, type: "spring" }}
                      >
                        <FaStar className="text-[#C56A45]" size={16} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-sm leading-relaxed mb-8 font-light" style={{ color: "#6B5F5A" }}>
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {testimonial.imageUrl ? (
                    <img 
                      src={getOptimizedImageUrl(testimonial.imageUrl, { width: 400, quality: 'auto:best' })} 
                      alt={testimonial.name} 
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C56A45]/20" 
                    />
                  ) : (
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-display text-xl"
                      style={{ background: "linear-gradient(135deg, #C56A45, #B85A38)" }}
                    >
                      {(testimonial.name || 'C').charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-sm mb-1" style={{ color: "#1A1614" }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-xs" style={{ color: "#6B5F5A" }}>
                      {testimonial.role || "Client"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center glass rounded-3xl p-8 sm:p-12 mb-12 sm:mb-16"
          >
            <p className="text-sm" style={{ color: "#6B5F5A" }}>
              Client testimonials will appear here soon
            </p>
          </motion.div>
        )}

        {/* Public Feedback Call To Action */}
        <div className="text-center">
          <motion.button
            type="button"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 sm:px-8 py-3.5 rounded-full text-[13px] font-medium glass-strong transition-smooth inline-flex items-center gap-2.5"
            style={{
              color: "#1A1614",
              border: "1px solid rgba(197, 106, 69, 0.25)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)"
            }}
          >
            <FiMessageSquare className="text-base text-[#C56A45]" />
            Share Your Experience
          </motion.button>
        </div>
      </div>

      {/* Public Testimonial Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-[24px] sm:rounded-[28px] glass-strong p-5 sm:p-7 md:p-8 shadow-2xl"
              style={{
                background: "rgba(250, 248, 245, 0.98)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 24px 64px rgba(0, 0, 0, 0.15)"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl font-light" style={{ color: "#1A1614" }}>
                    Share Your Feedback
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "#6B5F5A" }}>
                    We appreciate your thoughts! Your review will be displayed after review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !isSubmitting && setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-3xl"
                  >
                    <FiCheckCircle />
                  </motion.div>
                  <h4 className="font-display text-xl font-medium mb-2" style={{ color: "#1A1614" }}>
                    Thank You!
                  </h4>
                  <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "#6B5F5A" }}>
                    Your testimonial has been submitted successfully and will appear on our website after review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B5F5A] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Priyan & Keerthi"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/70 border border-black/10 focus:border-[#C56A45] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B5F5A] mb-1">
                        Role / Shoot Type (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wedding Couple, Bride, Client"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/70 border border-black/10 focus:border-[#C56A45] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B5F5A] mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <FaStar
                            size={20}
                            className={star <= formData.rating ? "text-[#C56A45]" : "text-gray-300"}
                          />
                        </button>
                      ))}
                      <span className="text-xs ml-2 font-medium" style={{ color: "#6B5F5A" }}>
                        {formData.rating} Star{formData.rating > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B5F5A] mb-1">
                      Your Feedback *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your experience working with Studio Y7..."
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/70 border border-black/10 focus:border-[#C56A45] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6B5F5A] mb-1">
                      Your Photo (Optional)
                    </label>
                    <input
                      id="public-testimonial-file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileChange}
                      className="text-xs block w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-medium file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-[11px] text-[#6B5F5A] mt-1.5">
                        Selected: <span className="font-medium">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>

                  <div className="pt-3 flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      className="flex-1 py-3 rounded-full text-xs font-medium text-white transition-opacity flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #C56A45 0%, #B85A38 100%)",
                        boxShadow: "0 8px 20px rgba(197, 106, 69, 0.28)",
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      <FiUpload className="text-sm" />
                      {isSubmitting ? "Submitting Review..." : "Submit Review"}
                    </motion.button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 rounded-full text-xs font-medium glass hover:bg-black/5 transition-colors"
                      style={{ color: "#6B5F5A" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
