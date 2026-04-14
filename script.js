let step = 0;
let userData = {};
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

window.onload = function () {
    askQuestion();

    document.getElementById("userInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
};

function sendMessage(selectedText) {
    let input = document.getElementById("userInput");
    let message = typeof selectedText === "string" && selectedText.trim() !== "" ? selectedText.trim() : input.value.trim();

    if (message === "") return;

    addMessage(message, "user");

    input.value = "";
    document.getElementById("quickReplies").innerHTML = "";

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

    // ✅ AI PART
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
         speak(data.reply); // 🔊 AI speaks
    })
   .catch(err => {
    removeTyping();
    let msg = "AI not responding";
    addMessage("❌ " + msg, "bot");
    speak(msg);
});}
    

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
    

    setTimeout(() => {
        removeTyping();

        if (step === 0) {
            let msg = "Are you traveling solo, with friends, or family?";
            addMessage(msg, "bot");
            speak(msg);
            showQuickReplies(["Solo", "Friends", "Family"]);
        }
        else if (step === 1) {
            let msg = "What type of trip do you prefer?";
            addMessage(msg, "bot");
            speak(msg);
            showQuickReplies(["Adventure", "Spiritual", "Relax", "Mixed"]);
        }
        else if (step === 2) {
            let msg = "What is your budget?";
            addMessage(msg, "bot");
            speak(msg);
            showQuickReplies(["Low", "Medium", "High"]);
        }

    }, 800);
}

function showTyping() {
    removeTyping();

    let chatBox = document.getElementById("chatBox");

    let typing = document.createElement("div");
    typing.className = "message bot";
    typing.id = "typing";

    typing.innerHTML = `
        <div class="message-content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;

    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    document.querySelectorAll("#typing").forEach(node => node.remove());
}

function addMessage(text, sender = "bot") {
    removeTyping();

    let chatBox = document.getElementById("chatBox");
    let message = document.createElement("div");
    message.className = `message ${sender}`;

    let content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;
    message.appendChild(content);

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showResult() {
    addMessage("✨ Here are some places you might love!", "bot");
    speak("Here are some places you might love!");

    fetch("http://127.0.0.1:5000/get_recommendations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            interest: userData.interest,
            budget: userData.budget
        })
    })
    .then(res => res.json())
    .then(data => {
        data.forEach(dest => {
            showCard(dest.place, dest.hotel, getImage(dest.place), dest.description, dest.rating);
        });
    })
    .catch(() => {
        addMessage("❌ Error getting recommendations", "bot");
        speak("❌ Error getting recommendations"); // 🔊 AI speaks
    });
}

function showCard(place, hotel, img, description, rating) {
    let chatBox = document.getElementById("chatBox");

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <img src="${img}" alt="${place}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';">
        <div class="card-content">
            <div class="card-title"><i class="fas fa-map-marker-alt"></i> ${place}</div>
            <div class="card-description">${description}</div>
            <div class="card-rating">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                <span>${rating}/5</span>
            </div>
            <div><i class="fas fa-hotel"></i> ${hotel}</div>
            <button onclick="showMap('${place}')"><i class="fas fa-map"></i> View Map</button>
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
    map.className = 'map-frame';

    map.innerHTML = `
        <iframe 
            width="100%" 
            height="250"
            src="https://www.google.com/maps?q=${place}&output=embed"
            loading="lazy"
            allowfullscreen>
        </iframe>
    `;

    chatBox.appendChild(map);
    map.scrollIntoView({ behavior: 'smooth', block: 'start' });
    chatBox.scrollTop = chatBox.scrollHeight;
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
    if (place.includes("andaman"))
        return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    if (place.includes("sikkim"))
        return "https://images.unsplash.com/photo-1593561470121-93ee6e1bb06a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    if (place.includes("jaisalmer"))
        return "https://images.unsplash.com/photo-1561873058-2b719fc0a474";
    if (place.includes("coorg"))
        return "https://images.unsplash.com/photo-1472317664273-30f901b41da4";
    if (place.includes("munnar"))
        return "https://images.unsplash.com/photo-1493936035195-1d0a2ff52f87";
    if (place.includes("spiti"))
        return "https://images.unsplash.com/photo-1542869184-47f74b63ffe4";
    if (place.includes("pushkar"))
        return "https://images.unsplash.com/photo-1588845359282-5bed264575f1";
    if (place.includes("puducherry") || place.includes("pondicherry"))
        return "https://images.unsplash.com/photo-1544025174-2ef73e9f92d6";
    if (place.includes("hampi"))
        return "https://images.unsplash.com/photo-1585765463193-0a5d9fb26b2b";
    if (place.includes("ooty") || place.includes("udaipur"))
        return "https://images.unsplash.com/photo-1535930749574-1399327ce78f";
    if (place.includes("rajasthan") || place.includes("circuit"))
        return "https://images.unsplash.com/photo-1554536256-5dd3b1dabe37";
    if (place.includes("nubra"))
        return "https://images.unsplash.com/photo-1547051213-3a4d39b95452";
    if (place.includes("bodh gaya"))
        return "https://images.unsplash.com/photo-1564934117379-2e7f5f0c392d";

    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
}

function resetChat() {
    // Reset logic without full reload to preserve UX
    let chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = '<div class="message bot">\n            <img src="https://i.pinimg.com/1200x/88/74/1a/88741afee32df444a59ae2f4e1d4ba12.jpg" alt="Kai" class="message-avatar" onerror="this.onerror=null;this.src=\'' + FALLBACK_IMAGE + '\';">\n            <div class="message-content">Hey! I\'m Kai ✈️<br>Let\'s plan your perfect trip! 😊</div>\n        </div>';
    step = 0;
    userData = {};
    askQuestion();
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

       let msg = `Weather in ${place}: ${temp}°C, ${weather}`;
       addMessage(`🌤️ ${msg}`, "bot");
      
    })
    .catch(() => {
        addMessage(`⚠️ Weather not available for ${place}`, "bot");
        
    });
}

function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        addMessage("❌ Voice not supported in this browser", "bot");
        speak("❌ Voice not supported in this browser");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();

    addMessage("🎤 Listening...", "bot");

    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;

        document.getElementById("userInput").value = transcript;


        sendMessage();
    };

    recognition.onerror = function(event) {
    console.error("Voice error:", event.error);

    if (event.error === "no-speech") return; // ignore

    let msg = "❌ Voice error";

    if (event.error === "not-allowed") {
        msg = "❌ Allow microphone permission";
    } else if (event.error === "network") {
        msg = "❌ Network issue";
    }

    addMessage(msg, "bot");
};
}

function speak(text) {
    window.speechSynthesis.cancel(); // stop previous

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    speech.rate = 0.95;
    speech.pitch = 1.50;

    window.speechSynthesis.speak(speech);
}

function addMessage(text, sender = "bot") {
    removeTyping();

    let chatBox = document.getElementById("chatBox");

    let message = document.createElement("div");
    message.className = `message ${sender}`;

    let content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    message.appendChild(content);
    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

    // 🔥 ONLY BOT SPEAKS
    if (sender === "bot") {
        speak(text);
    }
}