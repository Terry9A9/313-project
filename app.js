let file_url, nearSchoolApi, map, layer, marker, mainTableCol, tableLang, nearSchCol;
const file_name = "schoolData";

function changeEn(language) {
    const localStorage = window.localStorage;
    if (localStorage) {
        localStorage.setItem('language', language);
    }
    document.getElementById("chineseBtn").className = "nav-link";
    document.getElementById("englishBtn").className = "nav-link active";
    location.reload();
}

function changeZh(language) {
    const localStorage = window.localStorage;
    if (localStorage) {
        localStorage.setItem('language', language);
    }
    document.getElementById("chineseBtn").className = "nav-link active";
    document.getElementById("englishBtn").className = "nav-link ";
    location.reload();
}

let language = localStorage.getItem("language")

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        document.getElementById("btn-back-to-top").style.display = "block";
    } else {
        document.getElementById("btn-back-to-top").style.display = "none";
    }
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

async function fetchNearSchoolMap() {

    var org = document.getElementById("nearSchoolbtn").innerHTML
    if(language == "en"){
        document.getElementById("nearSchoolbtn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
    }else{
        document.getElementById("nearSchoolbtn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 載入中...'
    }
    
    const response = await fetch(nearSchoolApi);
    let data = await response.json();
    console.log(data)
    var bounds = new L.latLngBounds()
    data["results"].forEach(school => {
        marker = L.marker(school["lat-long"]);
        if (language == 'en') {
            prevName = school["name-en"]
            marker.bindTooltip(school["name-en"], {
                direction: 'bottom',
                sticky: true,
                permanent: false,
                opacity: 1.0
            }).openTooltip();
        }else{
            prevName = school["name-zh"]
            marker.bindTooltip(school["name-zh"], {
                direction: 'bottom',
                sticky: true,
                permanent: false,
                opacity: 1.0
            }).openTooltip();
        }

        marker.addTo(map)
        bounds.extend(school["lat-long"])
    });
    map.fitBounds(bounds)
    document.getElementById("nearSchoolbtn").innerHTML = org
    document.getElementById("nearSchoolbtn").disabled = true
    let html =
        `<div>
        <br/>
        <table id="nearDataTable" class="table table-striped table-hover table-scroll">
            <thead>
            <tr>
                <th>名稱</th>
                <th></th>
                <th>分區</th>
                <th>資助種類</th>
                <th>就讀性別</th>
                <th>類型</th>
                <th>地址</th>
                <th>授課時間</th>
                <th>宗教</th>
                <th>URL</th>
            </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>名稱</th>
                    <th></th>
                    <th>分區</th>
                    <th>資助種類</th>
                    <th>就讀性別</th>
                    <th>類型</th>
                    <th>地址</th>
                    <th>授課時間</th>
                    <th>宗教</th>
                    <th>URL</th>
                </tr>
            </tfoot>
        </table>
    </div>`
    document.getElementsByClassName("modal-body")[0].insertAdjacentHTML("beforeend", html)
    $('#nearDataTable').DataTable({
        autoWidth: false,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        rowReorder: false,
        "language": tableLang,
        responsive: true,
        data: data["results"],
        "columns": nearSchCol,
        "columnDefs": [
            {
                targets: [2],
                className: 'none',
            },
            {
                targets: [3],
                className: 'none',
            },
            {
                targets: [4],
                className: 'none',
            },
            {
                targets: [5],
                className: 'none',
            },
            {
                targets: [6],
                className: 'none',
            },
            {
                targets: [7],
                className: 'none',
            },
            {
                targets: [8],
                className: 'none',
            },
            {
                targets: [9],
                className: 'none',
            },
        ]
    })
}

function moveMap(lat, long, name) {
    $("#modal-fullscreen-sm").scrollTop(0);
    map.setView([lat, long], 20)
    marker.bindTooltip(name).openTooltip([lat, long])

}

function createMap(lat, long, name) {

    let lat_long = [lat, long]
    //reset map
    document.getElementsByClassName('modal-body')[0].innerHTML = "<div id='map'></div>";
    document.getElementsByClassName('modal-title')[0].innerHTML = name
    var mapOptions = {
        center: lat_long,
        zoom: 18
    }
    // Creating a map object
    map = new L.map('map', mapOptions);
    // Creating a Layer object

    layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    });
    // Adding layer to the map
    map.addLayer(layer);

    // Creating a marker
    var marker = L.marker(lat_long);
    // Adding marker to the map
    marker.addTo(map);
    $('#modal-fullscreen-sm').on('shown.bs.modal', function () {
        map.invalidateSize();
    });
    if (navigator.onLine) {
        document.getElementById("nearSchoolbtn").disabled = false

    } else {
        document.getElementById("nearSchoolbtn").disabled = true
        var networkHtml

        if(language == "en"){
            networkHtml = "<div><br/><p>You are currently offline, Map function is disabled</p></div>"
        }else{
            networkHtml = "<div><br/><p>您當前處於離線狀態，地圖功能已禁用</p></div>"
        }
        
        document.getElementsByClassName("modal-body")[0].insertAdjacentHTML("beforeend", networkHtml)
    }
    // document.getElementById("nearSchoolbtn").textContent = `附近的學校`
    nearSchoolApi = `https://api.data.gov.hk/v1/nearest-schools?lat=${lat}&long=${long}&max=10`
}

if (!navigator.onLine) {
    //if offline
    console.log("[Offline]")
    file_url = function (data, callback, settings) {
        callback(
            JSON.parse(localStorage.getItem(file_name))
        );
    }
    function getData() {
        const xhr = new XMLHttpRequest();
        const url = "schoolData.json";
        return new Promise(function (resolve, reject) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var schoolData = JSON.parse(xhr.response);
                    // Store cached data to local storage, let dataTable use in offline mode
                    const localStorage = window.localStorage;
                    if (localStorage) {
                        localStorage.setItem(file_name, JSON.stringify(schoolData));
                        console.log('[Offline][Promise] ' + url + ' stored in localStorage')
                    }
                    console.log("[Offline] DataTable is using localStorage"),
                        resolve();
                }
            };
            xhr.open("get", url, true);
            xhr.send();
        });
    }
} else {
    //if online
    console.log("[Online]")
    file_url = "schoolData.json"
    function getData() {
        return new Promise(function (resolve, reject) {
            resolve();
        })
    }
}

$(document).ready(function () {
    if (language == 'en') {
        document.getElementById("chineseBtn").className = "nav-link";
        document.getElementById("englishBtn").className = "nav-link active";
        document.getElementsByClassName("searchLabel")[0].textContent = "District:";
        document.getElementsByClassName("searchLabel")[1].textContent = "Finance Type:";
        document.getElementsByClassName("searchLabel")[2].textContent = "Students Gender:";
        document.getElementsByClassName("searchLabel")[3].textContent = "School Type:";
        document.getElementsByClassName("searchLabel")[4].textContent = "Session:";
        document.getElementsByClassName("searchLabel")[5].textContent = "Religion:";
        document.getElementById("nearSchoolbtn").textContent = `Nearest School`;
        document.getElementById("closeBtn").textContent = "Close";
        document.getElementsByClassName("navbar-brand")[0].innerHTML = `<img class="logo" src="icons/ios/512.png"
        height="40"> Find School</a>`

        mainTableCol = [
            {
                data: "D", title: "NAME",
                render: function (data, type, row) {
                    if ("男" == row.Q) {
                        return `<i class="fa-solid fa-child"></i> ${data}`
                    }
                    else if ("女" == row.Q) {
                        return `<i class="fa-solid fa-child-dress"></i> ${data}`
                    }
                    else if ("男女" == row.Q) {
                        return `<i class="fa-solid fa-child-dress"></i><i class="fa-solid fa-child"></i> ${data}`
                    } else {
                        return `${data}`
                    }
                }
            },
            { data: "T", title: "DISTRICT" },
            { data: "V", title: "FINANCE TYPE" },
            { data: "P", title: "STUDENTS GENDER" },
            { data: "X", title: "SCHOOL LEVEL" },
            {
                data: "F", title: "ENGLISH ADDRESS",
                render: function (data, type, row) {
                    return `${data} <button class="btn btn-primary btn-open-modal" data-toggle="modal" data-target="#modal-fullscreen-sm" id="mapButton" value="${row.D}" onclick=createMap(${row.K},${row.I},this.value)><i class="fas fa-map-marked-alt"></i></button>`
                }
            },
            { data: "R", title: "SESSION" },
            { data: "AF", title: "RELIGION" },
            {
                data: "AD", title: "WEBSITE",
                render: function (data, type) {
                    if (type === 'display') {
                        if (data.length <= 0) {
                            return 'No Web Site';
                        }
                        else {
                            return '<a href="' + data + '">' + "Website" + '</a>';
                        }
                    }
                    return data;
                }
            }]
        tableLang = {}

        nearSchCol = [
            {
                data: "name-en", title: "NAME",
                render: function (data, type, row) {
                    if ("男" == row["student-gender-zh"]) {
                        return ` <i class="fa-solid fa-child"></i> ${data}`
                    }
                    else if ("女" == row["student-gender-zh"]) {
                        return `<i class="fa-solid fa-child-dress"></i> ${data} `
                    }
                    else if ("男女" == row["student-gender-zh"]) {
                        return `<i class="fa-solid fa-child-dress"></i><i class="fa-solid fa-child"></i> ${data} `
                    }
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<a href="#" onclick="moveMap(${row['lat-long'][0]},${row['lat-long'][1]},'${row["name-en"]}')">
                    <i class="fas fa-map-marked-alt"></i>
                    </a>`
                }
            },
            { data: "district-en", title: "DISTRICT" },
            { data: "finance-type-en", title: "FINANCE TYPE" },
            { data: "student-gender-en", title: "GENDER" },
            {
                data: "level-en", title: "LEVEL"
            },
            {
                data: "address-en", title: "ADDRESS",
                render: function (data, type, row) {
                    return `${data} <a href="#" onclick="moveMap(${row['lat-long'][0]},${row['lat-long'][1]},'${row["name-en"]}')">
                    <i class="fas fa-map-marked-alt"></i>
                    </a>`
                }
            },
            { data: "session-en", title: "SESSION" },
            { data: "religion-en", title: "RELIGION" },
            {
                data: "website", title: "URL",
                render: function (data, type) {
                    if (type === 'display') {
                        if (data.length <= 0) {
                            return 'No Web Site';
                        }
                        else {
                            return '<a href="' + data + '">' + "Website" + '</a>';
                        }
                    }
                    return data;
                }
            }
        ]
    } else {
        document.getElementById("chineseBtn").className = "nav-link active";
        document.getElementById("englishBtn").className = "nav-link ";
        document.getElementById("nearSchoolbtn").textContent = `附近的學校`;
        document.getElementById("closeBtn").textContent = "關閉";
        document.getElementsByClassName("navbar-brand")[0].innerHTML = `<img class="logo" src="https://img.icons8.com/color/452/school-building.png"
        height="40"> 尋找學校</a>`
        mainTableCol = [
            {
                data: "E", title: "名稱",
                render: function (data, type, row) {
                    if ("男" == row.Q) {
                        return `<i class="fa-solid fa-child"></i> ${data}`
                    }
                    else if ("女" == row.Q) {
                        return `<i class="fa-solid fa-child-dress"></i> ${data}`
                    }
                    else if ("男女" == row.Q) {
                        return `<i class="fa-solid fa-child-dress"></i><i class="fa-solid fa-child"></i> ${data}`
                    } else {
                        return `${data}`
                    }
                }
            },
            { data: "U", title: "分區" },
            { data: "W", title: "資助種類" },
            { data: "Q", title: "就讀性別" },
            { data: "Y", title: "類型" },
            {
                data: "G", title: "地址",
                render: function (data, type, row) {
                    return `${data} <button class="btn btn-primary btn-open-modal" data-toggle="modal" data-target="#modal-fullscreen-sm" id="mapButton" value="${row.E}" onclick=createMap(${row.K},${row.I},this.value)><i class="fas fa-map-marked-alt"></i></button>`
                }
            },
            { data: "S", title: "授課時間" },
            { data: "AG", title: "宗教" },
            {
                data: "AE", title: "URL",
                render: function (data, type) {
                    if (type === 'display') {
                        if (data.length <= 0) {
                            return 'No Web Site';
                        }
                        else {
                            return '<a href="' + data + '">' + "Website" + '</a>';
                        }
                    }
                    return data;
                }
            }
        ]
        tableLang = {
            "lengthMenu": "每頁顯示 _MENU_ 條",
            "zeroRecords": "沒有資料",
            "info": "顯示第 _PAGE_ 頁，共 _PAGES_ 頁",
            "infoEmpty": "沒有可用的記錄",
            "infoFiltered": "(從 _MAX_ 條記錄中過濾)",
            "processing": "處理中...",
            "loadingRecords": "正在加載...",
            "search": "搜尋",
            "paginate": {
                "next": "下一頁",
                "previous": "上一頁"
            },
        }
        nearSchCol = [
            {
                data: "name-zh", title: "名稱",
                render: function (data, type, row) {
                    if ("男" == row["student-gender-zh"]) {
                        return ` <i class="fa-solid fa-child"></i> ${data}`
                    }
                    else if ("女" == row["student-gender-zh"]) {
                        return `<i class="fa-solid fa-child-dress"></i> ${data} `
                    }
                    else if ("男女" == row["student-gender-zh"]) {
                        return ` <i class="fa-solid fa-child-dress"></i><i class="fa-solid fa-child"></i> ${data}`
                    }
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<a href="#" onclick="moveMap(${row['lat-long'][0]},${row['lat-long'][1]},'${row["name-zh"]}')">
                    <i class="fas fa-map-marked-alt"></i>
                    </a>`
                }
            },
            { data: "district-zh", title: "分區" },
            { data: "finance-type-zh", title: "資助" },
            { data: "student-gender-zh", title: "就讀性別" },
            {
                data: "level-zh", title: "類型"
            },
            {
                data: "address-zh", title: "地址",
                render: function (data, type, row) {
                    return `${data} <a href="#" onclick="moveMap(${row['lat-long'][0]},${row['lat-long'][1]},'${row["name-zh"]}')">
                    <i class="fas fa-map-marked-alt"></i>
                    </a>`
                }
            },
            { data: "session-zh", title: "授課時間" },
            { data: "religion-zh", title: "宗教" },
            {
                data: "website", title: "URL",
                render: function (data, type) {
                    if (type === 'display') {
                        if (data.length <= 0) {
                            return 'No Web Site';
                        }
                        else {
                            return '<a href="' + data + '">' + "Website" + '</a>';
                        }
                    }
                    return data;
                }
            }
        ]
    }
    getData().then(mainTable())
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

});

function mainTable() {
    console.log("[DataTable] loading dataTable")
    $('#originalTable').dataTable({
        "pagingType": "simple",
        "autoWidth": false,
        "language": tableLang,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        rowReorder: false,
        responsive: true,
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 }
        ],
        "deferRender": true,
        ajax: file_url,
        initComplete: function () {
            var filter_cols = [1, 2, 7, 4, 6, 3]
            filter_cols.forEach(col => {
                this.api().columns(col).every(function () {
                    var column = this;
                    var select = $('<select  class="form-select" aria-label="Default select" style="width:100%; padding: 2px;"><option value=""></option></select>')
                        .appendTo($("#mobile-filter" + col))
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );

                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });

                    column.data().unique().sort().each(function (d, j) {
                        select.append('<option value="' + d + '">' + d + '</option>')
                    });
                });
            });
        },
        "columns": mainTableCol,
        "columnDefs": [
            {
                targets: [1],
                className: 'none',
            },
            {
                targets: [3],
                className: 'none',
            },
            {
                targets: [4],
                className: 'none',
            },
            {
                targets: [5],
                className: 'none',
            },
            {
                targets: [7],
                className: 'none',
            },
            {
                targets: [8],
                className: 'none',
            }
        ]
    })
    $("html, body").animate({ scrollTop: 0 }, 600);
}
