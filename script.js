let step = 0;
let userData = {};

window.onload = function () {
    askQuestion();
};

function sendMessage(text = null) {
    let input = document.getElementById("userInput");
    let message = text || input.value.trim();

    if (message === "") return;

    addMessage(message, "user");
    input.value = "";

    handleResponse(message);
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

    }, 1000);
}

function handleResponse(msg) {
    if (step === 0) {
        userData.type = msg;
        step++;
        askQuestion();
    }
    else if (step === 1) {
        userData.interest = msg;
        step++;
        askQuestion();
    }
    else if (step === 2) {
        userData.budget = msg;
        step++;
        showResult();
    }
}
function showResult() {
    showTyping();

    setTimeout(() => {
        removeTyping();

        addMessage("✨ Here are your top travel recommendations:", "bot");

        let destinations = [];

        if (userData.interest === "Adventure") {
            destinations = [
                { place: "Manali", hotel: "Mountain View Resort", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", map: "https://www.google.com/maps?q=manali" },
                { place: "Rishikesh", hotel: "River Side Camp", img: "https://images.unsplash.com/photo-1549887534-3db8d1c2c06b", map: "https://www.google.com/maps?q=rishikesh" },
                { place: "Leh Ladakh", hotel: "Snow Peak Hotel", img: "https://images.unsplash.com/photo-1605540436563-5bca919ae766", map: "https://www.google.com/maps?q=leh+ladakh" }
            ];
        }
        else if (userData.interest === "Spiritual") {
            destinations = [
                { place: "Varanasi", hotel: "Ganga View Hotel", img: "https://images.unsplash.com/photo-1561361513-2d000a50f1f9", map: "https://www.google.com/maps?q=varanasi" },
                { place: "Haridwar", hotel: "Holy Stay", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41", map: "https://www.google.com/maps?q=haridwar" },
                { place: "Tirupati", hotel: "Temple Residency", img: "https://images.unsplash.com/photo-1589307004394-1c9bcbf61a1c", map: "https://www.google.com/maps?q=tirupati" }
            ];
        }
        else {
            destinations = [
                { place: "Goa", hotel: "Sea View Resort", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", map: "https://www.google.com/maps?q=goa" },
                { place: "Jaipur", hotel: "Royal Palace Hotel", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41", map: "https://www.google.com/maps?q=jaipur" },
                { place: "Kerala", hotel: "Backwater Resort", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", map: "https://www.google.com/maps?q=kerala" }
            ];
        }

        console.log(destinations); // 👈 DEBUG (important)

        destinations.forEach(dest => {
            showCard(dest.place, dest.hotel, dest.img, dest.map);
        });

        document.getElementById("quickReplies").innerHTML = "";

    }, 1500);
}
function showCard(place, hotel, img, map) {
    let chatBox = document.getElementById("chatBox");

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <img src="${img}" alt="${place}">
        <div class="card-content">
            <div class="card-title">📍 ${place}</div>
            <div>🏨 ${hotel}</div>
            <button onclick="window.open('${map}', '_blank')">View on Map</button>
        </div>
    `;

    chatBox.appendChild(card);
    chatBox.scrollTop = chatBox.scrollHeight;
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