app.controller('MainCtrl', function($scope) {

    var d = new Date();
    var n = d.getMonth();
 
    $scope.months = [
        { id: 'Jan', label:'January'},
        { id: 'Feb', label:'February'},
        { id: 'Mar', label:'March'},
        { id: 'Apr', label:'April'},
        { id: 'May', label:'May'},
        { id: 'Jun', label:'June'},
        { id: 'Jul', label:'July'},
        { id: 'Aug', label:'August'},
        { id: 'Sep', label:'September'},
        { id: 'Oct', label:'October'},
        { id: 'Nov', label:'November'},
        { id: 'Dec', label:'December'}
    ];
    
    $scope.currMonth = $scope.months[n];
});