document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.step');
    const totalQuestions = 6;
    let currentQuestion = 0; 
    let selectedAnswers = {};

    
    const isEligible = () =>
        selectedAnswers.q1 === 'yes' &&
        selectedAnswers.q2 === 'yes' &&
        selectedAnswers.q3 === 'yes';

    const mainContainer = document.querySelector('.main-container');

    function applyCentering(stepNumber) {
        
        if (window.innerWidth <= 767 && (stepNumber === 1 || stepNumber === 2)) {
            mainContainer.classList.add('center-quiz');

            
            const card = document.querySelector(`#step${stepNumber} .card`);
            const footer = document.querySelector('.legal-footer');
            const footerH = footer ? footer.offsetHeight : 0;
            const available = window.innerHeight - footerH - 6; 
            if (card && card.offsetHeight + 24 > available) {
                mainContainer.classList.remove('center-quiz');
            }
        } else {
            mainContainer.classList.remove('center-quiz');
        }
    }

    const updateProgressBar = () => {
        const displayStep = Math.min(currentQuestion + 1, totalQuestions);
        const progress = (currentQuestion / totalQuestions) * 100;

        
        const inlineBar = document.getElementById('inlineProgressBar');
        const stepLabel = document.getElementById('stepLabel');
        if (inlineBar) inlineBar.style.width = `${progress}%`;
        if (stepLabel) stepLabel.textContent = `STEP ${displayStep} OF ${totalQuestions}`;
    };

    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('active'));
        const nextStepElement = document.getElementById(`step${stepNumber}`);
        if (nextStepElement) {
            nextStepElement.classList.add('active');
            applyCentering(stepNumber);
            if (stepNumber === 6) {
                
                const questionGroup = document.querySelector('.question-group');
                if(questionGroup) questionGroup.style.display = 'none';
                
                
                setTimeout(() => {
                    const finalProgressBar = document.querySelector('.final-progress__bar-fill');
                    if (finalProgressBar) {
                        finalProgressBar.style.width = '100%';
                    }
                }, 200);
                
                forceOpenAvailability(); 
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    
    const fadeToLoadingStep = () => {
        const q3 = document.getElementById('q3');
        const step4 = document.getElementById('step4');
        
        
        q3.classList.add('fading-out');
        
        setTimeout(() => {
            q3.classList.add('hidden');
            q3.classList.remove('fading-out');
            
            
            const questionGroup = document.querySelector('.question-group');
            if (questionGroup) {
                questionGroup.innerHTML = `
                    <div class="loading-step">
                        <h2>Reviewing answers...</h2>
                        <div class="loading-spinner"></div>
                    </div>
                `;
                questionGroup.style.opacity = '1';
                questionGroup.style.transform = 'translateY(0)';
            }
            
            
            const inlineBar = document.getElementById('inlineProgressBar');
            const stepLabel = document.getElementById('stepLabel');
            if (inlineBar) inlineBar.style.width = '66%';
            if (stepLabel) stepLabel.textContent = 'STEP 4 OF 6';
            
        }, 400);
    };

    
    const updateLoadingText = () => {
        const questionGroup = document.querySelector('.question-group');
        const h2Element = questionGroup.querySelector('.loading-step h2');
        
        
        h2Element.style.opacity = '0';
        
        setTimeout(() => {
            
            h2Element.textContent = 'Matching with best option...';
            
            
            const inlineBar = document.getElementById('inlineProgressBar');
            const stepLabel = document.getElementById('stepLabel');
            if (inlineBar) inlineBar.style.width = '83%';
            if (stepLabel) stepLabel.textContent = 'STEP 5 OF 6';
            
            
            h2Element.style.opacity = '1';
        }, 300);
    };

    const fadeToNextQuestion = (currentEl, nextEl) => {
        currentEl.classList.add('fading-out');
        
        setTimeout(() => {
            currentEl.classList.add('hidden');
            currentEl.classList.remove('fading-out');
            
            if (nextEl) {
                nextEl.classList.remove('hidden');
            }
        }, 400);
    };

    
    const q1 = document.getElementById('q1');
    const q1Buttons = q1.querySelectorAll('.option-btn');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');

    q1Buttons.forEach(button => {
        button.addEventListener('click', function() {
            q1Buttons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedAnswers.q1 = this.dataset.value;
            currentQuestion = 1;
            updateProgressBar();
            
            
            fadeToNextQuestion(q1, q2);
        });
    });

    const q2Buttons = document.querySelectorAll('#q2 .option-btn');
    q2Buttons.forEach(button => {
        button.addEventListener('click', function() {
            q2Buttons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedAnswers.q2 = this.dataset.value;
            currentQuestion = 2;
            updateProgressBar();
            
            
            fadeToNextQuestion(q2, q3);
        });
    });

    
    const q3Buttons = document.querySelectorAll('#q3 .option-btn');
    q3Buttons.forEach(button => {
        button.addEventListener('click', function() {
            q3Buttons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedAnswers.q3 = this.dataset.value;
            currentQuestion = 3;
            updateProgressBar();
            
            
            setTimeout(() => {
                fadeToLoadingStep();
                currentQuestion = 3;

                setTimeout(() => {
                    updateLoadingText();
                    currentQuestion = 4;

                    setTimeout(() => {
                        const targetStep = isEligible() ? 6 : 7;
                        showStep(targetStep);
                        currentQuestion = 5;
                    }, 2000);
                }, 2000);
            }, 400);
        });
    });

    
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'restartBtn') {
            window.location.reload();
        }
    });

    updateProgressBar();
    applyCentering(1);

    window.addEventListener('resize', () => {
        const activeStep = [...steps].findIndex(s => s.classList.contains('active')) + 1;
        applyCentering(activeStep || 1);
    });

    
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone number clicked:', this.href);
        });
    });

    
    let availabilityInterval; 

    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const isOpen = hours >= 8 && hours < 18;

        document.querySelectorAll('.availability').forEach(element => {
            
            if (element.dataset.static === 'true') return;
            if (element.classList.contains('forced-open')) return;
            if (isOpen) {
                element.innerHTML =
                    '<span class="badge open">Open Now</span><span class="dot"></span>' +
                    '<span class="wait"><strong>&lt; 1 min</strong> avg wait</span>' +
                    '<small>(Last consults today end at 6:00 PM ET)</small>';
            } else {
                element.innerHTML =
                    '<span class="badge closed">Closed Now</span><span class="dot"></span>' +
                    '<span class="wait">Opens 8:00 AM ET</span>' +
                    '<small>(Leave a message for priority callback)</small>';
            }
        });
    }

    function forceOpenAvailability() {
        document.querySelectorAll('.availability').forEach(element => {
            
            if (element.dataset.static === 'true') return;
            element.classList.add('forced-open');
            element.innerHTML =
                '<span class="badge open">Open Now</span>' +
                '<span class="wait"><strong>&lt; 1 min</strong> avg wait</span>' +
                '<small>(Last consults today end at 6:00 PM ET)</small>';
        });
        if (availabilityInterval) clearInterval(availabilityInterval);
    }

    updateTime();
    availabilityInterval = setInterval(updateTime, 60000);

    
    window.showDisclaimer = function() {
        document.getElementById('disclaimerModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        document.getElementById('disclaimerModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    
    window.onclick = function(event) {
        const modal = document.getElementById('disclaimerModal');
        if (event.target === modal) {
            closeModal();
        }
    };
});

// Add this JavaScript to your script.js or in a separate script tag
(function() {
    const modal = document.getElementById('exitModal');
    const closeBtn = document.getElementById('exitClose');
    const dismissBtn = document.getElementById('exitDismiss');
    
    // Session tracking to show only once
    const SHOWN_KEY = 'curadebt_exit_shown_v1';
    let hasShown = sessionStorage.getItem(SHOWN_KEY) === '1';
    let isLeavingAllowed = false;
    
    // Don't show if already shown this session
    if (hasShown) return;
    
    function showExitModal() {
        if (hasShown) return;
        
        hasShown = true;
        sessionStorage.setItem(SHOWN_KEY, '1');
        
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus the first button for accessibility
        modal.querySelector('.btn').focus();
        
        // Track the popup show event (for analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_popup_shown', {
                event_category: 'engagement',
                event_label: 'mobile_exit_intent'
            });
        }
    }
    
    function hideExitModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    // Close modal handlers
    closeBtn.addEventListener('click', hideExitModal);
    dismissBtn.addEventListener('click', hideExitModal);
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('exit-modal__overlay')) {
            hideExitModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideExitModal();
        }
    });
    
    // 1. BACK BUTTON EXIT INTENT (Most reliable on mobile)
    function setupBackButtonTrap() {
        const dummyState = { exitGuard: true };
        history.pushState(dummyState, '');
        
        window.addEventListener('popstate', function(e) {
            if (!isLeavingAllowed && !hasShown) {
                showExitModal();
                history.pushState(dummyState, '');
            }
        });
    }
    
    // 2. IMPROVED MOBILE SCROLL DETECTION
    let touchStartY = 0;
    let scrollDirection = 'down';
    let rapidScrollCount = 0;
    
    // Touch-based scroll detection (more accurate for mobile)
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (hasShown) return;
        
        const touchY = e.touches[0].clientY;
        const scrollY = window.scrollY;
        
        // Detect upward swipe motion near top of page
        if (scrollY < 200 && touchY > touchStartY + 30) {
            rapidScrollCount++;
            if (rapidScrollCount > 2) { // Multiple rapid upward swipes
                showExitModal();
            }
        } else {
            rapidScrollCount = 0;
        }
    }, { passive: true });
    
    // 3. PAGE VISIBILITY (when user switches apps/tabs)
    let wasHidden = false;
    document.addEventListener('visibilitychange', () => {
        if (hasShown) return;
        
        if (document.hidden) {
            wasHidden = true;
        } else if (wasHidden && window.scrollY < 300) {
            // User returned to tab after being away
            setTimeout(() => {
                if (!hasShown) showExitModal();
            }, 2000); // 2 second delay
        }
    });
    
    // 4. IDLE + TOUCH ACTIVITY
    let idleTime = 0;
    let idleTimer;
    
    function resetIdle() {
        idleTime = 0;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            idleTime++;
            if (idleTime > 1 && !hasShown && window.scrollY < 400) {
                // User has been idle and is near top
                showExitModal();
            }
        }, 25000); // 25 seconds
    }
    
    // Reset idle on any user interaction
    ['touchstart', 'touchmove', 'scroll', 'click'].forEach(event => {
        window.addEventListener(event, resetIdle, { passive: true });
    });
    resetIdle();
    
    // Initialize triggers
    setupBackButtonTrap();
    
    // Allow leaving after dismissing modal
    dismissBtn.addEventListener('click', () => {
        isLeavingAllowed = true;
        setTimeout(() => {
            isLeavingAllowed = false;
        }, 5000);
    });
    
})();

// WhatsApp chat function
function startLiveChat() {
    // Track the conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exit_intent_whatsapp_click', {
            event_category: 'conversion',
            event_label: 'mobile_exit_to_whatsapp'
        });
    }
    
    // Hide the modal
    document.getElementById('exitModal').classList.remove('show');
    document.body.style.overflow = '';
    
    // WhatsApp integration
    const phoneNumber = '18336350131'; // Your business WhatsApp number (without + or spaces)
    const message = encodeURIComponent("Hi! I'm interested in learning about debt relief options. Can you help me check my eligibility?");
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp (works on both mobile and desktop)
    window.open(whatsappURL, '_blank');
}