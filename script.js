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
    
    if (!closeBtn || !dismissBtn || !leaveBtn || !messengerBtn) {
        console.log('Modal buttons not found');
        return;
    }
    
    const SHOWN_KEY = 'curadebt_exit_shown_v1';
    let hasShown = sessionStorage.getItem(SHOWN_KEY) === '1';
    let isLeavingAllowed = false;
    let intendedDestination = null; // Store where user wanted to go
    
    if (hasShown) {
        console.log('Exit modal already shown this session');
        return;
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    console.log('Device detected as:', isMobile ? 'Mobile' : 'Desktop');
    
    // Capture intended destination when user tries to leave
    function captureIntendedDestination(destination) {
        intendedDestination = destination;
        console.log('Captured intended destination:', destination);
    }
    
    // Handle clicks on external links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.startsWith(window.location.origin) && !link.href.startsWith('tel:') && !link.href.startsWith('mailto:')) {
            if (!hasShown && !isLeavingAllowed) {
                e.preventDefault();
                captureIntendedDestination(link.href);
                showExitModal();
            }
        }
    });
    
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
    
    messengerBtn.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_messenger_click', {
                event_category: 'conversion',
                event_label: 'exit_to_messenger'
            });
        }
        
        hideExitModal();
        const messengerURL = 'https://m.me/CuraDebt';
        window.open(messengerURL, '_blank');
    });
    
    // Dismiss button - return to page
    dismissBtn.addEventListener('click', () => {
        hideExitModal();
        isLeavingAllowed = true;
        intendedDestination = null; // Clear the destination
        setTimeout(() => {
            isLeavingAllowed = false;
        }, 5000);
    });
    
    // Leave anyway button - go to intended destination or back
    leaveBtn.addEventListener('click', () => {
        isLeavingAllowed = true;
        hideExitModal();
        
        if (intendedDestination) {
            // Go to the intended destination
            window.location.href = intendedDestination;
        } else {
            // Enhanced detection for all types of apps and webviews
            const isInApp = detectWebview();
            
            if (isInApp) {
                // Try multiple methods to close the webview
                try {
                    // For Messenger and Facebook webviews
                    if (typeof MessengerExtensions !== 'undefined') {
                        MessengerExtensions.requestCloseBrowser(function success() {
                            console.log('Closed via MessengerExtensions');
                        }, function error(err) {
                            console.log('MessengerExtensions close failed', err);
                            fallbackClose();
                        });
                    } else {
                        fallbackClose();
                    }
                } catch (e) {
                    fallbackClose();
                }
            } else {
                // Regular browser - go back
                window.history.back();
            }
        }
        
        function detectWebview() {
            // Check if running in standalone mode (PWA)
            if (window.navigator.standalone) return true;
            
            // Check for PWA display mode
            if (window.matchMedia('(display-mode: standalone)').matches) return true;
            
            // Check if inside iframe
            if (window.top !== window.self) return true;
            
            // Check user agent for known apps
            const userAgent = navigator.userAgent.toLowerCase();
            const appPatterns = [
                // Social Media Apps
                'fban', 'fbav', 'fbios', 'fb_iab', 'fbsv', // Facebook
                'messengerwebview', 'messenger', // Messenger
                'instagram', 'ig_web', // Instagram
                'twitter', 'twitterandroid', 'twitterios', // Twitter/X
                'snapchat', // Snapchat
                'tiktok', 'musical_ly', // TikTok
                'pinterestbrowser', 'pinterest', // Pinterest
                'linkedinapp', 'linkedin', // LinkedIn
                'whatsapp', 'wabrowser', // WhatsApp
                'telegram', // Telegram
                'discordapp', 'discord', // Discord
                'reddit', 'redditapp', // Reddit
                'tumblr', // Tumblr
                'viber', // Viber
                'line', // Line
                'wechat', 'micromessenger', // WeChat
                'kakaotalk', // KakaoTalk
                
                // Shopping Apps
                'amazonwebview', 'amazon', // Amazon
                'ebayapp', 'ebay', // eBay
                'shopifywebview', 'shopify', // Shopify
                'etsy', // Etsy
                'wish', // Wish
                'aliexpress', // AliExpress
                
                // News & Media Apps
                'flipboard', // Flipboard
                'googleapp', 'gsa', // Google App
                'chromewebview', // Chrome WebView
                'applewebkit', // General WebKit (iOS apps)
                'android', // General Android apps
                'mobile', // Generic mobile browser
                
                // Email Apps
                'outlook', 'outlookapp', // Outlook
                'gmail', 'gmailapp', // Gmail
                'yahoo', 'yahoomail', // Yahoo Mail
                
                // Other Popular Apps
                'uber', 'lyft', // Ride sharing
                'spotify', 'apple music', // Music
                'netflix', 'hulu', 'disney', // Streaming
                'zoom', 'teams', 'skype', // Video calls
                'slack', // Workplace
                'airbnb', 'booking', // Travel
                'paypal', 'venmo', 'cashapp', // Finance
                'tinder', 'bumble', 'hinge', // Dating
                'pokemon go', 'candy crush', // Games
            ];
            
            // Check if any app pattern matches
            const isApp = appPatterns.some(pattern => userAgent.includes(pattern));
            if isApp) return true;
            
            // Check for generic webview indicators
            const webviewIndicators = [
                'webview',
                'inapp',
                'embedded',
                'cordova',
                'phonegap',
                'ionic',
                'crosswalk',
                'xamarin',
                'react-native',
                'flutter',
                'capacitor',
                'electronforge'
            ];
            
            const hasWebviewIndicator = webviewIndicators.some(indicator => 
                userAgent.includes(indicator)
            );
            if (hasWebviewIndicator) return true;
            
            // Check for missing features that indicate webview
            try {
                // Check if window.open is limited (common in apps)
                if (typeof window.open !== 'function') return true;
                
                // Check if certain APIs are missing
                if (!window.external || !window.chrome) {
                    // Additional checks for mobile webviews
                    if (/mobile|android|ios|iphone|ipad/i.test(userAgent)) {
                        return true;
                    }
                }
                
                // Check screen dimensions (some apps have specific sizes)
                const isNonStandardSize = window.screen.width < 300 || 
                                        window.screen.height < 300 ||
                                        (window.innerHeight > window.screen.height);
                
                if (isNonStandardSize && /mobile/i.test(userAgent)) return true;
                
            } catch (e) {
                // If we can't check these features, might be in restricted environment
                return true;
            }
            
            return false;
        }
        
        function fallbackClose() {
            // Try various methods to close the webview/app
            try {
                // Method 1: Try native app close methods
                if (window.webkit && window.webkit.messageHandlers) {
                    // iOS WebView
                    try {
                        window.webkit.messageHandlers.close.postMessage({});
                        return;
                    } catch (e) {
                        console.log('iOS WebView close failed');
                    }
                }
                
                if (window.Android && window.Android.close) {
                    // Android WebView with exposed close method
                    try {
                        window.Android.close();
                        return;
                    } catch (e) {
                        console.log('Android WebView close failed');
                    }
                }
                
                // Method 2: Try to close window if it was opened by script
                if (window.opener) {
                    window.close();
                    return;
                }
                
                // Method 3: Try postMessage to parent (for iframes)
                if (window.parent !== window) {
                    try {
                        window.parent.postMessage({ action: 'close' }, '*');
                        setTimeout(() => window.history.back(), 500);
                        return;
                    } catch (e) {
                        console.log('PostMessage close failed');
                    }
                }
                
                // Method 4: Navigate to app-specific close URLs
                const userAgent = navigator.userAgent.toLowerCase();
                
                if (userAgent.includes('fban') || userAgent.includes('fbav')) {
                    // Facebook app close
                    window.location.href = 'fb://close';
                    setTimeout(() => window.history.back(), 100);
                    return;
                }
                
                if (userAgent.includes('instagram')) {
                    // Instagram app close
                    window.location.href = 'instagram://close';
                    setTimeout(() => window.history.back(), 100);
                    return;
                }
                
                if (userAgent.includes('twitter')) {
                    // Twitter app close
                    window.location.href = 'twitter://close';
                    setTimeout(() => window.history.back(), 100);
                    return;
                }
                
                // Method 5: Try to go to a blank page that might trigger app close
                window.location.href = 'about:blank';
                
                // Method 6: Fallback to history back after a short delay
                setTimeout(() => {
                    try {
                        window.history.back();
                    } catch (e) {
                        // If history.back() fails, try going to the app's main page
                        if (window.location.href.includes('facebook.com')) {
                            window.location.href = 'https://www.facebook.com';
                        } else if (window.location.href.includes('instagram.com')) {
                            window.location.href = 'https://www.instagram.com';
                        } else {
                            // Last resort - reload the page
                            window.location.reload();
                        }
                    }
                }, 100);
                
            } catch (e) {
                // Final fallback
                console.log('All close methods failed, using history.back()');
                window.history.back();
            }
        }
    });
})();