$(document).ready(function () {
  const eventData = []
  fetch('/api/events')  // Assuming this endpoint provides a list of events
        .then(response => response.json())
        .then(data => {
          data.forEach(obj =>{
            eventData.push({title:`${obj.eventname}`,seatnumber: `${obj.seatnumber}`, booked:`${obj.BookedSeat}`})
          })
          generateEventTabs(eventData);
        })
        .catch(error => {
          alert(error);
        });
    $(document).on('click', '#createEvent', function() {
        var eventname = $('#eventTitle').val();
        var eventType = $('#eventType').val();
        var eventPriceHigh = $('#eventPriceHigh').val();
        var eventPriceMiddle = $('#eventPriceMiddle').val();
        var eventPriceLow = $('#eventPriceLow').val();
        var eventImage = $('#eventImage').val();
        var eventSeatNumber = $('#eventSeatNumber').val();
        var eventDateTime = $('#eventDateTime').val();
        var eventVenue = $('#eventVenue').val();
        var eventDescription = $('#eventDescription').val();
        var datetimeArray = eventDateTime.split('T');
        if(!eventname){
            alert("Event name cannot be empty");
        }
        else if(!eventType){
            alert("Event type cannot be empty");
        }
        else if(!eventPriceHigh || !eventPriceMiddle || !eventPriceLow){
            alert("Price cannot be empty");
        }
        else if(!eventImage){
            alert("Event Image link cannot be empty");
        }
        else if (!eventSeatNumber){
            alert("Seat number cannot be empty");
        }
        else if (!eventDateTime){
            alert("Event Date and Time cannot be empty");
        }
        else if (!eventVenue){
            alert("Event Venue cannot be empty");
        }
        else if (!eventDescription){
            alert("Event Description cannot be empty");
        }
        else{
            var formdata = new FormData();
            formdata.append('eventname', eventname);
            formdata.append('eventType', eventType);
            formdata.append('price', "$"+eventPriceLow+" $"+eventPriceMiddle+" $"+eventPriceHigh);
            formdata.append('eventImage', eventImage);
            formdata.append('eventSeatNumber', parseInt(eventSeatNumber,10));
            formdata.append('eventDate', datetimeArray[0]);
            formdata.append('eventTime', datetimeArray[1]);
            formdata.append('eventVenue', eventVenue);
            formdata.append('eventDescription', eventDescription);
            formdata.append('BookedSeat', []);
            fetch('/auth/newevents',{
                method:'POST',
                body:formdata
            }).then(response=>response.json())
            .then(data => {
                if(data.status == 'success'){
                document.getElementById("createEventForm").reset();
                alert("New event created");
                } else {
                alert(data.message || 'Unknown error');
                }
            })
            .catch(error =>{
                alert("Error: " + error.message || 'Unknown error');
            });
        }
    });
});
function generateEventTabs(events) {
        const tabList = $('#myTab');
        const tabContent = $('#myTabContent');
        tabList.empty();
        tabContent.empty();
        events.forEach((event, index) => {
            const tabId = `tab-${index}`;
            const tabPaneId = `tabPane-${index}`;
            const tab = $(`<li class="nav-item" role="presentation">
                            <button class="nav-link ${index === 0 ? 'active' : ''}" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${tabPaneId}" type="button" role="tab" aria-controls="${tabPaneId}" aria-selected="${index === 0}">${event.title}</button>
                        </li>`);

            const tabPane = $(`<div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="${tabPaneId}" role="tabpanel" aria-labelledby="${tabId}">
                                <div class="d-flex d-inline p-3">
                                    <p class="px-3 mx-5 text-black" style="background-color: #ffffff;">Highest Price</p>
                                    <p class="px-3 mx-5 text-black" style="background-color: #caca21;">Middle Price</p>
                                    <p class="px-3 mx-5 text-black" style="background-color: #279e27;">Lowest Price</p>
                                    <p class="px-3 mx-5 text-black" style="background-color: #d33157;">Not available</p>
                                </div>
                                <svg id="svg-text" width="500" height="110">
                                    <rect width="200" height="60" style="fill:rgb(149, 149, 196);stroke-width:3;stroke:rgb(0,0,0)" />
                                    <text x="60" y="40" class="h3">Stage</text>
                                </svg>
                                <svg id="svg-${index}" width="1000" height="${event.seatnumber*5}" xmlns="http://www.w3.org/2000/svg"></svg>
                             </div>`);

            tabList.append(tab);
            tabContent.append(tabPane);
            displaySeatMap(`svg-${index}`,event.seatnumber,event.booked)
        });
         const createEventTab = $(`<li class="nav-item" role="presentation">
                                <button class="nav-link" id="CreateEvent-tab" data-bs-toggle="tab" data-bs-target="#CreateEvent" type="button" role="tab" aria-controls="CreateEvent" aria-selected="false">Create New Event</button>
                             </li>`);
         const createEventTabPane = $(`<div class="tab-pane fade" id="CreateEvent" role="tabpanel" aria-labelledby="CreateEvent-tab">
                                <form id="createEventForm" class="row" action="/auth/newevents" method="post">
                                        <div class="col-6">
                                            <div class="mb-3">
                                                <label for="eventDateTime" class="form-label">Date/Time</label>
                                                <input type="datetime-local" class="form-control" id="eventDateTime" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventTitle" class="form-label">Title</label>
                                                <input type="text" class="form-control" id="eventTitle" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventPriceHigh" class="form-label">Highest Price</label>
                                                <input type="text" class="form-control" id="eventPriceHigh" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventPriceMiddle" class="form-label">Middle Price</label>
                                                <input type="text" class="form-control" id="eventPriceMiddle" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventPriceLow" class="form-label">Lowest Price</label>
                                                <input type="text" class="form-control" id="eventPriceLow" required>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <!-- Right column -->
                                            <div class="mb-2">
                                                <label for="eventImage" class="form-label">Image URL</label>
                                                <input type="text" class="form-control" id="eventImage" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventType" class="form-label">Type</label>
                                                <input type="text" class="form-control" id="eventType" required>
                                            </div>
                                            <div class="mb-2">
                                                <label for="eventSeatNumber" class="form-label">Seat Number</label>
                                                <input type="number" class="form-control" id="eventSeatNumber" required>
                                            </div>
                                            <div class="mb-2">
                                                <label for="eventVenue" class="form-label">Venue</label>
                                                <input type="text" class="form-control" id="eventVenue" required>
                                            </div>
                                            <div class="mb-2">
                                                <label for="eventDescription" class="form-label">Description</label>
                                                <textarea class="form-control" id="eventDescription" rows="3" required></textarea>
                                            </div>
                                        </div>
                                        <div class="">
                                            <button type="button" class="btn btn-primary" formmethod="post" id="createEvent">Create Event</button>
                                        </div>
                                    </form>
                                </div>`);

        tabList.append(createEventTab);
        tabContent.append(createEventTabPane);
    }

    function displaySeatMap(svgId, seatnum, booked) {
    var svgCircle = document.getElementById(svgId);
    let y = 0;
    let x = 0;
    var NS = "http://www.w3.org/2000/svg";

    for(let i =1; i<=seatnum; i++){
        var rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 30);
        rect.setAttribute("height", 30);
        rect.setAttribute("stroke", "gray");
        rect.setAttribute("strokeWidth", 5);
        if(booked.split(',').indexOf(i.toString())!== -1){
            rect.setAttribute("fill", "#d33157");
            rect.setAttribute("id", i);
        } else{
            if(i<21){
                rect.setAttribute("fill", "white");
                rect.setAttribute("id",i);
            }
            else if(i>20 && i<41){
                rect.setAttribute("fill", "#caca21");
                rect.setAttribute("id",i);
            }
            else{
                rect.setAttribute("fill", "green");
                rect.setAttribute("id",i);;
            }
        }
        svgCircle.appendChild(rect);

        var text = document.createElementNS(NS, "text");
        text.setAttribute("x", (x + 15));
        text.setAttribute("y", (y + 20));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("id", i);
        text.textContent = i;
        svgCircle.appendChild(text);

        x += 50;
        if(i%10==0){
            y+=50;
            x=0;
        }
    }
}