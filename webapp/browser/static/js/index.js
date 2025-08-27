var _a;
console.log("Hello world");
console.log(window.location.href);
const locationHost = "localhost:4682";
const wsUrl = `ws://${locationHost}`;
const apiUrl = `http://${locationHost}/api`;
// =========== WEBSOCKET CHAT
let chat1log = "";
const socket = new WebSocket(wsUrl);
const chat1logp = document.getElementById("f1ChatLog");
let idregistered;
socket.binaryType = "arraybuffer";
(_a = document.getElementById("firstChatbox")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", (e) => {
    var _a, _b, _c, _d, _e, _f;
    if (((_a = e.target) === null || _a === void 0 ? void 0 : _a.name) === "type") {
        if (((_b = e.target) === null || _b === void 0 ? void 0 : _b.value) === "priv") {
            (_c = document.getElementById("idConts")) === null || _c === void 0 ? void 0 : _c.removeAttribute("hidden");
            (_d = document.getElementById("userIdmi")) === null || _d === void 0 ? void 0 : _d.removeAttribute("disabled");
        }
        else {
            (_e = document.getElementById("idConts")) === null || _e === void 0 ? void 0 : _e.setAttribute("hidden", "true");
            (_f = document.getElementById("userIdmi")) === null || _f === void 0 ? void 0 : _f.setAttribute("disabled", "true");
        }
    }
});
socket.addEventListener("open", (event) => {
    console.log("Connected to server");
    socket.send(JSON.stringify({ type: "serv", content: "Hello server" }));
});
socket.addEventListener("message", (event) => {
    if (typeof event.data === "string") {
        const servRes = JSON.parse(event.data);
        if (servRes.type === "welcome") {
            document.getElementById("idCont").innerText = servRes.id;
            idregistered = servRes.id;
        }
        if (servRes.type === "message") {
            chat1log += "\n " + servRes.res;
            chat1logp.innerText = chat1log;
        }
        return;
    }
});
socket.addEventListener("error", err => {
    console.error("Websocker error: ", err);
});
socket.addEventListener("close", () => {
    console.log("connetion closed");
});
const f1 = document.getElementById("firstChatbox");
if (f1 !== null) {
    f1.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = f1.elements.namedItem("mes").value;
        const type = f1.elements.namedItem("type").value;
        f1.elements.namedItem("mes").value = "";
        switch (type) {
            case "serv":
                sendMessageServ(message);
                break;
            case "broad":
                sendMessageBroadcast(message);
                break;
            case "priv":
                sendMessagePriv(message, (f1 === null || f1 === void 0 ? void 0 : f1.elements.namedItem("userIdm")).value);
                break;
            default:
                sendMessageServ(message);
        }
    });
}
function sendMessageServ(message) {
    socket.send(JSON.stringify({ type: "serv", content: message }));
}
function sendMessageBroadcast(message) {
    socket.send(JSON.stringify({ type: "broad", content: message, "from": idregistered }));
}
function sendMessagePriv(message, id) {
    socket.send(JSON.stringify({ type: "priv", content: message, id, "from": idregistered, "to": id }));
}
// =====================VIDEO HTTP =========
function getImage() {
    fetch(`${apiUrl}/img`)
        .then(r => r.blob())
        .then(b => {
        console.log(b); //Blob
        const url = URL.createObjectURL(b);
        const imgElem = document.getElementById("imgServ");
        imgElem.hidden = false;
        imgElem.src = url;
    });
}
function enableVideoSR() {
    const videoElem = document.getElementById("videoServS");
    videoElem.hidden = false;
    videoElem.src = `${apiUrl}/videoSC`;
    document.getElementById("askvidS").disabled = true;
}
function enableVideo() {
    const videoElem = document.getElementById("videoServ");
    videoElem.hidden = false;
    videoElem.src = `${apiUrl}/videoSCR`;
    document.getElementById("askvid").disabled = true;
}
function enableVideoHls() {
    const videoElem = document.getElementById("videoHls");
    videoElem.hidden = false;
    if (window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(`${apiUrl}/videoHls/playlist.m3u8`);
        hls.attachMedia(videoElem);
    }
    else if (videoElem.canPlayType("application/vnd.apple.mpegurl")) {
        videoElem.src = `${apiUrl}/videoHls/playlist.m3u8`;
    }
    document.getElementById("askvidHls").disabled = true;
}
window.askImage = () => {
    getImage();
};
window.askVideoNoRange = () => {
    enableVideoSR();
};
window.askVideo = () => {
    enableVideo();
};
window.askvideoHls = () => {
    enableVideoHls();
};
export {};
