//<!--20060616d Choy Wing Ho-->
//<!--22019343d Siu Ching Him-->
const eventData = []
$(document).ready(async function () {
  await fetch('/auth/api/events')  // Assuming this endpoint provides a list of events
        .then(response => response.json())
        .then(data => {
          data.forEach(obj =>{
            eventData.push({
                title:`${obj.eventname}`,
                seatnumber: `${obj.seatnumber}`, 
                booked:`${obj.BookedSeat}`,
                description:`${obj.description}`,
                price:`${obj.price}`,
                date:`${obj.date}`,
                time:`${obj.time}`,
                type:`${obj.type}`,
                venue:`${obj.venue}`,
                uid:`${obj.uid}`
            })
          })
          generateEventTabs(eventData);
        })
        .catch(error => {
          alert(error);
        });

        await fetch('/auth/api/alltransactionhistory',{method:'GET'})
        .then(response => response.json())
        .then(transactionData => {
            generateTransactionTab(transactionData.transaction);
            })
        .catch(error => {
            alert(error);
        });
        await fetch('/auth/api/allAccount',{method:'GET'})
        .then(response => response.json())
        .then(data => {
            generateAccountTab(data.accounts);
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
        var eventSeatNumber = $('#eventSeatNumber').val();
        var eventDateTime = $('#eventDateTime').val();
        var eventVenue = $('#eventVenue').val();
        var eventDescription = $('#eventDescription').val();
        var eventImage = document.querySelector('input[name="eventImage"]').files[0]
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
            alert("Event Image cannot be empty");
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

    $('#searchButton').on('click', filterEvents);
});
function generateEventTabs(events) {
        const tabList = $('#myTab');
        const tabContent = $('#myTabContent');
        tabList.empty();
        tabContent.empty();
        events.forEach(async (event, index) => {
            const tabId = `tab-${index}`;
            const tabPaneId = `tabPane-${index}`;
            const tab = $(`<li class="nav-item" role="presentation" data-title="${event.title}" data-date="${event.date}" data-venue="${event.venue}" data-description="${event.description}">
                <button class="nav-link ${index === 0 ? 'active' : ''}" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${tabPaneId}" type="button" role="tab" aria-controls="${tabPaneId}" aria-selected="${index === 0}" data-event-id="${event.uid}">${event.title}</button>
            </li>`);


             const tabPane = $(`<div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="${tabPaneId}" role="tabpanel" aria-labelledby="${tabId}">
                            <div class="row">
                                <div class="col-6">
                                    <!-- Left column - Seat Map -->
                                    <div class="d-flex d-inline p-3">
                                        <p class="px-3 text-black" style="background-color: #ffffff;">Highest Price</p>
                                        <p class="px-3 text-black" style="background-color: #caca21;">Middle Price</p>
                                        <p class="px-3 text-black" style="background-color: #279e27;">Lowest Price</p>
                                        <p class="px-3 text-black" style="background-color: #d33157;">Not available</p>
                                    </div>
                                    <svg id="svg-text" width="200" height="60">
                                        <rect width="200" height="60" style="fill:rgb(149, 149, 196);stroke-width:3;stroke:rgb(0,0,0)" />
                                        <text x="60" y="40" class="h3">Stage</text>
                                    </svg>
                                    <svg id="svg-${index}" width="500" height="${event.seatnumber * 5}" xmlns="http://www.w3.org/2000/svg"></svg>
                                </div>
                                <div class="col-6">
                                    <!-- Right column - Edit Event Form -->
                                    <form id="edit${event.title}" class="row" action="/auth/api/updateevent/${event.uid}" method="post">
                                        <!-- Populate form fields with event data -->
                                        <div class="col-12">
                                        
                                            <div class="mb-3">
                                                <label for="eventDateTime" class="form-label">Date/Time</label>
                                                <input type="datetime-local" class="form-control" id="eventDateTime_${event.uid}" value="${event.date}T${event.time}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventTitle" class="form-label">Title</label>
                                                <input type="text" class="form-control" id="eventTitle_${event.uid}" value="${event.title}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventPriceHigh" class="form-label">Highest Price</label>
                                                <input type="text" class="form-control" id="eventPriceHigh_${event.uid}" value="${event.price.split(' ').map(price => parseInt(price.slice(1), 10))[2]}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventPriceMiddle" class="form-label">Middle Price</label>
                                                <input type="text" class="form-control" id="eventPriceMiddle_${event.uid}" value="${event.price.split(' ').map(price => parseInt(price.slice(1), 10))[1]}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="eventPriceLow" class="form-label">Lowest Price</label>
                                                <input type="text" class="form-control" id="eventPriceLow_${event.uid}" value="${event.price.split(' ').map(price => parseInt(price.slice(1), 10))[0]}" required>
                                            </div>
                                            <div class="mb-2">
                                                <label for="User_Image">Event picture</label>
                                                <input type="file" class="form-control" name="eventImage_${event.uid}" id="evtitlent_Image_${event.uid}" accept="image/*">
                                            </div>
                                            <div class="mb-3">title
                                                <label for="eventType" class="form-label">Type</label>
                                                <input type="text" class="form-control" id="eventType_${event.uid}" value="${event.type}" required>
                                            </div>
                                            <div class="mb-2">
                                                <label for="eventSeatNumber" class="form-label">Seat Number</label>
                                                <input type="number" class="form-control" id="eventSeatNumber_${event.uid}" value="${event.seatnumber}" required>
                                            </div>
                                            <div class="mb-2">
                                                <label for="eventVenue" class="form-label">Venue</label>
                                                <input type="text" class="form-control" id="eventVenue_${event.uid}" value="${event.venue}" required>
                                            </div>
                                            <div class="mb-2">
                                                <label for="eventDescription" class="form-label">Description</label>
                                                <textarea class="form-control" id="eventDescription_${event.uid}" rows="3" required>${event.description}</textarea>
                                            </div>
                                            <div >
                                                <button type="button" class="btn btn-primary" formmethod="post" onClick="editevent('${event.uid}')" id="editEvent">Save Changes</button>
                                                <button type="button" class="btn btn-primary formmethod="post" onClick="cancelEvent('${event.uid}')" id="cancelButton">Cancel event</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>`);

        tabList.append(tab);
        tabContent.append(tabPane);
        const transaction = [];
        await fetch(`/auth/api/userbookedseat/${event.title}`,{method:'GET'})
          .then(response => response.json())
          .then(data =>{
                data.forEach(obj =>{
                    transaction.push({
                        title:`${obj.eventname}`,
                        username: `${obj.username}`,
                        seat: `${obj.seat}`
                    })
                })
          }).catch(error=>{
            alert('Error: '+error);
          })

        displaySeatMap(`svg-${index}`, event.seatnumber, event.booked,transaction);

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
                                                <label for="User_Image">Event picture</label>
                                                <input type="file" class="form-control" name="eventImage" id="event_Image" accept="image/*">
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
function displaySeatMap(svgId, seatnum, booked, transaction) {
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
        if (booked.split(',').indexOf(i.toString()) !== -1) {
            rect.setAttribute("fill", "#d33157");
            rect.setAttribute("id", i);
            transaction.forEach((obj,index)=>{ 
                if(obj.seat.split(', ').indexOf(i.toString()) !== -1){
                    rect.addEventListener("mouseenter", function () {
                        displayHoverText(obj.username);
                    });
                }
            })
        } else {
            if (i < 21) {
                rect.setAttribute("fill", "white");
                rect.setAttribute("id", i);
            } else if (i > 20 && i < 41) {
                rect.setAttribute("fill", "#caca21");
                rect.setAttribute("id", i);
            } else {
                rect.setAttribute("fill", "green");
                rect.setAttribute("id", i);
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
    function displayHoverText(seatNumber) {
        alert(seatNumber);
    }
}
async function editevent(eventid){
        console.log('Event ID:', eventid);
        var eventname = $(`#eventTitle_${eventid}`).val();
        var eventType = $(`#eventType_${eventid}`).val();
        var eventPriceHigh = $(`#eventPriceHigh_${eventid}`).val();
        var eventPriceMiddle = $(`#eventPriceMiddle_${eventid}`).val();
        var eventPriceLow = $(`#eventPriceLow_${eventid}`).val();
        var eventSeatNumber = $(`#eventSeatNumber_${eventid}`).val();
        var eventDateTime = $(`#eventDateTime_${eventid}`).val();
        var eventVenue = $(`#eventVenue_${eventid}`).val();
        var eventDescription = $(`#eventDescription_${eventid}`).val();
        var eventImage = document.querySelector(`input[name="eventImage_${eventid}"]`).files[0];
        var datetimeArray = eventDateTime.split('T');
        console.log(eventname);
        if(!eventname){
            alert("Event name cannot be empty");
        }
        else if(!eventType){
            alert("Event type cannot be empty");
        }
        else if(!eventImage){
            alert("Event Image cannot be empty");
        }
        else if(!eventPriceHigh || !eventPriceMiddle || !eventPriceLow){
            alert("Price cannot be empty");
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
            formdata.append('BookedSeat', eventData.booked);
            formdata.append('uid', eventid);
            fetch(`/auth/api/updateevent/${eventid}`,{
                method:'POST',
                body:formdata
            })
            .then(response => response.json())
            .then(data => {
                if(data.status == 'success'){
                    alert("Edit success")
                } else {
                alert(data.message || 'Unknown error');
                }
            })
            .catch(error => {
                alert(error);
            });
        }
}
function generateTransactionTab(transactions) {
    const tabList = $('#myTab');
    const tabContent = $('#myTabContent');

    // Create Transaction History Tab
    const transactionTab = $(`<li class="nav-item" role="presentation">
                                <button class="nav-link" id="Transaction-tab" data-bs-toggle="tab" data-bs-target="#Transaction" type="button" role="tab" aria-controls="Transaction" aria-selected="false">Transaction History</button>
                             </li>`);
    const transactionTabPane = $(`<div class="tab-pane fade" id="Transaction" role="tabpanel" aria-labelledby="Transaction-tab"></div>`);

    // Populate Transaction History Tab Content
    transactions.forEach((transaction, index) => {
        const transactionDetails = `<p>Transaction ID: ${transaction.username}</p>
                                    <p>Event: ${transaction.eventname}</p>
                                    <p>Date: ${transaction.date}</p>
                                    <p>Price: ${transaction.price}</p>
                                    <hr>`;

        transactionTabPane.append(transactionDetails);
    });

    // Append Transaction History Tab and Content to the DOM
    tabList.append(transactionTab);
    tabContent.append(transactionTabPane);
}
function generateAccountTab(account) {
    const tabList = $('#myTab');
    const tabContent = $('#myTabContent');

    // Create Transaction History Tab
    const accountTab = $(`<li class="nav-item" role="presentation">
                                <button class="nav-link" id="Transaction-tab" data-bs-toggle="tab" data-bs-target="#Account" type="button" role="tab" aria-controls="Account" aria-selected="false">Account</button>
                             </li>`);
    const accountTabPane = $(`<div class="tab-pane fade" id="Account" role="tabpanel" aria-labelledby="Account-tab"></div>`);
    console.log(account);
    // Populate Transaction History Tab Content
    account.forEach((account, index) => {
        const imgTag = account.profileImage
      ? `<img id="userImage" src="${'data:image/jpeg;base64,' + account.profileImage}" alt="User Image" style="max-width: 10%;">`
      : '';
     const loginAttemptDate = new Date(account.loginattempt);

    // Format the date for display
    const formattedDate = loginAttemptDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });

    const changeAttemptDate = new Date(account.change);

    // Format the date for display
    const formattedDatechange = changeAttemptDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });
    const accountDetails = `<div style="overflow: hidden;">
                                <div style="float: left;">
                                    <p>Account name: ${account.username}</p>
                                    <p>Birthday: ${account.birthday}</p>
                                    <p>Gender: ${account.gender}</p>
                                    <p>Nickname: ${account.nickname}</p>
                                    <p>Last login attempt: ${formattedDate}</p>
                                    <p>Last profile/ password change: ${formattedDatechange}</p>
                                </div>
                                ${imgTag}
                            </div>
                            <hr>`;

        accountTabPane.append(accountDetails);
    });

    // Append Transaction History Tab and Content to the DOM
    tabList.append(accountTab);
    tabContent.append(accountTabPane);
}
function filterEvents() {
    const searchTitle = $('#searchTitle').val().toLowerCase();
    const searchDate = $('#searchDate').val();
    const searchTime = $('#searchTime').val();
    const searchVenue = $('#searchVenue').val().toLowerCase();
    const searchDescription = $('#searchDescription').val().toLowerCase();

    const filteredEvents = eventData.filter(event => {
        const titleMatch = event.title.toLowerCase().includes(searchTitle);
        const dateMatch = event.date.includes(searchDate);
        const timeMatch = event.time.includes(searchTime);
        const venueMatch = event.venue.toLowerCase().includes(searchVenue);
        const descriptionMatch = event.description.toLowerCase().includes(searchDescription);

        return titleMatch && dateMatch && timeMatch && venueMatch && descriptionMatch;
    });

    generateEventTabs(filteredEvents);
}
async function cancelEvent(eventID){
    const isConfirmed = window.confirm('Are you sure you want to cancel this event?');

    // Check if the user confirmed
    if (isConfirmed) {
        await fetch(`/auth/api/cancelEvent/${eventID}`,{method:'POST'})
        .then(response => response.json())
        .then(data =>{
            if(data.status === 'success'){
                alert("Event deleted");
            }
        }).catch(error=>{
            alert('Error: '+error);
          })
    } else {
        // The user clicked "Cancel" or closed the dialog, do nothing
        console.log('Event cancellation canceled');
    }
}
