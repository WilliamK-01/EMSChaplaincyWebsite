// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                purple: {
                    950: '#1a0b2e',
                    900: '#3b0764',
                    800: '#581c87',
                    700: '#6b21a8',
                    400: '#c084fc', 
                },
                gold: {
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                },
                slate: {
                    850: '#151e2e', // Custom in-between shade
                    900: '#0f172a',
                    950: '#020617',
                },
                neon: {
                    purple: '#d8b4fe',
                    glow: '#a855f7',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Cinzel', 'serif'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'heartbeat': 'heartbeat 3s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
                    '15%': { transform: 'scale(1.15)', opacity: '0.5' },
                    '30%': { transform: 'scale(1)', opacity: '0.2' },
                    '45%': { transform: 'scale(1.15)', opacity: '0.5' },
                    '60%': { transform: 'scale(1)', opacity: '0.2' },
                }
            }
        }
    }
}

// Initialize Animate On Scroll
AOS.init({
    once: true,
    offset: 50,
    duration: 1000,
    easing: 'ease-out-cubic',
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-xl');
    } else {
        navbar.classList.remove('shadow-xl');
    }
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Trigger counters when Stats section is in view
let counted = false;
const statsSection = document.querySelector('.counter').closest('section');

window.addEventListener('scroll', () => {
    if(!counted && window.scrollY + window.innerHeight > statsSection.offsetTop) {
        animateCounters();
        counted = true;
    }
});

// Slideshow functionality for About section
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    slides[slideIndex - 1].classList.add('active');
    setTimeout(showSlides, 5000); // Change slide every 5 seconds
}

// Start slideshow when page loads
if (slides.length > 0) {
    showSlides();
}

// Background Audio Control
const audio = document.getElementById('backgroundAudio');
const audioToggle = document.getElementById('audioToggle');
const audioToggleMobile = document.getElementById('audioToggleMobile');
const audioIcon = document.getElementById('audioIcon');
const audioIconMobile = document.getElementById('audioIconMobile');
const audioNotification = document.getElementById('audioNotification');

// Show notification function
function showAudioNotification() {
    audioNotification.classList.remove('hidden', 'fade-out');
    
    // Hide after 3 seconds with fade out
    setTimeout(() => {
        audioNotification.classList.add('fade-out');
        setTimeout(() => {
            audioNotification.classList.add('hidden');
        }, 300); // Wait for fade out animation
    }, 3000);
}

// Fade in/out duration in milliseconds
const fadeDuration = 1000;
const fadeSteps = 50;
const fadeInterval = fadeDuration / fadeSteps;

// Fade in function
function fadeIn() {
    let currentStep = 0;
    const targetVolume = 0.6;
    const volumeStep = targetVolume / fadeSteps;
    audio.volume = 0;
    
    const fadeInInterval = setInterval(() => {
        currentStep++;
        if (currentStep <= fadeSteps) {
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeInInterval);
        }
    }, fadeInterval);
}

// Fade out function
function fadeOut(callback) {
    let currentStep = fadeSteps;
    const currentVolume = audio.volume;
    const volumeStep = currentVolume / fadeSteps;
    
    const fadeOutInterval = setInterval(() => {
        currentStep--;
        if (currentStep >= 0) {
            audio.volume = Math.max(volumeStep * currentStep, 0);
        } else {
            audio.volume = 0;
            clearInterval(fadeOutInterval);
            if (callback) callback();
        }
    }, fadeInterval);
}

// Toggle audio on button click
function toggleAudio() {
    if (audio.paused) {
        audio.play().then(() => {
            fadeIn();
            showAudioNotification();
        });
        audioIcon.className = 'fas fa-volume-up';
        audioIconMobile.className = 'fas fa-volume-up';
    } else {
        fadeOut(() => {
            audio.pause();
        });
        audioIcon.className = 'fas fa-volume-mute';
        audioIconMobile.className = 'fas fa-volume-mute';
    }
}

audioToggle.addEventListener('click', toggleAudio);
audioToggleMobile.addEventListener('click', toggleAudio);

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitLoading = document.getElementById('submitLoading');
        const formSuccess = document.getElementById('formSuccess');
        const formError = document.getElementById('formError');
        
        // Hide any previous messages
        formSuccess.classList.add('hidden');
        formError.classList.add('hidden');
        
        // Show loading state
        submitText.classList.add('hidden');
        submitLoading.classList.remove('hidden');
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                // Show success message
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formError.classList.remove('hidden');
            formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } finally {
            // Reset button state
            submitText.classList.remove('hidden');
            submitLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
}

// Donate Modal Functionality
const donateButton = document.getElementById('donateButton');
const donateModal = document.getElementById('donateModal');
const closeModal = document.getElementById('closeModal');

// Open modal
if (donateButton) {
    donateButton.addEventListener('click', () => {
        donateModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
}

// Close modal on X button
if (closeModal) {
    closeModal.addEventListener('click', () => {
        donateModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    });
}

// Close modal on outside click
if (donateModal) {
    donateModal.addEventListener('click', (e) => {
        if (e.target === donateModal) {
            donateModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (donateModal && !donateModal.classList.contains('hidden')) {
            donateModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        if (volunteerModal && !volunteerModal.classList.contains('hidden')) {
            volunteerModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
});

// Volunteer Modal Functionality
const volunteerButton = document.getElementById('volunteerButton');
const volunteerModal = document.getElementById('volunteerModal');
const closeVolunteerModal = document.getElementById('closeVolunteerModal');

// Open volunteer modal
if (volunteerButton) {
    volunteerButton.addEventListener('click', () => {
        volunteerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
}

// Close volunteer modal on X button
if (closeVolunteerModal) {
    closeVolunteerModal.addEventListener('click', () => {
        volunteerModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    });
}

// Close volunteer modal on outside click
if (volunteerModal) {
    volunteerModal.addEventListener('click', (e) => {
        if (e.target === volunteerModal) {
            volunteerModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

// Copy to clipboard function
function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[60] flex items-center gap-2';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${label} copied!`;
        document.body.appendChild(notification);
        
        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}
// Newsletter form submission
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('newsletterBtn');
    const submitText = document.getElementById('newsletterText');
    const submitLoading = document.getElementById('newsletterLoading');
    const successMessage = document.getElementById('newsletterSuccess');
    
    // Show loading state
    submitText.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    submitBtn.disabled = true;
    
    // Submit form
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(() => {
        // Show success message
        successMessage.classList.remove('hidden');
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    })
    .catch((error) => {
        console.error('Newsletter submission error:', error);
        alert('There was an error subscribing. Please try again.');
    })
    .finally(() => {
        // Reset button state
        submitText.classList.remove('hidden');
        submitLoading.classList.add('hidden');
        submitBtn.disabled = false;
    });
}

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}