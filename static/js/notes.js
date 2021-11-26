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
				toaster("Error at Fetching Notes : " + error);
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
			let id = "id" + getUniqueID();
			let file = this.files[key];
			if (file.type == "application/pdf") {
				let size = file.size;
				if (size > 1000000) {
					size = (size / 1000000).toFixed(2) + " MB";
				} else if (size > 1000) {
					size = (size / 1000).toFixed(2) + " KB";
				} else {
					size = size + " Bytes";
				}
				let name = file.name.replace(".pdf", "");
				let item = `<div id="selected-file-item-${id}" class="selected-file-item card">
						<div class="flexbox justify-content-sb">
							<div class="flexbox">
								<img
									src="/static/images/pdf.png"
									width="30"
									height="30"
									alt=""
								/>
								&nbsp;&nbsp;
								<div>
									<h5 class="font">${name}</h5>
									<h6 class="font text-secondary">${size}</h6>
								</div>
							</div>
							<i
								id="file-item-remover-${id}"
								class="fas fa-minus-circle selected-file-item-remover"
								onclick="removeSelectedFile('${id}')"
							></i>
							<img
								id="file-item-loader-${id}"
								class="selected-file-item-loader"
								src="/static/images/loader.gif"
								height="30"
								width="30"
								alt=""
							/>
							<img
								id="file-item-uploaded-${id}"
								class="selected-file-item-uploaded"
								src="/static/images/check.gif"
								height="30"
								width="30"
								alt=""
							/>
						</div>
						<div
							id="file-item-progress-${id}"
							class="flexbox"
                            style="display:none;"
						>
							<h5 id="file-item-progress-count-${id}" class="font">0%</h5>
							&nbsp;
							<div
								id="file-item-progress-bar-${id}"
								class="selected-file-item-progress-bar"
							></div>
						</div>
					</div>`;
				$("#selectedFiles").append(item);
				$(`#file-item-remover-${id}`).css("display", "block");
				selectedFiles[id] = file;
			}
		});
		console.log({ files: selectedFiles });
	});
});

const removeSelectedFile = (id) => {
	let itemID = `#selected-file-item-${id}`;
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
				let fileID = "notes-" + getUniqueID();
				let selectedFile = selectedFiles[key];

				// Modifying layouts for start upload
				$(`#file-item-remover-${key}`).css("display", "none");
				$(`#file-item-loader-${key}`).css("display", "block");
				$(`#file-item-progress-${key}`).css("display", "flex");

				console.log("Uploading " + selectedFile.name);
				let uploadTask = firebaseNotesBucket.child(fileID).put(selectedFile);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						let progress = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);

						// Changing the progress bar and count
						$(`#file-item-progress-bar-${key}`).css("width", `${progress}%`);
						$(`#file-item-progress-count-${key}`).html(`${progress}%`);

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
						$(`#selected-file-item-${key}`).remove();
						toaster(selectedFile.name + " uploading failed!");
						delete selectedFiles[key];
					},
					() => {
						uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
							$(`#file-item-progress-${key}`).css("display", "none");
							$(`#file-item-loader-${key}`).css("display", "none");
							$(`#file-item-uploaded-${key}`).css("display", "block");
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
									setTimeout(() => {
										$(`#selected-file-item-${key}`).remove();
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

// const uploadNote = () => {
// 	if (Object.keys(selectedFiles).length === 0) {
// 		toaster("No Files Selected");
// 	} else {
// 		Object.keys(selectedFiles).forEach((key) => {
// 			let selectedFile = selectedFiles[key];
// 			$(`#file-item-remover-${key}`).css("display", "none");
// 			$(`#file-item-loader-${key}`).css("display", "block");
// 			$(`#file-item-progress-${key}`).css("display", "flex");
// 			setTimeout(() => {
// 				$(`#file-item-loader-${key}`).css("display", "none");
// 				$(`#file-item-uploaded-${key}`).css("display", "block");
// 				setTimeout(() => {
// 					removeSelectedFile(key);
// 				}, 2000);
// 			}, 5000);
// 		});
// 	}
// };

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
		toaster("All Notes Uploaded");
		setTimeout(() => {
			window.location.reload();
		}, 2000);
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

function getUniqueID() {
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (
		S4() +
		S4() +
		"-" +
		S4() +
		"-" +
		S4() +
		"-" +
		S4() +
		"-" +
		S4() +
		S4() +
		S4()
	);
}
