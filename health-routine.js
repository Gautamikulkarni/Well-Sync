// Health Routine Generator - Complete JS Implementation

// DOM Elements
const elements = {
    sleepSlider: document.getElementById('sleep_hours'),
    sleepValue: document.getElementById('sleep_value'),
    workSlider: document.getElementById('work_hours'),
    workValue: document.getElementById('work_value'),
    exerciseSelect: document.getElementById('exercise'),
    dietSelect: document.getElementById('diet'),
    symptomsTextarea: document.getElementById('symptoms'),
    generateBtn: document.getElementById('generate_btn'),
    loadingIndicator: document.getElementById('loading'),
    resultContainer: document.getElementById('result'),
    healthPrediction: document.getElementById('health_prediction'),
    healthSuggestions: document.getElementById('health_suggestions'),
    routineTableBody: document.getElementById('routine_body')
};

// Configuration
const config = {
    apiEndpoint: 'http://localhost:8000/generate-routine',
    fallbackRoutine: [
        { time: "7:00 AM", activity: "Wake up and drink water" },
        { time: "7:30 AM", activity: "Healthy breakfast" },
        { time: "8:00 AM", activity: "Start work/study" },
        { time: "12:00 PM", activity: "Healthy lunch" },
        { time: "1:00 PM", activity: "Short walk" },
        { time: "6:00 PM", activity: "Exercise or relaxation" },
        { time: "7:00 PM", activity: "Balanced dinner" },
        { time: "10:00 PM", activity: "Prepare for sleep" }
    ]
};

// Initialize the application
function init() {
    setupEventListeners();
    updateSliderValues();
}

// Set up all event listeners
function setupEventListeners() {
    elements.sleepSlider.addEventListener('input', updateSliderValues);
    elements.workSlider.addEventListener('input', updateSliderValues);
    elements.generateBtn.addEventListener('click', handleFormSubmission);
}

// Update slider value displays
function updateSliderValues() {
    elements.sleepValue.textContent = `${elements.sleepSlider.value} hours`;
    elements.workValue.textContent = `${elements.workSlider.value} hours`;
}

// Handle form submission
async function handleFormSubmission() {
    const userData = collectFormData();
    toggleLoadingState(true);
    
    try {
        const response = await fetchHealthData(userData);
        displayResults(response);
    } catch (error) {
        handleError(error);
    } finally {
        toggleLoadingState(false);
    }
}

// Collect data from form
function collectFormData() {
    const stressLevel = document.querySelector('input[name="stress"]:checked').value;
    
    return {
        sleep_hours: parseFloat(elements.sleepSlider.value),
        work_hours: parseInt(elements.workSlider.value),
        exercise: elements.exerciseSelect.value,
        diet: elements.dietSelect.value,
        stress_level: stressLevel,
        symptoms: elements.symptomsTextarea.value
    };
}

// Fetch data from API
async function fetchHealthData(userData) {
    const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    return await response.json();
}

// Display results
function displayResults(data) {
    // Validate and sanitize data
    const validatedData = validateResponse(data);
    
    // Display health information
    elements.healthPrediction.textContent = validatedData.health_prediction;
    elements.healthSuggestions.textContent = validatedData.health_suggestions;
    
    // Display routine
    renderRoutineTable(validatedData.routine);
    
    // Show results section
    elements.resultContainer.style.display = 'block';
}

// Validate API response
function validateResponse(data) {
    return {
        health_prediction: typeof data.health_prediction === 'string' 
            ? data.health_prediction 
            : "No health prediction available",
        health_suggestions: typeof data.health_suggestions === 'string'
            ? data.health_suggestions
            : "Maintain a balanced lifestyle with proper diet and exercise.",
        routine: Array.isArray(data.routine) && data.routine.length > 0
            ? data.routine
            : [...config.fallbackRoutine] // Use copy of fallback
    };
}

// Render routine table
function renderRoutineTable(routine) {
    elements.routineTableBody.innerHTML = '';
    
    routine.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(item.time)}</td>
            <td>${escapeHtml(item.activity)}</td>
        `;
        elements.routineTableBody.appendChild(row);
    });
}

// Basic HTML escaping for security
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Toggle loading state
function toggleLoadingState(isLoading) {
    elements.generateBtn.disabled = isLoading;
    elements.generateBtn.style.display = isLoading ? 'none' : 'block';
    elements.loadingIndicator.style.display = isLoading ? 'block' : 'none';
}

// Handle errors
function handleError(error) {
    console.error('Error details:', error);
    
    // Display fallback data with error message
    displayResults({
        health_prediction: "Error generating prediction",
        health_suggestions: `${error.message}. Showing sample routine instead.`,
        routine: []
    });
    
    alert('There was an error processing your request. Please try again.');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
// Add this to your health-routine.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    // Check if select elements exist
    console.log('Select elements:', document.querySelectorAll('select'));
});