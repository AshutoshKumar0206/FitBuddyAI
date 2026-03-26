from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)
CORS(app)

# Global variables to hold model/vectorizer
model = None
vectorizer = None

def load_model():
    global model, vectorizer
    try:
        model = pickle.load(open("model.pkl", "rb"))
        vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
    except FileNotFoundError:
        print("No model found. Please train first.")

# 1. NEW TRAIN ROUTE
@app.route("/train", methods=["POST"])
def train_api():
    try:
        with open("data.json") as f:
            data = json.load(f)
        
        texts = [d["text"] for d in data]
        labels = [d["label"] for d in data]

        v = TfidfVectorizer()
        X = v.fit_transform(texts)
        m = LogisticRegression()
        m.fit(X, labels)

        # Save files
        pickle.dump(m, open("model.pkl", "wb"))
        pickle.dump(v, open("vectorizer.pkl", "wb"))
        
        # Reload the global variables
        load_model()
        
        return jsonify({"status": "success", "message": "Model trained!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# predict.py

def get_response(label):
    responses = {
    # Original Data
    "weight_loss": "🏃 Weight Loss Plan:\n- Running: 20 mins\n- Squats: 3x15\n🥗 Diet: Low carbs, high protein",
    "muscle_gain": "💪 Muscle Gain Plan:\n- Bench Press: 4x8\n- Deadlift: 4x6\n🥗 Diet: High protein + calorie surplus",
    "diet": "🥗 Diet Plan:\n- Breakfast: Oats + eggs\n- Lunch: Rice + chicken\n- Dinner: Salad + paneer",
    "home_workout": "🏠 Home Workout:\n- Pushups: 3x15\n- Squats: 3x20\n- Plank: 1 min",
    "motivation": "🔥 Stay consistent!\nSmall progress daily = big results",

    # New Category Responses
    "yoga_flexibility": "🧘 Flexibility & Yoga:\n- Sun Salutations: 5 rounds\n- Hamstring Stretch: 2 mins\n- Poses: Cobra, Child's Pose, Pigeon.",
    "supplements": "💊 Supplement Guide:\n- Whey: For protein goals\n- Creatine: For strength\n- Note: Consult a doctor before starting new supplements.",
    "injury_recovery": "🩹 Recovery & Rehab:\n- Apply Ice for 15 mins (acute)\n- Focus on mobility and light stretching\n- Don't push through sharp pain!",
    "chest_push": "🏋️ Chest & Push Day:\n- Bench Press: 3x10\n- Incline Dumbbell Press: 3x12\n- Pushups: to failure",
    "back_pull": "🚣 Back & Pull Day:\n- Pullups/Lat Pulldowns: 3x10\n- Seated Rows: 3x12\n- Deadlifts: 3x5",
    "legs": "🍗 Leg Day:\n- Squats: 4x10\n- Lunges: 3x12 per leg\n- Calf Raises: 4x15",
    "core_abs": "🍫 Core & Abs:\n- Plank: 3x1 min\n- Leg Raises: 3x15\n- Bicycle Crunches: 3x20",
    "cardio_stamina": "🫀 Cardio & Stamina:\n- HIIT: 30s sprint / 30s walk (10 rounds)\n- Cycling: 30 mins steady pace",
    "mental_health_sleep": "😴 Wellness & Sleep:\n- Sleep: 7-9 hours for recovery\n- Meditation: 10 mins daily for stress",
    "greeting": "👋 Hello! I am FitBuddy. How can I help you reach your fitness goals today?"
}

    return responses.get(label, "Tell me your goal!")

def predict(text):
    global model, vectorizer
    # Check if model is loaded; if not, try to load it again
    if vectorizer is None or model is None:
        load_model()
    
    # If it's STILL None after trying to load, return an error message
    if vectorizer is None:
        return "I'm still warming up! Please try again in a second or trigger the /train route."
    
    X = vectorizer.transform([text])
    label = model.predict(X)[0]
    return get_response(label)

@app.route("/health")
def health():
    return "AI Server OK", 200

@app.route("/predict", methods=["POST"])
def predict_api():
    data = request.json
    print(data)
    message = data["message"]

    reply = predict(message)
    print(reply)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    load_model()
    app.run(port=8000, debug=True)