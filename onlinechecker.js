const elm = document.getElementById("onLine");

function update() {
	if (navigator.onLine) {
		elm.textContent = "Online";
		elm.style.color = "rgba(99, 255, 99, 0.63)";
		elm.style.backgroundColor = "rgba(6, 104, 6, 0.817)";
	} else {
		elm.textContent = "Offline";
		elm.style.color = "rgba(255, 99, 99, 0.63)";
		elm.style.backgroundColor = "rgba(104, 6, 6, 0.817)";
	}
}

update();

addEventListener("online", update);
addEventListener("offline", update);