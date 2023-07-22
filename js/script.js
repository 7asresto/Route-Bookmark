var markerInput = document.getElementById("nameInput")
var linkInput = document.getElementById("urlInput")
var saveBtn = document.getElementById("save-btn")

// Check if there is any data stored in the "Bookmarker" key in the localStorage
if (localStorage.getItem("Bookmarker") === null) {
	var bookMarkerList = []
} else {
	// If there is data, parse the JSON data from the "Bookmarker" key and assign it to the bookMarkerList
	bookMarkerList = JSON.parse(localStorage.getItem("Bookmarker"))
	display()
}
saveBtn.addEventListener("click", saveBookMarker)

function saveBookMarker() {
	if (!markerInputValidation() || !linkInputValidation()) {
		if (!markerInputValidation() || markerInput.value == null) {

			Swal.fire({
				title: 'Invalid Name!',
				text: 'name should contain at least three characters (numbers or small/capital letters).',
				icon: 'error',
				cancelButtonText: 'cancel',
				cancelButtonColor: "#E2BC50",
				showCancelButton: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			})
		} else {
			Swal.fire({
				title: 'Invalid URL!',
				html: `<p>Rules for the URL input are: <br> 
				1.http:// or https:// are optional.<br>
				2.at least one or more word characters (letters, digits, underscores, dots, or hyphens). <br>
				3."." (dot) is mandatory and your subdomain (com, de, uk. co.uk) </p>`,
				icon: 'error',
				cancelButtonText: 'Got it',
				cancelButtonColor: "#E2BC50",
				showCancelButton: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			})
		}
	} else {
		var bookMarker = {
			bookMarkerName: markerInput.value,
			bookMarkerUrl: linkInput.value,
		}
		// Check if the new bookmark already exists in the bookMarkerList 
		if (!nameAlreadyExist() || !urlAlreadyExist()) {

			if (!nameAlreadyExist()) {
				Swal.fire({
					title: 'Invalid Input!',
					text: 'Name already exist, please check again',
					icon: 'error',
					cancelButtonText: 'cancel',
					cancelButtonColor: "#E2BC50",
					showCancelButton: true,
					showConfirmButton: false,
					allowOutsideClick: false,
				})
			} else {
				Swal.fire({
					title: 'Invalid URL!',
					text: 'URL already exist, please check again',
					icon: 'error',
					cancelButtonText: 'cancel',
					cancelButtonColor: "#E2BC50",
					showCancelButton: true,
					showConfirmButton: false,
					allowOutsideClick: false,
				})
			}

		}
		// If the bookmark already exists, show a warning popup Using SweetAlert library
		else {
			// If the bookmark does not exist, add it to the bookMarkerList
			bookMarkerList.push(bookMarker)
			// Save the updated bookMarkerList to the localStorage as a JSON string
			localStorage.setItem("Bookmarker", JSON.stringify(bookMarkerList))
			display()
			reset()
			//show a success message Using SweetAlert library
			const Toast = Swal.mixin({
				toast: true,
				position: 'center',
				showConfirmButton: false,
				timer: 1000,
				timerProgressBar: true,

			})

			Toast.fire({
				icon: 'success',
				iconColor: '#E2BC50',
				title: ' Bookmarker was added successfully'
			})
		}
	}
}

function display() {
	// Initialize an empty string to store the HTML data for the table rows
	var data = ``
	for (var i = 0; i < bookMarkerList.length; i++) {
		// Append the bookmark data to the 'data' string as a table row
		data += `
		<tr>
			<td>${i + 1 }</td>
			<td>${bookMarkerList[i].bookMarkerName}</td>	
			<td><button class="btn btn-outline-success" onclick= "visit(${i})"><i class="fa-solid fa-eye"></i></button></td>			
			<td><button class="btn btn-outline-danger" onclick="del(${i})"><i class="fa-solid fa-trash-can"></i></button></td>
		</tr> `
	}
	// Set the innerHTML of the table body element ("tableBody") with the generated data from above
	document.getElementById("tableBody").innerHTML = data

}

function del(index) {
	// Remove the bookmark at the specified 'index' from the bookMarkerList using splice()
	bookMarkerList.splice(index, 1)
	// Save the updated bookMarkerList to the localStorage as a JSON string
	localStorage.setItem("Bookmarker", JSON.stringify(bookMarkerList))
	// Call the display() function to render the updated bookmarks in the table
	display()
}

function visit(index) {
	var https = /^https:\/\//
	var http = /^https:\/\//

	// url input has to start with https://
	if (https.test(bookMarkerList[index].bookMarkerUrl)) {
		window.open(bookMarkerList[index].bookMarkerUrl)

		// url input has to start with http://
	} else if (http.test(bookMarkerList[index].bookMarkerUrl)) {
		window.open(bookMarkerList[index].bookMarkerUrl)
	} else {
		window.open(`https://${bookMarkerList[index].bookMarkerUrl}`)
	}

}

function reset() {
	markerInput.value = ""
	linkInput.value = ""
}

function linkInputValidation() {
	var validURL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/
	if (validURL.test(linkInput.value)) {
		return true
	} else {
		return false
	}
}

function markerInputValidation() {
	var nameValidation = /^[a-zA-Z0-9]{3,}(\s+[a-zA-Z0-9]+)*$/
	if (nameValidation.test(markerInput.value)) {
		return true
	} else {
		return false
	}
}

function nameAlreadyExist() {
	for (var i = 0; i < bookMarkerList.length; i++) {
		// Check if the input value matches the bookmark name in the bookMarkerList
		if (markerInput.value === bookMarkerList[i].bookMarkerName) {
			return false
		}
	}
	return true
}

function urlAlreadyExist() {
	for (var i = 0; i < bookMarkerList.length; i++) {
		// Check if the input value matches the bookmark URL in the bookMarkerList
		if (linkInput.value === bookMarkerList[i].bookMarkerUrl) {
			return false
		}
	}
	return true
}