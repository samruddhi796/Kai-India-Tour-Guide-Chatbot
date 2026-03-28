from flask import Flask, request, jsonify
from flask_cors import CORS   # 👈 ADD THIS

app = Flask(__name__)
CORS(app)   # 👈 ADD THIS (VERY IMPORTANT)

@app.route("/get_recommendations", methods=["POST"])
def get_recommendations():
    data = request.json
    interest = data.get("interest")

    destinations = []

    if interest == "Adventure":
        destinations = [
            {"place": "Manali", "hotel": "Mountain View Resort"},
            {"place": "Rishikesh", "hotel": "River Side Camp"},
            {"place": "Leh Ladakh", "hotel": "Snow Peak Hotel"}
        ]
    elif interest == "Spiritual":
        destinations = [
            {"place": "Varanasi", "hotel": "Ganga View Hotel"},
            {"place": "Haridwar", "hotel": "Holy Stay"},
            {"place": "Tirupati", "hotel": "Temple Residency"}
        ]
    else:
        destinations = [
            {"place": "Goa", "hotel": "Sea View Resort"},
            {"place": "Jaipur", "hotel": "Royal Palace Hotel"},
            {"place": "Kerala", "hotel": "Backwater Resort"}
        ]

    return jsonify(destinations)

if __name__ == "__main__":
    app.run(debug=True)