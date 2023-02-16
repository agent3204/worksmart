const accessForm = document.getElementById("accessForm");
const submitButton = document.getElementById("submit");
const saveSecret = document.getElementById("save");
const registers = document.getElementById("registers");
const errorText = document.getElementById("errorText");
const logoutButton = document.getElementById("logoutButton");
const decoderInput = document.getElementById("decoderInput");
const tokenInput = document.getElementById("tokenInput");

let secret = localStorage.getItem("secret");

if (secret) {
	registers.removeAttribute("style");
	accessForm.remove();
} else {
	accessForm.removeAttribute("style");
	registers.remove();
}

async function submit() {
	if (decoderInput.value === "" || tokenInput.value === "") {
		return;
	}

	const response = await requestOctokit(tokenInput.value);
	if (!response) {
		return;
	}

	localStorage.setItem("secret", JSON.stringify({
		decoder: decoderInput.value,
		token: tokenInput.value,
		temporary: !saveSecret.checked
	}));

	location.reload();
}

let checking = false;

submitButton.addEventListener("click", (async () => {
	checking = true;
	try {
		await submit();
	} catch (err) {
		console.error(err);
	}
	checking = false;
}));

logoutButton.addEventListener("click", () => {
	localStorage.removeItem("secret");
	location.reload();
});