document.addEventListener("DOMContentLoaded", () => {
	const userInfo = document.getElementById("user-info");
	fetch("/api/sessions/current", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data && data.email) {
				userInfo.innerText = `Bienvenido, ${data.first_name}`;
			} else {
				window.location.href = "/login";
			}
		})
		.catch((err) => {
			console.error("Error al obtener el usuario actual:", err);
			window.location.href = "/login";
		});
});
