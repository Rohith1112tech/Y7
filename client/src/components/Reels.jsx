import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FiPlay, FiX, FiFilm, FiYoutube } from "react-icons/fi";
import { videoAPI } from "../services/api";
import {
  getOptimizedVideoUrl,
  getVideoThumbnailUrl,
  getYouTubeEmbedUrl
} from "../services/cloudinaryUpload";

import cinematicImg from "../assets/images/cinematic.jpg";
import coupleImg from "../assets/images/couple.jpg";
import weddingImg from "../assets/images/wedding.jpg";

const DEFAULT_REELS = [
  {
    _id: "default-reel-1",
    title: "Cinematic Wedding Highlights",
    description: "A breathtaking glimpse into sacred rituals, heartfelt vows, and timeless royal romance.",
    sourceType: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // fallback placeholder
    thumbnailUrl: weddingImg,
    order: 1
  },
  {
    _id: "default-reel-2",
    title: "Romantic Pre-Wedding Sunset",
    description: "Golden hour romance captured in breathtaking outdoor landscapes and candid intimate moments.",
    sourceType: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: coupleImg,
    order: 2
  },
  {
    _id: "default-reel-3",
    title: "4K Motion Portrait & Styling",
    description: "Editorial high-fashion movement tailored with dramatic creative lighting.",
    sourceType: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: cinematicImg,
    order: 3
  }
];

function VideoPlayerModal({ video, onClose }) {
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

  if (!video) return null;

  const isYouTube = video.sourceType === "youtube" || (video.videoUrl && (video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be")));
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(video.videoUrl, { autoplay: 1 }) : "";
  const optimizedVideoUrl = !isYouTube ? getOptimizedVideoUrl(video.videoUrl) : "";
  const poster = getVideoThumbnailUrl(video);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-2.5 sm:p-6 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(18, 15, 14, 0.88)",
          backdropFilter: "blur(24px)",
        }}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl max-h-[90dvh] flex flex-col rounded-[22px] sm:rounded-[28px] overflow-hidden soft-shadow-lg overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #1A1614 0%, #241E1B 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Close Button */}
        <motion.button
          type="button"
          aria-label="Close video player"
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          style={{ background: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(10px)", color: "#FFFFFF" }}
        >
          <FiX className="text-lg text-white" />
        </motion.button>

        {/* Video Player Area */}
        <div className="relative w-full bg-black flex items-center justify-center overflow-hidden">
          {isYouTube ? (
            <div className="w-full aspect-video">
              <iframe
                src={embedUrl}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full max-h-[68vh] flex items-center justify-center bg-black">
              <video
                src={optimizedVideoUrl}
                poster={poster}
                controls
                playsInline
                autoPlay
                preload="metadata"
                className="w-full max-h-[68vh] object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {/* Video Information Header & Description */}
        <div className="p-5 sm:p-7 text-white space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #C56A45, #B85A38)" }}
            >
              {isYouTube ? <FiYoutube className="text-xs" /> : <FiFilm className="text-xs" />}
              {isYouTube ? "YouTube Reel" : "Studio 4K Reel"}
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-light tracking-tight text-white">
            {video.title}
          </h3>

          {video.description && (
            <p className="text-xs sm:text-sm leading-relaxed text-white/70 max-w-3xl">
              {video.description}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Reels() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const fetchVideos = useCallback(async () => {
    try {
      const res = await videoAPI.getAll();
      const rawData = res?.data !== undefined ? res.data : res;
      let list = [];
      if (Array.isArray(rawData)) {
        list = rawData;
      } else if (rawData && typeof rawData === 'object') {
        list = rawData.videos || rawData.items || rawData.data || [];
      }

      if (Array.isArray(list) && list.length > 0) {
        setVideos(list);
      } else {
        setVideos(DEFAULT_REELS);
      }
    } catch (err) {
      console.log('Using default reels:', err);
      setVideos(DEFAULT_REELS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 15000);
    return () => clearInterval(interval);
  }, [fetchVideos]);

  const displayVideos = videos.length > 0 ? videos : DEFAULT_REELS;

  return (
    <>
      <section
        id="reels"
        className="relative section-padding overflow-hidden"
        style={{ background: "linear-gradient(180deg, #FAF8F5 0%, #F5F2EE 50%, #FAF8F5 100%)" }}
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
              <span className="block w-12 sm:w-16 h-[1px]" style={{ background: "linear-gradient(to right, transparent, rgba(197,106,69,0.4))" }} />
              <span className="text-[10px] uppercase tracking-[0.35em] font-medium" style={{ color: "#6B5F5A" }}>
                Behind The Lens
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
              Studio Reels & Films
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base max-w-2xl mx-auto leading-[1.7]"
              style={{ color: "#6B5F5A" }}
            >
              Experience our cinematic storytelling in motion — captivating wedding films, viral reels, and behind-the-scenes moments.
            </motion.p>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {loading ? (
              [0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="rounded-[24px] overflow-hidden skeleton-dark"
                  style={{
                    aspectRatio: "16/10",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}
                />
              ))
            ) : (
              displayVideos.map((video, idx) => {
                const thumbnail = getVideoThumbnailUrl(video);
                const isYouTube = video.sourceType === "youtube" || (video.videoUrl && (video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be")));

                return (
                  <motion.div
                    key={video._id || idx}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSelectedVideo(video)}
                    className="group relative rounded-[24px] overflow-hidden cursor-pointer soft-shadow transition-transform duration-500 hover:-translate-y-1.5"
                    style={{
                      background: "#1A1614",
                      aspectRatio: "16/10",
                      border: "1px solid rgba(255, 255, 255, 0.4)"
                    }}
                  >
                    {/* Poster Thumbnail Image */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      {thumbnail ? (
                        <motion.img
                          src={thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          style={{ filter: "brightness(0.85)" }}
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#241E1B] to-[#120F0E]">
                          <FiFilm className="text-4xl text-[#C56A45]/40" />
                        </div>
                      )}
                    </div>

                    {/* Dark Gradient Overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(to top, rgba(18,15,14,0.92) 0%, rgba(18,15,14,0.3) 50%, rgba(18,15,14,0.1) 100%)",
                      }}
                    />

                    {/* Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: "rgba(197, 106, 69, 0.88)",
                          backdropFilter: "blur(12px)",
                          border: "2px solid rgba(255, 255, 255, 0.6)"
                        }}
                      >
                        <FiPlay className="text-xl sm:text-2xl ml-1" />
                      </motion.div>
                    </div>

                    {/* Card Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                          {isYouTube ? "YouTube" : "Cinematic 4K"}
                        </span>
                      </div>

                      <h3
                        className="font-display text-white text-base sm:text-lg font-light leading-snug line-clamp-1 group-hover:text-[#E89370] transition-colors"
                        style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                      >
                        {video.title}
                      </h3>

                      {video.description && (
                        <p className="text-white/75 text-xs font-light line-clamp-1 mt-1">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Video Lightbox Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoPlayerModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
