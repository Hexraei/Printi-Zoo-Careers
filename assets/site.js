// Paste the URL you get after deploying apps-script/Code.gs as a Web App here.
// See apps-script/Code.gs for the full setup steps.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzY9sDGDu6gPrvoJJKLcudJQXEJoFMb_23qMMdSN_B5zCMIKLdSek0vcCpUIPT3So8U/exec";

const ICONS = {
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.01"/></svg>'
};

function setStatus(statusEl, state, message) {
  statusEl.dataset.state = state;
  statusEl.hidden = false;
  statusEl.innerHTML = `${ICONS[state]}<span>${message}</span>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector("nav.links");
  if (navToggle && navPanel) {
    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navPanel.dataset.open = "false";
    };
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navPanel.dataset.open = String(!isOpen);
    });
    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  const form = document.querySelector("[data-apply-form]");
  if (!form) return;

  const role = form.dataset.applyForm;
  const wrap = form.closest(".apply-form-wrap") || form.parentElement;
  const statusEl = wrap.querySelector("[data-form-status]");
  const submitBtn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
      setStatus(statusEl, "error", "This form isn't connected yet. Call or message us directly for now.");
      return;
    }

    const data = new FormData(form);
    const payload = {
      role,
      name: (data.get("name") || "").toString().trim(),
      phone: (data.get("phone") || "").toString().trim(),
      email: (data.get("email") || "").toString().trim(),
      portfolio: (data.get("portfolio") || "").toString().trim(),
      message: (data.get("message") || "").toString().trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusEl.hidden = true;

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.ok) {
        const firstName = payload.name.split(" ")[0] || "there";
        form.reset();
        form.hidden = true;
        setStatus(statusEl, "success", `Thanks, ${firstName}. We've got your application and will reach out soon.`);
      } else {
        setStatus(statusEl, "error", "Something went wrong on our end. Please try again or call us directly.");
      }
    } catch (err) {
      setStatus(statusEl, "error", "Couldn't send that. Check your connection and try again, or call us directly.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit application";
    }
  });
});
