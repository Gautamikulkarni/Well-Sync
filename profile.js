document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profileForm");

  if (!form) {
      console.error("Form with ID 'profileForm' not found.");
      return;
  }

  // Helper function to safely convert input to array
  const safeArrayConvert = (input) => {
      if (!input || typeof input !== 'string') return [];
      const trimmed = input.trim();
      return trimmed ? trimmed.split(/\s*,\s*/).filter(item => item) : [];
  };

  form.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("Form submission started");

      let userData = {
          name: document.getElementById("name").value.trim(),
          age: parseInt(document.getElementById("age").value) || 0,
          height: parseFloat(document.getElementById("height").value) || 0,
          weight: parseFloat(document.getElementById("weight").value) || 0,
          gender: document.getElementById("gender").value.trim(),
          blood_group: document.getElementById("blood_group").value.trim(),
          phone_number: document.getElementById("phone_number").value.trim(),
          address: {
              city: document.getElementById("city").value.trim(),
              state: document.getElementById("state").value.trim(),
              country: document.getElementById("country").value.trim(),
              pin_code: document.getElementById("pin_code").value.trim(),
          },
          past_illnesses: safeArrayConvert(document.getElementById("past_illnesses").value),
          family_history: safeArrayConvert(document.getElementById("family_history").value),
          current_medications: safeArrayConvert(document.getElementById("current_medications").value),
          known_allergies: safeArrayConvert(document.getElementById("known_allergies").value),
          surgery_hospitalizations: safeArrayConvert(document.getElementById("surgery_hospitalizations").value),
          lifestyle_factors: {
              smoking: document.getElementById("smoking").value.trim(),
              alcohol_consumption: document.getElementById("alcohol_consumption").value.trim(),
              exercise_frequency: document.getElementById("exercise_frequency").value.trim(),
              diet: document.getElementById("diet").value.trim(),
          },
          physical_disabilities: document.getElementById("physical_disabilities").value.trim(),
          timestamp: new Date().toISOString()
      };

      // Phone number validation
      if (!userData.phone_number || !/^\d{10,15}$/.test(userData.phone_number)) {
          alert("Please enter a valid phone number (10-15 digits)");
          return;
      }

      try {
          console.log("Submitting data:", JSON.stringify(userData, null, 2));
          
          const response = await fetch("/submit_profile", {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              },
              body: JSON.stringify(userData),
          });
          if (response.redirected) {
              window.location.href = response.url;
              return;
          }
          const result = await response.json();
          console.log("Server response:", result);

          if (!response.ok) {
              throw new Error(result.error || "Failed to save profile");
          }
          
          //window.location.href = result.redirect_url;
          

          alert("Profile saved successfully!");
          window.location.href = "/display_latest";
          
      } catch (error) {
          console.error("Submission error:", error);
          // alert(`Error: ${error.message}`);
          alert("error");
      }
  });
});