// Enhanced 404 Caveman Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize random spark movements
    initializeSparks();
    
    // Add sound effects (optional - requires audio files)
    initializeSoundEffects();
    
    // Add interactive elements
    initializeInteractivity();
    
    // Add particle system enhancements
    enhanceParticles();
    
    // Add cave echo effect to text
    addCaveEcho();
});

function initializeSparks() {
    const sparks = document.querySelectorAll('.spark');
    
    sparks.forEach((spark, index) => {
        // Set random movement directions for each spark
        const randomX = (Math.random() - 0.5) * 60; // -30 to 30px
        const randomY = -(Math.random() * 40 + 20); // -20 to -60px
        
        spark.style.setProperty('--random-x', `${randomX}px`);
        spark.style.setProperty('--random-y', `${randomY}px`);
        
        // Add random colors to sparks
        const colors = ['#ffff00', '#ff6b35', '#ff8e53', '#ffaa80', '#ffffff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        spark.addEventListener('animationiteration', () => {
            spark.style.background = randomColor;
        });
    });
}

function initializeSoundEffects() {
    // Create audio context for sound effects (if supported)
    let audioContext;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
        return;
    }
    
    // Create electrical spark sound effect
    function createSparkSound() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // Play spark sound periodically
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            createSparkSound();
        }
    }, 2000);
    
    // Add button click sound
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            createSparkSound();
        });
    }
}

function initializeInteractivity() {
    const caveman = document.querySelector('.caveman');
    const cable = document.querySelector('.cable');
    const errorText = document.querySelector('.error-text');
    
    // Make caveman react to mouse hover
    if (caveman) {
        caveman.addEventListener('mouseenter', () => {
            caveman.style.animationDuration = '1s'; // Speed up bounce
            
            // Make eyes follow cursor briefly
            const eyes = document.querySelectorAll('.eye');
            eyes.forEach(eye => {
                eye.style.transform = 'scale(1.2)';
                eye.style.background = '#ff6b35';
            });
            
            setTimeout(() => {
                eyes.forEach(eye => {
                    eye.style.transform = 'scale(1)';
                    eye.style.background = '#000';
                });
            }, 1000);
        });
        
        caveman.addEventListener('mouseleave', () => {
            caveman.style.animationDuration = '3s'; // Back to normal
        });
    }
    
    // Make cable spark more when clicked
    if (cable) {
        cable.addEventListener('click', () => {
            const sparks = document.querySelectorAll('.spark');
            sparks.forEach(spark => {
                spark.style.animationDuration = '0.3s';
                spark.style.background = '#ffffff';
            });
            
            setTimeout(() => {
                sparks.forEach(spark => {
                    spark.style.animationDuration = '1s';
                    spark.style.background = '#ffff00';
                });
            }, 1000);
        });
    }
    
    // Add typing effect to error message
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        const originalText = errorMessage.textContent;
        errorMessage.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                errorMessage.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing after a delay
        setTimeout(typeWriter, 2000);
    }
}

function enhanceParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    // Add more dynamic particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle dynamic-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 204, 153, ${Math.random() * 0.8 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

function addCaveEcho() {
    const errorTitle = document.querySelector('.error-404');
    const errorSubtitle = document.querySelector('.error-subtitle');
    
    // Add echo effect to main title
    if (errorTitle) {
        const echoText = errorTitle.cloneNode(true);
        echoText.style.cssText = `
            position: absolute;
            top: 2px;
            left: 2px;
            opacity: 0.3;
            color: #8b4513;
            z-index: -1;
            animation: echo-fade 3s ease-in-out infinite;
        `;
        errorTitle.parentNode.insertBefore(echoText, errorTitle);
    }
    
    // Add echo effect to subtitle
    if (errorSubtitle) {
        const echoSubtitle = errorSubtitle.cloneNode(true);
        echoSubtitle.style.cssText = `
            position: absolute;
            top: 1px;
            left: 1px;
            opacity: 0.2;
            color: #8b4513;
            z-index: -1;
            animation: echo-fade 2s ease-in-out infinite;
        `;
        errorSubtitle.parentNode.insertBefore(echoSubtitle, errorSubtitle);
    }
}

// Navigation function
function goBack() {
    // Try to go back in history
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // If no history, go to home page
        window.location.href = '/';
    }
}

// Add some Easter eggs
document.addEventListener('keydown', function(e) {
    // Konami code easter egg: ↑↑↓↓←→←→BA
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
    
    // Space bar makes caveman jump
    if (e.keyCode === 32) {
        e.preventDefault();
        const caveman = document.querySelector('.caveman');
        if (caveman) {
            caveman.style.transform = 'translateX(-50%) translateY(-50px)';
            setTimeout(() => {
                caveman.style.transform = 'translateX(-50%) translateY(0px)';
            }, 500);
        }
    }
});

function activateEasterEgg() {
    // Make everything go crazy for a few seconds
    const caveman = document.querySelector('.caveman');
    const cable = document.querySelector('.cable');
    const sparks = document.querySelectorAll('.spark');
    const fireLight = document.querySelector('.fire-light');
    
    // Crazy animations
    if (caveman) {
        caveman.style.animation = 'caveman-bounce 0.2s ease-in-out infinite';
    }
    
    if (cable) {
        cable.style.animation = 'cable-sway 0.1s ease-in-out infinite';
    }
    
    sparks.forEach(spark => {
        spark.style.animation = 'spark-fly 0.1s ease-out infinite';
        spark.style.background = '#ffffff';
    });
    
    if (fireLight) {
        fireLight.style.animation = 'flicker 0.1s ease-in-out infinite';
    }
    
    // Change page colors temporarily
    document.body.style.filter = 'hue-rotate(180deg)';
    
    // Reset after 3 seconds
    setTimeout(() => {
        if (caveman) caveman.style.animation = 'caveman-bounce 3s ease-in-out infinite';
        if (cable) cable.style.animation = 'cable-sway 2s ease-in-out infinite';
        sparks.forEach(spark => {
            spark.style.animation = 'spark-fly 1s ease-out infinite';
            spark.style.background = '#ffff00';
        });
        if (fireLight) fireLight.style.animation = 'flicker 2s ease-in-out infinite alternate';
        document.body.style.filter = 'none';
    }, 3000);
    
    // Show easter egg message
    const easterEggMsg = document.createElement('div');
    easterEggMsg.textContent = '🎉 OOGA BOOGA! You found the secret cave code! 🎉';
    easterEggMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 53, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-size: 1.2rem;
        z-index: 1000;
        animation: text-glow 1s ease-in-out infinite alternate;
    `;
    
    document.body.appendChild(easterEggMsg);
    
    setTimeout(() => {
        document.body.removeChild(easterEggMsg);
    }, 3000);
}

// Add CSS for echo animation
const style = document.createElement('style');
style.textContent = `
    @keyframes echo-fade {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.1; transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

// Performance optimization: Pause animations when page is not visible
document.addEventListener('visibilitychange', function() {
    const animatedElements = document.querySelectorAll('*');
    
    if (document.hidden) {
        // Pause animations when tab is not active
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab becomes active
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Add mouse trail effect
document.addEventListener('mousemove', function(e) {
    // Create a small spark that follows the mouse
    const spark = document.createElement('div');
    spark.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #ff6b35;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 2}px;
        top: ${e.clientY - 2}px;
        animation: spark-trail 1s ease-out forwards;
    `;
    
    document.body.appendChild(spark);
    
    setTimeout(() => {
        if (spark.parentNode) {
            spark.parentNode.removeChild(spark);
        }
    }, 1000);
});

// Add spark trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes spark-trail {
        0% { 
            opacity: 1; 
            transform: scale(1);
        }
        100% { 
            opacity: 0; 
            transform: scale(0);
        }
    }
`;
document.head.appendChild(trailStyle);