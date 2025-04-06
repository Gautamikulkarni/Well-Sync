document.getElementById('healthForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.querySelector('#healthForm button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating...';

    // Extract form values safely (handling missing fields)
    const formData = {
        wake_up_time: document.getElementById('wakeTime')?.value || '',
        sleep_time: document.getElementById('sleepTime')?.value || '',
        sleep_hours: document.getElementById('sleepHours')?.value || '',
        work_hours: document.getElementById('workHours')?.value || '',
        exercise: document.querySelector('input[name="exercise"]:checked')?.value || 'None',
        diet: document.getElementById('diet')?.value || 'Not specified',
        stress_level: document.getElementById('stressLevel')?.value || 'Unknown',
        symptoms: document.getElementById('symptoms')?.value || 'None'
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/generate', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);

        const data = await response.json();

        if (data?.status === 'success') {
            displayResults(data.response);
        } else {
            throw new Error(data?.message || 'Unknown error occurred');
        }
    } catch (error) {
        alert(`⚠️ Error: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate Routine';
    }
});

function displayResults(response) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Health Analysis
    const healthSection = document.createElement('div');
    healthSection.innerHTML = `<h2>🔍 Health Analysis</h2>`;

    if (response.includes('### Health Analysis:')) {
        const healthContent = response.split('### Health Analysis:')[1].split('### Daily Routine:')[0];
        healthSection.innerHTML += `<div class="result-box">${formatText(healthContent)}</div>`;
    }

    // Daily Routine
    const routineSection = document.createElement('div');
    routineSection.innerHTML = `<h2>📋 Your Personalized Routine</h2>`;

    if (response.includes('### Daily Routine:')) {
        const routineContent = response.split('### Daily Routine:')[1];
        routineSection.innerHTML += `<div class="result-box"><pre>${formatText(routineContent)}</pre></div>`;
    } else {
        routineSection.innerHTML += `<div class="result-box">${formatText(response)}</div>`;
    }

    resultsDiv.appendChild(healthSection);
    resultsDiv.appendChild(routineSection);
    resultsDiv.classList.remove('hidden');
}

function formatText(text) {
    return text.replace(/\n/g, '<br>');
}
