(async () => {
	let secret = localStorage.getItem("secret");
	if (!secret) return;

	secret = JSON.parse(secret);
	crypt.secret = secret.decoder;

	if (secret.temporary) {
		localStorage.removeItem("secret");
	}

	const {Octokit, App} = await import("https://cdn.skypack.dev/octokit");

	const status = document.getElementById("status");
	const jsonButton = document.getElementById("jsonButton");
	
	// const octokit = new Octokit({
	// 	auth: atob("Z2hwXzZFeFFJYlhRY3BzMnRmUDVqRFRyU3luSjFzdWVFbjRhRjQ1TQ==")
	// });

	let updating = false;
	let lastUpdate = 0;
	let json_content = null;

	function jsonParse(str) {
		try {
			return JSON.parse(str);
		} catch {
			console.warn("Invalid json of content: " + str);
			return {};
		}
	}

	async function update() {
		if (updating) {
			console.warn("Already updating, please wait!");
		}

		if (Date.now() - lastUpdate < 5000) {
			console.warn("Please wait " + (5 - parseInt(Date.now() - lastUpdate) / 1000) + " seconds until the next update");
			return;
		}

		while (tbody.firstChild) {
			tbody.removeChild(tbody.firstChild);
		}
		
		status.hidden = false;
		status.textContent = "Actualizando...";
		updating = true;
		console.log("Updating table...");

		const order = [];
		const list = [];

		try {
			// const {data} = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {owner, repo, path});
			const data = await requestOctokit(secret.token);
			const source = atob(data.content);
			const content = jsonParse(source);

			json_content = source;
	
			contentSource = source ?? "";
	
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
	
			order.sort((a, b) => b.timestamp - a.timestamp);
	
			for (let i = 0; i < order.length; i++) {
				const data = order[i];
				list.push({
					email: data.email,
					password: data.pwd,
					timestamp: data.timestamp
				});
			}
		} catch (ex) {
		 status.removeAttribute("hidden");
		 status.textContent = "Error: " + ex;
		} finally {
			if (list.length > 0) {
				status.hidden = true;
				replaceList(list);
			} else {
				status.hidden = false;
				status.textContent = "No se ha guardado ningún email";
			}
		}

		console.log("Updated!");
		lastUpdate = Date.now();
		updating = false;
	}

	update();
	updateButton.addEventListener("click", update);

	jsonButton.addEventListener("click", () => {
		if (json_content === null) return;

		const tab = window.open("pretext.html", "_blank");
		tab.addEventListener("load", () => {
			console.log(json_content);
			tab.document.getElementsByTagName("pre")[0].textContent = json_content;
		});
	});
})();