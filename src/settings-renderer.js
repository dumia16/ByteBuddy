const { ipcRenderer } = require('electron');

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initPetImageUpload();
  initSaveButton();
});

function loadSettings() {
  const defaults = {
    waterInterval: 120,
    endOfDayTime: '18:00',
    enableWater: true,
    enableEndOfDay: true,
    customPetImage: null
  };

  const settings = {
    waterInterval: localStorage.getItem('waterInterval') || defaults.waterInterval,
    endOfDayTime: localStorage.getItem('endOfDayTime') || defaults.endOfDayTime,
    enableWater: localStorage.getItem('enableWater') !== 'false',
    enableEndOfDay: localStorage.getItem('enableEndOfDay') !== 'false',
    customPetImage: localStorage.getItem('customPetImage') || defaults.customPetImage
  };

  document.getElementById('water-interval').value = settings.waterInterval;
  document.getElementById('end-of-day-time').value = settings.endOfDayTime;
  document.getElementById('enable-water').checked = settings.enableWater;
  document.getElementById('enable-end-of-day').checked = settings.enableEndOfDay;

  // Show preview if custom image exists
  updatePetPreview(settings.customPetImage);
}

function saveSettings() {
  const waterInterval = document.getElementById('water-interval').value;
  const endOfDayTime = document.getElementById('end-of-day-time').value;
  const enableWater = document.getElementById('enable-water').checked;
  const enableEndOfDay = document.getElementById('enable-end-of-day').checked;

  localStorage.setItem('waterInterval', waterInterval);
  localStorage.setItem('endOfDayTime', endOfDayTime);
  localStorage.setItem('enableWater', enableWater);
  localStorage.setItem('enableEndOfDay', enableEndOfDay);

  // Notify main process to restart reminders
  ipcRenderer.send('settings-changed');

  // Show success feedback
  const saveBtn = document.getElementById('save-settings');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Saved!';
  saveBtn.style.background = '#28a745';

  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background = '#34c759';
  }, 1500);
}

function initSaveButton() {
  document.getElementById('save-settings').addEventListener('click', () => {
    saveSettings();
  });
}

// Pet image upload functionality
function initPetImageUpload() {
  const uploadBtn = document.getElementById('upload-pet-btn');
  const resetBtn = document.getElementById('reset-pet-btn');
  const fileInput = document.getElementById('pet-image-input');

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (PNG, JPG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image file is too large. Please select a file under 5MB.');
      return;
    }

    // Read and store the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;

      try {
        localStorage.setItem('customPetImage', imageData);
        updatePetPreview(imageData);

        // Notify main window to update pet
        ipcRenderer.send('update-pet-image', imageData);
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          alert('Storage quota exceeded. Please use a smaller image.');
        } else {
          alert('Error saving image: ' + e.message);
        }
      }
    };

    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };

    reader.readAsDataURL(file);
  });

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('customPetImage');
    updatePetPreview(null);

    // Notify main window to reset pet
    ipcRenderer.send('update-pet-image', null);
  });
}

function updatePetPreview(imageData) {
  const preview = document.getElementById('pet-preview');
  const previewImg = document.getElementById('pet-preview-img');

  if (imageData) {
    previewImg.src = imageData;
    preview.classList.add('visible');
  } else {
    preview.classList.remove('visible');
    previewImg.src = '';
  }
}
