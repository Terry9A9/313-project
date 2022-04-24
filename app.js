let file_url, nearSchoolApi, map, layer,marker;
const file_name = "schoolData";

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
    document.getElementById("nearSchoolbtn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
    const response = await fetch(nearSchoolApi);
    let data = await response.json();
    var bounds = new L.latLngBounds()
    data["results"].forEach(school => {
        marker = L.marker(school["lat-long"]);
        prevName = school["name-zh"]
        marker.bindTooltip(school["name-zh"], {
            direction: 'bottom',
            sticky: true,
            permanent: false,
            opacity: 1.0
        }).openTooltip();
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
    var selected = [];
    var table = $('#nearDataTable').DataTable({
        select : true,
        "autoWidth": false,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        "rowCallback": function( row, data ) {
            if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                $(row).addClass('selected');
            }
        },
        rowReorder: false,
        responsive: true,
        data: data["results"],
        "columns": [
            { data: "name-zh", title: "名稱" },
            { data: "district-zh", title: "分區" },
            { data: "finance-type-zh", title: "資助" },
            { data: "student-gender-zh", title: "就讀性別" },
            { 
                data: "level-zh", title: "類型",
                render: function (data, type , row) {
                    return `${data} <a href="#" onclick="moveMap(${row['lat-long'][0]},${row['lat-long'][1]},'${row["name-zh"]}')">
                    <i class="fas fa-map-marked-alt"></i>
                    </a>`
                }
            },
            { 
                data: "address-zh", title: "地址",
                render: function (data, type , row) {
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
        ],
        "columnDefs": [
            {
                targets: [0],
                responsivePriority: 0,
            },
            {
                targets: [1],
                responsivePriority: 1000,
            },
            {
                targets: [2],
                responsivePriority: 1000,
            },
            {
                targets: [3],
                responsivePriority: 1000,
            },
            {
                targets: [4],
                responsivePriority: 0,
            },
            {
                targets: [5],
                responsivePriority: 1000,
            },
            {
                targets: [6],
                responsivePriority: 1000,
            },
            {
                targets: [7],
                responsivePriority: 1000,
            },
            {
                targets: [8],
                responsivePriority: 1000,
            },
        ],
        initComplete: function () {
            var filter_cols = [1, 2, 3, 4, 6, 7]
            this.api().columns(filter_cols).every(function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo($(column.footer()).empty())
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
        },
    })  
}

function moveMap(lat,long,name){
    $("#modal-fullscreen-sm").scrollTop(0);
    map.setView([lat,long],20)
    marker.bindTooltip(name).openTooltip([lat,long])
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

    layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    document.getElementById("nearSchoolbtn").disabled = false
    document.getElementById("nearSchoolbtn").textContent = `附近的學校`
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

    getData().then(function () {
        console.log("[DataTable] loading dataTable")
        $('#originalTable').dataTable({
            "pagingType": "simple",
            "autoWidth": false,
            "language": {
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
            },
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
                var filter_cols = [1, 2, 3, 4, 6, 7]
                this.api().columns(filter_cols).every(function () {
                    var column = this;
                    var select = $('<select><option value=""></option></select>')
                        .appendTo($(column.footer()).empty())
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
                filter_cols.forEach(col => {
                    this.api().columns(col).every(function () {
                        var column = this;
                        var select = $('<select><option value=""></option></select>')
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
            "columns": [
                { data: "E", title: "名稱" },
                { data: "U", title: "分區" },
                { data: "W", title: "資助種類" },
                { data: "Q", title: "就讀性別" },
                { data: "Y", title: "類型" },
                {
                    data: "G", title: "地址",
                    render: function (data, type, row) {
                        return `${data} <button class="btn btn-primary btn-open-modal" data-toggle="modal" data-target="#modal-fullscreen-sm" id="mapButton" value="${row.E}" onclick=createMap(${row.K},${row.I},this.value)>Map</button>`
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
                },
                { data: "K", title: "lat" },
                { data: "I", title: "long" }
            ],
            "columnDefs": [
                { "visible": false, "targets": [9] },
                { "visible": false, "targets": [10] }
            ]
        })
    })
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > 100) { 
            $('#scroll').fadeIn(); 
        } else { 
            $('#scroll').fadeOut(); 
        } 
    }); 
    $('#scroll').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    }); 
});

