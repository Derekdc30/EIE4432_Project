$(document).ready(function () {
    for(let i =0; i<40; i++)
            {
                const card=`
                <div class="container" style="text-align: center;">
                    <svg width="400" height="180">
                        <rect x="50" y="20" rx="20" ry="20" width="150" height="150"
                        style="fill:red;stroke:black;stroke-width:5;opacity:0.5" />
                        <text x="350" y="50">${i}</text>
                    </svg>
                </div>
                    `;
                const cardcontainer = document.createElement("div");
                cardcontainer.innerHTML = card;
                divcontainer.append(cardcontainer);
            }
            document.getElementById("seat").append(divcontainer);
});