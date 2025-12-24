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

// Unmute and fade in audio on page load
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure audio is loaded
    setTimeout(() => {
        audio.play().then(() => {
            audio.muted = false;
            fadeIn();
            showAudioNotification();
        }).catch(error => {
            console.log('Autoplay prevented, audio will start on user interaction:', error);
        });
    }, 100);
});

// Toggle audio on button click
function toggleAudio() {
    if (audio.paused) {
        audio.play().then(() => {
            audio.muted = false;
            fadeIn();
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
