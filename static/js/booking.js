//<!--20060616d Choy Wing Ho-->
//<!--22019343 Siu Ching Him-->
var seatarr = [];
var seatnum = 0;
$(document).ready(function () {
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
        $(".Master-Visa-Payment").addClass("d-none");
        $(".Purchase-success").removeClass("d-none");
    });
    $("#Paypal_Proceed").click(function(){
        $(".Paypal-Payment").addClass("d-none");
        $(".Purchase-success").removeClass("d-none");
    });
    $("#AE_Proceed").click(function(){
        $(".AE-Payment").addClass("d-none");
        $(".Purchase-success").removeClass("d-none");
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
        if(seatarr.includes(i)){
            rect.setAttribute("fill", "red");
            rect.setAttribute("id",i);
        }
        else{
            rect.setAttribute("fill", "white");
            rect.addEventListener("click", handleClick);
            rect.setAttribute("id",i);
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
    }
}

function handleClick(event) {
    var rectID = event.target.getAttribute("id");
    $("#Seat_Reset").removeClass("d-none");
    $(".booking-form").removeClass("d-none");
    $(".info").addClass("d-none");
    $(".Paypal-Payment").addClass("d-none");
    $(".Master-Visa-Payment").addClass("d-none");
    $(".AE-Payment").addClass("d-none");
    $(".Purchase-success").addClass("d-none");
}
function getdb(eventId) {
    fetch(`/api/events/${eventId}`)
        .then(response => response.json())
        .then(eventDetails => {
            seatarr = eventDetails.BookedSeat;
            seatnum = eventDetails.seatnumber;
            document.getElementById('Concert_Name').textContent = `Event Name: ${eventDetails.eventname} `;
            document.getElementById('Concert_Date').textContent = `Date: ${eventDetails.date} `;
            document.getElementById('Concert_Time').textContent = `Time: ${eventDetails.time}`;
            document.getElementById('Concert_Venue').textContent = `Venue: ${eventDetails.venue}`;
            document.getElementById('Concert_description').textContent = `Description: ${eventDetails.description}`;
            displayseat();
        })
        .catch(error => console.error('Error fetching event details:', error));
}
