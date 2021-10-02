const createPost = (data) => {};

$("#body-block").ready(function () {
	loadPage();
});

const loadPage = () => {
	let user = JSON.parse(storage.getItem("user"));
	getPosts();
	$("#profile-info-username").html(user.name);
	$("#profile-info-user-position").html(user.course);
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
	let postLayout = `<div class="post-layout font radius shadow">
			<div class="post-layout-header">
                <div class="post-creator-info">
                    <h4 class="post-header" id="post">${post.created_by.name}</h4>
                    <h6 class="post-time">${post.created_date.time} &#x25cf; ${post.created_date.date}</h6>
                </div>
                <button onclick="openPostOptions(${isDeleteAble}, '${post.id}')" class="dropbtn">
                    <i class="fa fa-ellipsis-v"></i>
                </button>
            </div>
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
	let content = $("textarea#post_content").val();
	if (content === "") {
		toaster("No Content!");
	} else {
		let user = JSON.parse(storage.getItem("user"));
		let postData = {
			created_by: user.email,
			data: content,
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
				toaster("Post Uploaded");
			})
			.catch((error) => {
				console.error("Error:", error);
				toaster(error.message);
			});
	}
};

const openPostOptions = (isDeleteAble, postID) => {
	let postOptionsContents;
	if (isDeleteAble) {
		postOptionsContents = `<div class="modal-dialog">
	        <div class="modal-content">
	            <div class="modal-body">
	                <button class="postOptionButtons">Details</button>
	                <hr class="line-break" />
	                <button class="postOptionButtons">Delete Post</button>
	            </div>
	        </div>
	    </div>`;
	} else {
		postOptionsContents = `<div class="modal-dialog">
	        <div class="modal-content">
	            <div class="modal-body">
	                <button type="button" class="btn postOptionButtons" onclick="deletePost()"><i class="fas fa-info-circle"></i>&nbsp;&nbsp;&nbsp;Details</button>
	            </div>
	        </div>
	    </div>`;
	}
	$("#postOptionsModal").html(postOptionsContents);
	$("#postOptionsModal").modal("show");
};

const deletePost = () => {
	alert("post");
};
