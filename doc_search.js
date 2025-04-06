window.searchDOC = searchDOC;
async function searchDOC() {
  const user_query = document
    .getElementById("doctorSearch")
    .value.trim()
    .toLowerCase();
  if (!user_query) {
    alert("Please enter a search term!");
    return;
  }
  try {
    // Fetch data from Flask API
    const response = await fetch(
      `http://127.0.0.1:5000/search_docs?query=${encodeURIComponent(
        user_query
      )}`
    );
    if (!response.ok) {
      throw new Error('HTTP error! Status: ${response.status}');
    }
    const doctors = await response.json();
    console.log("Fetched Doctors:", doctors); // Debugging

    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ""; // Clear previous results

    if (!Array.isArray(doctors) || doctors.length === 0) {
      resultsContainer.innerHTML =
        "<p>No doctors found matching your search!</p>";
      return;
    }
    if (doctors.length === 1) {
      resultsContainer.style.display = "flex";
      resultsContainer.style.justifyContent = "center";
    } else {
      resultsContainer.style.display = "flex";
      resultsContainer.style.justifyContent = "space-around";
    }
    doctors.forEach((doctor) => {
      const docCard = document.createElement("div");
      docCard.classList.add("job-card");

      const contact = doctor.contact || {};
      const phone = contact.phone || "Not available";
      const email = contact.email || "Not available";
      const altPhone = contact.alternate_phone || "Not available";

      docCard.innerHTML = `
        <div class="job-info">
          <h3>${doctor.name}</h3>
          <p><strong>Degree:</strong> ${doctor.degree}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Affiliation:</strong> ${doctor.affiliation}</p>
          <p><strong>Experience:</strong> ${doctor.experience}</p>
          <p><strong>Working Hours:</strong> ${doctor.working_hours}</p>
          <p><strong>Additional Info:</strong> ${doctor.additional_info}</p>
          <p><strong>Contact:</strong></p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Alternate Phone:</strong> ${altPhone}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `;

      resultsContainer.appendChild(docCard);
    });
  } catch (error) {
    console.error("Error fetching Doctors:", error);
    document.getElementById("results-container").innerHTML =
      "<p>Failed to fetch doctors. Please try again later.</p>";
  }
}