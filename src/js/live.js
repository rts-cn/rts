/* ALL RIGHTS RESERVED 烟台小樱桃 */

var wsUri = "wss://rts.xswitch.cn/ws";
var output;

var user = "robot";
var pass = "robot!@#";
var domain = "rts.xswitch.cn"
var login_user = user + '@' + domain;
var websocket = null;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

var sessid = uuidv4();
var id = 1;

var rpc = {
	id: 0,
	jsonrpc: "2.0",
	method: "login",
}

function login() {
	var data = rpc;

	data.params = {
		login: login_user,
		passwd: pass,
		sessid: sessid
	}

	sendJSON(data);
}

function subscribe(eventChannel) {
	var data = rpc;

	data.method = "verto.subscribe";
	data.params = {
		eventChannel: eventChannel,
		sessid: sessid
	}

	sendJSON(data);
}

function sendJSON(data) {
	doSend(JSON.stringify(data));
}

function toggle_ufo() {
    var color = "";
    if (fly('check')) {
        fly('stop');
    } else {
        fly('start');
        color = "blue";
        if (!websocket || ((websocket.readyState != websocket.OPEN) && (websocket.readyState != websocket.CONNECTING ))) {
            startWebSocket();
        }
    }
    document.getElementById('ufo').style.color = color;
}

function init() {
	output = document.getElementById("output");
    // startWebSocket();
    toggle_ufo();
}

function startWebSocket() {
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) { onOpen(evt) };
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) };
	websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
	writeToScreen("CONNECTED");
	login();
}

function onClose(evt) {
    writeToScreen("DISCONNECTED");
    fly("start");
    toggle_ufo();
}

function onMessage(evt) {
	// writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');

	var json = JSON.parse(evt.data);

	if (json.method == "verto.clientReady") {
		subscribe("conference-chat.3000-rts.xswitch.cn@rts.xswitch.cn");
	} else if (json.method == "verto.event") {
        params = json.params
        if (!params) return;
        data = params.data;
        if (!data) return;
        console.log(data.fromDisplay, data.message);
        fly({text: data.fromDisplay + ': ' + data.message});
    }
}

function onError(evt) {
	console.log(evt);
	writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
	// writeToScreen("SENT: " + message);
	websocket.send(message);
}

function writeToScreen(message) {
	var pre = document.createElement("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	output.appendChild(pre);
}

window.addEventListener("load", init, false);

let UFO = [];
let UFO_timer = null;
const UFO_colors = ['lime', 'white', 'yellow', "green", "red", "purple"];
let color_index = 0;

function fly(content) {
	if (content === 'start') {
		if (!UFO_timer) {
			UFO_timer = setInterval(flying, 200);
			console.log("UFO started");
		}
		return;
	} else if (content === 'stop') {
		clearInterval(UFO_timer);
		UFO_timer = null;
		UFO.forEach((div) => {
			div.parentNode.removeChild(div);
		});
		UFO = [];
		console.log("UFO stopped");
		return;
	} else if (content === "check") {
		if (UFO_timer) return true;
		return false;
	} else if (!UFO_timer) {
		return;
	}

	let dom = document.getElementById('ufo');
	if (!dom) {
		dom = document.createElement("div");
		dom.id = 'ufo';
		// dom.style.display = "none";
		document.getElementById('root').appendChild(dom);
	}

    var width = document.getElementById('video').offsetWidth;
    var height = document.getElementById('video').offsetHeight;

    if (!width) width = window.innerWidth;
    if (!height) height = window.innerHeight;

    const ufo_width = width - 100;
    const ufo_height = height - 150;

	const text = content.text;
	const div = document.createElement("div");
	div.innerText = text;
	div.style.position = "absolute";
	div.style.zIndex = "99999";
	div.className = "stroke";
	div.style.backgroundColor = "#00000022";
	div.style.color = UFO_colors[color_index++ % UFO_colors.length];
	div.style.left = ufo_width + "px";
	div.style.top = 100 + Math.random() * ufo_height + "px";
	dom.appendChild(div);
	UFO.push(div);
}

function flying() {
	UFO = UFO.filter((div) => {
		// console.log(div.innerText);
		const left = parseInt(div.style.left) - 15;
		if (left < 0) {
			div.parentNode.removeChild(div);
			return false;
		}
		div.style.left = left + 'px';
		return true;
	});
}
