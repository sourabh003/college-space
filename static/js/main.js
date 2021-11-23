const firebaseConfig = {
	apiKey: "AIzaSyANg95C1HMW2pZT7lJu5ldT_4-ccF4EJq0",
	authDomain: "college-space-728fd.firebaseapp.com",
	projectId: "college-space-728fd",
	storageBucket: "college-space-728fd.appspot.com",
	messagingSenderId: "880508884040",
	appId: "1:880508884040:web:7a83ef8426b5f588d0347d",
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const firebaseStorage = firebase.storage();
const firebaseStorageRef = firebaseStorage.ref();
const firebaseNotesBucket = firebaseStorageRef.child("notes");
const firebaseImagesBucket = firebaseStorageRef.child("images");

const storage = window.localStorage;

$("#navigation-bar").ready(function () {
	let token = JSON.parse(storage.getItem("token"));
	if (token === null) {
		window.location.href = "/login";
	} else {
		$("#body-block").css("display", "flex");
		let user = JSON.parse(storage.getItem("user"));
		if (user == null) {
			let data = { token: token };
			fetch("/api/verify-token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
				.then((response) => response.json())
				.then((data) => {
					user = data.data;
					$("#user-name").html(user.name);
					$("#profile-info-username").html(user.name);
					$("#profile-info-user-position").html(user.course);
					storage.setItem("user", JSON.stringify(user));
					console.log("Success:", data);
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		} else {
			console.log("User Present");
			$("#user-name").html(user.name);
		}
	}
});

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

// Close the dropdown menu if the user clicks outside of it
// window.onclick = function (event) {
// 	if (!event.target.matches(".dropbtn")) {
// 		var dropdowns = document.getElementsByClassName("dropdown-content");
// 		var i;
// 		for (i = 0; i < dropdowns.length; i++) {
// 			var openDropdown = dropdowns[i];
// 			if (openDropdown.classList.contains("show")) {
// 				openDropdown.classList.remove("show");
// 			}
// 		}
// 	} else {
// 		if (dropdowns.classList.contains("show")) {
// 			dropdowns.classList.remove("show");
// 		}
// 	}
// };

const logout = () => {
	storage.clear();
	$("#logoutModal").modal("hide");
	window.location.href = "/login";
};
