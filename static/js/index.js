const storage = window.localStorage;
window.onload = function () {
	let token = JSON.parse(storage.getItem("token"));
	if (token === null) {
		window.location.href = "/login";
	} else {
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

	getPosts();
};

const createPost = (data) => {};

const getPosts = () => {
	fetch("/api/post/get_all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			if (data.data.posts.length == 0) {
				let postLayout = `<div class="post-layout font">
                    <center><h4 class="post-header" id="post">No Recent Activities</h4></center>
                </div>`;
				$("#activities-section").append(postLayout);
			}
			data.data.posts.forEach((post) => {
				addPostInLayout(post, false);
			});
		})
		.catch((error) => {
			console.error("Error:", error);
		});
};

const addPostInLayout = (post, prepend) => {
	let postLayout = `<div class="post-layout font">
			<h4 class="post-header" id="post">${post.created_by}</h4>
			<h6 class="post-time">${post.created_date.time} &#x25cf; ${post.created_date.date}</h6>
			<hr class="custom-line" />
			<p>${post.data}</p>
		</div>`;

	if (prepend) {
		$("#activities-section").prepend(postLayout);
	} else {
		$("#activities-section").append(postLayout);
	}
};

const reloadPosts = () => {
	$("#activities-section").html("");
	getPosts();
};

const uploadPost = () => {
	let user = JSON.parse(storage.getItem("user"));
	let postData = {
		created_by: user.email,
		data: $("textarea#post_content").val(),
	};
	fetch("/api/post/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			$("textarea#post_content").val("");
			$("#uploadModal").modal("hide");
			addPostInLayout(data.data.post, true);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
};
