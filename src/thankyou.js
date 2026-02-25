// src/thankyou.js
/**
 * Thank You Page JavaScript
 * Handles button interactions, countdown timer, and animations
 */

(function() {
    'use strict';

    /**
     * Configuration constants
     */
    const CONFIG = {
        COUNTDOWN_SECONDS: 5,
        REDIRECT_URL: 'index.html',
        ERROR_MESSAGE: 'Failed to redirect. Please click the button to return home.'
    };

    /**
     * DOM Elements cache
     */
    const elements = {
        backButton: null,
        countdownSpan: null,
        redirectNotice: null
    };

    /**
     * Initialize the page
     */
    function init() {
        try {
            cacheElements();
            validateElements();
            attachEventListeners();
            startCountdown();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    /**
     * Cache DOM elements for reuse
     */
    function cacheElements() {
        elements.backButton = document.getElementById('backToHome');
        elements.countdownSpan = document.getElementById('countdown');
        elements.redirectNotice = document.getElementById('redirectNotice');
    }

    /**
     * Validate that required DOM elements exist
     * @throws {Error} If required elements are missing
     */
    function validateElements() {
        const missingElements = [];

        if (!elements.backButton) {
            missingElements.push('backToHome button');
        }
        if (!elements.countdownSpan) {
            missingElements.push('countdown span');
        }
        if (!elements.redirectNotice) {
            missingElements.push('redirect notice');
        }

        if (missingElements.length > 0) {
            throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
        }
    }

    /**
     * Attach event listeners to interactive elements
     */
    function attachEventListeners() {
        // Button click handler with navigation
        elements.backButton.addEventListener('click', handleButtonClick);

        // Keyboard accessibility
        elements.backButton.addEventListener('keydown', handleKeyboardNavigation);
    }

    /**
     * Handle button click event
     * @param {MouseEvent} event - The click event
     */
    function handleButtonClick(event) {
        try {
            // Prevent default navigation for more control
            event.preventDefault();
            
            const href = elements.backButton.getAttribute('href');
            
            if (!href) {
                console.error('Button href is missing');
                return;
            }

            // Add a subtle click feedback before navigating
            elements.backButton.style.opacity = '0.8';
            
            // Navigate to home page
            window.location.href = href;
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback navigation
            window.location.href = CONFIG.REDIRECT_URL;
        }
    }

    /**
     * Handle keyboard navigation for accessibility
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleKeyboardNavigation(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            elements.backButton.click();
        }
    }

    /**
     * Start the countdown timer for auto-redirect
     */
    function startCountdown() {
        let secondsRemaining = CONFIG.COUNTDOWN_SECONDS;
        
        // Ensure countdown element has initial value
        if (elements.countdownSpan) {
            elements.countdownSpan.textContent = secondsRemaining;
        }

        const countdownInterval = setInterval(() => {
            secondsRemaining--;

            if (secondsRemaining <= 0) {
                clearInterval(countdownInterval);
                performRedirect();
                return;
            }

            // Update countdown display
            if (elements.countdownSpan) {
                elements.countdownSpan.textContent = secondsRemaining;
            }
        }, 1000);

        // Store interval ID for cleanup if needed
        elements.countdownInterval = countdownInterval;
    }

    /**
     * Perform the redirect to home page
     */
    function performRedirect() {
        try {
            // Clear any pending countdown
            if (elements.countdownInterval) {
                clearInterval(elements.countdownInterval);
            }

            // Hide countdown notice
            if (elements.redirectNotice) {
                elements.redirectNotice.style.display = 'none';
            }

            // Navigate to home
            window.location.href = CONFIG.REDIRECT_URL;
        } catch (error) {
            console.error('Redirect error:', error);
            handleRedirectError();
        }
    }

    /**
     * Handle redirect errors gracefully
     */
    function handleRedirectError() {
        if (elements.redirectNotice) {
            elements.redirectNotice.innerHTML = 
                '<a href="' + CONFIG.REDIRECT_URL + '" style="color: inherit;">Click here to return home</a>';
        }
    }

    /**
     * Clean up function for page unload
     */
    function cleanup() {
        if (elements.countdownInterval) {
            clearInterval(elements.countdownInterval);
        }
    }

    // Attach cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }
})();