// Add to your main.js or base template
function translatePageElements() {
    // Only translate if not in default language
    if (document.documentElement.lang !== 'en') {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const text = el.textContent.trim();
            if (text) {
                fetch('/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text,
                        target: document.documentElement.lang
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.translation) {
                        el.textContent = data.translation;
                    }
                });
            }
        });
    }
}

// Call on page load and after dynamic content loads
document.addEventListener('DOMContentLoaded', translatePageElements);