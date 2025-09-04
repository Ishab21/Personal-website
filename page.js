document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("slide-left")) {
          entry.target.classList.add("animate-left");
        }
        if (entry.target.classList.contains("slide-right")) {
          entry.target.classList.add("animate-right");
        }
        observer.unobserve(entry.target); // Remove if you want it to animate only once
      }
    });
  }, observerOptions);

  document.querySelectorAll(".slide-left, .slide-right").forEach((el) => {
    observer.observe(el);
  });
});
(function () {
  const layer = document.getElementById("koi-bg");
  if (!layer) return;

  const NUM_FISH = 10; // how many koi
  const BASE_DUR = 28; // base swim duration in seconds
  const MIN_SCALE = 0.6,
    MAX_SCALE = 1.2;

  // Simple inline SVG koi (two colorways). You can swap with your own SVGs.
  const koiSVGs = [
    // Orange / white
    `<svg viewBox="0 0 120 40" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="k1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#ff6b00"/>
            <stop offset="1" stop-color="#ffd1a6"/>
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="20" rx="34" ry="12" fill="url(#k1)"/>
        <ellipse cx="89" cy="18" rx="10" ry="6" fill="#ffb27a"/>
        <ellipse cx="31" cy="22" rx="10" ry="6" fill="#ffb27a"/>
        <circle cx="80" cy="20" r="2.5" fill="#2b2b2b"/>
        <path d="M110 20 c-6 -4 -6 -8 0 -12 10 2 10 22 0 12z" fill="#ffd1a6"/>
        <path d="M10 20 c6 -4 6 -8 0 -12 -10 2 -10 22 0 12z" fill="#ffd1a6"/>
      </svg>`,
    // White / black / red
    `<svg viewBox="0 0 120 40" width="100%" height="100%" aria-hidden="true">
        <ellipse cx="60" cy="20" rx="34" ry="12" fill="#f7f7f7"/>
        <ellipse cx="60" cy="20" rx="22" ry="7" fill="#e43d30" opacity="0.8"/>
        <circle cx="80" cy="20" r="2.5" fill="#222"/>
        <path d="M110 20 c-6 -4 -6 -8 0 -12 10 2 10 22 0 12z" fill="#f7f7f7"/>
        <path d="M10 20 c6 -4 6 -8 0 -12 -10 2 -10 22 0 12z" fill="#f7f7f7"/>
      </svg>`,
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const fishes = [];

  for (let i = 0; i < NUM_FISH; i++) {
    const fish = document.createElement("div");
    fish.className = "koi";
    fish.innerHTML = pick(koiSVGs);

    // Random size (via scale), vertical position, direction
    const scale = rand(MIN_SCALE, MAX_SCALE);
    const top = rand(5, 85); // % of viewport height
    const dir = Math.random() < 0.5 ? "left" : "right";

    // Randomize duration and delays, then set animations
    const duration = BASE_DUR * rand(0.7, 1.3);
    const delay = -rand(0, duration); // negative to desync starts

    // Slight “bob” offset baked into a CSS var for the swim keyframes to use
    fish.style.setProperty("--bob", "translateY(0)");

    Object.assign(fish.style, {
      top: `${top}vh`,
      width: `${rand(120, 220)}px`,
      height: "auto",
      transform: `scale(${scale})`,
      animation: [
        // swim
        `${
          dir === "right" ? "swim-right" : "swim-left"
        } ${duration}s linear infinite ${delay}s`,
        // bob
        `bob ${rand(3, 6)}s ease-in-out infinite`,
      ].join(", "),
    });

    // Start slightly offscreen depending on direction (looks smoother)
    fish.style.left = dir === "right" ? "-20%" : "auto";
    fish.style.right = dir === "left" ? "-20%" : "auto";

    layer.appendChild(fish);
    fishes.push({ el: fish, baseDur: duration, dir });
  }

  // === Scroll -> adjust swim speed (duration) ===
  let lastY = window.scrollY;
  let raf = null;

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastY);
      lastY = y;

      // Map scroll delta to a speed factor
      // tweak divisor (400) to taste; higher = less sensitive
      const factor = Math.min(3, 1 + delta / 400);

      fishes.forEach(({ el, baseDur, dir }) => {
        // Shorter duration = faster swim
        const newDur = baseDur / factor;
        // Keep bob as-is; update only the swim animation duration
        // We rebuild animation string to update the first animation’s duration.
        const anims = el.style.animation.split(",");
        anims[0] = `${
          dir === "right" ? "swim-right" : "swim-left"
        } ${newDur}s linear infinite`;
        el.style.animation = anims.join(",");
      });

      raf = null;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
