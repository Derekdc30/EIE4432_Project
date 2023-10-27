$(document).ready(function () {
    displayseat();
});
function displayseat(){
    var svgCircle = document.getElementById("svg");
    let y= 50;
    let x = 50; 
    var NS = "http://www.w3.org/2000/svg";
    for(let i =1; i<=40; i++)
    {
        var rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 30);
        rect.setAttribute("height", 30);
        rect.setAttribute("stroke", "gray");
        rect.setAttribute("strokeWidth", 5);
        rect.setAttribute("fill", "white");
        rect.setAttribute("id",i);
        rect.addEventListener("click", handleClick);
        svgCircle.appendChild(rect);

        var text = document.createElementNS(NS, "text");
        text.setAttribute("x",(x+15));
        text.setAttribute("y",(y+20));
        text.setAttribute("text-anchor", "middle")
        text.textContent=i;
        svgCircle.appendChild(text);
        
        x+=50;
        if(i%10==0){
            y+=50;
            x=50;
        }
    }
}

function handleClick(event) {
    var rectID = event.target.getAttribute("id");
    console.log(rectID);
  }