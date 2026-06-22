import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  const key = process.env.Google_GeminiAPI_KEY;
  console.log("Checking models for key prefix:", key ? key.substring(0, 10) + "..." : "None");
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    console.log("\nAvailable models:");
    res.data.models.forEach(m => {
      console.log(`- Model: ${m.name} | Methods: ${m.supportedGenerationMethods.join(", ")}`);
    });
  } catch (err) {
    console.error("\nError listing models:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}

run();
