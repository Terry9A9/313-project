$(document).ready(function () {

    var table = $('#originalTable').dataTable({
        "ajax": "./schoolData11.json",
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        rowReorder: false,
        responsive: true,

        initComplete: function () {

            var cols = [1, 2, 3, 4]
            this.api().columns(cols).every(function () {
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
            cols.forEach(col => {
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
            {
                data: "E", title: "名稱"
            },
            { data: "U", title: "分區" },
            { data: "W", title: "資助種類" },
            { data: "Q", title: "就讀性別" },
            { data: 'Y', title: "類型" },
            {
                data: "AE", title: "URL",
                render: function (data, type) {
                    if (type === 'display') {
                        let link = "Website";
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
        
    });
});

