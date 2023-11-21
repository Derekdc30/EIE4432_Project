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
                                <div class="d-flex d-inline">
                                    <p class="px-3 mx-5" style="background-color: #ffffff;">Highest Price</p>
                                    <p class="px-3 mx-5" style="background-color: #caca21;">Middle Price</p>
                                    <p class="px-3 mx-5" style="background-color: #279e27;">Lowest Price</p>
                                    <p class="px-3 mx-5" style="background-color: #d33157;">Not available</p>
                                </div>
                                <svg id="svg-text" width="500" height="110">
                                    <rect width="200" height="60" style="fill:rgb(149, 149, 196);stroke-width:3;stroke:rgb(0,0,0)" />
                                    <text x="60" y="40" class="h3">Stage</text>
                                </svg>
                                <svg id="svg-${index}" width="1000" height="${event.seatnumber*50}" xmlns="http://www.w3.org/2000/svg"></svg>
                             </div>`);

            tabList.append(tab);
            tabContent.append(tabPane);
            displaySeatMap(`svg-${index}`,event.seatnumber,event.booked)
        });
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
        if(booked.includes(i.toString())){
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