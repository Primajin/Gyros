class f {
  constructor(e, t) {
    this.elements = document.querySelectorAll(e), this.options = this.getOptions(t), this.lastUpdateTime = 0, this.predefinedMaterials = {
      gold: {
        polished: ["#ffd700", "#f0c500", "#e6b200", "#d99f00", "#cc8c00"],
        matte: ["#b38600", "#a67c00", "#997300", "#8c6900", "#806000"]
      },
      silver: {
        polished: ["#c0c0c0", "#b3b3b3", "#a6a6a6", "#999999", "#8c8c8c"],
        matte: ["#737373", "#666666", "#595959", "#4d4d4d", "#404040"]
      }
    }, this.applyEffect();
  }
  getOptions(e) {
    return { ...{
      material: "gold",
      shininess: "polished",
      fallback: ["gyroscope", "mouse", "static"],
      sensitivity: 50
      // 0-100, lower is more frequent
    }, ...e };
  }
  async applyEffect() {
    let e = !1;
    if (window.DeviceOrientationEvent && this.options.fallback.includes("gyroscope"))
      if (typeof DeviceOrientationEvent.requestPermission == "function")
        try {
          await DeviceOrientationEvent.requestPermission() === "granted" && (window.addEventListener("deviceorientation", this.handleOrientation.bind(this)), e = !0);
        } catch (t) {
          console.error(t);
        }
      else
        window.addEventListener("deviceorientation", this.handleOrientation.bind(this)), e = !0;
    !e && this.options.fallback.includes("mouse") ? window.addEventListener("mousemove", this.handleMouseMove.bind(this)) : e || this.elements.forEach((t) => {
      const i = this.getGradient();
      t.style.backgroundImage = i;
    });
  }
  handleOrientation(e) {
    const { beta: t, gamma: i } = e;
    this.handleUpdate(t, i);
  }
  handleMouseMove(e) {
    const { clientX: t, clientY: i } = e, { innerWidth: o, innerHeight: s } = window, n = i / s * 180 - 90, a = t / o * 180 - 90;
    this.handleUpdate(n, a);
  }
  handleUpdate(e, t) {
    const i = Date.now();
    i - this.lastUpdateTime < this.options.sensitivity || (this.lastUpdateTime = i, this.elements.forEach((o) => {
      const s = this.getGradient(e, t);
      o.style.backgroundImage = s;
    }));
  }
  getGradient(e, t) {
    var d;
    (e === void 0 || t === void 0) && (e = 45, t = 45);
    const i = 180 + t * 2, o = 50 + e / 180 * 50;
    let s;
    const { material: n, shininess: a } = this.options;
    typeof n == "string" ? s = ((d = this.predefinedMaterials[n]) == null ? void 0 : d[a]) || this.predefinedMaterials.gold.polished : typeof n == "object" && (s = n[a] || n.polished || Object.values(n)[0]);
    const r = s.map((c, l) => {
      const h = o + (l - 2) * 20;
      return `${c} ${h}%`;
    }).join(", ");
    return `linear-gradient(${i}deg, ${r})`;
  }
}
export {
  f as default
};
