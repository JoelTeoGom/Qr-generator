
const urlInput = document.getElementById("urlInput");
const generateBtn = document.getElementById("generateBtn");
const qrContainer = document.getElementById("qrContainer");
const downloadLink = document.getElementById("downloadLink");

let observer = null;

function normalizeUrl(value) {
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function clearQR() {
  // Stop any previous observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Remove previous QR elements (keep placeholder)
  qrContainer.querySelectorAll("canvas, img").forEach((el) => el.remove());

  qrContainer.classList.remove("has-qr");
  downloadLink.classList.add("hidden");
  downloadLink.removeAttribute("href");
}

function getFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    // Get hostname without www
    let domain = urlObj.hostname.replace(/^www\./, "");
    // Remove .com, .net, .org, etc.
    domain = domain.replace(/\.(com|net|org|io|dev|app|co)$/, "");
    // Add path if exists (sanitize it)
    if (urlObj.pathname && urlObj.pathname !== "/") {
      const path = urlObj.pathname.replace(/^\/|\/$/g, "").replace(/\//g, "-");
      if (path) domain += `-${path}`;
    }
    // Clean up: only allow alphanumeric, hyphens, underscores
    domain = domain.replace(/[^a-zA-Z0-9-_]/g, "-");
    return `qr-${domain}.png`;
  } catch {
    return "qr-code.png";
  }
}

function setDownloadFromCanvas() {
  const canvas = qrContainer.querySelector("canvas");
  if (!canvas) return;
  const url = normalizeUrl(urlInput.value);
  const filename = getFilenameFromUrl(url);
  downloadLink.href = canvas.toDataURL("image/png");
  downloadLink.download = filename;
  downloadLink.classList.remove("hidden");
}

function revealQR() {
  const qrEl = qrContainer.querySelector("canvas, img");
  if (!qrEl) return;

  // Hide placeholder, show QR
  qrContainer.classList.add("has-qr");
  setDownloadFromCanvas();

  // We can stop observing once we have the element
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function generateQR() {
  const url = normalizeUrl(urlInput.value);
  clearQR();

  if (!url) return;

  try {
    new URL(url);
  } catch {
    alert("Please enter a valid URL");
    return;
  }

  // Observe changes: qrcodejs will append canvas/img asynchronously
  observer = new MutationObserver(() => revealQR());
  observer.observe(qrContainer, { childList: true, subtree: true });

  // Generate (qrcodejs inserts canvas/img inside qrContainer)
  new QRCode(qrContainer, {
    text: url,
    width: 320,
    height: 320,
    correctLevel: QRCode.CorrectLevel.M,
  });

  // Fallback: in case observer misses for any reason
  setTimeout(revealQR, 200);
}

generateBtn.addEventListener("click", generateQR);
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generateQR();
});
