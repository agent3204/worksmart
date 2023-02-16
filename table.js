const updateButton = document.getElementById("actualizar");
const searchInput = document.getElementById("search");
const table = document.getElementById("mainTable");
const tbody = table.getElementsByTagName("tbody")[0];

let handleSearch = null;

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

function formatTime(millis) {
	const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
	const date = new Date(millis);

	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	const hours = date.getHours();
	let minutes = date.getMinutes();

	if (minutes < 10) {
		minutes = "0" + minutes;
	}

	const todayDate = new Date();
	const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

	if (todayDate.getDate() === day && todayDate.getMonth() === month && todayDate.getFullYear() === year) {
		return "Hoy a las " + hours + ":" + minutes;
	} else if (yesterdayDate.getDate() === day && yesterdayDate.getMonth() === month && yesterdayDate.getFullYear() === year) {
		return "Ayer a las " + hours + ":" + minutes;
	} else {
		return day + " " + months[month] + " " + year + ", " + hours + ":" + minutes;
	}
}

// function updatePasswords() {
// 	const cells = table.getElementsByTagName("td");
// 	for (let i = 0; i < cells.length; i++) {
// 		const cell = cells[i];
// 		if (cell.classList.contains("password")) {
// 			const password = cell.getAttribute("secret");
// 			if (hidden) {
// 				cell.textContent = "•".repeat(password.length);
// 				cell.setAttribute("oncopy", "return false");
// 				cell.style = `
// 					font-weight: bold;
// 					letter-spacing: 2px;
// 					user-select: none;
// 				`;
				
// 			} else {
// 				cell.textContent = password;
// 				cell.removeAttribute("style");
// 				cell.removeAttribute("oncopy");
// 			}
// 		}
// 	}
// }

function replaceList(list) {
	console.log("Replacing list...");

	const saves = [];

	for (let i = 0; i < list.length; i++) {
		let {email, password, timestamp} = list[i];

		const row = tbody.insertRow();
		const emailCell = row.insertCell(0);
		const passwordCell = row.insertCell(1);
		const dateCell = row.insertCell(2);

		const passwordSpan = document.createElement("span");
		const passwordCopy = document.createElement("div");

		emailCell.textContent = email;

		passwordCell.className = "password special-cell";
		passwordCopy.className = "material-symbols-outlined symbol-btn";

		// dateCell.textContent = "Hace " + timeAgo(Date.now() - timestamp);
		dateCell.textContent = formatTime(timestamp);

		let visible = false;

		let handleVisibility = function() {
			if (visible) {
				passwordCell.classList.remove("password");
				passwordSpan.textContent = password;
				passwordCopy.textContent = "visibility_off";
				passwordCopy.removeAttribute("oncopy");
			} else {
				passwordCell.classList.add("password");
				passwordSpan.textContent = "•".repeat(password.length);
				passwordCopy.textContent = "visibility";
				passwordCopy.setAttribute("oncopy", "return false");
			}
		}

		passwordCopy.addEventListener("click", () => {
			visible = !visible;
			handleVisibility();
		});

		handleVisibility();

		passwordCell.appendChild(passwordSpan);
		passwordCell.appendChild(passwordCopy);

		saves.push({email, row});
	}

	handleSearch = function() {
		let text = searchInput.value;

		for (let i = 0; i < saves.length; i++) {
			const {email, row} = saves[i];
			if (email.includes(text)) {
				row.removeAttribute("style");
			} else {
				row.style.setProperty("display", "none");
			}
		}
	}

	// updatePasswords();
	console.log("Replaced!");
}

searchInput.addEventListener("input", () => {
	if (handleSearch) {
		handleSearch();
	}
});