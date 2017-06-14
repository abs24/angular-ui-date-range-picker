angular.module("materialDateRange",["ui-bootstrap"]).directive('materialDateRange', ['$http', '$position', '$document', '$timeout', 'dateFilter', '$window', function ($http, $position, $document, $timeout, dateFilter, $window) {
    
    return {
        restrict: 'A',
       
        scope: {
            settings: '='
        },
        templateUrl:"assets/ng-ui/template/material-date-range.html",
        link: function (scope, element, attr) {
            scope.isOpen = false;
            scope.position = {
                top: 0,
                left: 0
            };
            scope.getRedableDate = function (date) {
                return dateFilter(date, "MM-dd-yyyy");
            }
            scope.setRange = function (type) {
                var today = new Date();
                var dayTimeStamp = 24*3600*1000;
                var todayTimeStamp = today.setHours(0, 0, 0, 0); //12:00 AM time stamp
                switch(type){
                    case "today":
                        scope.settings.from.date = new Date(today.setHours(0, 0, 0, 0));
                        scope.settings.to.date = today;


                        break;
                    case "Yesterday":
                        var yesterdayTimestamp = todayTimeStamp - dayTimeStamp;
                        var yesterdayEndTimeStamp = todayTimeStamp - 1000;
                        scope.settings.from.date = new Date(yesterdayTimestamp);
                        scope.settings.to.date = new Date(yesterdayEndTimeStamp);

                        break;
                    case "Last7":
                        scope.settings.from.date = new Date(todayTimeStamp - (7 * dayTimeStamp));
                        scope.settings.to.date = new Date(todayTimeStamp);



                        break;
                    case "Last29":
                        scope.settings.from.date = new Date(todayTimeStamp - (29 * dayTimeStamp));
                        scope.settings.to.date = new Date(todayTimeStamp);
                        break;
                    case "ThisMonth":
                        var thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        scope.settings.from.date = thisMonth;
                        scope.settings.to.date = new Date(todayTimeStamp);

                        break;
                    case "LastMonth":
                        var lastMonth = null;
                        if (today.getMonth() == 0) {
                            lastMonth = new Date((today.getFullYear()-1), 11, 1);
                        }
                        else {
                            lastMonth = new Date(today.getFullYear(), (today.getMonth() -1), 1);
                        }

                        
                        scope.settings.from.date = new Date(lastMonth.getTime());

                        var thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        scope.settings.to.date = new Date(thisMonth.setHours(-1, 59, 59));
                        break;
                }
            }

            scope.settings = {
                from: {
                    date: new Date()
                },
                to: {
                    date: new Date()
                }
            };
            var documentClickBind = function (event) {
                if (scope.isOpen && !(element[0].contains(event.target))) {
                    scope.$apply(function () {
                        scope.isOpen = false;
                    });
                }
            };
            scope.toggleOpen = function () {
                scope.isOpen = !scope.isOpen;
            }
            scope.$watch('isOpen', function (value) {
                if (value) {
                    scope.position = $position.position(element);
                    scope.position.top = scope.position.top + element.prop('offsetHeight') + 10;
                  
                    if ((scope.position.left + 590) > $window.innerWidth) {
                        scope.position.left = scope.position.left - 590 + element.prop('offsetWidth');
                    }


                    $timeout(function () {
                        
                        $document.bind('click', documentClickBind);
                    }, 0, false);
                } else {
                    $document.unbind('click', documentClickBind);
                }
            });

            scope.$on('$destroy', function () {
                if (scope.isOpen === true) {
                    if (!$rootScope.$$phase) {
                        scope.$apply(function () {
                            scope.isOpen = false;
                        });
                    }
                }
                $document.unbind('click', documentClickBind);
            });

        }
    }
}])