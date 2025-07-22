// Gallery Lightbox JavaScript - Enhanced UX/UI
class GalleryLightbox {
    constructor() {
        this.currentImages = [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createKeyboardListener();
        this.updateImagesList();
    }
    
    bindEvents() {
        // Gallery item click events
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item-improved');
            if (galleryItem) {
                e.preventDefault();
                this.openLightbox(galleryItem);
            }
        });
        
        // Lightbox control events
        const lightbox = document.getElementById('lightbox');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', () => this.prevImage());
        nextBtn.addEventListener('click', () => this.nextImage());
        
        // Click outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });
        
        // Filter button events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilter(e.target);
            }
        });
    }
    
    createKeyboardListener() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }
    
    openLightbox(galleryItem) {
        this.updateImagesList();
        
        const imageSrc = galleryItem.dataset.image;
        const title = galleryItem.dataset.title;
        const description = galleryItem.dataset.description;
        
        // Find current index
        this.currentIndex = this.currentImages.findIndex(img => img.src === imageSrc);
        if (this.currentIndex === -1) this.currentIndex = 0;
        
        this.showImage();
        this.showLightbox();
    }
    
    showLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        // Add smooth entrance animation
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.opacity = '0';
        
        setTimeout(() => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            this.isOpen = false;
        }, 300);
    }
    
    showImage() {
        if (this.currentImages.length === 0) return;
        
        const currentImage = this.currentImages[this.currentIndex];
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDescription = document.getElementById('lightbox-description');
        const lightboxCurrent = document.getElementById('lightbox-current');
        const lightboxTotal = document.getElementById('lightbox-total');
        
        // Add loading state
        lightboxImage.style.opacity = '0.5';
        
        // Load new image
        const img = new Image();
        img.onload = () => {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.title;
            lightboxImage.style.opacity = '1';
            
            // Add slide-in animation
            lightboxImage.style.transform = 'scale(0.9)';
            setTimeout(() => {
                lightboxImage.style.transform = 'scale(1)';
            }, 50);
        };
        img.src = currentImage.src;
        
        // Update info
        lightboxTitle.textContent = currentImage.title;
        lightboxDescription.textContent = currentImage.description;
        lightboxCurrent.textContent = this.currentIndex + 1;
        lightboxTotal.textContent = this.currentImages.length;
        
        // Update language content
        this.updateLanguageContent(lightboxTitle, lightboxDescription, currentImage);
    }
    
    updateLanguageContent(titleElement, descElement, imageData) {
        const currentLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'dari';
        
        // Try to get localized content from the original gallery item
        const galleryItem = document.querySelector(`[data-image="${imageData.src}"]`);
        if (galleryItem) {
            const titleElement3 = galleryItem.querySelector('[data-en][data-dari]');
            const descElement3 = galleryItem.querySelectorAll('[data-en][data-dari]')[1];
            
            if (titleElement3) {
                const localizedTitle = titleElement3.getAttribute(`data-${currentLang}`);
                if (localizedTitle) titleElement.textContent = localizedTitle;
            }
            
            if (descElement3) {
                const localizedDesc = descElement3.getAttribute(`data-${currentLang}`);
                if (localizedDesc) descElement.textContent = localizedDesc;
            }
        }
    }
    
    nextImage() {
        if (this.currentImages.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.currentImages.length;
        this.showImage();
    }
    
    prevImage() {
        if (this.currentImages.length === 0) return;
        this.currentIndex = this.currentIndex === 0 ? this.currentImages.length - 1 : this.currentIndex - 1;
        this.showImage();
    }
    
    updateImagesList() {
        const visibleItems = document.querySelectorAll('.gallery-item-improved:not([style*="display: none"])');
        this.currentImages = Array.from(visibleItems).map(item => ({
            src: item.dataset.image,
            title: item.dataset.title,
            description: item.dataset.description,
            element: item
        }));
    }
    
    handleFilter(filterBtn) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        filterBtn.classList.add('active');
        
        const filter = filterBtn.getAttribute('data-filter');
        const galleryItems = document.querySelectorAll('.gallery-item-improved');
        
        galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            // Add filtering animation
            item.classList.add('filtering');
            
            setTimeout(() => {
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.remove('filtering');
                        item.classList.add('filtered-in');
                        setTimeout(() => {
                            item.classList.remove('filtered-in');
                        }, 400);
                    }, 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('filtering');
                }
            }, index * 50); // Stagger animation
        });
        
        // Update images list for lightbox
        setTimeout(() => {
            this.updateImagesList();
        }, 500);
    }
}

// Enhanced Gallery Filter (improved from existing script.js)
function initGalleryFilterEnhanced() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item-improved');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                // Enhanced animation
                item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.transitionDelay = `${index * 50}ms`;
                
                if (shouldShow) {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1) translateY(0)';
                    item.style.display = 'block';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(20px)';
                    setTimeout(() => {
                        if (!shouldShow) {
                            item.style.display = 'none';
                        }
                    }, 400 + (index * 50));
                }
            });
        });
    });
}

// Touch/Swipe Support for Mobile
class TouchHandler {
    constructor(lightbox) {
        this.lightbox = lightbox;
        this.startX = 0;
        this.startY = 0;
        this.threshold = 100; // minimum distance for swipe
        this.init();
    }
    
    init() {
        const lightboxContent = document.querySelector('.lightbox-content');
        
        lightboxContent.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }, { passive: true });
        
        lightboxContent.addEventListener('touchend', (e) => {
            if (!this.startX || !this.startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = this.startX - endX;
            const diffY = this.startY - endY;
            
            // Check if horizontal swipe is more prominent than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.threshold) {
                if (diffX > 0) {
                    // Swipe left - next image
                    this.lightbox.nextImage();
                } else {
                    // Swipe right - previous image
                    this.lightbox.prevImage();
                }
            }
            
            // Reset
            this.startX = 0;
            this.startY = 0;
        }, { passive: true });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery lightbox
    const galleryLightbox = new GalleryLightbox();
    
    // Initialize touch handler
    const touchHandler = new TouchHandler(galleryLightbox);
    
    // Initialize enhanced gallery filter
    initGalleryFilterEnhanced();
    
    // Listen for language changes to update lightbox content
    document.addEventListener('languageChanged', function() {
        if (galleryLightbox.isOpen) {
            galleryLightbox.showImage(); // Refresh current image with new language
        }
    });
    
    // Preload images for better performance
    const galleryImages = document.querySelectorAll('.gallery-item-improved img');
    galleryImages.forEach(img => {
        const imagePreloader = new Image();
        imagePreloader.src = img.src;
    });
    
    // Add loading animation
    const galleryItems = document.querySelectorAll('.gallery-item-improved');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 100}ms`;
        item.classList.add('fade-in');
    });
});

// Make galleryLightbox globally available for debugging
window.galleryLightbox = null;
document.addEventListener('DOMContentLoaded', function() {
    window.galleryLightbox = new GalleryLightbox();
});

