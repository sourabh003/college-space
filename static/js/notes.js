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
                <div id="selectedFileItem-${id}" class="card flexbox selectedFileItems">
                    <h5 class="font">
                        <i class="fa fa-file-pdf"></i>
                        &nbsp;
                        ${file.name}
                    </h5>
                    &nbsp;&nbsp;
                    <i class="fa fa-minus-circle" onclick="removeSelectedFile('${id}')"></i>
                </div>`;
				$("#selectedFiles").append(item);
				selectedFiles[id] = file;
			}
		});
	});
});

const removeSelectedFile = (id) => {
	let itemID = `#selectedFileItem-${id}`;
	$(itemID).remove();
	delete selectedFiles[id];
};

const uploadNote = () => {
	let selectedCourse = $("#uploadDropdownCourse option:selected").val();
	let selectedSubject = $("#uploadDropdownSubject option:selected").val();
	// if (selectedCourse == "null" || selectedSubject == "null") {
	// 	toaster("Please select course and subject");
	// } else {
	if (Object.keys(selectedFiles).length === 0) {
		toaster("No Files Selected!");
	}
	// }
};
