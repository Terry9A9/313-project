//Init. the search option checkboxes
function clearSearchOption() {
    $("#districtPicker").selectpicker('deselectAll');
    $("#schoolLevelPicker").selectpicker('deselectAll');
    $("#finTypePicker").selectpicker('deselectAll');
    $("#religionPicker").selectpicker('deselectAll');
}

//Handle the .json file
function initialize() {
    var status = "Greetings!";
    if (navigator.onLine) {
        status = "Hello! Please click the setting icon to start search.";
        retrieveschoolData();
    } else {
        const localStorage = window.localStorage;
        if (localStorage) {
            const schoolData = localStorage.getItem("schoolData");
            if (schoolData) {
                displayschoolData(JSON.parse(schoolData));
            }
        }
    }

    document.getElementById("status").innerHTML = status;

    document.body.addEventListener(
        "online",
        function () {
            document.getElementById("status").innerHTML = "Online";
        },
        false
    );
    document.body.addEventListener(
        "offline",
        function () {
            document.getElementById("status").innerHTML = "Offline";
        },
        false
    );
}

function retrieveschoolData() {
    const xhr = new XMLHttpRequest();
    const url = "schoolData11.json";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var schoolData = JSON.parse(xhr.response).schoolData;
            displayschoolData(schoolData);

            // Store data data to localstorage
            const localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem("schoolData", JSON.stringify(schoolData));
            }
        }
    };

    xhr.open("get", url);
    xhr.send();
    
}

function displayschoolData(schoolData) {
    schoolData.forEach(addRow);
}

function addRow(data) {
    var tcontent = document.getElementById("tcontent");
    var row = tcontent.insertRow();
    var levelCell = row.insertCell();
    var nameCell = row.insertCell();
    var districtCell = row.insertCell();
    var ftCell = row.insertCell();
    var genderCell = row.insertCell();
    var webpCell = row.insertCell();

    levelCell.setAttribute('data-label', "School Level");
    levelCell.innerHTML = data.Y;

    nameCell.setAttribute('data-label', "School Name");
    nameCell.innerHTML = data.E;

    districtCell.setAttribute('data-label', "School District");
    districtCell.innerHTML = data.U;

    ftCell.setAttribute('data-label', "School Finicial Type");
    ftCell.innerHTML = data.W;

    genderCell.setAttribute('data-label', "students Gender");
    genderCell.innerHTML = data.Q;

    webpCell.setAttribute('data-label', "School Webpage");
    webpCell.innerHTML = "<a href='" + data.AE + "'>網頁</a>";

}

function filter(data) {
    //To get the pickers value to do filtering
    var dpval = $("#districtPicker").val();
    var slpval = $("#schoolLevelPicker").val();
    var ftpval = $("#finTypePicker").val();
    var rpval = $("#religionPicker").val();

    console.log(`Picker Value: ${dpval},${slpval},${ftpval},${rpval}`);

    //filter
    var filteredResult = Object.values(data).filter(
        schoolData =>
            schoolData.U == dpval &&
            schoolData.Y == slpval &&
            schoolData.W == ftpval &&
            schoolData.AG == rpval
    );

    console.log(`length: ${filteredResult.length}`);

    if (filteredResult.length !== 0) {
        //show filtered list
        document.getElementById("filteredTable").classList.remove("d-none");
        //hide original list
        document.getElementById("originalTable").classList.add("d-none");
        //Show result message
        document.getElementById("status").innerHTML = filteredResult.length + " RESULT FOUND!!!";

        //to clear the filter result list
        $("#filteredTable tr").remove();

        for (var i = 0; i < filteredResult.length; i++) {
            console.log(`${i}th result:
            ${filteredResult[i].Y},
            ${filteredResult[i].E},            
            ${filteredResult[i].U},
            ${filteredResult[i].W},
            ${filteredResult[i].AE}`);

            //Add new results to rows
            var filteredContent = document.getElementById("filteredContent");
            var row = filteredContent.insertRow();
            var levelCell = row.insertCell();
            var nameCell = row.insertCell();
            var districtCell = row.insertCell();
            var ftCell = row.insertCell();
            var genderCell = row.insertCell();
            var webpCell = row.insertCell();

            levelCell.setAttribute('data-label', "School Level");
            levelCell.innerHTML = filteredResult[i].Y;

            nameCell.setAttribute('data-label', "School Name");
            nameCell.innerHTML = filteredResult[i].E;

            districtCell.setAttribute('data-label', "School District");
            districtCell.innerHTML = filteredResult[i].U;

            ftCell.setAttribute('data-label', "School Finicial Type");
            ftCell.innerHTML = filteredResult[i].W;

            genderCell.setAttribute('data-label', "Students Gender");
            genderCell.innerHTML = filteredResult[i].Q;

            webpCell.setAttribute('data-label', "School Webpage");
            webpCell.innerHTML = "<a href='" + filteredResult[i].AE + "'>網頁</a>";
        }
    } else {
        //If No result found, show the original list and show message
        document.getElementById("originalTable").classList.remove("d-none");
        document.getElementById("filteredTable").classList.add("d-none");

        document.getElementById("status").innerHTML = "NO RESULT FOUND!!! Now showing the full list";
    }
}

//To get the data and do the filtering
function getData() {
    const localStorage = window.localStorage;
    if (localStorage) {
        const schoolData = localStorage.getItem("schoolData");
        if (schoolData) {
            var parsedData = JSON.parse(schoolData);
            filter(parsedData);
        }
    }
}

$(document).ready(function () {
    //SearchBar function
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#originalTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        $("#filteredTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#scroll').fadeIn();
        } else {
            $('#scroll').fadeOut();
        }
    });
    $('#scroll').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });    

    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
       isClosed = false;
  
      trigger.click(function () {
        hamburger_cross();      
      });
  
      function hamburger_cross() {
  
        if (isClosed == true) {          
          overlay.hide();
          trigger.removeClass('is-open');
          trigger.addClass('is-closed');
          isClosed = false;
        } else {   
          overlay.show();
          trigger.removeClass('is-closed');
          trigger.addClass('is-open');
          isClosed = true;
        }
    }
    
    $('[data-toggle="offcanvas"]').click(function () {
          $('#wrapper').toggleClass('toggled');
    });  

    $('#originalTable').dataTable( {
        "ajax": "./schoolData11.json",
        "columns": [
            { data: 'Y', title: "學校類型"},
            { data: "E", title: "名稱"},
            { data: "U", title: "分區"},
            { data: "W", title: "資助種類"},
            { data: "Q", title: "就讀學生性別"},
        ],
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        responsive: true,
    } );

});

