const createPost = (data) => {};

$("#body-block").ready(function () {
	initData();
});

const initData = () => {
	let user = JSON.parse(storage.getItem("user"));
	getPosts();
	$("#profile-info-username").html(user.name);
	$("#profile-info-user-position").html(user.course);
	fetchProfileInfo();
};

const fetchProfileInfo = () => {
	let user = JSON.parse(storage.getItem("user"));
	fetch("/api/post/count", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email: user.email }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			$("#uploaded-posts-counter").html(data.data.count);
		})
		.catch((error) => {
			console.error("Error get post count:", error);
			toaster("Get Post Error");
		});

	fetch("/api/notes/count", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email: user.email }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			$("#uploaded-notes-counter").html(data.data.count);
		})
		.catch((error) => {
			console.error("Error get notes count:", error);
			toaster("Get notes Error");
		});
};

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
				toaster("No Posts Available");
			} else {
				data.data.posts.forEach((post) => {
					addPostInLayout(post, false);
				});
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			toaster("Get Post Error");
		});
};

const addPostInLayout = (post, prepend) => {
	let user = JSON.parse(storage.getItem("user"));
	let isDeleteAble = false;
	if (user.email === post.created_by.email) {
		isDeleteAble = true;
	}
	let created_date = getGetCreatedTime(new Date(post.created_date));
	let postLayout;

	if (post.image_url === "null") {
		postLayout = `<div id="post-${post.id}" class="post-layout font radius shadow">
			<div class="post-layout-header">
                <div class="post-creator-info">
                    <h4 class="post-header" id="post">${post.created_by.name}</h4>
                    <h6 class="post-time">${created_date.time} &#x25cf; ${created_date.date}</h6>
                </div>
                <button onclick="openPostOptions(${isDeleteAble}, '${post.id}')" class="dropbtn">
                    <i class="fa fa-ellipsis-v"></i>
                </button>
            </div>
			<hr class="custom-line" />
			<p>${post.data}</p>
		</div>`;
	} else {
		postLayout = `<div id="post-${post.id}" class="post-layout font radius shadow">
			<div class="post-layout-header">
                <div class="post-creator-info">
                    <h4 class="post-header" id="post">${post.created_by.name}</h4>
                    <h6 class="post-time">${created_date.time} &#x25cf; ${created_date.date}</h6>
                </div>
                <button onclick="openPostOptions(${isDeleteAble}, '${post.id}')" class="dropbtn">
                    <i class="fa fa-ellipsis-v"></i>
                </button>
            </div>
			<hr class="custom-line" />
			<p>${post.data}</p>
            <img src="${post.image_url}" class="post-attached-image"></img>
		</div>`;
	}

	if (prepend) {
		$("#activities-section").prepend(postLayout);
	} else {
		$("#activities-section").append(postLayout);
	}
	fetchProfileInfo();
};

const reloadPosts = () => {
	$("#activities-section").html("");
	getPosts();
};

const uploadPost = () => {
	let imageInput = document.getElementById("image-selector-input");
	let closeBtn = $("#btn_close_modal");
	let uploadBtn = $("#btn_upload");

	let user = JSON.parse(storage.getItem("user"));
	let content = $("textarea#post_content").val();
	if (imageInput.files[0] === undefined && content === "") {
		toaster("No Text or Image!");
	} else {
		closeBtn.attr("disabled", "true");
		uploadBtn.attr("disabled", "true");
		showLoader(true);

		if (imageInput.files[0] === undefined) {
			let created_date = new Date().getTime();
			let postData = {
				created_by: user.email,
				data: content,
				created_date: created_date,
				image_url: "null",
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
					closePostModal();
					addPostInLayout(data.data.post, true);
					toaster("Post Uploaded");
				})
				.catch((error) => {
					console.error("Error:", error);
					toaster(error.message);
					closePostModal();
				});
		} else {
			// Uploding image to firebase
			let image = imageInput.files[0];
			let imageName = getUniqueID() + getImageExtenstion(image.type);
			let uploadTask = firebaseImagesBucket.child(imageName).put(image);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					let progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					// console.log("Upload is " + progress + "% done");
				},
				(error) => {
					closePostModal();
					toaster("Image Upload failed. Please try again");
					showLoader(false);
				},
				() => {
					uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
						let created_date = new Date().getTime();
						let postData = {
							created_by: user.email,
							data: content,
							created_date: created_date,
							image_url: downloadURL,
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
								closePostModal();
								addPostInLayout(data.data.post, true);
								toaster("Post Uploaded");
							})
							.catch((error) => {
								console.error("Error:", error);
								toaster(error.message);
								closePostModal();
							});
					});
				}
			);
		}
	}
};

const openPostOptions = (isDeleteAble, postId) => {
	let postOptionsContents;
	if (isDeleteAble) {
		postOptionsContents = `<div class="modal-dialog">
	        <div class="modal-content">
	            <div class="modal-body">
	                <button class="postOptionButtons">Details</button>
	                <hr class="line-break" />
	                <button class="postOptionButtons" onclick="deletePost('${postId}')">Delete Post</button>
	            </div>
	        </div>
	    </div>`;
	} else {
		postOptionsContents = `<div class="modal-dialog">
	        <div class="modal-content">
	            <div class="modal-body">
	                <button type="button" class="btn postOptionButtons"><i class="fas fa-info-circle"></i>&nbsp;&nbsp;&nbsp;Details</button>
	            </div>
	        </div>
	    </div>`;
	}
	$("#postOptionsModal").html(postOptionsContents);
	$("#postOptionsModal").modal("show");
};

const deletePost = (postId) => {
	fetch("/api/post/delete", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id: postId }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			$("#postOptionsModal").modal("hide");
			toaster("Post Deleted");
			let postView = `#post-${postId}`;
			$(postView).remove();
			fetchProfileInfo();
		})
		.catch((error) => {
			console.error("Error:", error);
			toaster(error.message);
		});
};

const getGetCreatedTime = (created_date) => {
	var strArray = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var d = created_date.getDate();
	var m = strArray[created_date.getMonth()];
	var y = created_date.getFullYear();
	return {
		time: created_date.toLocaleTimeString(),
		date: (d <= 9 ? "0" + d : d) + "-" + m + "-" + y,
	};
};

const imagePicker = () => {
	document.getElementById("image-selector-input").click();
};

const imageSelected = () => {
	let input = document.getElementById("image-selector-input");
	let file = input.files[0];
	console.log(file);

	if (file.type === "image/jpeg" || file.type === "image/png") {
		let imageSelectorLayout = $("#image-selector");
		let selectedImageLayout = $("#selected-image");
		let imageRemover = `<img
						src="/static/images/remove.jpg"
						alt=""
						width="30"
						id="btn-remove-image"
						onclick="removeImage()"
						height="30"
						style="cursor: pointer"
					/>`;
		selectedImageLayout.append(imageRemover);
		let reader = new FileReader();
		reader.onload = function (e) {
			let image = document.createElement("img");
			let containerwidth =
				document.getElementById("selected-image").offsetWidth;
			image.width = containerwidth;
			image.src = e.target.result;
			image.style.borderRadius = "10px";
			image.classList.add("card");
			selectedImageLayout.append(image);
			selectedImageLayout.css("display", "block");
			imageSelectorLayout.css("display", "none");
		};
		reader.readAsDataURL(file);
	} else {
		toaster("File not Supported");
	}
};

const textAreaAdjust = (element) => {
	element.style.height = "1px";
	element.style.height = 25 + element.scrollHeight + "px";
};

const closePostModal = () => {
	document.getElementById("image-selector-input").value = "";
	$("#selected-image").empty();
	$("#image-selector").css("display", "block");
	$("#uploadModal").modal("hide");
	showLoader(false);
};

const removeImage = () => {
	document.getElementById("image-selector-input").value = "";
	$("#selected-image").empty();
	$("#image-selector").css("display", "block");
};

const showLoader = (show) => {
	if (show) {
		$("#post-loader").css("display", "block");
	} else {
		$("#post-loader").css("display", "none");
	}
};

function getUniqueID() {
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4();
}

const getImageExtenstion = (type) => {
	if (type === "image/jpeg") {
		return ".jpg";
	} else {
		return ".png";
	}
};
