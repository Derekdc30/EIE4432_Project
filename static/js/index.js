//<!--20060616d Choy Wing Ho-->
//<!--22019343d Siu Ching Him-->
$(document).ready(async function () {
  checkUserStatus()
    $('.nav-pills a').on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
    await fetch('/auth/api/events',{method:'GET'})
        .then(response => response.json())
        .then(data => {
            renderEvents(data); // Render events on page load
            const eventNames = data.map(event => event.eventname);

            // Update suggestion list
            updateEventSuggestions(eventNames);
            // Add an event listener for the search input
            document.getElementById("eventSearch").addEventListener("input", function () {
                const searchTerm = this.value.toLowerCase();
                const filteredEvents = data.filter(event => {
                    const nameMatch = event.eventname.toLowerCase().includes(searchTerm);
                    const typeMatch = event.type.toLowerCase().includes(searchTerm);
                    const priceMatch = event.price.toLowerCase().includes(searchTerm);

                    return nameMatch || typeMatch || priceMatch;
                });

                renderEvents(filteredEvents);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            const errorCard = `
                <div class="alert alert-danger">
                    Failed to fetch events. Please try again later
                </div>
            `;
            const errorContainer = document.createElement("div");
            errorContainer.innerHTML = errorCard;
            document.getElementById("Event-Dashboard").append(errorContainer);
        });

    $("#registrationButton").click(function () {
      const rememberMeToken = getCookie('remember_me');
        var formdata = new FormData();
        formdata.append('token', rememberMeToken);
        if (rememberMeToken) {
          fetch('/auth/loginwithtoken', {
            method: 'POST',
            body: formdata
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === 'success') {
                alert('Logged in using Remember Me');
                checkUserStatus();
              } else {
                alert(data.message);
                $(".registrationTab").removeClass('d-none').addClass('show');
              }
            })
            .catch((error) => {
              console.error('Error logging in with token:', error);
              $(".registrationTab").removeClass('d-none').addClass('show');
            });
        }
        else{
          $(".registrationTab").removeClass('d-none').addClass('show');
        }
        
    });
    $(".close").click(function () {
        $(".registrationTab").removeClass('show').addClass('hide');
        $(".forgotTab").removeClass('show').addClass('hide');
    });
    $('#login').click(function(){
        var username = $('#login_Name').val();
        var password = $('#login_Password').val();
        var rememberMe = document.getElementById('login_Check').checked;
        if(!username || !password){
            alert("Username and password cannot be empty");
            return;
        }
        var formdata = new FormData();
        formdata.append('username', username);
        formdata.append('password', password);
        formdata.append('rememberMe', rememberMe);
        formdata.append('token', getCookie('remember_me'))
        fetch('/auth/login',{
            method: 'POST',
            body: formdata
        }).then(response => response.json())
        .then(data =>{
            if(data.status == 'success'){
                //signin success action
                alert("Logged as "+ data.user.username);
                checkUserStatus();
            }
            else if(data.status == 'failed'){
                alert(data.message);
            }
            else{
                alert('unknown error');
            }
        }).catch(error =>{
            console.error("Error: ",error);
        })
    });
    $('#register').click(function() {
    var username = $('#register_user_ID').val();
    var password = $('#register_user_password').val();
    var re_passowrd = $('#confirm_register_user_password').val();
    var nickname = $('#register_user_nickname').val();
    var gender = $('input[name="inlineRadioOptions"]:checked').val();
    var birthday = $('#birthday').val();
    if(!username || !password){
      alert("Username and password cannot be empty");
    }
    else if(password!=re_passowrd){
      alert('Password mismatch');
    }
    else if(!nickname){
      alert("Please select your nickname");
    }
    else if(!gender){
        alert("Please choose your gender");
    }
    else if (!birthday){
        alert("Please input your birthday");
    }
    else{
      var formdata = new FormData();
      formdata.append('username',username);
      formdata.append('password',password);
      formdata.append('nickname', nickname);
      formdata.append('gender', gender);
      formdata.append('birthday', birthday);
      var profileImageInput = document.querySelector('input[name="profileImage"]');
      if (profileImageInput.files.length > 0) {
        formdata.append('profileImage', profileImageInput.files[0]);
      }
      fetch('/auth/register',{
        method:'POST',
        body:formdata
      }).then(response=>response.json())
      .then(data=>{
        if(data.status == 'success'){
          alert(`Welcome, ${username}!\nYou can login with your account now!`);
          $(".registrationTab").removeClass('show').addClass('hide');
          document.getElementById("register_form").reset();
        }
        else{
          alert(data.message);
        }
      }).catch(error =>{
        alert("Error: ",error);
      })
    }
  });

  $('#logoutButton').click(function() {
      const response = confirm("Confirm to logout");
      if(response){
        fetch('/auth/logout',{method: 'POST'}).then(data=>{
          $("#login_register").removeClass('d-none').addClass('show');
          $("#logout_info").removeClass('show').addClass('d-none');
        })
      }
    });

  $('#forgotpasswordbtn').click(function() {
      $(".registrationTab").removeClass('show').addClass('hide');
      $(".forgotTab").removeClass('d-none').addClass('show');
    });
  $('#reset_password').click(function() {
      var userID = $("#forgot_user_ID").val();
      var nickname = $("#forgot_user_nickname").val();
      var birthday = $("#forgot_birthday").val();
      var newPassword = $("#new_password").val();
      var confirmNewPassword = $("#confirm_new_password").val();
      var formdata = new FormData();
      formdata.append('userID',userID);
      formdata.append('nickname',nickname);
      formdata.append('birthday',birthday);
      formdata.append('newPassword',newPassword);
      formdata.append('confirmNewPassword', confirmNewPassword);
      if(!userID || !nickname || !birthday || !newPassword || !confirmNewPassword){
        alert("Field cannot be empty");
        return
      }
      fetch('/auth/forgot',{
        method:'POST',
        body:formdata
      })
      .then(response => response.json())
      .then(data =>{
       if(data.status == 'success'){
                //signin success action
                alert(data.message);
                $(".registrationTab").removeClass('show').addClass('hide');
                $(".forgotTab").removeClass('d-none').addClass('show');
            }
            else if(data.status == 'failed'){
                alert(data.message);
            }
            else{
                alert('unknown error');
            }
        }).catch(error =>{
            console.error("Error: ",error);
        })
    });

  $("#filterEvents").click(function () {
      fetch('/auth/api/events')
          .then(response => response.json())
          .then(data => {
              const filteredEvents = filterEvents(data);
              renderEvents(filteredEvents);
          })
          .catch(error => {
              console.error('Error fetching events:', error);
          });
  });

  document.getElementById("eventSearch").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    fetch('/auth/api/events')
        .then(response => response.json())
        .then(data => {
            const filteredEvents = filterEvents(data.filter(event => {
                // Allow partial search in event name, type, and price
                return (
                    event.eventname.toLowerCase().includes(searchTerm) ||
                    event.type.toLowerCase().includes(searchTerm) ||
                    event.price.toLowerCase().includes(searchTerm)
                );
            }));
            renderEvents(filteredEvents);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
});
});
function checkUserStatus() {
  fetch('/auth/me')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.status == 'success') {
        $(".registrationTab").removeClass('show').addClass('hide');
        $("#login_register").addClass('d-none');
        $("#logout_info").removeClass('d-none').addClass('show');
        document.getElementById("login_form").reset();
        document.getElementById("UserInfoPage").innerHTML = `Hello ${data.user.username}`;
      } else {
        $(".registrationTab").removeClass('hide').addClass('show');
        $("#login_register").removeClass('d-none').addClass('show');
        $("#logout_info").removeClass('show').addClass('d-none');
      }
    })
    .catch(error => {
      alert('An error occurred');
      window.open('/login.html', '_self');
    });
}
function checkUserRole() {
        fetch('/auth/me')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status == 'success') {
                    if (data.user.role == 'admin') {
                        window.location.href = '/admin.html';
                    } else {
                        window.location.href = '/UserAccount.html';
                    }
                }
            })
            .catch(error => {
                alert('An error occurred');
                window.open('/login.html', '_self');
            });
    }
function getCookie(name) {
    const cookieValue = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (cookieValue) {
    const value = cookieValue[2];
    return value;
    }
    return '';
  }

function renderEvents(events) {
    // Clear previous events
    document.getElementById("Event-Dashboard").innerHTML = "";

    // Render events
    const divcontainer = document.createElement("div");
    divcontainer.classList.add("row");
    divcontainer.classList.add("row-cols-sm-1");
    divcontainer.classList.add("row-cols-md-2");
    divcontainer.classList.add("row-cols-lg-4");
    divcontainer.classList.add("justify-content-center");

    events.forEach(async obj => {
        let image = null;

        try {
            const imageResponse = await fetch(`/auth/api/eventimage/${obj.uid}`, { method: 'GET' });
            const imageData = await imageResponse.json();

            if (imageData.status === 'success') {
                image = 'data:image/jpeg;base64,' + imageData.event.profileImage;
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }

        const card = `
            <div class="col card m-2 justify-content-center" id="${obj.eventname}">
                <a href="/booking.html?eventId=${obj.uid}">
                    <img class="card-img" src="${image}" style="width: 100%; height: 20rem; object-fit:cover">
                    <div class="card-body text-start">
                        <h5 class="card-title">${obj.eventname}</h5>
                        <p class="badge bg-success p-2">
                            ${obj.type}
                        </p>
                        <p class="card-text">${obj.price}</p>
                    </div>
                </a>
            </div>
        `;
        const cardcontainer = document.createElement("div");
        cardcontainer.innerHTML = card;
        divcontainer.append(cardcontainer);
    });

    document.getElementById("Event-Dashboard").append(divcontainer);
}

function updateEventSuggestions(suggestions) {
    const datalist = document.getElementById("eventSuggestions");
    // Clear previous suggestions
    datalist.innerHTML = "";

    // Add new suggestions
    suggestions.forEach(suggestion => {
        const option = document.createElement("option");
        option.value = suggestion;
        datalist.appendChild(option);
    });
}

function filterEvents(events) {
    const filterDate = $("#filterDate").val();
    const filterTime = $('#filterTime').val();
    const filterTitle = $("#filterTitle").val().toLowerCase();
    const filterVenue = $("#filterVenue").val().toLowerCase();
    const filterDescription = $("#filterDescription").val().toLowerCase();

    return events.filter(event => {
        // Filter by date/time
        if (filterDate && !event.date.includes(filterDate)) {
            return false;
        }
        if (filterTime && !event.time.includes(filterTime)) {
            return false;
        }

        // Filter by title
        const eventName = event.eventname.toLowerCase();
        if (filterTitle && !eventName.includes(filterTitle)) {
            return false;
        }

        // Filter by venue
        const eventVenue = event.venue.toLowerCase();
        if (filterVenue && !eventVenue.includes(filterVenue)) {
            return false;
        }

        // Filter by description
        const eventDescription = event.description.toLowerCase();
        if (filterDescription && !eventDescription.includes(filterDescription)) {
            return false;
        }

        // Filter by type
        const eventType = event.type.toLowerCase();
        if (filterDescription && !eventType.includes(filterDescription)) {
            return false;
        }

        // Filter by price
        const eventPrice = event.price.toLowerCase();
        if (filterDescription && !eventPrice.includes(filterDescription)) {
            return false;
        }

        return true;
    });
}
