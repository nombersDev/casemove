require('dotenv').config()

exports.default = async function(configuration) {
    // do not include passwords or other sensitive data in the file
    // rather create environment variables with sensitive data
    const TIMESTAMP = process.env.SIGNING_TIMESTAMP;
    const SIGNING_PATH = process.env.SIGNING_PATH;
    console.log("Signing with timestamp: " + TIMESTAMP);
    console.log("Signing path: " + SIGNING_PATH);
  
    require("child_process").execSync(
      // your commande here ! For exemple and with JSign :
      `signtool sign /tr ${TIMESTAMP} /td sha256 /fd sha256 /a "${configuration.path}"`,
      {cwd: SIGNING_PATH}
    );

    // Sleep for 5 seconds to allow the signing to complete
    await new Promise(resolve => setTimeout(resolve, 5000));
  };