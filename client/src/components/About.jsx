import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FiMapPin, FiCalendar, FiHeart, FiCamera } from "react-icons/fi";
import { contentAPI } from "../services/api";
import { getOptimizedImageUrl } from "../services/cloudinaryUpload";
import defaultStoryImage from "../assets/images/couple.jpg";

export default function About({ customImage = null }) {
  const [storyImage, setStoryImage] = useState(customImage || null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (customImage) {
      setStoryImage(customImage);
      return;
    }

    let isMounted = true;
    const fetchStoryContent = async () => {
      try {
        const res = await contentAPI.get('about');
        if (!isMounted) return;
        const data = res?.data !== undefined ? res.data : res;
        const content = data?.content || data;
        const img = content?.storyImage || content?.imageUrl || content?.secure_url || content?.image;
        if (img) {
          setStoryImage(img);
        } else {
          setStoryImage(defaultStoryImage);
        }
      } catch (err) {
        if (!isMounted) return;
        setStoryImage(defaultStoryImage);
      }
    };

    fetchStoryContent();
    return () => {
      isMounted = false;
    };
  }, [customImage]);

  return (
    <section 
      id="about" 
      className="relative section-padding overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F5F2EE 0%, #FAF8F5 50%, #F5F2EE 100%)" }}
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
            <span className="block w-12 sm:w-16 h-[1px]" style={{ background: "linear-gradient(to right, transparent, rgba(197,106,69,0.4))" }} />
            <span className="text-[10px] uppercase tracking-[0.35em] font-medium" style={{ color: "#6B5F5A" }}>
              Our Story
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
            Capturing Life's
            <br />
            <span style={{ fontStyle: "italic", color: "#C56A45" }}>Most Beautiful Moments</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base max-w-2xl mx-auto leading-[1.7]"
            style={{ color: "#6B5F5A" }}
          >
            Every photograph tells a story. We're here to tell yours with authenticity and artistry.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-md lg:max-w-none mx-auto w-full"
          >
            <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-2xl bg-[#EBE6DF]" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.1)", aspectRatio: "4/5" }}>
              {storyImage ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={typeof storyImage === 'string' && storyImage.includes('http') ? getOptimizedImageUrl(storyImage, { width: 1600, quality: 'auto:best' }) : storyImage}
                  alt="Studio Y7 Story"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full skeleton" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-[28px] font-light mb-3 sm:mb-4" style={{ color: "#1A1614", letterSpacing: "-0.01em" }}>
                Studio Story
              </h3>
              <p className="text-sm sm:text-[15px] leading-[1.75] mb-3 sm:mb-4" style={{ color: "#6B5F5A" }}>
                Started in 2021, Studio Y7 is a creative photography studio based in Tiruchengode, dedicated to capturing life's most precious moments with authenticity and artistry.
              </p>
              <p className="text-sm sm:text-[15px] leading-[1.75]" style={{ color: "#6B5F5A" }}>
                With 5 years of experience, we specialize in wedding photography, portraits, and event coverage—creating timeless images that tell your unique story.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5 md:gap-4">
              {[
                { icon: FiCalendar, label: "Started in 2021" },
                { icon: FiMapPin, label: "Tiruchengode" },
                { icon: FiHeart, label: "5 Years Experience" },
                { icon: FiCamera, label: "Editorial Style" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl glass-strong"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(197,106,69,0.12), rgba(197,106,69,0.05))" }}>
                    <item.icon className="text-sm sm:text-base" style={{ color: "#C56A45" }} />
                  </div>
                  <p className="text-[11px] sm:text-xs md:text-[13px] font-medium leading-[1.35]" style={{ color: "#1A1614" }}>
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
