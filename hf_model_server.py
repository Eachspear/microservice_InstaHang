from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import random

# 🚀 Initialize app
app = FastAPI()

# 🌐 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow everything for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Load model
print("⏳ Loading facebook/bart-large-mnli model...")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# 💡 Multiple variants per trait
TRAIT_VARIANTS = {
    "Openness": [
        "creative and curious",
        "open-minded and imaginative",
        "intellectually adventurous and artistic",
    ],
    "Conscientiousness": [
        "organized and goal-focused",
        "methodical and disciplined",
        "responsible and hard-working",
    ],
    "Extraversion": [
        "outgoing and energetic",
        "sociable and lively",
        "talkative and enthusiastic",
    ],
    "Agreeableness": [
        "kind and cooperative",
        "empathetic and compassionate",
        "warm-hearted and generous",
    ],
    "Neuroticism": [
        "emotionally sensitive and introspective",
        "anxious and self-aware",
        "reactive and moody",
    ],
}

@app.post("/predict")
async def predict(req: Request):
    try:
        data = await req.json()
        text = data.get("text", "")
        if not text.strip():
            return {"error": "Missing or empty 'text' field in request"}

        print(f"📨 Received text: {text[:100]}...")

        # Generate scores using multiple phrasing variants
        trait_scores = {}
        for trait, variants in TRAIT_VARIANTS.items():
            chosen_variant = random.choice(variants)
            hypothesis = f"The person described is {chosen_variant}."
            result = classifier(text, [hypothesis], multi_label=False)
            trait_scores[trait] = round(result["scores"][0], 4)

        print("📦 Predicted trait scores:", trait_scores)

        # Determine top 2 dominant traits
        sorted_traits = sorted(trait_scores.items(), key=lambda x: x[1], reverse=True)
        top1, top2 = sorted_traits[0][0], sorted_traits[1][0]

        # 🎨 Smart combined summaries
        summary_templates = {
            ("Openness", "Extraversion"): "You're a creative explorer who loves sharing ideas and experiences with others.",
            ("Openness", "Conscientiousness"): "You're a thoughtful innovator — imaginative but also driven to get things done.",
            ("Conscientiousness", "Agreeableness"): "You're dependable and caring, someone people can count on and trust.",
            ("Extraversion", "Agreeableness"): "You're social and warm — the kind of person who brightens any room.",
            ("Agreeableness", "Neuroticism"): "You're empathetic and emotionally aware, deeply tuned in to others' feelings.",
            ("Conscientiousness", "Openness"): "You're organized yet open-minded, balancing structure with creativity.",
            ("Openness", "Agreeableness"): "You're creative and kind — someone who finds beauty in people and ideas.",
            ("Neuroticism", "Openness"): "You're introspective and imaginative, drawn to exploring emotions and meaning.",
        }

        summary = (
            summary_templates.get((top1, top2))
            or summary_templates.get((top2, top1))
            or f"Your personality blends {top1.lower()} and {top2.lower()} — a unique mix of traits."
        )

        # Add a little variety
        tone_addons = [
            "✨ You bring a distinctive vibe wherever you go.",
            "🌿 You find balance between thought and feeling.",
            "🔥 You embrace life with intensity and curiosity.",
            "💫 You make people feel comfortable around you.",
        ]
        summary += " " + random.choice(tone_addons)

        print("🧭 Summary:", summary)

        return {"personality": trait_scores, "summary": summary}

    except Exception as e:
        print("❌ Error:", str(e))
        return {"error": str(e)}
