from urllib import response

from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)


load_dotenv()   # ✅ this loads .env file

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

#  Recommendation API
@app.route("/get_recommendations", methods=["POST"])
def get_recommendations():
    data = request.json
    interest = data.get("interest")
    budget = data.get("budget", "Medium")

    recommendations = {
        "Adventure": {
            "Low": [
                {"place": "Coorg", "hotel": "Budget Jungle Lodge", "description": "Coffee estate walks and river rafting amid misty hills.", "rating": 4.2},
                {"place": "Rishikesh", "hotel": "Backpacker River Camp", "description": "Affordable rafting and local food with shared lodge vibes.", "rating": 4.3},
                {"place": "Munnar", "hotel": "Hill View Inn", "description": "Tea trails and moderate trekking routes in lush greenery.", "rating": 4.1}
            ],
            "Medium": [
                {"place": "Manali", "hotel": "Mountain View Resort", "description": "Stunning landscapes, adventure activities, and serene valleys.", "rating": 4.5},
                {"place": "Leh Ladakh", "hotel": "Snow Peak Hotel", "description": "High-altitude desert, biking, trekking and monastery tours.", "rating": 4.7},
                {"place": "Spiti Valley", "hotel": "Alpine Guesthouse", "description": "Remote Himalayan routes for serious roadtrippers.", "rating": 4.4}
            ],
            "High": [
                {"place": "Sikkim", "hotel": "Luxury Mountain Resort", "description": "Private guides, mountain heli-tours, and premium wellness stays.", "rating": 4.8},
                {"place": "Jaisalmer Desert", "hotel": "Premium Sand Camp", "description": "Camel safari with luxury tent experience under the stars.", "rating": 4.7},
                {"place": "Andaman", "hotel": "Beachside Luxury Villa", "description": "Scuba diving, private island boating and premium sea sports.", "rating": 4.9}
            ]
        },
        "Spiritual": {
            "Low": [
                {"place": "Pushkar", "hotel": "Simple Ashram Stay", "description": "Pilgrimage camps and budget ashram meditation sessions.", "rating": 4.2},
                {"place": "Varanasi", "hotel": "Budget Ghat Lodge", "description": "Ganga aarti and simple pilgrim facilities.", "rating": 4.3},
                {"place": "Rishikesh", "hotel": "Yoga Dorm", "description": "Group yoga with affordable stays close to the Ganges.", "rating": 4.4}
            ],
            "Medium": [
                {"place": "Haridwar", "hotel": "Holy Stay", "description": "Ashram stays, Ganga Aarti and meditation with guided sessions.", "rating": 4.5},
                {"place": "Tirupati", "hotel": "Temple Residency", "description": "Tirumala darshan with mid-range comfort.", "rating": 4.6},
                {"place": "Shravanabelagola", "hotel": "Heritage Jain Lodge", "description": "Historical Jain pilgrim site with tranquil atmosphere.", "rating": 4.5}
            ],
            "High": [
                {"place": "Kedarnath", "hotel": "Luxury Himalayan Retreat", "description": "Private guide, luxury caravan, and health services.", "rating": 4.7},
                {"place": "Varanasi", "hotel": "Riverside Boutique Retreat", "description": "Premium ayurvedic spa and private river cruises.", "rating": 4.8},
                {"place": "Bodh Gaya", "hotel": "Five-Star Zen Resort", "description": "Spiritual retreats with guided monks and upscale comfort.", "rating": 4.9}
            ]
        },
        "Relax": {
            "Low": [
                {"place": "Gokarna", "hotel": "Budget Beach Hut", "description": "Laid-back beach walking with affordable local huts.", "rating": 4.1},
                {"place": "Alleppey", "hotel": "Homestay on backwaters", "description": "Shared houseboat row with local meals in Kerala.", "rating": 4.2},
                {"place": "Darjeeling", "hotel": "Cozy Hill Lodge", "description": "Tea garden views with budget sips.", "rating": 4.0}
            ],
            "Medium": [
                {"place": "Goa", "hotel": "Sea View Resort", "description": "Beaches, vibrant culture, and comfortable mid-range resorts.", "rating": 4.5},
                {"place": "Udaipur", "hotel": "Lake Palace Hotel", "description": "Romantic lakefront stay and slow city tours.", "rating": 4.6},
                {"place": "Coorg", "hotel": "Coffee Valley Retreat", "description": "Cool hilltop holiday and plantation walks.", "rating": 4.4}
            ],
            "High": [
                {"place": "Kerala", "hotel": "Luxury Backwater Villa", "description": "Private houseboats with gourmet dining and spa.", "rating": 4.9},
                {"place": "Andaman", "hotel": "Elite Beach Resort", "description": "Premium water sports and private beaches.", "rating": 4.8},
                {"place": "Sikkim", "hotel": "5-Star Hill Spa", "description": "Luxury wellness with scenic mountain views.", "rating": 4.85}
            ]
        },
        "Mixed": {
            "Low": [
                {"place": "Pondicherry", "hotel": "Charming Guesthouse", "description": "French quarter charm with beach relax and temple walks.", "rating": 4.3},
                {"place": "Hampi", "hotel": "Budget Heritage Inn", "description": "History + gentle biking around ruins.", "rating": 4.2},
                {"place": "Ooty", "hotel": "Hill Station Lodge", "description": "Cool weather, train ride, and garden strolls.", "rating": 4.1}
            ],
            "Medium": [
                {"place": "Jaipur", "hotel": "Royal Palace Hotel", "description": "Fort tours, culture, and curated city experiences.", "rating": 4.4},
                {"place": "Darjeeling", "hotel": "Tea View Resort", "description": "Mountain train ride with tea estate visits.", "rating": 4.5},
                {"place": "Goa", "hotel": "Coastal Resort", "description": "Beach time combined with local culture and nightlife.", "rating": 4.5}
            ],
            "High": [
                {"place": "Rajasthan Circuit", "hotel": "Luxury Palace Hotels", "description": "High-end forts, desert nights, and heritage dining.", "rating": 4.9},
                {"place": "Kerala + Munnar", "hotel": "Premium Tour Package", "description": "Backwaters plus tea hills in one curated package.", "rating": 4.8},
                {"place": "Leh Ladakh + Nubra", "hotel": "Elite Basecamp", "description": "Adventure plus luxury tent stays in high-altitude terrain.", "rating": 4.85}
            ]
        }
    }

    # select interest + budget slots
    interest_data = recommendations.get(interest, recommendations["Relax"])
    if isinstance(interest_data, dict):
        result = interest_data.get(budget, interest_data.get("Medium", []))
    else:
        result = interest_data

    return jsonify(result)

#  AI Chat API
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are Kai, a smart travel assistant."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": "❌ AI not working"})
    
if __name__ == "__main__":
    app.run(debug=True)