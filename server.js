import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express();



app.get("/",(req, res)=>{
    res.send("hello world")
})








const VERIFY_TOKEN = process.env.ACCESS_TOKEN || "verify_instabot_42";
const APP_SECRET = process.env.APP_SECRET || "your_app_secret_here"; // used for signature check

// Verification endpoint (GET)
app.get("/insta", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.status(403).send("Forbidden");
  }
});

// Helper to verify X-Hub-Signature (sha256). If not present, we still accept (dev only).
function verifySignature(req) {
  const sigHeader = req.headers["x-hub-signature-256"] || req.headers["x-hub-signature"];
  if (!sigHeader || !APP_SECRET) return true; // allow if no secret configured (dev)

  const [algo, hash] = sigHeader.split("=");
  const bodyStr = JSON.stringify(req.body);
  const hmac = crypto.createHmac(algo === "sha1" ? "sha1" : "sha256", APP_SECRET);
  hmac.update(bodyStr);
  const expected = hmac.digest("hex");
  return expected === hash;
}

// Receive webhook events (POST)
app.post("/insta", (req, res) => {
  if (!verifySignature(req)) {
    console.warn("Invalid signature");
    return res.sendStatus(403);
  }

  // Acknowledge quickly
  res.sendStatus(200);

  // Process incoming event asynchronously
  try {
    const body = req.body;
    console.log("Webhook event received:", JSON.stringify(body, null, 2));

    // Typical structure: body.entry[0].messaging or body.entry[0].changes
    // Implement message handling here: filter, respond via Graph API, log, etc.
  } catch (err) {
    console.error("Error processing webhook:", err);
  }
});



app.listen(8080,()=>{

console.log("serverrunning")

})
