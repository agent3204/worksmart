const statusContainer = document.getElementById("statusContainer");
const statusText = statusContainer.getElementsByTagName("p")[0];

statusContainer.setAttribute("hidden", "true");

let currentTick = 0;

this.setStatus = function(text) {
	if (!text) {
		statusContainer.setAttribute("hidden", "");
		statusText.textContent = "";
		return;
	}

	statusText.textContent = text;
	statusContainer.removeAttribute("hidden");

	const myTick = Date.now();
	currentTick = myTick;

	setTimeout(() => {
		if (currentTick === myTick) {
			setStatus();
		}
	}, 5000)
}