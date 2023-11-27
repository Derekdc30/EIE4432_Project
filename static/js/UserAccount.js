// Call the function when the page is ready
var user;
var isUpdateInProgress = false;
$(document).ready(function () {
    getUserDataAndImage();
    getUserTransactionHistory();
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
   if (isUpdateInProgress) {
        alert('Please wait before making another update.');
        return;
    }
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
            '<div class="row mb-3">'+
                '<div class="col"><label for="User_Image">Profile picture</label></div>'+
                '<div class="col"><input type="file" class="form-control" name="profileImage" id="User_Image" accept="image/*"></div>'+
            '</div>'+
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
   if (isUpdateInProgress) {
        alert('Please wait before making another update.');
        return;
    }
    var updatedUserData = {
        username: $('input[name="username"]').val(),
        birthday: $('input[name="birthday"]').val(),
        gender: $('input[name="gender"]').val(),
        nickname: $('input[name="nickname"]').val(),
        password: $('input[name="password"]').val(),
        profileImage: document.querySelector('input[name="profileImage"]').files[0]
    };
      var formdata = new FormData();
      formdata.append('username', $('input[name="username"]').val());
      formdata.append('birthday', $('input[name="birthday"]').val());
      formdata.append('gender', $('input[name="gender"]').val());
      formdata.append('nickname', $('input[name="nickname"]').val());
      formdata.append('password', $('input[name="password"]').val());
      formdata.append('profileImage', document.querySelector('input[name="profileImage"]').files[0]);

      fetch('/auth/updateinfo',{
        method:'POST',
        body:formdata
      }).then(response=>response.json())
      .then(data=>{
        if(data.status == 'success'){
          $('#Account_info').data('user', updatedUserData);
          displayUserInfo(updatedUserData);
          isUpdateInProgress = true;
          setTimeout(() => {
              isUpdateInProgress = false;
          }, 30000);
        }
        else{
          alert(data.message);
        }
      }).catch(error =>{
          alert("Error: ",error);
      })
}

// Function to get and display user transaction history
function getUserTransactionHistory() {
    // Make a fetch request to your '/transactionHistory' route
    fetch('/auth/transactionHistory')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Display the transaction history
                displayTransactionHistory(data.transactions);
            } else {
                console.error('Error fetching transaction history:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching transaction history:', error);
        });
}

// Function to display user transaction history
function displayTransactionHistory(transactions) {
    // Check if there are transactions to display
    if (transactions && transactions.length > 0) {
        // Construct HTML content with transaction history
        var transactionHistoryHTML =
            '<div class="m-3">' +
                '<h5 class="mb-3">Transaction History</h5>';

        transactions.forEach(transaction => {
            transactionHistoryHTML +=
                '<div class="card mb-3">' +
                    '<div class="card-body">' +
                        '<p><strong>Event Name:</strong> ' + transaction.eventname + '</p>' +
                        '<p><strong>Date:</strong> ' + transaction.date + '</p>' +
                        '<p><strong>Price:</strong> ' + transaction.price + '</p>' +
                        '<p><strong>Seats:</strong> ' + transaction.seat + '</p>' +
                    '</div>' +
                '</div>';
        });

        transactionHistoryHTML += '</div>';

        // Replace the content of the 'History' tab with the transaction history
        $('#History').html(transactionHistoryHTML);
    } else {
        // If no transactions are found, display a message
        var noTransactionsHTML =
            '<div class="m-3">' +
                '<p>No transactions found for the user.</p>' +
            '</div>';

        // Replace the content of the 'History' tab with the message
        $('#History').html(noTransactionsHTML);
    }
}


