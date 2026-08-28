// Copy-to-clipboard for the setup command boxes.
// Button labels come from data attributes so the Persian page can supply its own
// wording without a second script. The async Clipboard API needs a secure
// context, so a textarea fallback keeps the buttons working when the page is
// opened straight from disk over file://.
document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-btn");
  if (!button) return;

  const source = document.getElementById(button.dataset.copyTarget);
  if (!source) return;

  const idle = button.dataset.copyLabel || "Copy";
  const done = button.dataset.copiedLabel || "Copied";
  const failed = button.dataset.fallbackLabel || "Press Ctrl+C";

  const text = source.textContent.trim();
  let copied = false;

  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.setAttribute("readonly", "");
    scratch.style.position = "fixed";
    scratch.style.top = "-1000px";
    document.body.appendChild(scratch);
    scratch.select();
    copied = document.execCommand("copy");
    scratch.remove();
  }

  button.textContent = copied ? done : failed;
  button.classList.toggle("is-copied", copied);

  window.setTimeout(() => {
    button.textContent = idle;
    button.classList.remove("is-copied");
  }, 1800);
});
