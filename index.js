import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import Stripe from "stripe";

import userRoutes from "./routes/users.js";
import questionsRoutes from "./routes/AskQuestion.js";
import answerRoutes from "./routes/Answers.js";
import postRoutes from './routes/Post.js'

dotenv.config();

const config = new Configuration({
  apiKey: process.env.OPEN_AI,
});

const openai = new OpenAIApi(config);

const stripe = Stripe(process.env.STRIPE_API);


const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is a StackOverflow Clone API");
});

app.use("/user", userRoutes);
app.use("/questions", questionsRoutes);
app.use("/answer", answerRoutes);
app.use("/community/posts", postRoutes);
app.use("/community/user", userRoutes);


const generateResponse = (intent) => {
  // console.log(intent.status)
  if (intent.status) {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    };
  } else {
    // Invalid status
    return {
      error: "Invalid PaymentIntent status",
    };
  }
};

// confirm the paymentIntent
app.post("/payment/pay", async (request, response) => {
  try {
    // Create the PaymentIntent
    let intent = await stripe.paymentIntents.create({
      payment_method: request.body.payment_method_id,
      description: "Test payment",
      amount: request.body.amount*100,
      currency: "inr",
      confirmation_method: "manual",
      confirm: true,
    });
    // console.log(intent)
    // Send the response to the client
    response.send(generateResponse(intent));
  } catch (e) {
    // Display error on client
    return response.send({ error: e.message });
  }
});

app.get("/payment", (req, res) => {
  res.send("Stripe Integration");
});



// endpoint for ChatGpt
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0,
    prompt: prompt,
  });

  res.send(completion.data.choices[0].text);
});



const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.CONNECTION_URL;

mongoose.set("strictQuery", false);

mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
