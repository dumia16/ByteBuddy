const { ipcRenderer } = require('electron');

// Initialize pet
let pet;
document.addEventListener('DOMContentLoaded', () => {
  // Load pet script
  const script = document.createElement('script');
  script.src = 'pet.js';
  script.onload = () => {
    pet = new Pet('pet');

    // Load custom pet image if available
    const customImage = localStorage.getItem('customPetImage');
    if (customImage) {
      updatePetImage(customImage);
    }
  };
  document.body.appendChild(script);

  // Initialize all features
  initDragging();
  initReminders();
  initIPCListeners();
});

// ===== DRAGGING FUNCTIONALITY =====
function initDragging() {
  const petContainer = document.getElementById('pet-container');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  petContainer.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target.closest('#speech-bubble') || e.target.closest('#settings-btn')) {
      return; // Don't drag when clicking on bubble or settings
    }

    initialX = e.clientX;
    initialY = e.clientY;

    const rect = window.getBoundingClientRect();
    currentX = rect.left;
    currentY = rect.top;

    isDragging = true;
  }

  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();

    const deltaX = e.screenX - initialX;
    const deltaY = e.screenY - initialY;

    window.moveTo(currentX + deltaX, currentY + deltaY);
  }

  function dragEnd(e) {
    isDragging = false;
  }
}

// ===== IPC LISTENERS =====
function initIPCListeners() {
  // Listen for pet image updates from settings window or tray menu
  ipcRenderer.on('update-pet-image', (event, imageData) => {
    if (imageData) {
      localStorage.setItem('customPetImage', imageData);
      updatePetImage(imageData);
    } else {
      localStorage.removeItem('customPetImage');
      updatePetImage(null);
    }
  });

  // Listen for settings changes to restart reminders
  ipcRenderer.on('settings-changed', () => {
    initReminders();
  });
}

function updatePetImage(imageData) {
  const petImg = document.getElementById('pet-img');
  if (petImg) {
    if (imageData) {
      petImg.src = imageData;
    } else {
      petImg.src = '../assets/pet.png'; // Default image
    }

    // Force repaint after image change to prevent ghosting
    petImg.onload = () => {
      setTimeout(() => {
        if (typeof forceRepaint === 'function') {
          forceRepaint();
          // Extra repaint for image changes
          setTimeout(() => {
            if (typeof forceRepaint === 'function') {
              forceRepaint();
            }
          }, 100);
        }
      }, 50);
    };
  }
}

// ===== REMINDERS FUNCTIONALITY =====
let waterReminderTimer;
let endOfDayTimer;

function loadSettings() {
  return {
    waterInterval: localStorage.getItem('waterInterval') || 120,
    endOfDayTime: localStorage.getItem('endOfDayTime') || '18:00',
    enableWater: localStorage.getItem('enableWater') !== 'false',
    enableEndOfDay: localStorage.getItem('enableEndOfDay') !== 'false'
  };
}

function initReminders() {
  // Clear existing timers
  if (waterReminderTimer) clearInterval(waterReminderTimer);
  if (endOfDayTimer) clearInterval(endOfDayTimer);

  const settings = loadSettings();

  // Water reminder
  if (settings.enableWater) {
    const intervalMs = settings.waterInterval * 60 * 1000;

    // Show first reminder after 5 seconds (for testing)
    setTimeout(() => {
      showReminder(getWaterReminderMessage());
    }, 5000);

    // Then continue with regular interval
    waterReminderTimer = setInterval(() => {
      showReminder(getWaterReminderMessage());
    }, intervalMs);
  }

  // End of day reminder
  if (settings.enableEndOfDay) {
    checkEndOfDay(settings.endOfDayTime);
    // Check every minute
    endOfDayTimer = setInterval(() => {
      checkEndOfDay(settings.endOfDayTime);
    }, 60 * 1000);
  }
}

function checkEndOfDay(targetTime) {
  const now = new Date();
  const [hours, minutes] = targetTime.split(':');
  const targetDate = new Date();
  targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  // Check if we're within 1 minute of target time
  const diff = Math.abs(now - targetDate);
  if (diff < 60000 && !localStorage.getItem(`eod-shown-${targetDate.toDateString()}`)) {
    showReminder(getEndOfDayMessage());
    // Mark as shown for today
    localStorage.setItem(`eod-shown-${targetDate.toDateString()}`, 'true');
  }
}

function showReminder(message) {
  const bubble = document.getElementById('speech-bubble');
  const messageText = document.getElementById('message-text');
  const dismissBtn = document.getElementById('dismiss-btn');

  messageText.textContent = message;
  bubble.classList.remove('hidden', 'bubble-hiding');

  // Animate pet
  if (pet) {
    pet.alert();
  }

  // Show notification
  showNotification('ByteBuddy', message);

  // Auto-dismiss after 10 seconds
  const autoDismiss = setTimeout(() => {
    dismissBubble(bubble);
  }, 10000);

  // Dismiss button
  dismissBtn.onclick = () => {
    clearTimeout(autoDismiss);
    dismissBubble(bubble);
    if (pet) {
      pet.celebrate();
    }
  };
}

// Helper function to dismiss bubble with animation
function dismissBubble(bubble) {
  // Immediately start fading out
  bubble.classList.add('bubble-hiding');

  // Clear the message text immediately to avoid showing empty bubble
  const messageText = document.getElementById('message-text');
  if (messageText) {
    messageText.style.opacity = '0';
  }

  // Force repaint immediately when text disappears
  if (typeof forceRepaint === 'function') {
    setTimeout(() => forceRepaint(), 50);
  }

  // Force repaint during animation
  setTimeout(() => {
    if (typeof forceRepaint === 'function') {
      forceRepaint();
    }
  }, 150);

  // Wait for animation to complete before hiding
  setTimeout(() => {
    bubble.classList.add('hidden');
    bubble.classList.remove('bubble-hiding');

    // Reset message text opacity for next time
    if (messageText) {
      messageText.style.opacity = '1';
    }

    // Force repaint on macOS after hiding
    if (typeof forceRepaint === 'function') {
      forceRepaint();
      // Extra repaint pass for stubborn ghosting
      setTimeout(() => {
        if (typeof forceRepaint === 'function') {
          forceRepaint();
        }
      }, 100);
    }
  }, 300); // Match animation duration
}

function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '../assets/pet/icon.png' // You can add an icon later
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body: body });
      }
    });
  }
}

// ===== REMINDER MESSAGES =====
function getWaterReminderMessage() {
  const messages = [
    "Time to drink water! 💧 Stay hydrated!",
    "Don't forget to hydrate! 💦",
    "Water break! Your body needs it! 🚰",
    "Hydration check! Drink some water! 💙",
    "Take a sip! Water time! 🥤"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getEndOfDayMessage() {
  const messages = [
    "Time for a walk! Let's go outside! 🚶‍♂️",
    "Walk time! Fresh air is calling! 🌳",
    "Let's take a walk together! 🐾",
    "Time to stretch your legs! Walk break! 🌤️",
    "Walk o'clock! Let's get moving! 👟"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Request notification permission on load
if (Notification.permission === 'default') {
  Notification.requestPermission();
}

// ===== FORCE REPAINT FUNCTIONALITY (Fix macOS Ghosting) =====
function forceRepaint() {
  if (process.platform === 'darwin') {
    // Method 1: Force multiple layout recalculations
    document.body.style.transform = 'translateZ(0)';
    void document.body.offsetHeight; // Trigger reflow
    document.body.style.transform = '';

    // Method 2: Toggle opacity with force
    const originalOpacity = document.body.style.opacity;
    document.body.style.opacity = '0.999';
    void document.body.offsetHeight;

    // Method 3: Force repaint on pet container
    const petContainer = document.getElementById('pet-container');
    if (petContainer) {
      petContainer.style.transform = 'translateZ(0)';
      void petContainer.offsetHeight;
      petContainer.style.transform = '';
    }

    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
      void document.body.offsetHeight;

      // Extra repaint pass
      requestAnimationFrame(() => {
        document.body.style.webkitTransform = 'translateZ(0)';
        void document.body.offsetHeight;
        document.body.style.webkitTransform = '';

        // Force repaint on pet container again
        if (petContainer) {
          petContainer.style.webkitTransform = 'translateZ(0)';
          void petContainer.offsetHeight;
          petContainer.style.webkitTransform = '';
        }
      });
    });

    // Method 4: Request window repaint via IPC
    ipcRenderer.send('force-repaint');
  }
}

// Attach repaint listeners to pet animations
function attachRepaintListeners() {
  const petImg = document.getElementById('pet-img');
  if (petImg) {
    petImg.addEventListener('animationend', forceRepaint);
    petImg.addEventListener('transitionend', forceRepaint);
  }
}

// Initialize repaint listeners when pet loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(attachRepaintListeners, 1000);
});
