<script>
import QRCode from './lib/qrcode'
import { Canvg } from 'canvg'

  let qrTxt = null
  let v = null
  let qrPng = null

  const generateCode = e => {
    qrTxt = e.target.value
    qrTxt = qrTxt.toLowerCase().replace(/\s/g, '-')

    let qrcode = new QRCode({
      content: qrTxt,
      join: true,
      padding: 1,
      width: 512,
      height: 512,
      color: "#000000",
      background: "#ffffff",
      ecl: "M"
    })
    let svg = qrcode.svg()
    document.getElementById("qrOutput").innerHTML = svg

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    v = Canvg.fromString(ctx, svg);
    v.start();
    qrPng = canvas.toDataURL("img/png");

  }
  
</script>

<main>
  <input type="text" name="qrText" id="qrTxt" on:input={(e) => generateCode(e)}>
  <h1>Qr code</h1>
  <div class="qr-codes">
    <div class="svg-code">
      <div id="qrOutput"></div>
      {#if qrTxt}
        <h3>{qrTxt}</h3>
      {/if}
    </div>
    <div class="png-code">
      <canvas id="qrCodePng"></canvas>
      {#if qrTxt}
        <h3>{qrTxt}</h3>
      {/if}
    </div>
  </div>

</main>

<style>
  .qr-codes {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .svg-code,
  .png-code {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  #qrCodePng {
    margin-inline: auto;
  }
</style>