class Gyros {
  constructor(selector, options) {
    this.elements = document.querySelectorAll(selector);
    this.options = this.getOptions(options);
    this.lastUpdateTime = 0;
    this.predefinedMaterials = {
      gold: {
        polished: ['#ffd700', '#f0c500', '#e6b200', '#d99f00', '#cc8c00'],
        matte: ['#b38600', '#a67c00', '#997300', '#8c6900', '#806000'],
      },
      silver: {
        polished: ['#c0c0c0', '#b3b3b3', '#a6a6a6', '#999999', '#8c8c8c'],
        matte: ['#737373', '#666666', '#595959', '#4d4d4d', '#404040'],
      },
    };

    this.applyEffect();
  }

  getOptions(options) {
    const defaultOptions = {
      material: 'gold',
      shininess: 'polished',
      fallback: ['gyroscope', 'mouse', 'static'],
      sensitivity: 50, // 0-100, lower is more frequent
    };

    return { ...defaultOptions, ...options };
  }

  async applyEffect() {
    let gyroscopeUsed = false;

    if (window.DeviceOrientationEvent && this.options.fallback.includes('gyroscope')) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permissionState = await DeviceOrientationEvent.requestPermission();
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
            gyroscopeUsed = true;
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
        gyroscopeUsed = true;
      }
    }

    if (!gyroscopeUsed && this.options.fallback.includes('mouse')) {
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    } else if (!gyroscopeUsed) {
      this.elements.forEach(element => {
        const gradient = this.getGradient();
        element.style.backgroundImage = gradient;
      });
    }
  }

  handleOrientation(event) {
    const { beta, gamma } = event; // beta: -180 to 180, gamma: -90 to 90
    this.handleUpdate(beta, gamma);
  }

  handleMouseMove(event) {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const beta = (clientY / innerHeight) * 180 - 90; // -90 to 90
    const gamma = (clientX / innerWidth) * 180 - 90; // -90 to 90

    this.handleUpdate(beta, gamma);
  }

  handleUpdate(beta, gamma) {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.options.sensitivity) {
      return;
    }
    this.lastUpdateTime = now;

    this.elements.forEach(element => {
      const gradient = this.getGradient(beta, gamma);
      element.style.backgroundImage = gradient;
    });
  }

  getGradient(beta, gamma) {
    if (beta === undefined || gamma === undefined) {
      // Fallback for static gradient
      beta = 45;
      gamma = 45;
    }

    const angle = 180 + (gamma * 2); // 0-360 deg
    const position = 50 + (beta / 180 * 50); // 0-100 %

    let colors;
    const { material, shininess } = this.options;

    if (typeof material === 'string') {
      colors = this.predefinedMaterials[material]?.[shininess] || this.predefinedMaterials.gold.polished;
    } else if (typeof material === 'object') {
      colors = material[shininess] || material.polished || Object.values(material)[0];
    }

    const gradientStops = colors.map((color, index) => {
      const stopPosition = position + (index - 2) * 20;
      return `${color} ${stopPosition}%`;
    }).join(', ');

    return `linear-gradient(${angle}deg, ${gradientStops})`;
  }
}

export default Gyros;
