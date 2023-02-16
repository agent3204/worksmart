const OctokitPromise = import("https://cdn.skypack.dev/octokit");

const octokitData = {
	owner: "agent3204",
	repo: "data",
	path: "ds.json"
};

const crypt = {
	// secret: secret.decoder, //"VFF3403",

	decrypt: (cipher) => {
		let decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
		decipher = decipher.toString(CryptoJS.enc.Utf8);
		return decipher;
	}
};

this.crypt = crypt;

this.requestOctokit = async function(auth4) {
	const {Octokit} = await OctokitPromise;
	
	let octokit = new Octokit({
		auth: atob(auth4 + "XzZFeFFJYlhRY3BzMnRmUDVqRFRyU3luSjFzdWVFbjRhRjQ1TQ==")
	});

	try {
		const {data} = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", octokitData);
		return data;
	} catch {
		return null;
	}
}