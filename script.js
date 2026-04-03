let step = 0;
let userData = {};

window.onload = function () {
    askQuestion();

    document.getElementById("userInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
};

function sendMessage(text = null) {
    let input = document.getElementById("userInput");
    let message = text || input.value.trim();

    if (message === "") return;

    addMessage(message, "user");
    input.value = "";

    document.getElementById("quickReplies").innerHTML = "";

    // ✅ FLOW QUESTIONS
    if (step === 0) {
        userData.type = message;
        step++;
        askQuestion();
        return;
    }

    if (step === 1) {
        userData.interest = message;
        step++;
        askQuestion();
        return;
    }

    if (step === 2) {
        userData.budget = message;
        step++;
        showResult();
        return;
    }

    // 🤖 AFTER FLOW → AI RESPONSE
    showTyping();

    fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(res => res.json())
    .then(data => {
        removeTyping();
        addMessage(data.reply, "bot");
    })
    .catch(() => {
        removeTyping();
        addMessage("❌ AI not responding", "bot");
    });
}

function addMessage(text, type) {
    let chatBox = document.getElementById("chatBox");

    let msg = document.createElement("div");
    msg.className = "message " + type;
    msg.innerText = text;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showQuickReplies(options) {
    let container = document.getElementById("quickReplies");
    container.innerHTML = "";

    options.forEach(opt => {
        let btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => sendMessage(opt);
        container.appendChild(btn);
    });
}

function askQuestion() {
    showTyping();

    setTimeout(() => {
        removeTyping();

        if (step === 0) {
            addMessage("Are you traveling solo, with friends, or family?", "bot");
            showQuickReplies(["Solo", "Friends", "Family"]);
        }
        else if (step === 1) {
            addMessage("What type of trip do you prefer?", "bot");
            showQuickReplies(["Adventure", "Spiritual", "Relax", "Mixed"]);
        }
        else if (step === 2) {
            addMessage("What is your budget?", "bot");
            showQuickReplies(["Low", "Medium", "High"]);
        }

    }, 800);
}

function showTyping() {
    let chatBox = document.getElementById("chatBox");

    let typing = document.createElement("div");
    typing.className = "message bot";
    typing.id = "typing";
    typing.innerText = "Kai is typing...";

    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    let typing = document.getElementById("typing");
    if (typing) typing.remove();
}

function showResult() {
    addMessage("✨ Finding best places for you...", "bot");

    fetch("http://127.0.0.1:5000/get_recommendations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            interest: userData.interest
        })
    })
    .then(res => res.json())
    .then(data => {
        data.forEach(dest => {
            showCard(dest.place, dest.hotel, getImage(dest.place));
        });
    })
    .catch(() => {
        addMessage("❌ Error getting recommendations", "bot");
    });
}

function showCard(place, hotel, img) {
    let chatBox = document.getElementById("chatBox");

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <img src="${img}">
        <div class="card-content">
            <div class="card-title">📍 ${place}</div>
            <div>🏨 ${hotel}</div>
            <button onclick="showMap('${place}')">View Map</button>
        </div>
    `;

    chatBox.appendChild(card);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🔥 ADD THIS
    getWeather(place);
}

function showMap(place) {
    let chatBox = document.getElementById("chatBox");

    let map = document.createElement("div");

    map.innerHTML = `
        <iframe 
            width="100%" 
            height="200"
            src="https://www.google.com/maps?q=${place}&output=embed">
        </iframe>
    `;

    chatBox.appendChild(map);
}

function getImage(place) {
    place = place.toLowerCase();

    if (place.includes("manali"))
        return "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

    if (place.includes("rishikesh"))
        return "https://images.unsplash.com/photo-1549887534-3db8d1c2c06b";

    if (place.includes("leh"))
        return "https://images.unsplash.com/photo-1605540436563-5bca919ae766";

    if (place.includes("varanasi"))
        return "https://images.unsplash.com/photo-1561361513-2d000a50f1f9";

    if (place.includes("haridwar"))
        return "https://images.unsplash.com/photo-1599661046289-e31897846e41";

    if (place.includes("tirupati"))
        return "https://images.unsplash.com/photo-1589307004394-1c9bcbf61a1c";

    if (place.includes("goa"))
        return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

    if (place.includes("jaipur"))
        return "https://images.unsplash.com/photo-1599661046289-e31897846e41";

    if (place.includes("kerala"))
        return "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
}

function resetChat() {
    location.reload();
}

function getWeather(place) {
    const apiKey = "8f111a98caa2e8b98ccbb009ab5f78fd";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}&units=metric`)
    .then(res => {
        if (!res.ok) {
            throw new Error("API error");
        }
        return res.json();
    })
    .then(data => {
        let temp = data.main.temp;
        let weather = data.weather[0].main;

        addMessage(`🌤️ Weather in ${place}: ${temp}°C, ${weather}`, "bot");
    })
    .catch(() => {
        addMessage(`⚠️ Weather not available for ${place}`, "bot");
    });
}