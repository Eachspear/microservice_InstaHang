import mongoose from "mongoose";

const personalitySchema = new mongoose.Schema({
  Openness: Number,
  Conscientiousness: Number,
  Extraversion: Number,
  Agreeableness: Number,
  Neuroticism: Number
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  interests: [String],
  personality: personalitySchema
});

export default mongoose.model("User", userSchema);
