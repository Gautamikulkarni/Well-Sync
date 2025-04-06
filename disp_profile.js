document.addEventListener("DOMContentLoaded", async function () {
  // Store the original container HTML at the start
  const originalContainer = document.querySelector(".health-profile-container");

  // Show loading state
  document.body.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading your health profile...</p>
    </div>
  `;

  try {
    console.log("Fetching latest profile...");
    const response = await fetch("/get_latest_profile");

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const userProfile = await response.json();
    console.log("Profile data received:", userProfile);

    if (!userProfile || userProfile.error) {
      throw new Error(userProfile?.error || "No profile data available");
    }

    // Restore the original container if it exists
    if (originalContainer) {
      document.body.innerHTML = originalContainer.outerHTML;
    } else {
      throw new Error("Profile container element not found");
    }

    // Helper function to safely update profile fields
    const updateProfileField = (elementId, value, label) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML =
          value !== undefined && value !== null && value !== ""
            ? `${value} <span class="label">${label}</span>`
            : `N/A <span class="label">${label}</span>`;
      } else {
        console.warn(`Element with ID  '${elementId}' not found`);
      }
    };

    // Update all profile fields
    updateProfileField("medical_id", userProfile.medical_id, "Medical_ID");
    updateProfileField("name", userProfile.name, "Name");
    updateProfileField("phone_number", userProfile.phone_number, "Mobile Number");
    updateProfileField("city", userProfile.address?.city, "City");
    updateProfileField("age", userProfile.age, "Age");
    updateProfileField("height", userProfile.height, "Height");
    updateProfileField("weight", userProfile.weight, "Weight");
    updateProfileField("diet", userProfile.lifestyle_factors?.diet, "Diet");
    updateProfileField("gender", userProfile.gender, "Gender");
    updateProfileField("blood_group", userProfile.blood_group, "Blood Group");
    updateProfileField(
      "past_illnesses",
      userProfile.past_illnesses?.join(", ") || "None",
      "Past Illness"
    );
    updateProfileField(
      "family_history",
      userProfile.family_history?.join(", ") || "None",
      "Family History"
    );
    updateProfileField(
      "current_medications",
      userProfile.current_medications?.join(", ") || "None",
      "Current Medications"
    );
    updateProfileField(
      "exercise_frequency",
      userProfile.lifestyle_factors?.exercise_frequency,
      "Exercise Frequency"
    );
    updateProfileField(
      "physical_disabilities",
      userProfile.physical_disabilities || "None",
      "Physical Disabilities"
    );
    updateProfileField(
      "known_allergies",
      userProfile.known_allergies?.join(", ") || "None",
      "Known Allergies"
    );
    updateProfileField(
      "surgery_hospitalizations",
      userProfile.surgery_hospitalizations?.join(", ") || "None",
      "Surgery/Hospitalizations"
    );
    updateProfileField(
      "smoking",
      userProfile.lifestyle_factors?.smoking,
      "Smoking"
    );
    updateProfileField(
      "alcohol_consumption",
      userProfile.lifestyle_factors?.alcohol_consumption,
      "Alcohol Consumption"
    );

    // Update progress indicators if they exist
    const mainProgress = document.getElementById("main-health-progress");
    const labProgress = document.getElementById("lab-test-progress");
    if (mainProgress)
      mainProgress.innerText = userProfile.mainHealthProgress || "N/A";
    if (labProgress)
      labProgress.innerText = userProfile.labTestProgress || "N/A";
  } catch (error) {
    console.error("Error loading profile:", error);

    // Show error message
    document.body.innerHTML = `
      <div class="error-container">
        <h2>Error Loading Profile</h2>
        <p>${error.message}</p>
        <div class="error-actions">
          <button onclick="location.reload()">Try Again</button>
          <button onclick="window.location.href='/'">Return Home</button>
        </div>
      </div>
    `;
  }
});