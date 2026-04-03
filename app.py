from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

#  Add your Gemini API key
genai.configure(api_key="AIzaSyDeRYNHSEXqzNa_MnouZBp07ZUH8GmSLzY")
model = genai.GenerativeModel("gemini-pro")

#  Recommendation API
@app.route("/get_recommendations", methods=["POST"])
def get_recommendations():
    data = request.json
    interest = data.get("interest")

    if interest == "Adventure":
        return jsonify([
            {"place": "Manali", "hotel": "Mountain View Resort"},
            {"place": "Rishikesh", "hotel": "River Side Camp"},
            {"place": "Leh Ladakh", "hotel": "Snow Peak Hotel"}
        ])

    elif interest == "Spiritual":
        return jsonify([
            {"place": "Varanasi", "hotel": "Ganga View Hotel"},
            {"place": "Haridwar", "hotel": "Holy Stay"},
            {"place": "Tirupati", "hotel": "Temple Residency"}
        ])

    else:
        return jsonify([
            {"place": "Goa", "hotel": "Sea View Resort"},
            {"place": "Jaipur", "hotel": "Royal Palace Hotel"},
            {"place": "Kerala", "hotel": "Backwater Resort"}
        ])

#  AI Chat API
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    try:
        response = model.generate_content(message)
        return jsonify({"reply": response.text})
    except:
        return jsonify({"reply": "Sorry, I'm having trouble understanding."})

if __name__ == "__main__":
    app.run(debug=True)