// SVG Pet Component
// This is a placeholder pet that can be replaced with your Nano Banana generated character

class Pet {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = 'idle'; // idle, happy, alert, sleepy
    this.render();
    this.startIdleAnimation();
  }

  render() {
    // Check for custom pet image in localStorage
    const customImage = localStorage.getItem('customPetImage');
    const imageSrc = customImage || '../assets/pet.png';

    const petImg = `
      <div id="pet-container" style="position: relative; width: 360px; height: 190px; transform: translateZ(0); backface-visibility: hidden;">
        <img id="pet-img" src="${imageSrc}" alt="ByteBuddy Pet"
             style="width: 360px; height: 190px; object-fit: contain;
                    transform: translateZ(0); backface-visibility: hidden;
                    will-change: transform, opacity;">
        <span id="heart-emoji"
              style="position: absolute; top: 15px; right: 70px; font-size: 30px;
                     display: none; z-index: 10; transform: translateZ(0);
                     backface-visibility: hidden; will-change: opacity;">❤️</span>
      </div>
    `;

    this.container.innerHTML = petImg;
  }

  setState(newState) {
    this.state = newState;
    this.updateAppearance();
  }

  updateAppearance() {
    const petImg = document.getElementById('pet-img');
    const heart = document.getElementById('heart-emoji');

    // Reset
    if (petImg) {
      petImg.classList.remove('bounce', 'shake');
    }

    switch(this.state) {
      case 'happy':
        if (petImg) petImg.classList.add('bounce');
        if (heart) {
          heart.style.display = 'block';
          heart.style.opacity = '1';
          heart.style.transition = 'opacity 0.3s ease-out';

          // Force repaint when heart appears
          if (typeof forceRepaint === 'function') {
            requestAnimationFrame(() => {
              forceRepaint();
              setTimeout(() => forceRepaint(), 50);
            });
          }

          setTimeout(() => {
            // Fade out first
            heart.style.opacity = '0';

            // Force repaint during fade out
            if (typeof forceRepaint === 'function') {
              requestAnimationFrame(() => forceRepaint());
              setTimeout(() => forceRepaint(), 150);
            }

            // Then hide after fade completes
            setTimeout(() => {
              heart.style.display = 'none';

              // Multiple aggressive repaints after hiding
              if (typeof forceRepaint === 'function') {
                requestAnimationFrame(() => {
                  forceRepaint();
                  setTimeout(() => forceRepaint(), 50);
                  setTimeout(() => forceRepaint(), 150);
                  setTimeout(() => forceRepaint(), 250);
                });
              }
            }, 350);
          }, 2000);
        }
        break;

      case 'alert':
        if (petImg) petImg.classList.add('shake');
        break;

      case 'sleepy':
        // Could add opacity animation
        if (petImg) petImg.style.opacity = '0.7';
        break;

      default: // idle
        if (petImg) petImg.style.opacity = '1';
        break;
    }
  }

  startIdleAnimation() {
    // Random animations every 4 seconds
    setInterval(() => {
      if (this.state === 'idle') {
        const animations = [
          this.gentleBounce.bind(this),
          this.wiggle.bind(this),
          this.tilt.bind(this)
        ];
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        randomAnim();
      }
    }, 4000);
  }

  gentleBounce() {
    const petImg = document.getElementById('pet-img');
    if (petImg) {
      petImg.style.transition = 'transform 0.5s ease-in-out';
      petImg.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        petImg.style.transform = 'translateY(0)';
        // Force repaint after animation
        if (typeof forceRepaint === 'function') forceRepaint();
      }, 500);
    }
  }

  wiggle() {
    const petImg = document.getElementById('pet-img');
    if (petImg) {
      petImg.style.transition = 'transform 0.1s ease-in-out';
      let count = 0;
      const wiggleInterval = setInterval(() => {
        count++;
        petImg.style.transform = count % 2 === 0 ? 'rotate(-3deg)' : 'rotate(3deg)';

        // Aggressive repainting: force multiple repaints immediately after transform
        if (typeof forceRepaint === 'function') {
          // Immediate repaint
          requestAnimationFrame(() => {
            forceRepaint();
            // Second repaint after a frame
            requestAnimationFrame(() => {
              forceRepaint();
            });
          });
        }

        if (count >= 6) {
          clearInterval(wiggleInterval);
          petImg.style.transform = 'rotate(0deg)';

          // Multiple aggressive repaints after animation completes
          if (typeof forceRepaint === 'function') {
            requestAnimationFrame(() => {
              forceRepaint();
              setTimeout(() => forceRepaint(), 50);
              setTimeout(() => forceRepaint(), 150);
              setTimeout(() => forceRepaint(), 250);
            });
          }
        }
      }, 100);
    }
  }

  tilt() {
    const petImg = document.getElementById('pet-img');
    if (petImg) {
      petImg.style.transition = 'transform 0.6s ease-in-out';
      petImg.style.transform = 'rotate(15deg)';

      // Aggressive repaint after first tilt
      setTimeout(() => {
        if (typeof forceRepaint === 'function') {
          requestAnimationFrame(() => {
            forceRepaint();
            setTimeout(() => forceRepaint(), 50);
          });
        }
      }, 650);

      setTimeout(() => {
        petImg.style.transform = 'rotate(-15deg)';

        // Aggressive repaint after second tilt
        setTimeout(() => {
          if (typeof forceRepaint === 'function') {
            requestAnimationFrame(() => {
              forceRepaint();
              setTimeout(() => forceRepaint(), 50);
            });
          }
        }, 650);

        setTimeout(() => {
          petImg.style.transform = 'rotate(0deg)';

          // Multiple aggressive repaints after returning to neutral
          setTimeout(() => {
            if (typeof forceRepaint === 'function') {
              requestAnimationFrame(() => {
                forceRepaint();
                setTimeout(() => forceRepaint(), 50);
                setTimeout(() => forceRepaint(), 150);
                setTimeout(() => forceRepaint(), 250);
              });
            }
          }, 650);
        }, 600);
      }, 600);
    }
  }

  // Trigger animations
  celebrate() {
    this.setState('happy');
    setTimeout(() => {
      this.setState('idle');
    }, 2000);
  }

  alert() {
    this.setState('alert');
    setTimeout(() => {
      this.setState('idle');
    }, 1000);
  }
}

// Export for use in renderer.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Pet;
}
