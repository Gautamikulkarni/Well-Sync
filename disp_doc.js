document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("city");
    const resultsContainer = document.getElementById("results-container");
    const cityNameElement = document.querySelector(".hero h1 span");
  
    if (!city) {
      resultsContainer.innerHTML = "<p>Please select a city first</p>";
      return;
    }
    cityNameElement.textContent = city;
    try {
      const response = await fetch(
        `/api/doctors?city=${encodeURIComponent(city)}`
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  
      const doctors = await response.json();
      resultsContainer.innerHTML = "";
  
      if (!doctors.length) {
        resultsContainer.innerHTML = `<p>No doctors found in ${city}</p>`;
        return;
      }
  
      doctors.forEach((doctor) => {
        const docCard = document.createElement("div");
        docCard.classList.add("job-card");
  
        const contact = doctor.contact || {};
        docCard.innerHTML = `
                <div class="job-info">
                    <h3>${doctor.name}</h3>
                    <p><strong>Degree:</strong> ${doctor.degree}</p>
                    <p><strong>Specialization:</strong> ${
                      doctor.specialization
                    }</p>
                    <p><strong>Affiliation:</strong> ${doctor.affiliation}</p>
                    <p><strong>Experience:</strong> ${doctor.experience}</p>
                    <p><strong>Working Hours:</strong> ${doctor.working_hours}</p>
                    ${
                      doctor.additional_info
                        ? `<p><strong>Additional Info:</strong> ${doctor.additional_info}</p>`
                        : ""
                    }
                    <p><strong>Contact:</strong></p>
                    <p><strong>Phone:</strong> ${
                      contact.phone || "Not available"
                    }</p>
                    ${
                      contact.alternate_phone
                        ? `<p><strong>Alternate Phone:</strong> ${contact.alternate_phone}</p>`
                        : "Not available"
                    }
                    ${
                      contact.email
                        ? `<p><strong>Email:</strong> ${contact.email}</p>`
                        : "Not available"
                    }
                    ${
                      contact.website
                        ? `<p><strong>Website:</strong><a href=" ${contact.website}" target="_blank">${contact.website}</a></p>`
                        : "Not available"
                    }
                </div>
            `;
  
        resultsContainer.appendChild(docCard);
      });
    } catch (error) {
      resultsContainer.innerHTML = `<p>Error loading doctors: ${error.message}</p>`;
    }
  });