// Global variables
let totalSpots = 20;
let availableSpots = 20;
let occupiedSpots = 0;
let vehicleData = {}; // Store vehicle data by vehicle number

document.addEventListener("DOMContentLoaded", () => {
  initializeParkingGrid();
});

// Initialize parking grid
function initializeParkingGrid() {
  const parkingGrid = document.getElementById("parkingGrid");
  parkingGrid.innerHTML = ''; // Clear existing slots

  for (let i = 1; i <= totalSpots; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot", "available");
    slot.dataset.id = i;
    slot.dataset.status = "available";
    slot.dataset.vehicle = ""; // Initially no vehicle
    slot.addEventListener("click", () => toggleSlot(slot));
    parkingGrid.appendChild(slot);
  }

  updateStats();
}

// Set total slots
function setTotalSlots() {
  const newTotal = parseInt(document.getElementById("totalSlots").value);
  if (newTotal > 0) {
    totalSpots = newTotal;
    availableSpots = newTotal;
    occupiedSpots = 0;
    vehicleData = {};
    initializeParkingGrid();
    updateStats();
  } else {
    showCustomAlert("Error", "Please enter a valid number of slots.");
  }
}

// Toggle slot between available and occupied
function toggleSlot(slot) {
  if (slot.classList.contains("available")) {
    showVehicleInput(slot);  // Show input for vehicle details if slot is available
  } else if (slot.classList.contains("occupied")) {
    removeVehicle(parseInt(slot.dataset.id)); // Remove vehicle if slot is occupied
  }
  updateStats();
}

// Add a vehicle by type and number
function addVehicle() {
    const vehicleType = document.getElementById("vehicleType").value;
    const vehicleNumber = document.getElementById("vehicleNumber").value;
  
    // Validate the input fields
    if (!vehicleType || !vehicleNumber) {
      showCustomAlert("Error", "Please enter both vehicle type and number.");
      return;
    }
  
    // Check if the vehicle number already exists in vehicleData
    if (vehicleData[vehicleNumber]) {
      showCustomAlert("Error", "This vehicle number is already registered.");
      return;
    }
  
    // Find the first available slot to park the vehicle
    for (let i = 1; i <= totalSpots; i++) {
      const slot = document.querySelector(`.slot[data-id='${i}']`);
      if (slot.dataset.status === "available") {
        // Update slot to occupied
        slot.classList.remove("available");
        slot.classList.add("occupied");
        slot.dataset.status = "occupied";
        slot.dataset.vehicle = `${vehicleType}: ${vehicleNumber}`;
  
        // Store the vehicle data in the vehicleData object
        vehicleData[vehicleNumber] = i;
        availableSpots--;
        occupiedSpots++;
        updateStats();
        break;
      }
    }
  
    // Close the vehicle input modal if any
    closeVehicleInput();
  }

  // Remove a vehicle by slot ID or vehicle number
  function removeVehicleByIdentifier() {
    const identifier = document.getElementById("removeIdentifier").value.trim();
    if (!identifier) return;
  
    let slotId;
    // Check if the identifier is a valid slot ID (numeric) or vehicle number
    if (!isNaN(parseInt(identifier))) {
      // Remove by slot ID
      slotId = parseInt(identifier);
    } else {
      // Remove by vehicle number
      slotId = vehicleData[identifier];
    }
  
    // If slot ID is found, remove the vehicle
    if (slotId !== undefined) {
      removeVehicle(slotId);
    } else {
      showCustomAlert("Error", "No vehicle found with the given ID or vehicle number.");
    }
  }
  
// Remove a vehicle from a slot
function removeVehicle(slotId) {
    const slot = document.querySelector(`.slot[data-id='${slotId}']`);
    if (slot && slot.dataset.status === "occupied") {
      // Update slot to available
      slot.classList.remove("occupied");
      slot.classList.add("available");
      slot.dataset.status = "available";
      slot.dataset.vehicle = "";

      // Extract vehicle number from slot data
      const vehicleInfo = slot.dataset.vehicle.trim();
      const vehicleNumber = vehicleInfo.split(":")[1]?.trim();
  
      if (vehicleNumber) {
        // Remove vehicle data from vehicleData object
        delete vehicleData[vehicleNumber];
      }

      availableSpots++;
      occupiedSpots--;
      updateStats();
    } else {
      showCustomAlert("Error", "No vehicle found in the given slot.");
    }
}

// Update parking stats on the UI
function updateStats() {
  document.getElementById("availableSpots").innerText = availableSpots;
  document.getElementById("occupiedSpots").innerText = occupiedSpots;
  document.getElementById("totalSpots").value = totalSpots; // Update total slots input field
}

// Search vehicle by number
function searchVehicle() {
  const searchQuery = document.getElementById("vehicleSearchInput").value.trim();
  const slots = document.querySelectorAll(".slot");

  // Clear previous highlights
  slots.forEach(slot => {
    slot.style.outline = "none";
    slot.style.outlineOffset = "0";
  });

  // Only search when the search query has exactly 4 digits (valid vehicle number format)
  if (searchQuery.length === 4 && !isNaN(searchQuery)) {
    slots.forEach(slot => {
      const vehicleInfo = slot.dataset.vehicle || "";
      const vehicleNumber = vehicleInfo.split(":")[1]?.trim();

      if (vehicleNumber === searchQuery) {
        slot.style.outline = "3px solid #4a90e2"; // Highlight matching slot
        slot.style.outlineOffset = "3px";
      }
    });
  }
}

// Show Custom Alert (Error or Success)
function showCustomAlert(title, message) {
  const alertTitle = document.getElementById("alertTitle");
  const alertMessage = document.getElementById("alertMessage");

  alertTitle.innerText = title;
  alertMessage.innerText = message;

  const alertModal = document.getElementById("customAlert");
  alertModal.style.display = "flex";
}

// Close the custom alert modal
function closeCustomAlert() {
  const alertModal = document.getElementById("customAlert");
  alertModal.style.display = "none";
}

// Show Vehicle Input form for a specific slot
function showVehicleInput(slot) {
  const vehicleInputModal = document.getElementById("vehicleInputModal");
  vehicleInputModal.style.display = "block";

  const submitButton = document.getElementById("submitVehicle");
  submitButton.onclick = () => {
    addVehicle(); // Add vehicle when form is submitted
    closeVehicleInput(); // Close the vehicle input form after submission
  };
}

// Close the Vehicle Input Modal
function closeVehicleInput() {
  const vehicleInputModal = document.getElementById("vehicleInputModal");
  vehicleInputModal.style.display = "none";
  document.getElementById("vehicleType").value = "";
  document.getElementById("vehicleNumber").value = "";
}
