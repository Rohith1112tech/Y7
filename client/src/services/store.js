import { create } from 'zustand';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken') || null;
};

export const useAuthStore = create((set) => ({
  admin: null,
  token: getStoredToken(),
  setAuth: (admin, token, rememberMe = true) => {
    if (rememberMe) {
      localStorage.setItem('adminToken', token);
      sessionStorage.removeItem('adminToken');
    } else {
      sessionStorage.setItem('adminToken', token);
      localStorage.removeItem('adminToken');
    }
    set({ admin, token });
  },
  logout: () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    set({ admin: null, token: null });
  }
}));

export const useGalleryStore = create((set) => ({
  images: [],
  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  removeImage: (id) => set((state) => ({ 
    images: state.images.filter(img => img._id !== id) 
  }))
}));

export const useBookingStore = create((set) => ({
  selectedService: null,
  selectedPackage: null,
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  selectServiceAndPackage: (service, pkg = null) => set({ selectedService: service, selectedPackage: pkg }),
  clearBookingSelection: () => set({ selectedService: null, selectedPackage: null })
}));


