const storage = window.localStorage;

window.onload = function () {
	let token = storage.getItem("token");
	if (token !== null) {
		window.location.href = "/";
	} else {
		fetch("/api/course/get_all", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				let content = `<option class="dropdownOptions" value="Select Course">
                                <h3>Select Course</h3>
                            </option>`;

				data.data.courses.forEach((element) => {
					console.log(element);
					content += `<option class="dropdownOptions" value="${element.name}"><h3>${element.name}</h3></option>`;
				});

				$("#courseDropdown").html(content);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
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
		data.password === "" ||
		data.name === null ||
		data.name === undefined ||
		data.name === ""
	) {
		return false;
	} else {
		return true;
	}
};

// Method for login
const register = () => {
	$("#login-form").submit(function (e) {
		e.preventDefault();
	});

	let data = {
		name: $("#inputName").val(),
		email: $("#inputEmail").val(),
		password: $("#inputPassword").val(),
		course: $("#courseDropdown option:selected").val(),
	};

	if (data.name === "" || data.email === "" || data.password === "") {
		toaster("Fields Empty");
	} else {
		if (data.course === "Select Course") {
			toaster("Please Select Course");
		} else {
			loading(true);
			fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
				.then((response) => response.json())
				.then((data) => {
					$("#btn-submit").attr("disabled", true);
					loading(false);
					if (data.error) {
						toaster(data.message);
						console.error("Error:", data);
					} else {
						toaster(data.message);
						console.log(data);
						storage.setItem("token", JSON.stringify(data.data.token));
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
		}
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

const validateSection = (section) => {
	if (section === 1) {
		let data = {
			name: $("#inputName").val(),
			email: $("#inputEmail").val(),
			password: $("#inputPassword").val(),
		};
		if (data.name === "" || data.email === "" || data.password === "") {
			toaster("Fields Empty!");
		} else {
			$("#form-section-2").css("display", "block");
		}
	} else {
	}
};
