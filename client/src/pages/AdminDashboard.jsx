import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../services/store";
import { galleryAPI, heroAPI, bookingAPI, contactAPI, testimonialAPI, pricingAPI, serviceAPI, contentAPI, videoAPI } from "../services/api";
import {
  uploadDirectToCloudinary,
  validateImageFile,
  validateVideoFile,
  formatFileSize,
  getOptimizedImageUrl,
  getOptimizedVideoUrl,
  getVideoThumbnailUrl,
  extractYouTubeId,
  getYouTubeEmbedUrl,
  MAX_UPLOAD_SIZE
} from "../services/cloudinaryUpload";
import { FaImage, FaCalendar, FaEnvelope, FaStar, FaUpload, FaTrash, FaSignOutAlt, FaHome, FaTimes, FaCheckCircle, FaExclamationTriangle, FaCamera, FaCheck, FaEye, FaEyeSlash, FaEdit, FaBookOpen, FaVideo, FaPlay, FaYoutube, FaFilm } from "react-icons/fa";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [images, setImages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [services, setServices] = useState([]);
  const [videos, setVideos] = useState([]);
  
  // Gallery upload states
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadData, setUploadData] = useState({ title: "", category: "Wedding", featured: false });
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [galleryStage, setGalleryStage] = useState("");
  const [galleryError, setGalleryError] = useState("");
  const galleryAbortRef = useRef(null);

  // Hero upload states
  const [heroFile, setHeroFile] = useState(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [heroStage, setHeroStage] = useState("");
  const [heroError, setHeroError] = useState("");
  const [currentHero, setCurrentHero] = useState(null);
  const heroAbortRef = useRef(null);

  // Studio Story upload states
  const [storyFile, setStoryFile] = useState(null);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyStage, setStoryStage] = useState("");
  const [storyError, setStoryError] = useState("");
  const [storySuccess, setStorySuccess] = useState("");
  const [currentStory, setCurrentStory] = useState(null);
  const storyAbortRef = useRef(null);

  // Photography Services states
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    order: 0,
    packages: [{ name: "", price: "", description: "" }]
  });
  const [serviceFile, setServiceFile] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isUploadingService, setIsUploadingService] = useState(false);
  const [serviceProgress, setServiceProgress] = useState(0);
  const [serviceStage, setServiceStage] = useState("");
  const [serviceError, setServiceError] = useState("");
  const serviceAbortRef = useRef(null);

  // Video / Reels states
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    sourceType: "cloudinary", // "cloudinary" | "youtube"
    videoUrl: "",
    order: 0,
    active: true
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoThumbnailFile, setVideoThumbnailFile] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStage, setVideoStage] = useState("");
  const [videoError, setVideoError] = useState("");
  const videoAbortRef = useRef(null);

  // Testimonial upload states
  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "", content: "", rating: 5 });
  const [testimonialFile, setTestimonialFile] = useState(null);
  const [isUploadingTestimonial, setIsUploadingTestimonial] = useState(false);
  const [testimonialProgress, setTestimonialProgress] = useState(0);
  const [testimonialStage, setTestimonialStage] = useState("");
  const [testimonialError, setTestimonialError] = useState("");
  const testimonialAbortRef = useRef(null);

  // Pricing states
  const [pricingForm, setPricingForm] = useState({ name: "", price: "", description: "", features: [""], recommended: false });
  const [editingPricing, setEditingPricing] = useState(null);
  
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  useEffect(() => {
    if (activeTab === "overview") {
      loadGallery();
      loadBookings();
      loadContacts();
      loadTestimonials();
      loadHero();
      loadStory();
      loadServices();
      loadVideos();
      loadPricing();
    }
    if (activeTab === "gallery") loadGallery();
    if (activeTab === "hero") loadHero();
    if (activeTab === "story") loadStory();
    if (activeTab === "services") loadServices();
    if (activeTab === "videos") loadVideos();
    if (activeTab === "bookings") loadBookings();
    if (activeTab === "contacts") loadContacts();
    if (activeTab === "testimonials") loadTestimonials();
    if (activeTab === "pricing") loadPricing();
  }, [activeTab]);

  const normalizeArrayData = (data, key) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      if (key && Array.isArray(data[key])) return data[key];
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  };

  const loadGallery = async () => {
    try {
      const res = await galleryAPI.getAll();
      setImages(normalizeArrayData(res?.data !== undefined ? res.data : res, 'gallery'));
    } catch (err) {
      console.warn("Could not load gallery:", err);
      setImages([]);
    }
  };

  const loadHero = async () => {
    try {
      const res = await heroAPI.get();
      const heroData = res?.data !== undefined ? res.data : res;
      setCurrentHero(heroData || null);
    } catch (err) {
      console.warn("Could not load hero:", err);
      setCurrentHero(null);
    }
  };

  const loadStory = async () => {
    try {
      const res = await contentAPI.get('about');
      const data = res?.data !== undefined ? res.data : res;
      const content = data?.content || data;
      setCurrentStory(content || null);
    } catch (err) {
      console.warn("Could not load studio story:", err);
      setCurrentStory(null);
    }
  };

  const loadServices = async () => {
    try {
      const res = await serviceAPI.getAdminAll();
      setServices(normalizeArrayData(res?.data !== undefined ? res.data : res, 'services'));
    } catch (err) {
      console.warn("Could not load services:", err);
      setServices([]);
    }
  };

  const loadVideos = async () => {
    try {
      const res = await videoAPI.getAdminAll();
      setVideos(normalizeArrayData(res?.data !== undefined ? res.data : res, 'videos'));
    } catch (err) {
      console.warn("Could not load videos:", err);
      setVideos([]);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await bookingAPI.getAll();
      setBookings(normalizeArrayData(res?.data !== undefined ? res.data : res, 'bookings'));
    } catch (err) {
      console.warn("Could not load bookings:", err);
      setBookings([]);
    }
  };

  const loadContacts = async () => {
    try {
      const res = await contactAPI.getAll();
      setContacts(normalizeArrayData(res?.data !== undefined ? res.data : res, 'contacts'));
    } catch (err) {
      console.warn("Could not load contacts:", err);
      setContacts([]);
    }
  };

  const loadTestimonials = async () => {
    try {
      const res = await testimonialAPI.getAdminAll();
      setTestimonials(normalizeArrayData(res?.data !== undefined ? res.data : res, 'testimonials'));
    } catch (err) {
      console.warn("Could not load testimonials:", err);
      setTestimonials([]);
    }
  };

  const loadPricing = async () => {
    try {
      const res = await pricingAPI.getAll();
      setPricing(normalizeArrayData(res?.data !== undefined ? res.data : res, 'pricing'));
    } catch (err) {
      console.warn("Could not load pricing:", err);
      setPricing([]);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status });
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update booking status");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await bookingAPI.delete(id);
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete booking");
    }
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Delete this contact enquiry?")) return;
    try {
      await contactAPI.delete(id);
      await loadContacts();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete contact enquiry");
    }
  };

  const getFileTypeString = (file) => {
    if (!file) return '';
    if (file.type) {
      const sub = file.type.split('/')[1];
      if (sub) return sub.toUpperCase();
    }
    const ext = file.name ? file.name.split('.').pop() : '';
    return (ext || 'IMAGE').toUpperCase();
  };

  // --- Gallery Handlers ---
  const handleGalleryFileChange = (e) => {
    setGalleryError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setUploadFile(null);
      return;
    }

    try {
      validateImageFile(file);
      setUploadFile(file);
    } catch (err) {
      setGalleryError(err.message);
      e.target.value = '';
      setUploadFile(null);
    }
  };

  const handleCancelGalleryUpload = () => {
    if (galleryAbortRef.current) {
      galleryAbortRef.current.abort();
      galleryAbortRef.current = null;
    }
    setIsUploadingGallery(false);
    setGalleryProgress(0);
    setGalleryStage("");
    setGalleryError("Upload cancelled by user.");
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setGalleryError("");

    if (!uploadFile) {
      setGalleryError("Please select an image file to upload.");
      return;
    }

    try {
      validateImageFile(uploadFile);
    } catch (validationErr) {
      setGalleryError(validationErr.message);
      return;
    }

    setIsUploadingGallery(true);
    setGalleryProgress(0);
    setGalleryStage("Initializing upload...");

    const controller = new AbortController();
    galleryAbortRef.current = controller;

    try {
      // 1. Direct signed chunked upload to Cloudinary (up to 150 MB)
      const cloudinaryResult = await uploadDirectToCloudinary(uploadFile, {
        folder: 'studio-y7/gallery',
        onProgress: (percent) => setGalleryProgress(percent),
        onStage: (stage) => setGalleryStage(stage),
        signal: controller.signal
      });

      // 2. Save metadata to MongoDB
      setGalleryStage("Saving metadata to database...");
      await galleryAPI.saveMetadata({
        title: uploadData.title,
        category: uploadData.category,
        featured: uploadData.featured,
        secure_url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id
      });

      // 3. Reset form and refresh gallery
      setUploadFile(null);
      setUploadData({ title: "", category: "Wedding", featured: false });
      setGalleryProgress(100);
      setGalleryStage("Image uploaded and saved successfully!");
      
      const fileInput = document.getElementById('gallery-file-input');
      if (fileInput) fileInput.value = '';
      
      await loadGallery();
      setTimeout(() => {
        setIsUploadingGallery(false);
        setGalleryProgress(0);
        setGalleryStage("");
      }, 2500);
    } catch (err) {
      console.error('Gallery upload error:', err);
      const errMsg = err.response?.data?.message || err.message || "Failed to upload image.";
      setGalleryError(errMsg);
      setIsUploadingGallery(false);
    } finally {
      galleryAbortRef.current = null;
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm("Delete this image? The asset will also be removed from Cloudinary.")) return;
    try {
      await galleryAPI.delete(id);
      loadGallery();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete image");
    }
  };

  // --- Hero Handlers ---
  const handleHeroFileChange = (e) => {
    setHeroError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setHeroFile(null);
      return;
    }

    try {
      validateImageFile(file);
      setHeroFile(file);
    } catch (err) {
      setHeroError(err.message);
      e.target.value = '';
      setHeroFile(null);
    }
  };

  const handleCancelHeroUpload = () => {
    if (heroAbortRef.current) {
      heroAbortRef.current.abort();
      heroAbortRef.current = null;
    }
    setIsUploadingHero(false);
    setHeroProgress(0);
    setHeroStage("");
    setHeroError("Hero upload cancelled by user.");
  };

  const handleHeroUploadSubmit = async (e) => {
    if (e) e.preventDefault();
    setHeroError("");

    if (!heroFile) {
      setHeroError("Please select a new hero image file to upload.");
      return;
    }

    try {
      validateImageFile(heroFile);
    } catch (validationErr) {
      setHeroError(validationErr.message);
      return;
    }

    setIsUploadingHero(true);
    setHeroProgress(0);
    setHeroStage("Initializing hero upload...");

    const controller = new AbortController();
    heroAbortRef.current = controller;

    try {
      // 1. Direct signed chunked upload to Cloudinary (up to 150 MB)
      const cloudinaryResult = await uploadDirectToCloudinary(heroFile, {
        folder: 'studio-y7/hero',
        onProgress: (percent) => setHeroProgress(percent),
        onStage: (stage) => setHeroStage(stage),
        signal: controller.signal
      });

      // 2. Save new active Hero to MongoDB and deactivate old
      setHeroStage("Activating new hero background...");
      await heroAPI.saveMetadata({
        secure_url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id
      });

      // 3. Reset form and reload active hero
      setHeroFile(null);
      setHeroProgress(100);
      setHeroStage("Hero image updated and activated successfully!");
      
      const fileInput = document.getElementById('hero-file-input');
      if (fileInput) fileInput.value = '';
      
      await loadHero();
      setTimeout(() => {
        setIsUploadingHero(false);
        setHeroProgress(0);
        setHeroStage("");
      }, 2500);
    } catch (err) {
      console.error('Hero upload error:', err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update hero image.";
      setHeroError(errMsg);
      setIsUploadingHero(false);
    } finally {
      heroAbortRef.current = null;
    }
  };

  // --- Studio Story Handlers ---
  const handleStoryFileChange = (e) => {
    setStoryError("");
    setStorySuccess("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setStoryFile(null);
      return;
    }

    try {
      validateImageFile(file);
      setStoryFile(file);
    } catch (err) {
      setStoryError(err.message);
      e.target.value = '';
      setStoryFile(null);
    }
  };

  const handleCancelStoryUpload = () => {
    if (storyAbortRef.current) {
      storyAbortRef.current.abort();
      storyAbortRef.current = null;
    }
    setIsUploadingStory(false);
    setStoryProgress(0);
    setStoryStage("");
    setStoryError("Studio Story upload cancelled by user.");
  };

  const handleStoryUploadSubmit = async (e) => {
    if (e) e.preventDefault();
    setStoryError("");
    setStorySuccess("");

    if (!storyFile) {
      setStoryError("Please select an image file to upload for Studio Story.");
      return;
    }

    try {
      validateImageFile(storyFile);
    } catch (validationErr) {
      setStoryError(validationErr.message);
      return;
    }

    setIsUploadingStory(true);
    setStoryProgress(0);
    setStoryStage("Initializing Studio Story upload...");

    const controller = new AbortController();
    storyAbortRef.current = controller;

    try {
      // 1. Direct signed chunked upload to Cloudinary (folder: 'studio-y7/about')
      const cloudinaryResult = await uploadDirectToCloudinary(storyFile, {
        folder: 'studio-y7/about',
        onProgress: (percent) => setStoryProgress(percent),
        onStage: (stage) => setStoryStage(stage),
        signal: controller.signal
      });

      // 2. Save metadata to MongoDB SiteContent ('about')
      setStoryStage("Updating Studio Story in database...");
      await contentAPI.update('about', {
        content: {
          imageUrl: cloudinaryResult.secure_url,
          secure_url: cloudinaryResult.secure_url,
          public_id: cloudinaryResult.public_id,
          storyImage: cloudinaryResult.secure_url
        }
      });

      // 3. Reset file, set progress & reload
      setStoryFile(null);
      setStoryProgress(100);
      setStoryStage("Studio Story image updated successfully!");
      setStorySuccess("Studio Story image uploaded and updated successfully!");

      const fileInput = document.getElementById('story-file-input');
      if (fileInput) fileInput.value = '';

      await loadStory();
      setTimeout(() => {
        setIsUploadingStory(false);
        setStoryProgress(0);
        setStoryStage("");
      }, 2500);
    } catch (err) {
      console.error('Studio Story upload error:', err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update Studio Story image.";
      setStoryError(errMsg);
      setIsUploadingStory(false);
    } finally {
      storyAbortRef.current = null;
    }
  };

  // --- Services Handlers ---
  const handleServiceFileChange = (e) => {
    setServiceError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setServiceFile(null);
      return;
    }

    try {
      validateImageFile(file);
      setServiceFile(file);
    } catch (err) {
      setServiceError(err.message);
      e.target.value = '';
      setServiceFile(null);
    }
  };

  const handleCancelServiceUpload = () => {
    if (serviceAbortRef.current) {
      serviceAbortRef.current.abort();
      serviceAbortRef.current = null;
    }
    setIsUploadingService(false);
    setServiceProgress(0);
    setServiceStage("");
    setServiceError("Upload cancelled by user.");
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setServiceError("");

    if (!editingService && !serviceFile) {
      setServiceError("Please select a sample image for this photography service.");
      return;
    }

    if (!serviceForm.title.trim()) {
      setServiceError("Service title is required.");
      return;
    }

    setIsUploadingService(true);
    setServiceProgress(0);

    let secure_url = '';
    let public_id = '';

    try {
      if (serviceFile) {
        setServiceStage("Uploading service image to Cloudinary...");
        const controller = new AbortController();
        serviceAbortRef.current = controller;

        const cloudinaryResult = await uploadDirectToCloudinary(serviceFile, {
          folder: 'studio-y7/services',
          onProgress: (percent) => setServiceProgress(percent),
          onStage: (stage) => setServiceStage(stage),
          signal: controller.signal
        });

        secure_url = cloudinaryResult.secure_url;
        public_id = cloudinaryResult.public_id;
      }

      setServiceStage(editingService ? "Updating service in database..." : "Saving service to database...");
      
      const cleanedPackages = (serviceForm.packages || [])
        .filter(p => p && p.name && p.name.trim())
        .map(p => ({
          name: p.name.trim(),
          price: p.price ? p.price.trim() : "Contact for pricing",
          description: p.description ? p.description.trim() : ""
        }));

      const payload = {
        title: serviceForm.title.trim(),
        description: serviceForm.description.trim(),
        order: serviceForm.order ? Number(serviceForm.order) : 0,
        packages: cleanedPackages
      };

      if (secure_url) {
        payload.secure_url = secure_url;
        payload.public_id = public_id;
      }

      if (editingService) {
        await serviceAPI.update(editingService, payload);
      } else {
        await serviceAPI.create(payload);
      }

      setServiceForm({ title: "", description: "", order: 0, packages: [{ name: "", price: "", description: "" }] });
      setServiceFile(null);
      setEditingService(null);
      const sInput = document.getElementById('service-file-input');
      if (sInput) sInput.value = '';

      await loadServices();
      alert(editingService ? "Photography service updated successfully!" : "Photography service added successfully!");
    } catch (err) {
      console.error('Service save error:', err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save service";
      setServiceError(errMsg);
      alert(errMsg);
    } finally {
      setIsUploadingService(false);
      setServiceProgress(0);
      setServiceStage("");
      serviceAbortRef.current = null;
    }
  };

  const handleAddPackageToServiceForm = () => {
    setServiceForm(prev => ({
      ...prev,
      packages: [...(prev.packages || []), { name: "", price: "", description: "" }]
    }));
  };

  const handleRemovePackageFromServiceForm = (index) => {
    setServiceForm(prev => {
      const updated = [...(prev.packages || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        packages: updated.length > 0 ? updated : [{ name: "", price: "", description: "" }]
      };
    });
  };

  const handleServicePackageFieldChange = (index, field, value) => {
    setServiceForm(prev => {
      const updated = [...(prev.packages || [])];
      if (!updated[index]) updated[index] = { name: "", price: "", description: "" };
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, packages: updated };
    });
  };

  const handleEditService = (service) => {
    setEditingService(service._id);
    setServiceForm({
      title: service.title || "",
      description: service.description || "",
      order: service.order || 0,
      packages: (service.packages && service.packages.length > 0)
        ? service.packages.map(p => ({
            name: p.name || "",
            price: p.price || "",
            description: p.description || ""
          }))
        : [{ name: "", price: "", description: "" }]
    });
    setServiceFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Delete this photography service? Its sample image will also be removed from Cloudinary.")) return;
    try {
      await serviceAPI.delete(id);
      await loadServices();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete service");
    }
  };

  // --- Video Handlers ---
  const handleVideoFileChange = (e) => {
    setVideoError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setVideoFile(null);
      return;
    }

    try {
      validateVideoFile(file);
      setVideoFile(file);
    } catch (err) {
      setVideoError(err.message);
      e.target.value = '';
      setVideoFile(null);
    }
  };

  const handleVideoThumbnailFileChange = (e) => {
    setVideoError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setVideoThumbnailFile(null);
      return;
    }

    try {
      validateImageFile(file);
      setVideoThumbnailFile(file);
    } catch (err) {
      setVideoError(err.message);
      e.target.value = '';
      setVideoThumbnailFile(null);
    }
  };

  const handleCancelVideoUpload = () => {
    if (videoAbortRef.current) {
      videoAbortRef.current.abort();
      videoAbortRef.current = null;
    }
    setIsUploadingVideo(false);
    setVideoProgress(0);
    setVideoStage("");
    setVideoError("Video upload cancelled by user.");
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setVideoError("");

    if (!videoForm.title.trim()) {
      setVideoError("Video title is required.");
      return;
    }

    if (videoForm.sourceType === "cloudinary") {
      if (!editingVideo && !videoFile) {
        setVideoError("Please select a video file to upload for Cloudinary source.");
        return;
      }
    } else if (videoForm.sourceType === "youtube") {
      if (!videoForm.videoUrl || !videoForm.videoUrl.trim()) {
        setVideoError("Please provide a valid YouTube video URL.");
        return;
      }
      const ytId = extractYouTubeId(videoForm.videoUrl);
      if (!ytId) {
        setVideoError("Invalid YouTube URL. Please enter a valid YouTube video link (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...).");
        return;
      }
    }

    setIsUploadingVideo(true);
    setVideoProgress(0);

    let videoUrl = videoForm.videoUrl;
    let cloudinaryPublicId = '';
    let thumbnailUrl = '';
    let thumbnailPublicId = '';

    const controller = new AbortController();
    videoAbortRef.current = controller;

    try {
      // If uploading direct video file to Cloudinary
      if (videoForm.sourceType === "cloudinary" && videoFile) {
        setVideoStage("Uploading video file to Cloudinary (direct chunked)...");
        const videoRes = await uploadDirectToCloudinary(videoFile, {
          folder: 'studio-y7/videos',
          fileType: 'video',
          onProgress: (percent) => setVideoProgress(percent),
          onStage: (stage) => setVideoStage(stage),
          signal: controller.signal
        });
        videoUrl = videoRes.secure_url;
        cloudinaryPublicId = videoRes.public_id;
      }

      // If uploading custom thumbnail image
      if (videoThumbnailFile) {
        setVideoStage("Uploading video thumbnail to Cloudinary...");
        const thumbRes = await uploadDirectToCloudinary(videoThumbnailFile, {
          folder: 'studio-y7/video-thumbnails',
          onProgress: (percent) => setVideoProgress(percent),
          onStage: (stage) => setVideoStage(stage),
          signal: controller.signal
        });
        thumbnailUrl = thumbRes.secure_url;
        thumbnailPublicId = thumbRes.public_id;
      }

      setVideoStage(editingVideo ? "Updating video in database..." : "Saving video to database...");

      const payload = {
        title: videoForm.title.trim(),
        description: videoForm.description ? videoForm.description.trim() : "",
        sourceType: videoForm.sourceType,
        order: videoForm.order ? Number(videoForm.order) : 0,
        active: videoForm.active !== undefined ? videoForm.active : true
      };

      if (videoUrl) payload.videoUrl = videoUrl;
      if (cloudinaryPublicId) payload.cloudinaryPublicId = cloudinaryPublicId;
      if (thumbnailUrl) {
        payload.thumbnailUrl = thumbnailUrl;
        payload.thumbnailPublicId = thumbnailPublicId;
      }

      if (editingVideo) {
        await videoAPI.update(editingVideo, payload);
      } else {
        await videoAPI.create(payload);
      }

      setVideoForm({
        title: "",
        description: "",
        sourceType: "cloudinary",
        videoUrl: "",
        order: 0,
        active: true
      });
      setVideoFile(null);
      setVideoThumbnailFile(null);
      setEditingVideo(null);
      const vInput = document.getElementById('video-file-input');
      if (vInput) vInput.value = '';
      const vtInput = document.getElementById('video-thumbnail-input');
      if (vtInput) vtInput.value = '';

      await loadVideos();
      alert(editingVideo ? "Video updated successfully!" : "Video added successfully!");
    } catch (err) {
      console.error('Video save error:', err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save video";
      setVideoError(errMsg);
      alert(errMsg);
    } finally {
      setIsUploadingVideo(false);
      setVideoProgress(0);
      setVideoStage("");
      videoAbortRef.current = null;
    }
  };

  const handleEditVideo = (v) => {
    setEditingVideo(v._id);
    setVideoForm({
      title: v.title || "",
      description: v.description || "",
      sourceType: v.sourceType || "cloudinary",
      videoUrl: v.videoUrl || "",
      order: v.order || 0,
      active: v.active !== undefined ? v.active : true
    });
    setVideoFile(null);
    setVideoThumbnailFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm("Delete this video / reel? Its Cloudinary assets will also be cleaned up.")) return;
    try {
      await videoAPI.delete(id);
      await loadVideos();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete video");
    }
  };

  const handleToggleVideoStatus = async (id, currentActive) => {
    try {
      await videoAPI.update(id, { active: !currentActive });
      await loadVideos();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update video status");
    }
  };

  const handleToggleTestimonialStatus = async (id, currentActive) => {
    try {
      await testimonialAPI.update(id, { active: !currentActive });
      await loadTestimonials();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update testimonial status");
    }
  };

  // --- Testimonial Handlers ---
  const handleTestimonialFileChange = (e) => {
    setTestimonialError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setTestimonialFile(null);
      return;
    }

    try {
      validateImageFile(file);
      setTestimonialFile(file);
    } catch (err) {
      setTestimonialError(err.message);
      e.target.value = '';
      setTestimonialFile(null);
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setTestimonialError("");

    setIsUploadingTestimonial(true);
    setTestimonialProgress(0);

    let secure_url = '';
    let public_id = '';

    try {
      if (testimonialFile) {
        setTestimonialStage("Uploading customer photo to Cloudinary...");
        const controller = new AbortController();
        testimonialAbortRef.current = controller;

        const cloudinaryResult = await uploadDirectToCloudinary(testimonialFile, {
          folder: 'studio-y7/testimonials',
          onProgress: (percent) => setTestimonialProgress(percent),
          onStage: (stage) => setTestimonialStage(stage),
          signal: controller.signal
        });

        secure_url = cloudinaryResult.secure_url;
        public_id = cloudinaryResult.public_id;
      }

      setTestimonialStage("Saving testimonial...");
      await testimonialAPI.create({
        name: testimonialForm.name,
        role: testimonialForm.role,
        content: testimonialForm.content,
        rating: testimonialForm.rating,
        secure_url,
        public_id
      });

      setTestimonialForm({ name: "", role: "", content: "", rating: 5 });
      setTestimonialFile(null);
      const testInput = document.getElementById('testimonial-file-input');
      if (testInput) testInput.value = '';
      
      await loadTestimonials();
      alert("Testimonial added successfully!");
    } catch (err) {
      console.error('Testimonial error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to add testimonial";
      setTestimonialError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploadingTestimonial(false);
      setTestimonialProgress(0);
      setTestimonialStage("");
      testimonialAbortRef.current = null;
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await testimonialAPI.delete(id);
      loadTestimonials();
    } catch (err) {}
  };

  // Pricing Handlers
  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...pricingForm,
      features: pricingForm.features.filter(f => f.trim() !== "")
    };

    try {
      if (editingPricing) {
        await pricingAPI.update(editingPricing, data);
        setEditingPricing(null);
      } else {
        await pricingAPI.create(data);
      }
      setPricingForm({ name: "", price: "", description: "", features: [""], recommended: false });
      loadPricing();
      alert(editingPricing ? "Pricing updated!" : "Pricing added!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save pricing";
      alert(errorMessage);
    }
  };

  const handleEditPricing = (pkg) => {
    setEditingPricing(pkg._id);
    setPricingForm({
      name: pkg.name,
      price: pkg.price,
      description: pkg.description || "",
      features: pkg.features && pkg.features.length > 0 ? pkg.features : [""],
      recommended: pkg.recommended
    });
  };

  const handleDeletePricing = async (id) => {
    if (!confirm("Delete this pricing package?")) return;
    try {
      await pricingAPI.delete(id);
      loadPricing();
    } catch (err) {}
  };

  const addFeatureField = () => {
    setPricingForm({ ...pricingForm, features: [...pricingForm.features, ""] });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...pricingForm.features];
    newFeatures[index] = value;
    setPricingForm({ ...pricingForm, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = pricingForm.features.filter((_, i) => i !== index);
    setPricingForm({ ...pricingForm, features: newFeatures });
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F2" }}>
      {/* Header */}
      <div className="glass sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <h1 className="font-display text-xl sm:text-2xl font-semibold" style={{ color: "#1F1F1F" }}>Studio Y7 Dashboard</h1>
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
            style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
          >
            <FaHome /> <span className="hidden sm:inline">View Site</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
            style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
          >
            <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-w-0">
        {/* Sidebar / Navigation Bar */}
        <div className="w-full lg:w-64 p-3 sm:p-4 lg:p-6 glass overflow-x-auto lg:overflow-x-visible lg:min-h-[calc(100vh-80px)] border-b lg:border-b-0 lg:border-r border-black/10 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: FaHome },
              { id: "gallery", label: "Gallery", icon: FaImage },
              { id: "hero", label: "Hero Image", icon: FaUpload },
              { id: "story", label: "Studio Story", icon: FaBookOpen },
              { id: "services", label: "Services", icon: FaCamera },
              { id: "videos", label: "Videos / Reels", icon: FaVideo },
              { id: "bookings", label: "Bookings", icon: FaCalendar },
              { id: "contacts", label: "Contacts", icon: FaEnvelope },
              { id: "pricing", label: "Pricing", icon: FaStar },
              { id: "testimonials", label: "Testimonials", icon: FaStar },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(item.id)}
                className="whitespace-nowrap flex-shrink-0 lg:w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-left text-xs sm:text-sm font-medium flex items-center gap-2.5 sm:gap-3 transition-all"
                style={{
                  background: activeTab === item.id ? "rgba(197, 106, 69, 0.1)" : "transparent",
                  color: activeTab === item.id ? "#C56A45" : "#666666",
                }}
              >
                <item.icon /> {item.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === "overview" && (
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Dashboard Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5 md:gap-6">
                {[
                  { label: "Total Images", value: Array.isArray(images) ? images.length : 0, icon: FaImage },
                  { label: "Services", value: Array.isArray(services) ? services.length : 0, icon: FaCamera },
                  { label: "Videos / Reels", value: Array.isArray(videos) ? videos.length : 0, icon: FaVideo },
                  { label: "Bookings", value: Array.isArray(bookings) ? bookings.length : 0, icon: FaCalendar },
                  { label: "Contacts", value: Array.isArray(contacts) ? contacts.length : 0, icon: FaEnvelope },
                  { label: "Testimonials", value: Array.isArray(testimonials) ? testimonials.length : 0, icon: FaStar },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass soft-shadow p-4 sm:p-6 rounded-3xl"
                  >
                    <stat.icon className="text-2xl sm:text-3xl mb-2 sm:mb-3" style={{ color: "#C56A45" }} />
                    <h3 className="font-display text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#1F1F1F" }}>{stat.value}</h3>
                    <p className="text-xs sm:text-sm" style={{ color: "#666666" }}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Gallery Management</h2>
              
              {/* Upload Form */}
              <form onSubmit={handleImageUpload} className="glass soft-shadow p-6 sm:p-8 rounded-3xl mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: "#1F1F1F" }}>Upload High-Resolution Photo</h3>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Direct signed chunked upload to Cloudinary. Supports up to 150 MB (JPG, JPEG, PNG, WEBP).
                    </p>
                  </div>
                </div>

                {galleryError && (
                  <div className="mb-4 p-4 rounded-2xl bg-red-50/80 border border-red-200 flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-red-700 leading-relaxed font-medium">
                      {galleryError}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Image Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Elegant Sunset Ceremony"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      required
                      disabled={isUploadingGallery}
                      className="w-full px-4 py-2.5 rounded-xl glass text-sm"
                      style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Category</label>
                    <select
                      value={uploadData.category}
                      onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                      disabled={isUploadingGallery}
                      className="w-full px-4 py-2.5 rounded-xl glass text-sm"
                      style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Couple">Couple</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>
                </div>

                {/* File Picker & Metadata Card */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Select Image File (Max 150 MB)</label>
                  <input
                    id="gallery-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleGalleryFileChange}
                    required={!uploadFile}
                    disabled={isUploadingGallery}
                    className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                  />

                  {uploadFile && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-[#C56A45]/20 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C56A45]/10 text-[#C56A45] shrink-0">
                          <FaImage />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1F1F1F] truncate">{uploadFile.name}</p>
                          <p className="text-[11px] text-[#666666] mt-0.5">
                            <span className="font-medium text-[#C56A45]">{formatFileSize(uploadFile.size)}</span> • Format: <span className="font-medium uppercase">{getFileTypeString(uploadFile)}</span>
                          </p>
                        </div>
                      </div>
                      {!isUploadingGallery && (
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFile(null);
                            const el = document.getElementById('gallery-file-input');
                            if (el) el.value = '';
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove file"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Real-Time Upload Progress */}
                {isUploadingGallery && (
                  <div className="mb-5 p-4 rounded-2xl bg-[#C56A45]/5 border border-[#C56A45]/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#1F1F1F] flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#C56A45] animate-ping" />
                        {galleryStage || "Uploading to Cloudinary..."}
                      </span>
                      <span className="text-xs font-bold text-[#C56A45]">{galleryProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${galleryProgress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#666666]">
                        {uploadFile ? `Direct Cloudinary chunked transfer (${formatFileSize(uploadFile.size)})` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelGalleryUpload}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                      >
                        Cancel Upload
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <motion.button
                    type="submit"
                    disabled={isUploadingGallery}
                    whileHover={!isUploadingGallery ? { scale: 1.02 } : {}}
                    whileTap={!isUploadingGallery ? { scale: 0.98 } : {}}
                    className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-opacity flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #C56A45, #D88165)",
                      opacity: isUploadingGallery ? 0.7 : 1,
                      cursor: isUploadingGallery ? "not-allowed" : "pointer"
                    }}
                  >
                    <FaUpload />
                    {isUploadingGallery ? `Uploading (${galleryProgress}%)...` : "Upload Image to Gallery"}
                  </motion.button>
                </div>
              </form>

              {/* Image Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {images.map((img) => (
                  <div key={img._id} className="glass soft-shadow rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <img src={getOptimizedImageUrl(img.imageUrl, { width: 800, quality: 'auto:best' })} alt={img.title} className="w-full h-52 object-cover" />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm truncate" style={{ color: "#1F1F1F" }}>{img.title}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C56A45]/10 text-[#C56A45]">
                            {img.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeleteImage(img._id)}
                        className="w-full px-4 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors hover:bg-red-50 hover:text-red-600"
                        style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                      >
                        <FaTrash /> Delete Image
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "hero" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Hero Image Management</h2>
              
              {currentHero?.imageUrl && (
                <div className="glass soft-shadow p-6 sm:p-8 rounded-3xl mb-8">
                  <h3 className="font-semibold text-lg mb-1" style={{ color: "#1F1F1F" }}>Active Homepage Hero Preview</h3>
                  <p className="text-xs text-[#666666] mb-4">
                    Current active hero image displayed to visitors on the homepage.
                  </p>
                  <div className="rounded-2xl overflow-hidden max-w-2xl h-72 border border-black/10 soft-shadow">
                    <img src={getOptimizedImageUrl(currentHero.imageUrl, { width: 1200, quality: 'auto:best' })} alt="Current Hero" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <form onSubmit={handleHeroUploadSubmit} className="glass soft-shadow p-6 sm:p-8 rounded-3xl">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "#1F1F1F" }}>
                  {isUploadingHero ? "Uploading Hero Image..." : "Upload New Hero Background Image"}
                </h3>
                <p className="text-xs mb-5 text-[#666666]">
                  Upload high-res background photograph (up to 150 MB). Uploads directly to Cloudinary and immediately updates homepage hero without rebuilds.
                </p>

                {heroError && (
                  <div className="mb-4 p-4 rounded-2xl bg-red-50/80 border border-red-200 flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-red-700 leading-relaxed font-medium">
                      {heroError}
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <input
                    id="hero-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleHeroFileChange}
                    disabled={isUploadingHero}
                    className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                  />

                  {heroFile && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-[#C56A45]/20 flex items-center justify-between gap-4 max-w-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C56A45]/10 text-[#C56A45] shrink-0">
                          <FaImage />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1F1F1F] truncate">{heroFile.name}</p>
                          <p className="text-[11px] text-[#666666] mt-0.5">
                            <span className="font-medium text-[#C56A45]">{formatFileSize(heroFile.size)}</span> • Format: <span className="font-medium uppercase">{getFileTypeString(heroFile)}</span>
                          </p>
                        </div>
                      </div>
                      {!isUploadingHero && (
                        <button
                          type="button"
                          onClick={() => {
                            setHeroFile(null);
                            const el = document.getElementById('hero-file-input');
                            if (el) el.value = '';
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove file"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Real-Time Upload Progress for Hero */}
                {isUploadingHero && (
                  <div className="mb-5 p-4 rounded-2xl bg-[#C56A45]/5 border border-[#C56A45]/20 max-w-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#1F1F1F] flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#C56A45] animate-ping" />
                        {heroStage || "Uploading to Cloudinary..."}
                      </span>
                      <span className="text-xs font-bold text-[#C56A45]">{heroProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${heroProgress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#666666]">
                        {heroFile ? `Direct Cloudinary transfer (${formatFileSize(heroFile.size)})` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelHeroUpload}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                      >
                        Cancel Upload
                      </button>
                    </div>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isUploadingHero || !heroFile}
                  whileHover={!isUploadingHero && heroFile ? { scale: 1.02 } : {}}
                  whileTap={!isUploadingHero && heroFile ? { scale: 0.98 } : {}}
                  className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-opacity flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #C56A45, #D88165)",
                    opacity: (isUploadingHero || !heroFile) ? 0.6 : 1,
                    cursor: (isUploadingHero || !heroFile) ? "not-allowed" : "pointer"
                  }}
                >
                  <FaUpload />
                  {isUploadingHero ? `Uploading Hero (${heroProgress}%)...` : "Upload & Activate Hero"}
                </motion.button>
              </form>
            </div>
          )}

          {activeTab === "story" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Studio Story Image Management</h2>

              {/* Current Studio Story Preview */}
              <div className="glass soft-shadow p-6 sm:p-8 rounded-3xl mb-8">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "#1F1F1F" }}>Current Studio Story Image Preview</h3>
                <p className="text-xs text-[#666666] mb-4">
                  Current image representing the Studio Y7 journey displayed in the "Our Story" section on the public website.
                </p>
                <div className="rounded-2xl overflow-hidden max-w-sm border border-black/10 soft-shadow bg-neutral-100">
                  {currentStory?.imageUrl || currentStory?.secure_url || currentStory?.storyImage ? (
                    <img
                      src={getOptimizedImageUrl(currentStory.imageUrl || currentStory.secure_url || currentStory.storyImage, { width: 1000, quality: 'auto:best' })}
                      alt="Current Studio Story"
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-72 p-6 text-center text-gray-400">
                      <FaImage className="text-4xl mb-2 text-[#C56A45]/40" />
                      <p className="text-sm font-medium text-gray-600">Default Story Image Active</p>
                      <p className="text-xs text-gray-400 mt-1">Upload a custom image below to replace the default photo.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleStoryUploadSubmit} className="glass soft-shadow p-6 sm:p-8 rounded-3xl">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "#1F1F1F" }}>
                  {isUploadingStory ? "Uploading Studio Story Image..." : "Upload & Replace Studio Story Image"}
                </h3>
                <p className="text-xs mb-5 text-[#666666]">
                  Upload a high-resolution photograph (up to 150 MB). Uploads directly to Cloudinary (folder: <span className="font-mono text-[#C56A45]">studio-y7/about</span>) and immediately updates the public website without rebuilds.
                </p>

                {storySuccess && (
                  <div className="mb-4 p-4 rounded-2xl bg-green-50/80 border border-green-200 flex items-start gap-3">
                    <FaCheckCircle className="text-green-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-green-800 leading-relaxed font-medium">
                      {storySuccess}
                    </div>
                  </div>
                )}

                {storyError && (
                  <div className="mb-4 p-4 rounded-2xl bg-red-50/80 border border-red-200 flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-red-700 leading-relaxed font-medium">
                      {storyError}
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">
                    Select New Image File (Max 150 MB)
                  </label>
                  <input
                    id="story-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleStoryFileChange}
                    disabled={isUploadingStory}
                    className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                  />

                  {storyFile && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-[#C56A45]/20 flex items-center justify-between gap-4 max-w-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C56A45]/10 text-[#C56A45] shrink-0">
                          <FaImage />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1F1F1F] truncate">{storyFile.name}</p>
                          <p className="text-[11px] text-[#666666] mt-0.5">
                            <span className="font-medium text-[#C56A45]">{formatFileSize(storyFile.size)}</span> • Format: <span className="font-medium uppercase">{getFileTypeString(storyFile)}</span>
                          </p>
                        </div>
                      </div>
                      {!isUploadingStory && (
                        <button
                          type="button"
                          onClick={() => {
                            setStoryFile(null);
                            const el = document.getElementById('story-file-input');
                            if (el) el.value = '';
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove file"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Real-Time Upload Progress */}
                {isUploadingStory && (
                  <div className="mb-5 p-4 rounded-2xl bg-[#C56A45]/5 border border-[#C56A45]/20 max-w-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#1F1F1F] flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#C56A45] animate-ping" />
                        {storyStage || "Uploading to Cloudinary..."}
                      </span>
                      <span className="text-xs font-bold text-[#C56A45]">{storyProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${storyProgress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#666666]">
                        {storyFile ? `Direct Cloudinary chunked transfer (${formatFileSize(storyFile.size)})` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelStoryUpload}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                      >
                        Cancel Upload
                      </button>
                    </div>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isUploadingStory || !storyFile}
                  whileHover={!isUploadingStory && storyFile ? { scale: 1.02 } : {}}
                  whileTap={!isUploadingStory && storyFile ? { scale: 0.98 } : {}}
                  className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-opacity flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #C56A45, #D88165)",
                    opacity: (isUploadingStory || !storyFile) ? 0.6 : 1,
                    cursor: (isUploadingStory || !storyFile) ? "not-allowed" : "pointer"
                  }}
                >
                  <FaUpload />
                  {isUploadingStory ? `Uploading Story Image (${storyProgress}%)...` : "Upload & Update Studio Story"}
                </motion.button>
              </form>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Photography Services Management</h2>
              
              {/* Add / Edit Service Form */}
              <form onSubmit={handleServiceSubmit} className="glass soft-shadow p-6 sm:p-8 rounded-3xl mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: "#1F1F1F" }}>
                      {editingService ? "Edit Photography Service" : "Add New Photography Service"}
                    </h3>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Sample image uploaded directly to Cloudinary (up to 150 MB). Packages and pricing belong directly inside each service.
                    </p>
                  </div>
                  {editingService && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setServiceForm({ title: "", description: "", order: 0, packages: [{ name: "", price: "", description: "" }] });
                        setServiceFile(null);
                      }}
                      className="px-4 py-1.5 rounded-full text-xs font-medium bg-black/5 hover:bg-black/10 text-[#666666]"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {serviceError && (
                  <div className="mb-4 p-4 rounded-2xl bg-red-50/80 border border-red-200 flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-red-700 leading-relaxed font-medium">
                      {serviceError}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Service Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding Photography, Couple Shoot, Maternity"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      required
                      disabled={isUploadingService}
                      className="w-full px-4 py-2.5 rounded-xl glass text-sm"
                      style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Display Order</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={serviceForm.order}
                      onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })}
                      disabled={isUploadingService}
                      className="w-full px-4 py-2.5 rounded-xl glass text-sm"
                      style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Full Description (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Comprehensive description of this photography service shown in details modal..."
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    disabled={isUploadingService}
                    className="w-full px-4 py-2.5 rounded-xl glass text-sm resize-none"
                    style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                  />
                </div>

                {/* Package Management inside Service Form */}
                <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-black/[0.02] border border-black/5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F1F1F]">Service Packages & Pricing</h4>
                      <p className="text-xs text-[#666666]">Define the package options (e.g. Mini, Premium, Luxury) for this service.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPackageToServiceForm}
                      disabled={isUploadingService}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#C56A45]/10 text-[#C56A45] hover:bg-[#C56A45]/20 transition-colors"
                    >
                      + Add Package
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(serviceForm.packages || []).map((pkg, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/80 border border-black/5 flex flex-col md:flex-row gap-2.5 items-start md:items-center">
                        <div className="w-full md:w-1/4">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Package Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Mini / Premium / Luxury"
                            value={pkg.name}
                            onChange={(e) => handleServicePackageFieldChange(idx, "name", e.target.value)}
                            disabled={isUploadingService}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/[0.03] border border-black/5"
                          />
                        </div>
                        <div className="w-full md:w-1/4">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Price</label>
                          <input
                            type="text"
                            placeholder="e.g. ₹12,000"
                            value={pkg.price}
                            onChange={(e) => handleServicePackageFieldChange(idx, "price", e.target.value)}
                            disabled={isUploadingService}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/[0.03] border border-black/5"
                          />
                        </div>
                        <div className="w-full md:flex-1">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Short Description (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. 2 hours shoot, 30 edited photos & reel"
                            value={pkg.description}
                            onChange={(e) => handleServicePackageFieldChange(idx, "description", e.target.value)}
                            disabled={isUploadingService}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/[0.03] border border-black/5"
                          />
                        </div>
                        {(serviceForm.packages || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePackageFromServiceForm(idx)}
                            disabled={isUploadingService}
                            className="text-gray-400 hover:text-red-500 p-2 self-end md:self-center transition-colors"
                            title="Remove Package"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">
                    Sample Image {editingService ? "(Optional - keep existing if unselected)" : "*"} (Max 150 MB)
                  </label>
                  <input
                    id="service-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleServiceFileChange}
                    disabled={isUploadingService}
                    className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                  />

                  {serviceFile && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-[#C56A45]/20 flex items-center justify-between gap-4 max-w-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C56A45]/10 text-[#C56A45] shrink-0">
                          <FaImage />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1F1F1F] truncate">{serviceFile.name}</p>
                          <p className="text-[11px] text-[#666666] mt-0.5">
                            <span className="font-medium text-[#C56A45]">{formatFileSize(serviceFile.size)}</span> • Format: <span className="font-medium uppercase">{getFileTypeString(serviceFile)}</span>
                          </p>
                        </div>
                      </div>
                      {!isUploadingService && (
                        <button
                          type="button"
                          onClick={() => {
                            setServiceFile(null);
                            const el = document.getElementById('service-file-input');
                            if (el) el.value = '';
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove file"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {isUploadingService && serviceFile && (
                  <div className="mb-5 p-4 rounded-2xl bg-[#C56A45]/5 border border-[#C56A45]/20 max-w-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#1F1F1F] flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#C56A45] animate-ping" />
                        {serviceStage || "Uploading image to Cloudinary..."}
                      </span>
                      <span className="text-xs font-bold text-[#C56A45]">{serviceProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${serviceProgress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#666666]">
                        Direct Cloudinary transfer ({formatFileSize(serviceFile.size)})
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelServiceUpload}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                      >
                        Cancel Upload
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    disabled={isUploadingService}
                    whileHover={!isUploadingService ? { scale: 1.02 } : {}}
                    whileTap={!isUploadingService ? { scale: 0.98 } : {}}
                    className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-opacity flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #C56A45, #D88165)",
                      opacity: isUploadingService ? 0.7 : 1,
                      cursor: isUploadingService ? "not-allowed" : "pointer"
                    }}
                  >
                    <FaUpload />
                    {isUploadingService ? (editingService ? "Updating Service..." : "Adding Service...") : (editingService ? "Update Service" : "Add Service")}
                  </motion.button>
                </div>
              </form>

              {/* Services List */}
              <div className="grid md:grid-cols-3 gap-6">
                {services.map((srv) => (
                  <div key={srv._id} className="glass soft-shadow rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      {srv.imageUrl && (
                        <img
                          src={getOptimizedImageUrl(srv.imageUrl, { width: 800, quality: 'auto:best' })}
                          alt={srv.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-base" style={{ color: "#1F1F1F" }}>{srv.title}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C56A45]/10 text-[#C56A45]">
                            Order: {srv.order || 0}
                          </span>
                        </div>
                        {srv.description && (
                          <p className="text-xs text-[#666666] line-clamp-2 mb-3">{srv.description}</p>
                        )}
                        
                        {/* Packages summary inside service card */}
                        {srv.packages && srv.packages.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-black/5">
                            <p className="text-[10px] uppercase font-semibold text-gray-400 mb-1.5">Packages ({srv.packages.length}):</p>
                            <div className="flex flex-wrap gap-1.5">
                              {srv.packages.map((pkg, pIdx) => (
                                <span key={pIdx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/5 text-[#1F1F1F] font-medium">
                                  {pkg.name}: <span className="text-[#C56A45] font-semibold">{pkg.price}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 pt-0 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleEditService(srv)}
                        className="flex-1 px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: "rgba(115, 133, 109, 0.1)", color: "#73856D" }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleDeleteService(srv._id)}
                        className="flex-1 px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="col-span-full text-center py-12 glass rounded-3xl">
                    <p className="text-sm text-[#666666]">No custom services added yet. The public site is currently displaying default photography services.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Videos & Reels Management</h2>
              
              {/* Video Form */}
              <form onSubmit={handleVideoSubmit} className="glass soft-shadow p-6 sm:p-8 rounded-3xl mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: "#1F1F1F" }}>
                      {editingVideo ? "Edit Video / Reel" : "Add New Video / Reel"}
                    </h3>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Upload cinematic photography reels directly to Cloudinary (up to 150 MB) or embed YouTube video links.
                    </p>
                  </div>
                  {editingVideo && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVideo(null);
                        setVideoForm({
                          title: "",
                          description: "",
                          sourceType: "cloudinary",
                          videoUrl: "",
                          order: 0,
                          active: true
                        });
                        setVideoFile(null);
                        setVideoThumbnailFile(null);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#666666] font-medium transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {videoError && (
                  <div className="mb-4 p-4 rounded-2xl bg-red-50/80 border border-red-200 flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-red-700 leading-relaxed font-medium">
                      {videoError}
                    </div>
                  </div>
                )}

                {/* Title & Order */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Video Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Wedding Highlights, Sunset Couple Reel"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      required
                      disabled={isUploadingVideo}
                      className="w-full px-4 py-2.5 rounded-xl glass text-sm"
                      style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Display Order</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={videoForm.order}
                      onChange={(e) => setVideoForm({ ...videoForm, order: Number(e.target.value) })}
                      disabled={isUploadingVideo}
                      className="w-full px-4 py-2.5 rounded-xl glass text-sm"
                      style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                    />
                  </div>
                </div>

                {/* Source Type Selector */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">Video Source Type</label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isUploadingVideo}
                      onClick={() => setVideoForm({ ...videoForm, sourceType: "cloudinary" })}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        videoForm.sourceType === "cloudinary"
                          ? "bg-[#C56A45]/15 border-[#C56A45] text-[#C56A45] shadow-sm"
                          : "bg-white/60 border-black/10 text-[#666666] hover:bg-black/5"
                      }`}
                    >
                      <FaFilm /> Direct Video Upload (Cloudinary)
                    </button>
                    <button
                      type="button"
                      disabled={isUploadingVideo}
                      onClick={() => setVideoForm({ ...videoForm, sourceType: "youtube" })}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        videoForm.sourceType === "youtube"
                          ? "bg-red-500/15 border-red-500 text-red-600 shadow-sm"
                          : "bg-white/60 border-black/10 text-[#666666] hover:bg-black/5"
                      }`}
                    >
                      <FaYoutube className="text-red-600" /> YouTube Video URL
                    </button>
                  </div>
                </div>

                {/* Cloudinary Direct Video Picker */}
                {videoForm.sourceType === "cloudinary" && (
                  <div className="mb-5 p-4 rounded-2xl bg-black/[0.02] border border-black/5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">
                      Select Video File {editingVideo ? "(Optional - keep existing if unselected)" : "*"} (MP4, WEBM, MOV, Max 150 MB)
                    </label>
                    <input
                      id="video-file-input"
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/mov,video/ogg"
                      onChange={handleVideoFileChange}
                      disabled={isUploadingVideo}
                      className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                    />

                    {videoFile && (
                      <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-[#C56A45]/20 flex items-center justify-between gap-4 max-w-xl">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C56A45]/10 text-[#C56A45] shrink-0">
                            <FaVideo />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#1F1F1F] truncate">{videoFile.name}</p>
                            <p className="text-[11px] text-[#666666] mt-0.5">
                              <span className="font-medium text-[#C56A45]">{formatFileSize(videoFile.size)}</span> • Format: <span className="font-medium uppercase">{getFileTypeString(videoFile)}</span>
                            </p>
                          </div>
                        </div>
                        {!isUploadingVideo && (
                          <button
                            type="button"
                            onClick={() => {
                              setVideoFile(null);
                              const el = document.getElementById('video-file-input');
                              if (el) el.value = '';
                            }}
                            className="text-xs text-gray-400 hover:text-red-500 p-1 transition-colors"
                            title="Remove file"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* YouTube Link Input */}
                {videoForm.sourceType === "youtube" && (
                  <div className="mb-5 p-4 rounded-2xl bg-red-500/[0.03] border border-red-500/10">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">YouTube Video URL *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-500">
                        <FaYoutube />
                      </div>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        value={videoForm.videoUrl}
                        onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                        required={videoForm.sourceType === "youtube"}
                        disabled={isUploadingVideo}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-sm"
                        style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                      />
                    </div>
                    {videoForm.videoUrl && extractYouTubeId(videoForm.videoUrl) && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(videoForm.videoUrl)}/mqdefault.jpg`}
                          alt="YouTube preview"
                          className="w-24 h-14 object-cover rounded-lg border border-black/10 shadow-sm"
                        />
                        <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                          <FaCheckCircle /> Valid YouTube Video Link
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Thumbnail / Poster Image Picker */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">
                    Custom Cover / Thumbnail Image (Optional, Max 150 MB)
                  </label>
                  <input
                    id="video-thumbnail-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleVideoThumbnailFileChange}
                    disabled={isUploadingVideo}
                    className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                  />
                  {videoThumbnailFile && (
                    <div className="mt-2 text-xs text-[#C56A45] font-medium flex items-center gap-2">
                      <FaImage /> Thumbnail selected: {videoThumbnailFile.name} ({formatFileSize(videoThumbnailFile.size)})
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Short Description (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description or caption for this video / reel..."
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    disabled={isUploadingVideo}
                    className="w-full px-4 py-2.5 rounded-xl glass text-sm resize-none"
                    style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                  />
                </div>

                {/* Active Toggle */}
                <div className="mb-5 flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={videoForm.active}
                      onChange={(e) => setVideoForm({ ...videoForm, active: e.target.checked })}
                      disabled={isUploadingVideo}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C56A45]"></div>
                  </label>
                  <span className="text-xs font-semibold text-[#1F1F1F]">
                    {videoForm.active ? "Published (Visible on public site)" : "Draft (Hidden from public site)"}
                  </span>
                </div>

                {/* Upload Progress */}
                {isUploadingVideo && (
                  <div className="mb-5 p-4 rounded-2xl bg-[#C56A45]/5 border border-[#C56A45]/20 max-w-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#1F1F1F] flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#C56A45] animate-ping" />
                        {videoStage || "Processing video..."}
                      </span>
                      <span className="text-xs font-bold text-[#C56A45]">{videoProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${videoProgress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#666666]">
                        {videoFile ? `Direct Cloudinary chunked transfer (${formatFileSize(videoFile.size)})` : "Uploading assets..."}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelVideoUpload}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                      >
                        Cancel Upload
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    disabled={isUploadingVideo}
                    whileHover={!isUploadingVideo ? { scale: 1.02 } : {}}
                    whileTap={!isUploadingVideo ? { scale: 0.98 } : {}}
                    className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-opacity flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #C56A45, #D88165)",
                      opacity: isUploadingVideo ? 0.7 : 1,
                      cursor: isUploadingVideo ? "not-allowed" : "pointer"
                    }}
                  >
                    <FaUpload />
                    {isUploadingVideo ? (editingVideo ? "Updating Video..." : "Uploading Video...") : (editingVideo ? "Update Video / Reel" : "Add Video / Reel")}
                  </motion.button>
                </div>
              </form>

              {/* Video List */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((vid) => {
                  let posterImg = vid.thumbnailUrl;
                  if (!posterImg) {
                    if (vid.sourceType === "youtube") {
                      const yId = extractYouTubeId(vid.videoUrl);
                      if (yId) posterImg = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
                    } else if (vid.videoUrl) {
                      posterImg = getVideoThumbnailUrl(vid.videoUrl);
                    }
                  }

                  return (
                    <div key={vid._id} className="glass soft-shadow rounded-2xl overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-video bg-black/10 overflow-hidden">
                          {posterImg ? (
                            <img
                              src={posterImg}
                              alt={vid.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/50">
                              <FaPlay className="text-3xl" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              vid.sourceType === "youtube"
                                ? "bg-red-600 text-white shadow-sm"
                                : "bg-black/70 backdrop-blur-md text-white shadow-sm"
                            }`}>
                              {vid.sourceType === "youtube" ? "YouTube" : "Direct Video"}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => handleToggleVideoStatus(vid._id, vid.active)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm transition-colors ${
                                vid.active
                                  ? "bg-emerald-600/90 text-white hover:bg-emerald-700"
                                  : "bg-gray-800/90 text-gray-300 hover:bg-gray-700"
                              }`}
                              title="Click to toggle visibility"
                            >
                              {vid.active ? <><FaEye className="text-[10px]" /> Published</> : <><FaEyeSlash className="text-[10px]" /> Hidden</>}
                            </button>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-base line-clamp-1" style={{ color: "#1F1F1F" }}>{vid.title}</h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C56A45]/10 text-[#C56A45] shrink-0">
                              Order: {vid.order || 0}
                            </span>
                          </div>
                          {vid.description && (
                            <p className="text-xs text-[#666666] line-clamp-2 mt-1">{vid.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleEditVideo(vid)}
                          className="flex-1 px-4 py-2 rounded-full text-xs font-medium"
                          style={{ background: "rgba(115, 133, 109, 0.1)", color: "#73856D" }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleDeleteVideo(vid._id)}
                          className="flex-1 px-4 py-2 rounded-full text-xs font-medium"
                          style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
                {videos.length === 0 && (
                  <div className="col-span-full text-center py-12 glass rounded-3xl">
                    <FaFilm className="text-3xl text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-[#666666]">No videos or reels uploaded yet. Add your first photography reel above!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Bookings Management</h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="glass soft-shadow p-6 rounded-3xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: "#1F1F1F" }}>{booking.name}</h3>
                        <p className="text-sm" style={{ color: "#666666" }}>{booking.email} • {booking.phone}</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: booking.status === "Approved" || booking.status === "Confirmed" ? "rgba(115, 133, 109, 0.2)" : "rgba(197, 106, 69, 0.2)",
                          color: booking.status === "Approved" || booking.status === "Confirmed" ? "#73856D" : "#C56A45",
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm mb-3 bg-white/40 p-4 rounded-2xl border border-black/5" style={{ color: "#1F1F1F" }}>
                      <p><span className="text-[#666666] font-medium">Service:</span> <span className="font-semibold text-[#C56A45]">{booking.serviceTitle || booking.eventType}</span></p>
                      <p><span className="text-[#666666] font-medium">Package:</span> <span className="font-semibold">{booking.packageName || booking.package || "Custom"} {booking.packagePrice ? `(${booking.packagePrice})` : ''}</span></p>
                      <p><span className="text-[#666666] font-medium">Event Date:</span> {new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p><span className="text-[#666666] font-medium">Location:</span> {booking.location}</p>
                      {(booking.message || booking.notes) && (
                        <p className="col-span-full"><span className="text-[#666666] font-medium">Notes:</span> {booking.message || booking.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleUpdateBookingStatus(booking._id, "Approved")}
                        className="px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: "rgba(115, 133, 109, 0.1)", color: "#73856D" }}
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="glass soft-shadow p-8 rounded-3xl text-center text-sm text-[#666666]">
                    No bookings received yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Contact Enquiries</h2>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="glass soft-shadow p-8 rounded-3xl text-center text-sm text-[#666666]">
                    No contact enquiries received yet.
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact._id} className="glass soft-shadow p-6 rounded-3xl flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <h3 className="font-semibold mb-1" style={{ color: "#1F1F1F" }}>{contact.name}</h3>
                        <p className="text-sm mb-2" style={{ color: "#666666" }}>{contact.email} • {contact.phone}</p>
                        <p className="text-sm font-semibold mb-1" style={{ color: "#1F1F1F" }}>{contact.subject}</p>
                        <p className="text-sm" style={{ color: "#666666" }}>{contact.message}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteContact(contact._id)}
                        className="px-4 py-2 rounded-full text-xs font-medium shrink-0"
                        style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Pricing Management</h2>
              
              {/* Pricing Form */}
              <form onSubmit={handlePricingSubmit} className="glass soft-shadow p-6 rounded-3xl mb-6">
                <h3 className="font-semibold mb-4" style={{ color: "#1F1F1F" }}>
                  {editingPricing ? "Edit" : "Add New"} Pricing Package
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Package Name"
                    value={pricingForm.name}
                    onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                    required
                    className="px-4 py-2 rounded-xl glass text-sm"
                    style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                  />
                  <input
                    type="text"
                    placeholder="Price (e.g. ₹50,000 or Contact for pricing)"
                    value={pricingForm.price}
                    onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                    required
                    className="px-4 py-2 rounded-xl glass text-sm"
                    style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={pricingForm.description}
                  onChange={(e) => setPricingForm({ ...pricingForm, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 rounded-xl glass text-sm mb-4 resize-none"
                  style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1F" }}>Features</label>
                  {pricingForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Feature description"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl glass text-sm"
                        style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => removeFeature(index)}
                        className="px-4 py-2 rounded-xl text-xs font-medium"
                        style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  ))}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    onClick={addFeatureField}
                    className="text-xs font-medium px-4 py-2 rounded-xl"
                    style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                  >
                    + Add Feature
                  </motion.button>
                </div>

                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pricingForm.recommended}
                    onChange={(e) => setPricingForm({ ...pricingForm, recommended: e.target.checked })}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: "#C56A45" }}
                  />
                  <span className="text-sm" style={{ color: "#666666" }}>Mark as "Most Popular"</span>
                </label>

                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}
                  >
                    {editingPricing ? "Update" : "Add"} Package
                  </motion.button>
                  {editingPricing && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setEditingPricing(null);
                        setPricingForm({ name: "", price: "", description: "", features: [""], recommended: false });
                      }}
                      className="px-6 py-2 rounded-full text-sm font-medium"
                      style={{ background: "rgba(107, 95, 90, 0.1)", color: "#666666" }}
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </form>

              {/* Pricing List */}
              <div className="grid md:grid-cols-3 gap-4">
                {pricing.map((pkg) => (
                  <div key={pkg._id} className="glass soft-shadow rounded-2xl p-6">
                    {pkg.recommended && (
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                        style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}>
                        Most Popular
                      </div>
                    )}
                    <h4 className="font-semibold text-lg mb-2" style={{ color: "#1F1F1F" }}>{pkg.name}</h4>
                    <p className="text-sm mb-2" style={{ color: "#C56A45" }}>{pkg.price}</p>
                    {pkg.description && <p className="text-xs mb-3" style={{ color: "#666666" }}>{pkg.description}</p>}
                    <ul className="text-xs mb-4 space-y-1" style={{ color: "#666666" }}>
                      {pkg.features?.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleEditPricing(pkg)}
                        className="flex-1 px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: "rgba(115, 133, 109, 0.1)", color: "#73856D" }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleDeletePricing(pkg._id)}
                        className="flex-1 px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div>
              <h2 className="font-display text-3xl font-semibold mb-6" style={{ color: "#1F1F1F" }}>Testimonials Management</h2>
              
              {/* Testimonial Form */}
              <form onSubmit={handleTestimonialSubmit} className="glass soft-shadow p-6 sm:p-8 rounded-3xl mb-8">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "#1F1F1F" }}>Add New Testimonial</h3>
                <p className="text-xs text-[#666666] mb-5">
                  Client review with optional photo uploaded directly to Cloudinary (up to 150 MB).
                </p>

                {testimonialError && (
                  <div className="mb-4 p-4 rounded-2xl bg-red-50/80 border border-red-200 flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-red-700 leading-relaxed font-medium">
                      {testimonialError}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    required
                    disabled={isUploadingTestimonial}
                    className="px-4 py-2.5 rounded-xl glass text-sm"
                    style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                  />
                  <input
                    type="text"
                    placeholder="Role/Title (e.g. Bride, Groom, Corporate Client)"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    required
                    disabled={isUploadingTestimonial}
                    className="px-4 py-2.5 rounded-xl glass text-sm"
                    style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                  />
                </div>
                <textarea
                  placeholder="Testimonial Content"
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  required
                  rows="4"
                  disabled={isUploadingTestimonial}
                  className="w-full px-4 py-2.5 rounded-xl glass text-sm mb-4 resize-none"
                  style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                />
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Rating</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    disabled={isUploadingTestimonial}
                    className="px-4 py-2.5 rounded-xl glass text-sm"
                    style={{ border: "1px solid rgba(0,0,0,0.08)", outline: "none" }}
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1.5">Customer Image (Optional, Max 150 MB)</label>
                  <input
                    id="testimonial-file-input"
                    name="testimonial"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleTestimonialFileChange}
                    disabled={isUploadingTestimonial}
                    className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C56A45]/10 file:text-[#C56A45] hover:file:bg-[#C56A45]/20 cursor-pointer"
                  />
                  {testimonialFile && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-[#C56A45]/20 flex items-center justify-between gap-4 max-w-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C56A45]/10 text-[#C56A45] shrink-0">
                          <FaImage />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1F1F1F] truncate">{testimonialFile.name}</p>
                          <p className="text-[11px] text-[#666666] mt-0.5">
                            <span className="font-medium text-[#C56A45]">{formatFileSize(testimonialFile.size)}</span> • Format: <span className="font-medium uppercase">{getFileTypeString(testimonialFile)}</span>
                          </p>
                        </div>
                      </div>
                      {!isUploadingTestimonial && (
                        <button
                          type="button"
                          onClick={() => {
                            setTestimonialFile(null);
                            const el = document.getElementById('testimonial-file-input');
                            if (el) el.value = '';
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove file"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Real-Time Upload Progress for Testimonial */}
                {isUploadingTestimonial && testimonialFile && (
                  <div className="mb-5 p-4 rounded-2xl bg-[#C56A45]/5 border border-[#C56A45]/20 max-w-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#1F1F1F] flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#C56A45] animate-ping" />
                        {testimonialStage || "Uploading customer image..."}
                      </span>
                      <span className="text-xs font-bold text-[#C56A45]">{testimonialProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${testimonialProgress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isUploadingTestimonial}
                  whileHover={!isUploadingTestimonial ? { scale: 1.02 } : {}}
                  whileTap={!isUploadingTestimonial ? { scale: 0.98 } : {}}
                  className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-opacity flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #C56A45, #D88165)",
                    opacity: isUploadingTestimonial ? 0.7 : 1,
                    cursor: isUploadingTestimonial ? "not-allowed" : "pointer"
                  }}
                >
                  <FaUpload />
                  {isUploadingTestimonial ? "Adding Testimonial..." : "Add Testimonial"}
                </motion.button>
              </form>

              {/* Testimonials List */}
              <div className="grid md:grid-cols-2 gap-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="glass soft-shadow rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <span key={i} className="text-[#C56A45]">★</span>
                          ))}
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
                          style={{
                            background: testimonial.active ? "rgba(115, 133, 109, 0.15)" : "rgba(197, 106, 69, 0.15)",
                            color: testimonial.active ? "#73856D" : "#C56A45"
                          }}
                        >
                          {testimonial.active ? (
                            <>
                              <FaCheckCircle size={10} /> Approved
                            </>
                          ) : (
                            <>
                              <FaExclamationTriangle size={10} /> Pending Review
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm mb-4 leading-relaxed" style={{ color: "#666666" }}>"{testimonial.content}"</p>
                      <div className="flex items-center gap-3 mb-4">
                        {testimonial.imageUrl ? (
                          <img src={getOptimizedImageUrl(testimonial.imageUrl, { width: 200, quality: 'auto:best' })} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                            style={{ background: "linear-gradient(135deg, #C56A45, #D88165)" }}>
                            {(testimonial.name || 'C').charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-sm" style={{ color: "#1F1F1F" }}>{testimonial.name}</h4>
                          <p className="text-xs" style={{ color: "#666666" }}>{testimonial.role || "Client"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        onClick={() => handleToggleTestimonialStatus(testimonial._id, testimonial.active)}
                        className="flex-1 px-4 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1.5"
                        style={{
                          background: testimonial.active ? "rgba(107, 95, 90, 0.1)" : "rgba(115, 133, 109, 0.15)",
                          color: testimonial.active ? "#666666" : "#73856D"
                        }}
                      >
                        {testimonial.active ? "Hide / Unpublish" : "Approve & Publish"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        onClick={() => handleDeleteTestimonial(testimonial._id)}
                        className="px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: "rgba(197, 106, 69, 0.1)", color: "#C56A45" }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && (
                  <div className="col-span-full text-center py-12 glass rounded-3xl">
                    <p className="text-sm text-[#666666]">No testimonials yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
