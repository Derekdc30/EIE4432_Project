$(document).ready(function () {
    $(".registrationTab").addClass('hide');
    $.get("assets/Event.json", function (data) {
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
                        <div class="col card m-2 justify-content-center" id="${i}" >
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
                            Failed to fetch drink menu. Please try again later
                    </div>
                    `;
                const cardcontainer = document.createElement("div");
                cardcontainer.innerHTML = card;
                document.getElementById("Event-Dashboard").append(cardcontainer);
        });
        $("#registrationButton").click(function () {
            $(".registrationTab").removeClass('hide').addClass('show');
        });
        $(".close").click(function () {
            $(".registrationTab").removeClass('show').addClass('hide');
        });
    });

    