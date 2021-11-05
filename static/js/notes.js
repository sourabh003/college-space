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

	if (selectedCourse === "null") {
		fetch("/api/notes/get_all", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				showLoader(false);
				if (data.error) {
					toaster("Error at Fetching Notes : " + data.message);
				} else {
					console.log(data.data);
					addNotesInLayout(data.data.notes);
				}
			})
			.catch((error) => {
				showLoader(false);
				console.error("Error:", error);
				toaster("Error at Fetching Subjects : " + error);
			});
	} else {
		fetch("/api/notes/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				course: selectedCourse,
				subject: selectedSubject,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				showLoader(false);
				if (data.error) {
					toaster("Error at Searching Notes : " + data.message);
				} else {
					console.log(data.data);
					addNotesInLayout(data.data.notes);
				}
			})
			.catch((error) => {
				showLoader(false);
				console.error("Error:", error);
				toaster("Error at Searching Subjects : " + error);
			});
	}
};

const addNotesInLayout = (notes) => {
	const count = Object.keys(notes).length;
	if (count === 1) {
		$("#search-results-counter").html(count + " result found");
	} else {
		$("#search-results-counter").html(count + " results found");
	}

	$("#searched-notes-container")
		.html(`<div class="card searched-note" id="searched-note">
				<table style="width: 100%">
					<tr>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h5 class="text-primary">Course</h5>
								</div>
							</center>
						</td>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h5 class="text-primary">Subject</h5>
								</div>
							</center>
						</td>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h5 class="text-primary">Uploaded Date</h5>
								</div>
							</center>
						</td>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h5 class="text-primary">Uploaded By</h5>
								</div>
							</center>
						</td>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h5 class="text-primary">Action</h5>
								</div>
							</center>
						</td>
					</tr>
				</table>
			</div>`);
	notes.forEach((note) => {
		let uploaded_date = getGetCreatedTime(new Date(note.uploaded_date));

		let content = `<div class="card searched-note" id="searched-note">
				<div class="flexbox">
					<img
						src="/static/images/pdf.png"
						alt=""
						height="30"
						width="30"
					/>&nbsp;&nbsp;
					<h4 class="font">${note.name}</h4>
				</div>
				<hr class="line-break" />
                <table style="width: 100%">
					<tr>
						<td class="notes-info-cell">
                            <div class="font">
                                <h6 class="text-secondary">${note.course.name}</h6>
                            </div>
						</td>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h6 class="text-secondary">${note.subject.name}</h6>
								</div>
							</center>
						</td>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h6 class="text-secondary">${uploaded_date.time}</h6>
                                    <h6 class="text-secondary">${uploaded_date.date}</h6>
								</div>
							</center>
						</td>
						<td class="notes-info-cell">
							<center>
								<div class="font">
									<h6 class="text-secondary">${note.uploaded_by.name}</h6>
								</div>
							</center>
						</td>
						<td class="notes-info-cell section-download">
                            <a class="btn download-btn font" href="${note.download_url}" target="_blank">
                                Download&nbsp;&nbsp;<i class="fas fa-download"></i>
                            </a>
						</td>
					</tr>
				</table>
			</div>`;
		$("#searched-notes-container").append(content);
	});
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

							let filename = selectedFile.name.split(".pdf")[0];
							let notesInfo = {
								id: fileID,
								name: filename,
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
