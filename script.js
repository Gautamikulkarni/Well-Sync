function translateText() {
    const textToTranslate = document.getElementById("text").value;
    const selectedLanguage = document.getElementById("language").value;
    
    fetch("/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTranslate, target_language: selectedLanguage })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("translatedText").innerText = data.translated_text;
    })
    .catch(error => console.error("Error:", error));
}
