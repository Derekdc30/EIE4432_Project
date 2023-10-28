$(document).ready(function () {
    displayseat();
});
function displayseat(){
    var svgCircle = document.getElementById("svg");
    let y= 0;
    let x = 0; 
    var NS = "http://www.w3.org/2000/svg";
    for(let i =1; i<=60; i++)
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
    console.log(rectID);
    $(".booking-form").removeClass("d-none");
    $(".info").addClass("d-none");
    $("#reset").click(function(){
        $(".booking-form").addClass("d-none");
        $(".info").removeClass("d-none");
    });
    $("#Payment_Proceed").click(function(){
        var option = document.getElementsByName("Payment_Method");
        for (i = 0; i < option.length; i++) {
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
}