const hideButton = document.getElementById("ocultar");
const updateButton = document.getElementById("actualizar");
const table = document.getElementById("mainTable");
const tbody = table.getElementsByTagName("tbody")[0];

let hidden = true;

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

function updatePasswords() {
	const cells = table.getElementsByTagName("td");
	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];
		if (cell.classList.contains("password")) {
			const password = cell.getAttribute("secret");
			if (hidden) {
				cell.textContent = "•".repeat(password.length);
				cell.style = `
					font-weight: bold;
					letter-spacing: 2px;
					user-select: none;
				`;
				
			} else {
				cell.textContent = password;
				cell.removeAttribute("style");
			}
		}
	}
}

function replaceList(list) {
	console.log("Replacing list...");

	for (let i = 0; i < list.length; i++) {
		let {email, password, timestamp} = list[i];

		const row = tbody.insertRow();
		const emailCell = row.insertCell(0);
		const passwordCell = row.insertCell(1);
		const dateCell = row.insertCell(2);

		emailCell.textContent = email;
		const passwordInput = document.createElement("input");
		passwordCell.textContent = password;
		passwordCell.setAttribute("class", "password");
		passwordCell.setAttribute("secret", password);
		passwordCell.setAttribute("oncopy", "return false");
		dateCell.textContent = "Hace " + timeAgo(Date.now() - timestamp);
	}
	updatePasswords();
	console.log("Replaced!");
}

hideButton.addEventListener("click", () => {
	hidden = !hidden;
	updatePasswords();
	if (hidden) {
		hideButton.textContent = "Mostrar";
	} else {
		hideButton.textContent = "Ocultar";
	}
});