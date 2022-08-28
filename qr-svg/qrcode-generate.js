import QRCode from 'qrcode-svg'
import sharp from 'sharp'


const qrcode = new QRCode({ 
    content: "https://webisora.com",
    padding: 4,
    width: 256,
    height: 256,
    color: "#000000",
    background: "#ffffff",
    ecl: "M"
})

qrcode.save("qr-svg.svg", function (error) {
  if (error) throw error;
  
  const svgQr = sharp('qr-svg.svg')
    .png()
    .toFile("qr-code.png")
    .then(function(info) {
      console.log(info)
    })
    .catch(function(err) {
      console.log(err)
    })

  console.log("QR Code saved!");
});
