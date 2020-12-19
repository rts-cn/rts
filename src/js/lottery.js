/* ALL RIGHTS RESERVED 烟台小樱桃 */

var wsUri = "wss://rts.xswitch.cn/ws";
var output;

var user = "robot";
var pass = "robot!@#";
var domain = "rts.xswitch.cn"
var login_user = user + '@' + domain;
var websocket = null;
var loops = 60;
var started = false;

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
}

var sessid = uuidv4();
var id = 1;
var users = [];

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

function init() {
	output = document.getElementById("output");
	startWebSocket();
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

		if (!started) return;

		var lucky = getRandomInt(users.length);
		var found = 0;
		users.forEach((user) => {
			if (user.name == data.fromDisplay) {
				user.score++;
				found++;
			}
			if (lucky-- == 0) {
				user.score += 3;
			}
		});

		if (!found) {
			users.push({name: data.fromDisplay, score: 1});
		}

		update();
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function update() {

	users = users.sort((a, b) => {
		if (a.score < b.score) return 1;
		if (a.score > b.score) return -1;
		return 0;
	});

	html = "<ol>";
	users.forEach((user) => {
		html += "<li>" + user.score + ": " + user.name + "</li>";
	});
	html += "</ol>";

	document.getElementById('lottery').innerHTML = html;
}

function loop() {
	if (--loops == 0) {
		started = false;
		document.getElementById('timer').innerText = '开始';
		loops = 60;
	} else {
		document.getElementById('timer').innerText = loops;
		setTimeout(loop, 1000);
	}
}

function start() {
	if (started) return;
	started = true;
	document.getElementById('timer').innerText = loops;
	setTimeout(loop, 1000);
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
