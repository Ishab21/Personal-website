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

let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

next.addEventListener("click", function () {
  let items = document.querySelectorAll(".item");
  document.querySelector(".slide").appendChild(items[0]);
});

prev.addEventListener("click", function () {
  let items = document.querySelectorAll(".item");
  document.querySelector(".slide").prepend(items[items.length - 1]); // here the length of items = 6
});

/*this is for the backgroun and current update */
function updateBackground() {
  const container = document.querySelector(".container");
  const active = document.querySelector(".slide .item:nth-child(2)");
  if (!container || !active) return;

  const bg = getComputedStyle(active).backgroundImage;
  container.style.setProperty("--bg", bg);
}

updateBackground(); // run once on load

document.querySelector(".next")?.addEventListener("click", () => {
  // your existing "next" logic that moves items...
  updateBackground();
});

document.querySelector(".prev")?.addEventListener("click", () => {
  // your existing "prev" logic that moves items...
  updateBackground();
});
