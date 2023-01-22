const socket = io();
const qrcode = new QRCode(document.getElementById("qrcode"), {
  text: "https://www.google.com",
  width: 512,
  height: 512,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});

let updated = Date.now();

socket.on("newurl", url => {
  qrcode.makeCode(url);

  updated = Date.now();
});

setInterval(() => {
  if (Date.now() - updated > 60 * 1000) {
    qrcode.makeCode("");
  }
}, 1000);
