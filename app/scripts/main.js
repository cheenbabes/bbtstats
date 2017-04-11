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


    //get the CSV
    $.get("scripts/bbt.csv", function(data){
        $scope.objs = $.csv.toObjects(data);
        calculateStats($scope.objs);
        $scope.$apply();
    })

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
            //console.log($scope.objs[j]);
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