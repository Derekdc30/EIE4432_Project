//<!--20060616d Choy Wing Ho-->
//<!--22019343 Siu Ching Him-->
$(document).ready(function () {
    $('.nav-pills a').on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
    $.get("Event.json", function (data) {
            const divcontainer = document.createElement("div");
            divcontainer.classList.add("row");
            divcontainer.classList.add("row-cols-sm-1");
            divcontainer.classList.add("row-cols-md-2");
            divcontainer.classList.add("row-cols-lg-4");
            divcontainer.classList.add("justify-content-center");
            
            for(let i =0; i<data.length; i++)
            {
                let obj = data[i];
                const card=`
                        <div class="col card m-2 justify-content-center" id="${obj.ID}" >
                            <img class="card-img" src="${obj.image}" style="width: 100%; height: 20rem; object-fit:cover">
                            <div class="card-body text-start">
                                <h5 class="card-title">${obj.name}</h5>
                                <p class="badge bg-success p-2">
                                    ${obj.type}
                                </p>
                                <p class="card-text">${obj.price}</p>
                            </div>
                        </div>
                    `;
                const cardcontainer = document.createElement("div");
                cardcontainer.innerHTML = card;
                divcontainer.append(cardcontainer);
            }
            document.getElementById("Event-Dashboard").append(divcontainer);
        }).fail(function (error) {
                const card=`
                    <div class="alert alert-danger">
                            Failed to fetch. Please try again later
                    </div>
                    `;
                const cardcontainer = document.createElement("div");
                cardcontainer.innerHTML = card;
                document.getElementById("Event-Dashboard").append(cardcontainer);
        });
    $("#registrationButton").click(function () {
        $(".registrationTab").removeClass('d-none').addClass('show');
    });
    $(".close").click(function () {
        $(".registrationTab").removeClass('show').addClass('hide');
    });
    $('#login').click(function(){
        var username = $('#login_Name').val();
        var password = $('#login_Password').val();
        if(!username || !password){
            alert("Username and password cannot be empty");
            return;
        }
        var formdata = new FormData();
        formdata.append('username', username);
        formdata.append('password', password);
        fetch('/auth/login',{
            method: 'POST',
            body: formdata
        }).then(response => response.json())
        .then(data =>{
            if(data.status == 'success'){
                //signin success action
                alert("Logged as "+ data.user.username);
                $(".registrationTab").removeClass('show').addClass('hide');
                $("#login_register").addClass('d-none');
                $("#logout_info").removeClass('d-none').addClass('show');
                document.getElementById("login_form").reset();
                document.getElementById("UserInfoPage").innerHTML = `Hello ${username}`;
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
});
/*function sha256(input){
  const crypto = window.crypto || window.msCrypto;
  const encoder = new TextEncoder();
  const data  = encoder.encode(input);
  return crypto.subtle.digest('SHA-256',data)
    .then(buffer=>{
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2,'0')).join('');
      return hashHex;
    });
}*/
