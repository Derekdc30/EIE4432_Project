$(document).ready(function () {
    displayseat();
});
function displayseat(){
    var svgCircle = document.getElementById("svg");
    let y= 50;
    let x = 50; 
    var NS = "http://www.w3.org/2000/svg";
    for(let i =1; i<=80; i++)
    {
        var rect = document.createElementNS(NS, "rect");
        console.log(rect);
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 30);
        rect.setAttribute("height", 30);
        rect.setAttribute("stroke", "green");
        rect.setAttribute("strokeWidth", 4);
        rect.setAttribute("fill", "yellow");
        rect.setAttribute("id",i);
        rect.addEventListener("click", handleClick);
        svgCircle.appendChild(rect);
        x+=50;
        if(i%10==0){
            y+=50;
            x=50;
        }
    }
}

function handleClick(event) {
    var rectID = event.target.id; // Retrieve the ID of the clicked rect
    alert("Clicked rect ID:", rectID);
  }