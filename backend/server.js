require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const OpenAI = require("openai");
const plantumlEncoder = require("plantuml-encoder");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env
});

// Convert user input to PlantUML code using OpenAI
app.post("/generate-plantuml", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ Updated to use gpt-3.5-turbo
      messages: [
        { role: "system", content: "Convert the following SQL schema or use case into a PlantUML ER diagram syntax." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    });

    const plantUMLCode = response.choices[0].message.content.trim();
    res.json({ plantUMLCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PlantUML code" });
  }
});

// Convert PlantUML code to an image URL
app.post("/generate-diagram", (req, res) => {
  const { plantUMLCode } = req.body;

  try {
    const encoded = plantumlEncoder.encode(plantUMLCode);
    const diagramURL = `http://www.plantuml.com/plantuml/svg/${encoded}`;
    res.json({ diagramURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate ER diagram" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
