const table = document.getElementById("tableBody");
const hideButton = document.getElementById("hideButton");

let hidden = false;
const savedRows = [];

function updatePassTypes() {
	for (const elm of document.getElementsByClassName("passwordText")) {
		const val = elm.getAttribute("value");
		if (val === null) return;
		if (hidden) {
			elm.textContent = "•".repeat(val.length);
		} else {
			elm.textContent = val;
		}
	}
}

function timeAgo(timeMillis) {
	const seconds = Math.floor(timeMillis / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);

	if (years > 0) {
		return years + " " + (years == 1 ? "año" : "años");
	} else if (months > 0) {
		return months + " " + (months == 1 ? "mes": "meses");
	} else if (days > 0) {
		return days + " " + (days == 1 ? "día": "días");
	} else if (hours > 0) {
		return hours + " " + (hours == 1 ? "hora": "horas");
	} else if (minutes > 0) {
		return minutes + " " + (minutes == 1 ? "minuto": "minutos");
	} else {
		return seconds + " " + (seconds == 1 ? "segundo": "segundos");
	}
}

hideButton.addEventListener("click", () => {
	hidden = !hidden;
	updatePassTypes();
	if (hidden) {
		hideButton.textContent = "Mostrar";
	} else {
		hideButton.textContent = "Ocultar";
	}
});

function createRow(email, password, timestamp) {
	const row = table.insertRow(0); // The place 0 is for header
	savedRows.push(row);

	row.insertCell(0).innerHTML = email;
	const passInput = row.insertCell(1);
	passInput.setAttribute("class", "passwordEntry");
	passInput.innerHTML = `<p class="passwordText" value="${password}"></p>
						<button class="copy-link-button" hidden>
							<span class="material-icons">content_copy</span>
						</button>`
	updatePassTypes();
	const dateElm = row.insertCell(2);
	dateElm.innerHTML = "Hace " + timeAgo(Date.now() - timestamp); //new Date(timestamp).toDateString();
	dateElm.setAttribute("aria-label", "Hola");

	passInput.getElementsByClassName("copy-link-button")[0].addEventListener("click", () => {
		navigator.clipboard.writeText(password);
	});
}

function clearRows() {
	while (savedRows.length > 0) {
		const elm = savedRows[savedRows.length - 1];
		elm.remove();
		savedRows.pop();
	}
}

createRow("lopez.jhonmaikol@artazaromo.com", "gkadodfouhjrw", Date.now());
createRow("urmomo@gmail.com", "peterpumpkineater69", Date.now());