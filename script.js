document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.step');
    const totalQuestions = 6;
    let currentQuestion = 0; 
    let selectedAnswers = {};

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

        // Update inline progress in the questions card (new)
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
                // Hide the question container on the final step to reclaim space
                const questionGroup = document.querySelector('.question-group');
                if(questionGroup) questionGroup.style.display = 'none';
                
                // Animate the final progress bar to 100%
                setTimeout(() => {
                    const finalProgressBar = document.querySelector('.final-progress__bar-fill');
                    if (finalProgressBar) {
                        finalProgressBar.style.width = '100%';
                    }
                }, 200);
                
                forceOpenAvailability(); // ALWAYS show Open Now on final step
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Function to fade to loading step (same as question transitions)
    const fadeToLoadingStep = () => {
        const q3 = document.getElementById('q3');
        const step4 = document.getElementById('step4');
        
        // Fade out question 3
        q3.classList.add('fading-out');
        
        setTimeout(() => {
            q3.classList.add('hidden');
            q3.classList.remove('fading-out');
            
            // Show step 4 loading content in the same container
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
            
            // Update progress bar and step label
            const inlineBar = document.getElementById('inlineProgressBar');
            const stepLabel = document.getElementById('stepLabel');
            if (inlineBar) inlineBar.style.width = '66%';
            if (stepLabel) stepLabel.textContent = 'STEP 4 OF 6';
            
        }, 400);
    };

    // Function to smoothly update loading text (step 4 to 5)
    const updateLoadingText = () => {
        const questionGroup = document.querySelector('.question-group');
        const h2Element = questionGroup.querySelector('.loading-step h2');
        
        // Fade out text
        h2Element.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            h2Element.textContent = 'Matching with best option...';
            
            // Update progress bar and step label
            const inlineBar = document.getElementById('inlineProgressBar');
            const stepLabel = document.getElementById('stepLabel');
            if (inlineBar) inlineBar.style.width = '83%';
            if (stepLabel) stepLabel.textContent = 'STEP 5 OF 6';
            
            // Fade back in
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
            
            // Use fadeToNextQuestion instead of showStep for consistent transition
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
            
            // Fade transition to loading step (same as question transitions)
            setTimeout(() => {
                fadeToLoadingStep();
                currentQuestion = 3;
                
                // After 2 seconds, update text to step 5 content
                setTimeout(() => {
                    updateLoadingText();
                    currentQuestion = 4;
                    
                    // After another 2 seconds, move to final step with full page transition
                    setTimeout(() => {
                        showStep(6);
                        currentQuestion = 5;
                    }, 2000);
                }, 2000);
            }, 400);
        });
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

    
    let availabilityInterval; // store interval so we can stop it when forcing open

    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const isOpen = hours >= 8 && hours < 18;

        document.querySelectorAll('.availability').forEach(element => {
            // do not touch static availability on the final page
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
            // do not touch static availability on the final page
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