// Call the function when the page is ready
var user;
$(document).ready(function () {
    getUserDataAndImage();
});

// Function to get user data from the server
function getUserDataAndImage() {
    // Make a fetch request to your /me route to get the user data
    fetch('/auth/me')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Display user information
                displayUserInfo(data.user);
                user = data.user;
                // Check if the user has a profileImage field
                if (data.user.profileImage) {
                    // Display the profile image
                    displayProfileImage(data.user.profileImage);
                }
            } else {
                console.error('Error fetching user data:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

// Function to display user information
function displayUserInfo(user) {
    // Construct the HTML content with user information
    var userInfoHTML =
        '<div class="m-3 h5">' +
        '<div class="row mb-3">' +
        '<div class="col"><p>Username:</p></div>' +
        '<div class="col">' + user.username + '</div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><p>Birthday:</p></div>' +
        '<div class="col">' + user.birthday + '</div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><p>Gender:</p></div>' +
        '<div class="col">' + user.gender + '</div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><p>Nickname:</p></div>' +
        '<div class="col">' + user.nickname + '</div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><p>Password:</p></div>' +
        '<div class="col">********</div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><button id="modifyUserInfoBtn" class="btn btn-primary" onClick="replaceWithEditForm()">Edit</button></div>' +
        '</div>' +
        '</div>';

    $('#Account_info').html(userInfoHTML);
}

// Function to display the user's profile image
function displayProfileImage(base64Image) {
    const imageElement = document.getElementById('userImage'); // Assuming you have an <img> element with id="profileImage"
  
    // Set the src attribute of the img element to the base64-encoded image
    imageElement.src = 'data:image/jpeg;base64,' + base64Image;
}

// Function to replace user information with a form for modification
function replaceWithEditForm() {
    // Construct a form with input fields populated with current user data
    var editFormHTML = 
       '<div class="m-3">' +
        '<form id="editUserInfoForm">' +
        '<div class="row mb-3">' +
        '<div class="col"><label for="username" class="form-label">Username:</label></div>' +
        '<div class="col"><input type="text" class="form-control" name="username" value="' + user.username + '"></div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><label for="birthday" class="form-label">Birthday:</label></div>' +
        '<div class="col"><input type="text" class="form-control" name="birthday" value="' + user.birthday + '"></div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><label for="gender" class="form-label">Gender:</label></div>' +
        '<div class="col"><input type="text" class="form-control" name="gender" value="' + user.gender + '"></div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><label for="nickname" class="form-label">Nickname:</label></div>' +
        '<div class="col"><input type="text" class="form-control" name="nickname" value="' + user.nickname + '"></div>' +
        '</div>' +
        '<div class="row mb-3">' +
        '<div class="col"><label for="password" class="form-label">Password:</label></div>' +
        '<div class="col"><input type="password" class="form-control" name="password" value="' + user.password + '"></div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col"><button type="button" id="saveChangesBtn" class="btn btn-primary" onClick="saveChanges()">Save Changes</button></div>' +
        '</div>' +
        '</form>' +
        '</div>';

    // Replace the user information with the form
    $('#Account_info').html(editFormHTML);

    // Add a click event to the "Save Changes" button
    $('#saveChangesBtn').click(saveChanges);
}

// Function to save changes and revert to displaying user information
function saveChanges() {
    // Get values from the form
    var updatedUserData = {
        username: $('input[name="username"]').val(),
        birthday: $('input[name="birthday"]').val(),
        gender: $('input[name="gender"]').val(),
        nickname: $('input[name="nickname"]').val(),
        password: $('input[name="password"]').val()
    };

    // Update the data attribute with the new user data
    $('#Account_info').data('user', updatedUserData);

    // Display the updated user information
    displayUserInfo(updatedUserData);
}
