// DARK / LIGHT MODE SYSTEM
const toggle = document.getElementById("modeToggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// CONTACT FORM SYSTEM
const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Message sent successfully");
    form.reset();
});
