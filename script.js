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
    
    // 1. BACK BUTTON EXIT INTENT
    function setupBackButtonTrap() {
        // Push a dummy state so back button triggers our handler first
        const dummyState = { exitGuard: true };
        history.pushState(dummyState, '');
        
        window.addEventListener('popstate', function(e) {
            if (!isLeavingAllowed && !hasShown) {
                // Show modal instead of leaving
                showExitModal();
                // Push the state back so they can leave after closing modal
                history.pushState(dummyState, '');
            }
        });
    }
    
    // 2. FAST UPWARD SCROLL (pre-exit behavior)
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    
    function handleScroll() {
        if (hasShown) return;
        
        const currentY = window.scrollY;
        const currentTime = Date.now();
        const timeDiff = currentTime - lastScrollTime;
        const scrollDiff = lastScrollY - currentY; // Positive when scrolling up
        
        // Detect fast upward scroll near the top of page
        if (currentY < 150 && scrollDiff > 0 && timeDiff > 0) {
            const scrollSpeed = scrollDiff / timeDiff; // pixels per ms
            
            // If they're scrolling up quickly (like trying to reach address bar)
            if (scrollSpeed > 0.8) { // Adjust threshold as needed
                showExitModal();
            }
        }
        
        lastScrollY = currentY;
        lastScrollTime = currentTime;
    }
    
    // 3. IDLE DETECTION + SCROLL UP
    let isIdle = false;
    let idleTimer;
    
    function resetIdleTimer() {
        isIdle = false;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            isIdle = true;
        }, 30000); // 30 seconds of inactivity
    }
    
    function handleIdleScroll() {
        if (hasShown || !isIdle) return;
        
        const currentY = window.scrollY;
        if (currentY < 200 && lastScrollY - currentY > 50) {
            showExitModal();
        }
    }
    
    // 4. TAB VISIBILITY (when they switch apps/tabs)
    function handleVisibilityChange() {
        if (hasShown) return;
        
        // If they come back to the tab after being away and are near top
        if (!document.hidden && isIdle && window.scrollY < 300) {
            setTimeout(() => {
                if (!hasShown) showExitModal();
            }, 1000); // Small delay to not be jarring
        }
    }
    
    // Initialize all triggers
    setupBackButtonTrap();
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            handleScroll();
            handleIdleScroll();
        }, 100);
    }, { passive: true });
    
    // Reset idle timer on user activity
    ['touchstart', 'touchmove', 'scroll', 'keydown'].forEach(event => {
        window.addEventListener(event, resetIdleTimer, { passive: true });
    });
    resetIdleTimer();
    
    // Tab visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Allow leaving after dismissing modal
    dismissBtn.addEventListener('click', () => {
        isLeavingAllowed = true;
        setTimeout(() => {
            isLeavingAllowed = false; // Reset after a short time
        }, 5000);
    });
    
})();

// Live chat function (customize based on your chat provider)
function startLiveChat() {
    // Track the conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exit_intent_chat_click', {
            event_category: 'conversion',
            event_label: 'mobile_exit_to_chat'
        });
    }
    
    // Hide the modal
    document.getElementById('exitModal').classList.remove('show');
    document.body.style.overflow = '';
    
    // Initialize your chat widget here
    // Examples for common chat providers:
    
    // Intercom
    // if (window.Intercom) window.Intercom('show');
    
    // Zendesk Chat
    // if (window.$zopim) window.$zopim.livechat.window.show();
    
    // Drift
    // if (window.drift) window.drift.api.sidebar.open();
    
    // LiveChat
    // if (window.LC_API) window.LC_API.open_chat_window();
    
    // Or redirect to a chat page
    window.location.href = '/chat';
    
    // Or show a phone number prominently
    // alert('Call now: 833-635-0131 or text DEBT to 12345');
}