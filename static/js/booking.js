//<!--20060616d Choy Wing Ho-->
//<!--22019343 Siu Ching Him-->
var seatarr = [];
var seatnum = 0;
var selected=[];
var price=[];
var totalprice=0;
var eventname="";
var venue="";
var updatedseat=[];
var date="";
var time="";
var username="";
$(document).ready(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    getdb(eventId);
    $("#Seat_Reset").click(function(){
        $("#Seat_Reset").addClass("d-none");
        $(".booking-form").addClass("d-none");
        $(".info").removeClass("d-none");
    });
    $("#Payment_Proceed").click(function(){
        var option = document.getElementsByName("Payment_Method");
        $("#Seat_Reset").addClass("d-none");
        for (let i = 0; i < option.length; i++) {
            if (option[i].checked)
                var method = option[i].value;
        }
        switch(method){
            case "Master_Visa":
                $(".booking-form").addClass("d-none");
                $(".Master-Visa-Payment").removeClass("d-none");
                break;
            case "Paypal":
                $(".booking-form").addClass("d-none");
                $(".Paypal-Payment").removeClass("d-none");
                break;
            case "AE":
                $(".booking-form").addClass("d-none");
                $(".AE-Payment").removeClass("d-none");
                break;
        }
    });
    $("#Master_Proceed").click(function(){
        var Master_Card_No = $('#Master_Card_No').val();
        var Month = $('#Month').val();
        var Year = $('#Year').val();
        var Master_Cardholder = $('#Master_Cardholder').val();
        var Master_Security = $('#Master_Security').val();
        updatedseat = [...new Set([...seatarr ,...selected])]
        console.log(updatedseat);
        var formdata = new FormData();
        formdata.append('Master_Card_No', Master_Card_No);
        formdata.append('Month', Month);
        formdata.append('Year', Year);
        formdata.append('Master_Cardholder', Master_Cardholder);
        formdata.append('Master_Security', Master_Security);
        formdata.append('seatarr', updatedseat);
        formdata.append('booked', selected.join(", "));
        formdata.append('eventname', eventname);
        formdata.append('price', totalprice);
        formdata.append('username', username);
        fetch('/auth/pay/visa',{
            method: 'POST',
            body: formdata
        }).then(response => response.json())
        .then(data =>{
            if(data.status == 'success'){
                $(".Master-Visa-Payment").addClass("d-none");
                $(".Purchase-success").removeClass("d-none");
                document.getElementById("payment_form_visa").reset();
                const concertDetails = {
                name: `${eventname}`,
                date: `${date}`,
                time: `${time}`,
                venue: `${venue}`,
                price: `${totalprice}`,
                };
                generateReceipt(concertDetails);
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
    $("#Paypal_Proceed").click(function(){
        var Paypal_email = $('#Paypal_email').val();
        updatedseat = [...new Set([...seatarr ,...selected])]
        var formdata = new FormData();
        formdata.append('Paypal_email', Paypal_email);
        formdata.append('seatarr', updatedseat);
        formdata.append('booked', selected.join(", "));
        formdata.append('eventname', eventname);
        formdata.append('price', totalprice);
        formdata.append('username', username);
        fetch('/auth/pay/paypal',{
            method: 'POST',
            body: formdata
        }).then(response => response.json())
        .then(data =>{
            if(data.status == 'success'){
                $(".Paypal-Payment").addClass("d-none");
                $(".Purchase-success").removeClass("d-none");
                document.getElementById("payment_form_paypal").reset();
                const concertDetails = {
                name: `${eventname}`,
                date: `${date}`,
                time: `${time}`,
                venue: `${venue}`,
                price: `${totalprice}`,
                };
                generateReceipt(concertDetails);
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
    $("#AE_Proceed").click(function(){
        var AE_Cardholder = $('#AE_Cardholder').val();
        var AE_Card_No = $('#AE_Card_No').val();
        var Month = $('#Month').val();
        var Year = $('#Year').val();
        var AE_Security = $('#AE_Security').val();
        var formdata = new FormData();
        updatedseat = [...new Set([...seatarr ,...selected])]
        formdata.append('AE_Cardholder', AE_Cardholder);
        formdata.append('AE_Card_No', AE_Card_No);
        formdata.append('Month', Month);
        formdata.append('Year', Year);
        formdata.append('AE_Security', AE_Security);
        formdata.append('seatarr', updatedseat);
        formdata.append('booked', selected.join(", "));
        formdata.append('eventname', eventname);
        formdata.append('price', totalprice);
        formdata.append('username', username);
        fetch('/auth/pay/AE',{
            method: 'POST',
            body: formdata
        }).then(response => response.json())
        .then(data =>{
            if(data.status == 'success'){
                $(".AE-Payment").addClass("d-none");
                $(".Purchase-success").removeClass("d-none");
                document.getElementById("payment_form_AE").reset();
                const concertDetails = {
                name: `${eventname}`,
                date: `${date}`,
                time: `${time}`,
                venue: `${venue}`,
                price: `${totalprice}`,
                };
                generateReceipt(concertDetails);
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
});
function displayseat(){
    var svgCircle = document.getElementById("svg");
    let y= 0;
    let x = 0; 
    var NS = "http://www.w3.org/2000/svg";
    for(let i =1; i<=seatnum; i++)
    {
        var rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 30);
        rect.setAttribute("height", 30);
        rect.setAttribute("stroke", "gray");
        rect.setAttribute("strokeWidth", 5);
        if(seatarr.indexOf(i.toString())!== -1){
            rect.setAttribute("fill", "#d33157");
            rect.setAttribute("id",i);
        }
        else{
            if(i<21){
                rect.setAttribute("fill", "white");
                rect.addEventListener("click", handleClick);
                rect.setAttribute("id",i);
                rect.setAttribute("value",price[2]);
            }
            else if(i>20 && i<41){
                rect.setAttribute("fill", "#caca21");
                rect.addEventListener("click", handleClick);
                rect.setAttribute("id",i);
                rect.setAttribute("value",price[1]);
            }
            else{
                rect.setAttribute("fill", "green");
                rect.addEventListener("click", handleClick);
                rect.setAttribute("id",i);
                rect.setAttribute("value",price[0]);
            }
        }
        svgCircle.appendChild(rect);

        var text = document.createElementNS(NS, "text");
        text.setAttribute("x",(x+15));
        text.setAttribute("y",(y+20));
        text.setAttribute("text-anchor", "middle")
        text.setAttribute("id",i);
        text.textContent=i;
        text.addEventListener("click", handleClick);
        svgCircle.appendChild(text);
        
        x+=50;
        if(i%10==0){
            y+=50;
            x=0;
        }
        $('#svg').attr('height', (seatnum/10)*50);
    }
}
function handleClick(event) {
    fetch('/auth/me',{
            method: 'GET',
        }).then(response => response.json())
        .then(data =>{
            if(data.status == 'success'){
                username= data.user.username;
                var rectID = event.target.getAttribute("id");
                selected.push(rectID);
                $("#Seat_Reset").removeClass("d-none");
                $(".booking-form").removeClass("d-none");
                $(".info").addClass("d-none");
                $(".Paypal-Payment").addClass("d-none");
                $(".Master-Visa-Payment").addClass("d-none");
                $(".AE-Payment").addClass("d-none");
                $(".Purchase-success").addClass("d-none");
                document.getElementById('SelectedSeat').textContent = `You have selected ${selected}`;
                totalprice += parseInt(event.target.getAttribute("value"), 10);
                document.getElementById('TotalPrice').textContent = `Total price is $${totalprice}`;
            }
            else if(data.status == 'failed'){
                alert("Please login first");
                window.location.href = '/index.html';
            }
            else{
                alert('unknown error');
            }
        }).catch(error =>{
            console.error("Error: ",error);
        })

}
function getdb(eventId) {
    fetch(`/auth/api/events/${eventId}`)
        .then(response => response.json())
        .then(eventDetails => {
            if(!eventDetails.BookedSeat){
                seatarr = [];
            }
            else{
                 seatarr = eventDetails.BookedSeat.split(',').map(seat => seat.trim());
            }
            seatnum = eventDetails.seatnumber;
            eventname = eventDetails.eventname;
            venue = eventDetails.venue;
            date = eventDetails.date;
            time = eventDetails.time;
            price = eventDetails.price.split(' ').map(price => parseInt(price.slice(1), 10));
            document.getElementById('Concert_Name').textContent = `Event Name: ${eventDetails.eventname} `;
            document.getElementById('Concert_Date').textContent = `Date: ${eventDetails.date} `;
            document.getElementById('Concert_Time').textContent = `Time: ${eventDetails.time}`;
            document.getElementById('Concert_Venue').textContent = `Venue: ${eventDetails.venue}`;
            document.getElementById('Concert_description').textContent = `Description: ${eventDetails.description}`;
            displayseat();
        })
        .catch(error => console.error('Error fetching event details:', error));
}
function generateReceipt(concertDetails) {
  // Get the digital receipt container
  const receiptContainer = document.getElementById("digitalReceiptContainer");

  // Create receipt content
  const ticketContent = `
            <h2>Concert Ticket</h2>
            <p>${concertDetails.name}</p>
            <p>Date: ${concertDetails.date}</p>
            <p>Time: ${concertDetails.time}</p>
            <p>Venue: ${concertDetails.venue}</p>
            <p>Seats: ${selected.join(", ")}</p>
            <p>Total Price: $${totalprice}</p>
            <img src="barcode.png" alt="Barcode" width="150px" height="150px">
            <p class="disclaimer">This is your electronic ticket. Please present it at the entrance for admission.</p>
        `;

  // Set the receipt content to the container
  receiptContainer.innerHTML = ticketContent;

  // Display the receipt container by removing the 'd-none' class
  receiptContainer.classList.remove('d-none');
}
