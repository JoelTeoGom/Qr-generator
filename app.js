const urlInput = document.getElementById("urlInput");
const generateBtn = document.getElementById("generateBtn");
const qrContainer = document.getElementById("qrContainer");
const downloadLink = document.getElementById("downloadLink");

function normalizeUrl(value) {
  const v = value.trim();
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) return "https://" + v;
  return v;
}

function generateQR() {
  const url = normalizeUrl(urlInput.value);

  qrContainer.innerHTML = "";
  downloadLink.classList.add("hidden");

  if (!url) return;

  try {
    new URL(url);
  } catch {
    alert("Please enter a valid URL");
    return;
  }

  new QRCode(qrContainer, {
    text: url,
    width: 260,
    height: 260,
    correctLevel: QRCode.CorrectLevel.M,
  });

  setTimeout(() => {
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) return;
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.classList.remove("hidden");
  }, 50);
}

generateBtn.addEventListener("click", generateQR);
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generateQR();
});
