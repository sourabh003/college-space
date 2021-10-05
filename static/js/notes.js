$("#main-block").ready(function () {
	loadSelectList();
});

const loadSelectList = () => {
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

	fetch("/api/subject/get_all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.error) {
				toaster("Error at Fetching Subjects : " + data.message);
			}
			fillSubjectsList(data.data.subjects);
		})
		.catch((error) => {
			console.error("Error:", error);
			toaster("Error at Fetching Subjects : " + error);
		});
};
const fillSubjectsList = (subjects) => {
	subjects.forEach((subject) => {
		let subjectItem = `
        <option class="dropdownOptions" value="${subject.id}">
            <h3 class="font">${subject.name}</h3>
		</option>`;
		$("#subjectDropdown").append(subjectItem);
	});
};

const fillCourseList = (courses) => {
	courses.forEach((course) => {
		let courseItem = `
        <option class="dropdownOptions" value="${course.id}">
            <h3 class="font">${course.name}</h3>
		</option>`;
		$("#courseDropdown").append(courseItem);
	});
};

const searchSubject = () => {
	let selectedCourse = $("#courseDropdown option:selected").val();
	let selectedSubject = $("#subjectDropdown option:selected").val();

	if (selectedCourse === "null" || selectedSubject === "null") {
		toaster("Please select valid subject and course");
	} else {
		toaster(selectedCourse + " : " + selectedSubject);
	}
};
