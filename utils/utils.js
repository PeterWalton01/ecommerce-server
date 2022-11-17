const moment = require("moment");

/*
 * get string containing utc timestamp
 * @author Peter Walton
 * @return {String}  [required string]
 */
const now = () => {
  return moment.utc().toISOString();
};

const googleResponse = (outcome) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        .center {
          display: flex;
          font-size: 3rem;
          justify-content: center;
        }
        .btn {
          width: 10rem;
          font-size: 2rem;
          border-radius: 15%;
        }
      </style>
      <script defer>
        const closeMe = () => {
          window.close();
        };
        //   document.getElementById("closeMe").onclick = closeMe;
      </script>
      <title>Document</title>
    </head>
    <body>
      <div class="center">
        <div><span>${outcome}&nbsp-&nbsp;</span></div>
        <button id="closeMe" class="btn" onclick="closeMe ()">Exit</button>
      </div>
    </body>
  </html>`;
};

module.exports = { now, googleResponse };
