document.addEventListener('DOMContentLoaded', function() {
    const languageSelector = document.getElementById('languageSelector');
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        languageSelector.value = savedLanguage;
    }
    
    // Translate immediately if not default language
    if (languageSelector.value !== 'en') {
        translatePage(languageSelector.value);
    }
    
    // Handle language change
    languageSelector.addEventListener('change', function() {
        const selectedLanguage = this.value;
        translatePage(selectedLanguage);
        localStorage.setItem('preferredLanguage', selectedLanguage);
    });
    
    async function translatePage(targetLanguage) {
        const elements = document.querySelectorAll('[data-translate]');
        
        for (const element of elements) {
            const text = element.textContent.trim();
            if (!text) continue;
            
            try {
                const response = await fetch('/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text,
                        target_language: targetLanguage
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    element.textContent = data.translatedText;
                }
            } catch (error) {
                console.error('Translation error:', error);
            }
        }
    }
});