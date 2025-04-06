window.searchNGO = async function searchNGO() {
    const user_query = document
      .getElementById("jobSearch")
      .value.trim()
      .toLowerCase();
  
    if (!user_query) {
      alert("Please enter a search term!");
      return;
    }
  
    try {
      // Fetch data from Flask API
      const response = await fetch(
        `/search_ngos?query=${encodeURIComponent(user_query)}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const ngos = await response.json();
      console.log("Fetched NGOs:", ngos); // Debugging
  
      const resultsContainer = document.getElementById("results-container");
      resultsContainer.innerHTML = ""; // Clear previous results
  
      if (!Array.isArray(ngos) || ngos.length === 0) {
        resultsContainer.innerHTML = "<p>No NGOs found matching your search!</p>";
        return;
      }
  
      ngos.forEach((ngo) => {
        const ngoCard = document.createElement("div");
        ngoCard.classList.add("job-card");
  
        const services = Array.isArray(ngo.services_provided)
          ? ngo.services_provided.join(", ")
          : "N/A";
  
        const contactDetails = ngo.contact_details || {};
        const phone = contactDetails.phone || "Not available";
        const email = contactDetails.email || "Not available";
        const website = contactDetails.website
          ? `<a href="${contactDetails.website}" target="_blank">Visit Website</a>`
          : "Not available";
        const address = contactDetails.address || "Not available";
  
        const keyPersonnel =
          typeof ngo.key_personnel === "object" && ngo.key_personnel !== null
            ? Object.entries(ngo.key_personnel)
                .map(([role, name]) => `${role}: ${name}`)
                .join(", ")
            : ngo.key_personnel || "Not specified";
  
        ngoCard.innerHTML = `
          <div class="job-info">
            <h3>${ngo.name}</h3>
            <p><strong>Location:</strong> ${ngo.location}</p>
            <p><strong>Services:</strong> ${services}</p>
            <p><strong>Key Personnel:</strong> ${keyPersonnel}</p>
            <p><strong>Contact:</strong></p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Website:</strong> ${website}</p>
            <p><strong>Address:</strong> ${address}</p>
          </div>
        `;
  
        resultsContainer.appendChild(ngoCard);
      });
    } catch (error) {
      console.error("Error fetching NGOs:", error);
      document.getElementById("results-container").innerHTML =
        "<p>Failed to fetch NGOs. Please try again later.</p>";
    }
  };
  