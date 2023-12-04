// Function to generate voice volume options dynamically
function generateVolumeOptions() {
    const voiceVolumeSelect = document.getElementById('voiceVolumeSelect');

    for (let i = 0; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        voiceVolumeSelect.appendChild(option);
    }

    // Retrieve the saved volume from localStorage if it exists
    const savedVolume = localStorage.getItem('selectedVolume');
    if (savedVolume !== null) {
        voiceVolumeSelect.value = savedVolume;
    }

    // Listen for change event on select element
    voiceVolumeSelect.addEventListener('change', function (event) {
        const selectedVolume = event.target.value;
        // Save the selected volume in localStorage
        localStorage.setItem('selectedVolume', selectedVolume);
    });
}

// Call the function to generate the volume options on page load
window.onload = generateVolumeOptions;
