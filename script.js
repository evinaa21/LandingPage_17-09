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


(function() {
    const modal = document.getElementById('exitModal');
    if (!modal) {
        console.log('Exit modal not found');
        return;
    }
    
    const closeBtn = document.getElementById('exitClose');
    const dismissBtn = document.getElementById('exitDismiss');
    const leaveBtn = document.getElementById('exitLeave');
    const messengerBtn = document.getElementById('messengerBtn');
    const crispBtn = document.getElementById('crispBtn');
    
    if (!closeBtn || !dismissBtn || !leaveBtn || !messengerBtn || !crispBtn) {
        console.log('Modal buttons not found');
        return;
    }
    
    const SHOWN_KEY = 'curadebt_exit_shown_v1';
    let hasShown = sessionStorage.getItem(SHOWN_KEY) === '1';
    let isLeavingAllowed = false;
    
    if (hasShown) {
        console.log('Exit modal already shown this session');
        return;
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    console.log('Device detected as:', isMobile ? 'Mobile' : 'Desktop');
    
    function showExitModal() {
        if (hasShown) return;
        
        console.log('Showing exit modal');
        hasShown = true;
        sessionStorage.setItem(SHOWN_KEY, '1');
        
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        const firstBtn = modal.querySelector('.btn');
        if (firstBtn) firstBtn.focus();
    }
    
    function hideExitModal() {
        console.log('Hiding exit modal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', hideExitModal);
    dismissBtn.addEventListener('click', hideExitModal);
    
    messengerBtn.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_messenger_click', {
                event_category: 'conversion',
                event_label: 'exit_to_messenger'
            });
        }
        
        hideExitModal();
        
 

        const messengerURL = 'https://m.me/curadebt';
        window.open(messengerURL, '_blank');
    });
    
    crispBtn.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_crisp_click', {
                event_category: 'conversion',
                event_label: 'exit_to_crisp'
            });
        }
        
        hideExitModal();
        
        window.open('https://www.curadebt.com/chat', '_blank');
    });
    
    // Leave anyway button
    leaveBtn.addEventListener('click', () => {
        isLeavingAllowed = true;
        hideExitModal();
        window.history.back();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('exit-modal__overlay')) {
            hideExitModal();
        }
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideExitModal();
        }
    });
    
    // DESKTOP TRIGGERS (keep existing code)
    if (!isMobile) {
        console.log('Setting up desktop triggers');
        
        let mouseLeaveTimeout;
        document.documentElement.addEventListener('mouseleave', (e) => {
            if (hasShown) return;
            
            if (e.clientY <= 10) {
                clearTimeout(mouseLeaveTimeout);
                mouseLeaveTimeout = setTimeout(() => {
                    console.log('Mouse left through top - showing modal');
                    showExitModal();
                }, 200);
            }
        });
        
        document.documentElement.addEventListener('mouseenter', () => {
            clearTimeout(mouseLeaveTimeout);
        });
        
        let backTrapActive = false;
        function setupBackTrap() {
            if (backTrapActive) return;
            backTrapActive = true;
            
            setTimeout(() => {
                const currentState = history.state;
                history.pushState({ exitGuard: true, original: currentState }, '');
                
                window.addEventListener('popstate', function backHandler(e) {
                    if (!isLeavingAllowed && !hasShown && e.state && e.state.exitGuard) {
                        console.log('Back button - showing modal');
                        showExitModal();
                        history.pushState({ exitGuard: true, original: currentState }, '');
                    }
                });
            }, 1000);
        }
        setupBackTrap();
        
        setTimeout(() => {
            if (!hasShown) {
                console.log('20 second timer - showing modal');
                showExitModal();
            }
        }, 20000);
        
        let idleTimer;
        let isIdle = false;
        
        function resetIdle() {
            clearTimeout(idleTimer);
            
            if (isIdle && !hasShown) {
                console.log('Activity after idle - showing modal');
                showExitModal();
                return;
            }
            
            isIdle = false;
            idleTimer = setTimeout(() => {
                isIdle = true;
                console.log('User idle');
            }, 15000);
        }
        
        ['mousemove', 'keydown', 'scroll'].forEach(event => {
            document.addEventListener(event, resetIdle, { passive: true });
        });
        resetIdle();
        
        let hasLeftTab = false;
        document.addEventListener('visibilitychange', () => {
            if (hasShown) return;
            
            if (document.hidden) {
                hasLeftTab = true;
                console.log('Tab hidden');
            } else if (hasLeftTab) {
                console.log('Tab visible - showing modal');
                setTimeout(() => {
                    if (!hasShown) showExitModal();
                }, 1000);
            }
        });
    }
    
    else {
        console.log('Setting up mobile triggers');
        
        let mobileBackActive = false;
        let exitIntentState = null;
        
        function setupMobileBack() {
            if (mobileBackActive) return;
            mobileBackActive = true;
            
            exitIntentState = 'exit_intent_' + Date.now();
            
            setTimeout(() => {
                history.pushState({ exitGuard: true, id: exitIntentState }, '');
                console.log('Mobile back trap set with ID:', exitIntentState);
                
                window.addEventListener('popstate', function mobileBackHandler(e) {
                    console.log('Popstate event:', e.state);
                    
                    if (!isLeavingAllowed && !hasShown) {
                        if (!e.state || (e.state && e.state.id === exitIntentState)) {
                            console.log('Mobile back detected - showing modal');
                            showExitModal();
                            history.pushState({ exitGuard: true, id: exitIntentState }, '');
                            return;
                        }
                    }
                    
                    if (isLeavingAllowed) {
                        console.log('User allowed to leave');
                        return;
                    }
                });
            }, 3000);
        }
        setupMobileBack();
        
        let touchStartY = 0;
        let scrollUpCount = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            if (hasShown) return;
            
            const touchY = e.touches[0].clientY;
            const scrollY = window.scrollY;
            
            if (scrollY < 100 && touchY > touchStartY + 40) {
                scrollUpCount++;
                console.log('Upward swipe:', scrollUpCount);
                if (scrollUpCount > 2) {
                    console.log('Multiple swipes - showing modal');
                    showExitModal();
                }
            } else {
                scrollUpCount = 0;
            }
        }, { passive: true });
        
        setTimeout(() => {
            if (!hasShown) {
                console.log('Mobile 25s timer - showing modal');
                showExitModal();
            }
        }, 25000);
        
        let wasHidden = false;
        document.addEventListener('visibilitychange', () => {
            if (hasShown) return;
            
            if (document.hidden) {
                wasHidden = true;
                console.log('App hidden');
            } else if (wasHidden) {
                console.log('App visible - showing modal');
                setTimeout(() => {
                    if (!hasShown) showExitModal();
                }, 2000);
            }
        });
    }
    
    dismissBtn.addEventListener('click', () => {
        isLeavingAllowed = true;
        setTimeout(() => {
            isLeavingAllowed = false;
        }, 5000);
    });
    
    console.log('Exit intent system initialized');
})();