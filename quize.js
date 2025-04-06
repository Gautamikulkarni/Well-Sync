document.addEventListener('DOMContentLoaded', function() {
    // Handle Get Started button click
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const btn = card.querySelector('.btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                const cardTitle = card.querySelector('h3').textContent.trim();
                
                if (cardTitle === 'Predict & Cure') {
                    e.preventDefault();
                    const targetUrl = this.getAttribute('href');
                    
                    // Show loading animation
                    showLoader();
                    
                    // Redirect after a brief delay for UX
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 800);
                }
            });
        }
    });
    
    // Quiz functionality (if on quiz page)
    if (document.querySelector('.quiz-container')) {
        initializeQuiz();
    }
    
    function showLoader() {
        const loader = document.createElement('div');
        loader.className = 'fullscreen-loader';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }
    
    function initializeQuiz() {
        // Your existing quiz JavaScript logic here
        // This would include:
        // - Loading questions
        // - Handling form submission
        // - Showing results
        // - Navigation between question sets
        
        console.log('Quiz initialized');
        // Add your quiz-specific JS from predict_cure.html here
    }
    
    // Helper function for AJAX requests
    function makeRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(JSON.parse(xhr.responseText));
            } else {
                console.error('Request failed:', xhr.statusText);
            }
        };
        
        xhr.onerror = function() {
            console.error('Request failed');
        };
        
        xhr.send(JSON.stringify(data));
    }
});