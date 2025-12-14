const urlInput = document.getElementById("urlInput");
const generateBtn = document.getElementById("generateBtn");
const qrContainer = document.getElementById("qrContainer");
const downloadLink = document.getElementById("downloadLink");

function normalizeUrl(value) {
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function clearOutput() {
  qrContainer.innerHTML = "";
  downloadLink.classList.add("hidden");
  downloadLink.removeAttribute("href");
}

function setDownloadFromCanvas() {
  const canvas = qrContainer.querySelector("canvas");
  if (!canvas) return;
  downloadLink.href = canvas.toDataURL("image/png");
  downloadLink.classList.remove("hidden");
}

function generateQR() {
  const url = normalizeUrl(urlInput.value);
  clearOutput();

  if (!url) return;

  try {
    new URL(url);
  } catch {
    alert("Please enter a valid URL");
    return;
  }

  new QRCode(qrContainer, {
    text: url,
    width: 320,
    height: 320,
    correctLevel: QRCode.CorrectLevel.M,
  });

  // Wait for canvas render
  setTimeout(setDownloadFromCanvas, 50);
}

generateBtn.addEventListener("click", generateQR);
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generateQR();
});
