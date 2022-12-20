import { Octokit, App } from "https://cdn.skypack.dev/octokit";

const crypt = {
	secret: "VFF3403",

	decrypt: (cipher) => {
		let decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
		decipher = decipher.toString(CryptoJS.enc.Utf8);
		return decipher;
	}
}

const octokit = new Octokit({
	auth: atob("Z2hwXzZFeFFJYlhRY3BzMnRmUDVqRFRyU3luSjFzdWVFbjRhRjQ1TQ==")
});

const owner = "agent3204";
const repo = "data";
const path = "ds.json";

async function getFileData() {
	const {data} = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: owner,
		repo: repo,
		path: path
	});

	return data;
}

function jsonParse(str) {
	try {
		return JSON.parse(str);
	} catch {
		console.warn("Invalid json of content: " + str);
		return {};
	}
}

let updating = false;
let lastUpdate = 0;

async function update() {
	if (updating) {
		console.warn("Already updating, please wait!");
		return;
	}

	if (Date.now() - lastUpdate < 5000) {
		console.warn("Please wait " + (5 - parseInt(Date.now() - lastUpdate) / 1000) + " seconds until the next update");
		return;
	}

	updating = true;
	console.log("Updating table...");
	clearRows();

	const data = await getFileData();
	const content = jsonParse(atob(data.content));
	const order = [];

	if (!(content instanceof Object)) {
		console.warn("The json content isn't an Object");
		content = {};
	}

	Object.keys(content).forEach(key => {
		const data = content[key];
		data.email = key;
		if (data.encrypted) {
			data.pwd = crypt.decrypt(data.pwd);
		}
		order.push(data);
	});

	order.sort((a, b) => a.timestamp - b.timestamp);

	for (let i = 0; i < order.length; i++) {
		const data = order[i];
		createRow(data.email, data.pwd, data.timestamp);
	}

	console.log("Updated!");
	lastUpdate = Date.now();
	updating = false;
}

const updateButton = document.getElementById("update");
updateButton.addEventListener("click", update);
update();