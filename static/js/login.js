const storage = window.localStorage;

window.onload = function () {
	let token = storage.getItem("token");
	if (token !== null) {
		window.location.href = "/";
	}
};

// Method to validate inputs
const validate = (data) => {
	if (
		data.email === null ||
		data.email === undefined ||
		data.email === "" ||
		data.password === null ||
		data.password === undefined ||
		data.password === ""
	) {
		return false;
	} else {
		return true;
	}
};

// Method for login
const login = () => {
	loading(true);
	$("#login-form").submit(function (e) {
		e.preventDefault();
	});
	let data = {
		email: $("#inputEmail").val(),
		password: $("#inputPassword").val(),
	};

	if (validate(data)) {
		fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				loading(false);
				console.log("Success:", data.message);
				if (data.error) {
					toaster(data.message);
					console.error("Error:", data);
				} else {
					toaster(data.message);
					storage.setItem("token", JSON.stringify(data.data.token));
					$("#btn-submit").attr("disabled", true);
					setTimeout(() => {
						window.location.href = "/";
					}, 3000);
				}
			})
			.catch((error) => {
				loading(false);
				toaster(error.message);
				console.error("Error:", error);
			});
	} else {
		loading(false);
		toaster("Fields Empty!");
	}
};

// Loader
const loading = (show) => {
	if (show) {
		$("#loader").css("display", "block");
	} else {
		$("#loader").css("display", "none");
	}
};

// Banner
const banner = (data) => {
	if (data.success) {
		$("#banner").css("background-color", "#00aa8d");
		$("#banner").html(`<b>${data.message}</b>`);
		$("#banner").css("display", "block");
	} else {
		$("#banner").css("background-color", "#C62828");
		$("#banner").html(`<b>${data.message}</b>`);
		$("#banner").css("display", "block");
	}

	setTimeout(() => {
		$("#banner").css("display", "none");
	}, 2000);
};
