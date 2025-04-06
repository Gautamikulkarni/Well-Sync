// City data
const ngos = [
  { city: "Delhi", locations: 3, image: "delhi.png" },
  { city: "Mumbai", locations: 5, image: "mumbai.png" },
  { city: "Kolkata", locations: 2, image: "kolkata.png" },
  { city: "Bangalore", locations: 4, image: "bangalore.png" },
  { city: "Hyderabad", locations: 3, image: "hyderabad.png" },
  { city: "Chennai", locations: 6, image: "chennai.png" },
  { city: "Bhubaneswar", locations: 2, image: "bhubaneshwar.png" },
  { city: "Pune", locations: 3, image: "pune.png" },
  { city: "Lucknow", locations: 4, image: "lucknow.png" },
  { city: "Ludhiana", locations: 5, image: "ludhiana.png" },
  { city: "Ahmedabad", locations: 5, image: "Ahmedabad.png" },
  { city: "Bhopal", locations: 5, image: "Bhopal.png" },
  { city: "Nagpur", locations: 5, image: "nagpur.png" },
  { city: "Sangamner", locations: 2, image: "sangamner.png" },
  { city: "Nashik", locations: 4, image: "nashik.png" },
  { city: "Noida", locations: 3, image: "noida.png" },
  { city: "Chandigarh", locations: 6, image: "chandigarh.png" },
  { city: "Aurangabad", locations: 2, image: "aurangabad.png" },
  { city: "Vizag", locations: 3, image: "vizag.png" },
  { city: "Gurgaon", locations: 5, image: "gurgaon.png" },
  { city: "Vellore", locations: 2, image: "vellore.png" },
];

// DOM Elements
const ngoGrid = document.getElementById("cityGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// Pagination settings
const itemsPerPage = 8;
let currentIndex = 0;
const totalPages = Math.ceil(ngos.length / itemsPerPage);

// Render NGO cards
function renderNGOs(startIndex) {
  ngoGrid.innerHTML = "";
  const visibleNGOs = ngos.slice(startIndex, startIndex + itemsPerPage);

  visibleNGOs.forEach((ngo) => {
    const ngoCard = document.createElement("div");
    ngoCard.className = "ngo-card";

    ngoCard.innerHTML = `
        <img src="/static/images/${ngo.image}" alt="${
      ngo.city
    }" onerror="this.onerror=null; this.src='/static/images/default-city.png'">
        <div class="ngo-card-content">
          <h3>${ngo.city}</h3>
          <p>${ngo.locations} Location${ngo.locations !== 1 ? "s" : ""}</p>
        </div>
      `;

    ngoCard.addEventListener("click", () => {
      window.location.href = `/disp_doc?city=${encodeURIComponent(ngo.city)}`;
    });

    ngoGrid.appendChild(ngoCard);
  });

  updateButtonStates();
  updatePageInfo();
}

// Update pagination button states
function updateButtonStates() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex + itemsPerPage >= ngos.length;
}

// Update page information
function updatePageInfo() {
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Scroll through grid
function scrollGrid(direction) {
  const maxIndex = ngos.length - itemsPerPage;
  currentIndex = Math.max(
    0,
    Math.min(currentIndex + direction * itemsPerPage, maxIndex)
  );
  renderNGOs(currentIndex);
}

// Event listeners
prevBtn.addEventListener("click", () => scrollGrid(-1));
nextBtn.addEventListener("click", () => scrollGrid(1));

// Initial render
renderNGOs(0);