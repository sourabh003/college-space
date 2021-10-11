const selectedFiles = {};

$("#main-block").ready(function () {
	loadCourseList();
});

const showLoader = (show) => {
	if (show) {
		$("#loader").css("display", "block");
	} else {
		$("#loader").css("display", "none");
	}
};

const loadCourseList = () => {
	fetch("/api/course/get_all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.error) {
				toaster("Error at Fetching Courses : " + data.message);
			}
			fillCourseList(data.data.courses);
		})
		.catch((error) => {
			console.error("Error:", error);
			toaster("Error at Fetching Courses : " + error);
		});
};

const loadSubjectList = (forSearch) => {
	let selectedCourse;
	if (forSearch) {
		$("#subjectDropdown").html(`<option class="dropdownOptions" value="null">
							<h3 class="font">All</h3>
						</option>`);
		selectedCourse = $("#courseDropdown option:selected").val();
	} else {
		$("#uploadDropdownSubject")
			.html(`<option class="dropdownOptions" value="null">
						<h3 class="font">Select Subject</h3>
					</option>`);
		selectedCourse = $("#uploadDropdownCourse option:selected").val();
	}
	if (selectedCourse !== "null") {
		console.log("Fetching Subjects");
		fetch("/api/subject/get", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: selectedCourse }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					toaster("Error at Fetching Subjects : " + data.message);
				} else {
					data.data.subjects.forEach((subject) => {
						let subjectItem = `
                    <option class="dropdownOptions" value="${subject.id}">
                        <h3 class="font">${subject.name}</h3>
                    </option>`;

						if (forSearch) {
							$("#subjectDropdown").append(subjectItem);
						} else {
							$("#uploadDropdownSubject").append(subjectItem);
						}
					});
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				toaster("Error at Fetching Subjects : " + error);
			});
	}
};

const fillCourseList = (courses) => {
	courses.forEach((course) => {
		let courseItem = `
        <option class="dropdownOptions" value="${course.id}">
            <h3 class="font">${course.name}</h3>
		</option>`;
		$("#courseDropdown").append(courseItem);
		$("#uploadDropdownCourse").append(courseItem);
	});
};

const searchSubject = () => {
	showLoader(true);
	let selectedCourse = $("#courseDropdown option:selected").val();
	let selectedSubject = $("#subjectDropdown option:selected").val();

	setTimeout(() => {
		showLoader(false);
		if (selectedCourse === "null" || selectedSubject === "null") {
			toaster("Getting all Notes");
		} else {
			toaster(selectedCourse + " : " + selectedSubject);
		}
	}, 1000);
};

$(document).ready(function () {
	$("form input").change(function () {
		console.log(this.files);
		Object.keys(this.files).forEach((key) => {
			let id = "id" + new Date().getTime();
			let file = this.files[key];
			if (file.type == "application/pdf") {
				let item = `
                <div id="selectedFileItemContainer-${id}" class="card">
						<div id="selectedFileItem-${id}" class="flexbox selectedFileItems">
							<h5 class="font">
								<i class="fa fa-file-pdf"></i>
								&nbsp; 
                                ${file.name}
							</h5>
							&nbsp;&nbsp;
							<i
								id="file-item-remove-button-${id}"
								onclick="removeSelectedFile('${id}')"
								class="fa fa-minus-circle"
							></i>
						</div>
						<div id="progress-container-box-${id}" class="progress-container">
							<h5 class="font" id="file-upload-progress-counter-${id}">0%</h5>
							&nbsp;&nbsp;
							<div
								id="file-upload-progress-bar-${id}"
								class="file-upload-progress"
							></div>
						</div>
					</div>`;
				$("#selectedFiles").append(item);
				selectedFiles[id] = file;
			}
		});
		console.log({ files: selectedFiles });
	});
});

const removeSelectedFile = (id) => {
	let itemID = `#selectedFileItem-${id}`;
	$(itemID).remove();
	delete selectedFiles[id];
};

const uploadNote = () => {
	let user = JSON.parse(storage.getItem("user"));
	let selectedCourse = $("#uploadDropdownCourse option:selected").val();
	let selectedSubject = $("#uploadDropdownSubject option:selected").val();
	if (selectedCourse == "null" || selectedSubject == "null") {
		toaster("Please select course and subject");
	} else {
		if (Object.keys(selectedFiles).length === 0) {
			toaster("No Files Selected!");
		} else {
			let uploadCount = 0;
			Object.keys(selectedFiles).forEach((key) => {
				let time = new Date().getTime();
				let fileID = "notes-" + time;
				let selectedFile = selectedFiles[key];
				$("#file-item-remove-button-" + key).css("display", "none");
				$("#progress-container-box-" + key).css("display", "flex");
				console.log("Uploading " + selectedFile.name);
				let uploadTask = firebaseNotesBucket.child(fileID).put(selectedFile);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						let progress = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);

						$("#file-upload-progress-bar-" + key).css("width", `${progress}%`);
						$("#file-upload-progress-counter-" + key).html(`${progress}%`);

						switch (snapshot.state) {
							case firebase.storage.TaskState.PAUSED: // or 'paused'
								console.log("Upload is paused");
								break;
							case firebase.storage.TaskState.RUNNING: // or 'running'
								console.log("Upload is running");
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						console.log("file upload failed");
						console.error(error);
						$("#selectedFileItemContainer-" + key).remove();
						toaster(selectedFile.name + " uploading failed!");
						delete selectedFiles[key];
					},
					() => {
						uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
							$("#file-item-remove-button-" + key).css("display", "block");
							$("#file-item-remove-button-" + key).removeClass(
								"fa-minus-circle"
							);
							$("#file-item-remove-button-" + key).addClass("fa-check-circle");
							$("#file-item-remove-button-" + key).css("color", "green");
							$("#file-item-remove-button-" + key).removeAttr("onclick");

							let notesInfo = {
								id: fileID,
								uploaded_by: user.email,
								uploaded_date: time,
								course: selectedCourse,
								subject: selectedSubject,
								download_url: downloadURL,
							};
							saveNotesInfoInDatabase(notesInfo, (error) => {
								if (!error) {
									toaster("Notes Sucessfully Uploaded");
									setTimeout(() => {
										$("#selectedFileItemContainer-" + key).remove();
										uploadCount++;
										filesUploaded(uploadCount);
									}, 3000);
								}
							});
						});
					}
				);
			});
		}
	}
};

const saveNotesInfoInDatabase = (note, cb) => {
	fetch("/api/notes/save", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(note),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.error) {
				toaster("Error at Saving Notes : " + data.message);
				return cb(true);
			} else {
				return cb(false);
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			toaster("Error at Saving Notes : " + error);
			return cb(true);
		});
};

const filesUploaded = (count) => {
	if (Object.keys(selectedFiles).length === count) {
		toaster("Note Uploaded");
		window.location.reload();
	}
};
