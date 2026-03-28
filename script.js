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

    console.log(data); // 👈 ADD THIS

    addMessage(`✨ Based on your interest in ${userData.interest}, I found these perfect destinations for you!`, "bot");
    data.forEach(dest => {
    showCard(
        dest.place,
        dest.hotel,
        getImage(dest.place),
        "https://www.google.com/maps?q=" + dest.place
    );
});
});

    }, 1000);
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
            <button onclick="showMap('${place}')">View Map</button>
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
function showMap(place) {
    let chatBox = document.getElementById("chatBox");

    let mapDiv = document.createElement("div");
    mapDiv.className = "card";

    let mapURL = `https://www.google.com/maps?q=${place}&output=embed`;

    mapDiv.innerHTML = `
        <iframe 
            width="100%" 
            height="200" 
            style="border:0; border-radius:10px;"
            src="${mapURL}" 
            loading="lazy">
        </iframe>
    `;

    chatBox.appendChild(mapDiv);
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

    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
}
function resetChat() {
    location.reload();
}
document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});