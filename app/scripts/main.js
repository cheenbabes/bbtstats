app.controller('MainCtrl', function ($scope) {

    var d = new Date();
    var n = d.getMonth();

    $scope.months = [
        {
            id: 'Jan',
            label: 'January',
            num: 1
        },
        {
            id: 'Feb',
            label: 'February',
            num: 2
        },
        {
            id: 'Mar',
            label: 'March',
            num: 3
        },
        {
            id: 'Apr',
            label: 'April',
            num: 4
        },
        {
            id: 'May',
            label: 'May',
            num: 5
        },
        {
            id: 'Jun',
            label: 'June',
            num: 6
        },
        {
            id: 'Jul',
            label: 'July',
            num: 7
        },
        {
            id: 'Aug',
            label: 'August',
            num: 8
        },
        {
            id: 'Sep',
            label: 'September',
            num: 9
        },
        {
            id: 'Oct',
            label: 'October',
            num: 10
        },
        {
            id: 'Nov',
            label: 'November',
            num: 11
        },
        {
            id: 'Dec',
            label: 'December',
            num: 12
        }
    ];

    $scope.currMonth = $scope.months[n];
    $scope.monthYear = $scope.currMonth.id + '2017';

    $scope.monthPerc = $scope.currMonth.id + 'Perc';
    $scope.monthMOM = $scope.currMonth.id + 'MOM';



    $scope.updateMonth = function () {
        $scope.monthYear = $scope.currMonth.id + '2017';
        $scope.monthPerc = $scope.currMonth.id + 'Perc';
        $scope.monthMOM = $scope.currMonth.id + 'MOM';

        //calc month totals
        //total remittance for month and # of temples who submitted scores and percentage of temples who submitted

        $scope.currMonthRemittance = 0;
        $scope.currMonthSubmitted = 0;
        $scope.currMonthNotSubmitted = 0;
        $scope.currMonthMetGoal = 0;
        $scope.currMonthLessThan20 = 0;
        
        console.log("calling updateMonth with" + $scope.currMonth.id);
        for (var j = 0; j < $scope.objs.length; j++) {
            console.log($scope.objs[j]);
            if ($scope.objs[j][$scope.monthYear] == 0) {
                $scope.currMonthNotSubmitted++;
            } else {
                $scope.currMonthSubmitted++;
            }

            if ($scope.objs[j][$scope.monthPerc] > 0.95) {
                $scope.currMonthMetGoal++;
            } else if ($scope.objs[j][$scope.monthPerc] < 20 && $scope.objs[j][$scope.monthPerc] != 0) {
                $scope.currMonthLessThan20++;
            }
        }

        $scope.currMonthRemittance = $scope.objs.reduce(function (i, score) {
            return i + Number(score[$scope.monthYear]);
        }, 0)
    }

    $scope.getProgressBarClass = function (perc) {
        if (perc <= 0.25) {
            return "progress-bar-danger";
        } else if (perc > 0.25 && perc <= 0.50) {
            return "progress-bar-warning";
        } else if (perc > 0.50 && perc <= 0.85) {
            return "progress-bar-default";
        } else {
            return "progress-bar-success";
        }
    }

    $scope.selectedOrder = "Total";
    $scope.isReversed = true;

    $scope.orderUpdate = function () {
        //console.log("selectedOrder:" + $scope.selectedOrder);
    }

    if (isAPIAvailable()) {
        $('#files').bind('change', handleFileSelect);
    }


    function isAPIAvailable() {
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            return true;
        } else {
            // source: File API availability - http://caniuse.com/#feat=fileapi
            // source: <output> availability - http://html5doctor.com/the-output-element/
            document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
            // 6.0 File API & 13.0 <output>
            document.writeln(' - Google Chrome: 13.0 or later<br />');
            // 3.6 File API & 6.0 <output>
            document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
            // 10.0 File API & 10.0 <output>
            document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
            // ? File API & 5.1 <output>
            document.writeln(' - Safari: Not supported<br />');
            // ? File API & 9.2 <output>
            document.writeln(' - Opera: Not supported');
            return false;
        }
    }

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var file = files[0];

        // read the file metadata
        var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

        // read the file contents
        printTable(file);

        // post the results
        $('#list').append(output);
    }

    function printTable(file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            var csv = event.target.result;
            var data = $.csv.toArrays(csv);
            //console.log(data);
            $scope.objs = $.csv.toObjects(csv);
            calculateStats($scope.objs);
            //console.log($scope.objs);
            //            var html = '';
            //            for (var row in data) {
            //                html += '<tr>\r\n';
            //                for (var item in data[row]) {
            //                    html += '<td>' + data[row][item] + '</td>\r\n';
            //                }
            //                html += '</tr>\r\n';
            //            }
            //            $('#contents').html(html);
            $scope.$apply();
        };
        reader.onerror = function () {
            alert('Unable to read ' + file.fileName);
        };
    }

    function calculateStats(arr) {
        $scope.zeroRemittance = 0;
        $scope.metGoal = 0;
        $scope.onTrack = 0;
        $scope.behind = 0;

        for (var i = 0; i < arr.length; i++) {
            //console.log(arr[i]);
            arr[i]["Goal2017"] = Number(arr[i]["Goal2017"]);
            arr[i]["2016"] = Number(arr[i]["2016"])
            arr[i]["Monthly2017"] = Number(arr[i]["Monthly2017"])
            arr[i]["Jan2017"] = Number(arr[i]["Jan2017"]);
            arr[i]["Feb2017"] = Number(arr[i]["Feb2017"]);
            arr[i]["Mar2017"] = Number(arr[i]["Mar2017"]);
            arr[i]["Apr2017"] = Number(arr[i]["Apr2017"]);
            arr[i]["May2017"] = Number(arr[i]["May2017"]);
            arr[i]["Jun2017"] = Number(arr[i]["Jun2017"]);
            arr[i]["Jul2017"] = Number(arr[i]["Jul2017"]);
            arr[i]["Aug2017"] = Number(arr[i]["Aug2017"]);
            arr[i]["Sep2017"] = Number(arr[i]["Sep2017"]);
            arr[i]["Oct2017"] = Number(arr[i]["Oct2017"]);
            arr[i]["Nov2017"] = Number(arr[i]["Nov2017"]);
            arr[i]["Dec2017"] = Number(arr[i]["Dec2017"]);
            arr[i]["Total"] = Number(arr[i]["Total"]);

            if (arr[i]["Total"] == 0) {
                $scope.zeroRemittance++;
            }
            if (arr[i]["PercYear"] >= 1) {
                $scope.metGoal++;
            }
            if (arr[i]["PercYear"] <= ((n + 1) / 12) && arr[i]["PercYear"] >= ((n - 1) / 12)) {
                $scope.onTrack++;
            }
            if (arr[i]["PercYear"] <= ((n - 2) / 12)) {
                $scope.behind++;
            }


        }

        $scope.totalRemittance = arr.reduce(function (i, score) {
            return i + parseInt(score.Total);
        }, 0);

        $scope.totalRemittancePercent = $scope.totalRemittance / 2264213;
    }



});