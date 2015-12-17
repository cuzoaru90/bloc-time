    var app = angular.module("blocTime", ['firebase', 'ui.router']);
    var myDataRef = new Firebase('https://shining-torch-8271.firebaseio.com/');
    
    app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');     
    $stateProvider
      .state('history', {
      url: '/',
      controller: 'HistoryCtrl as history',
      templateUrl: '/templates/history.html'
      });
    });

    app.controller('taskCtrl', ['$scope', '$interval', function($scope, $interval) {

        $scope.time = (60*25);

        var stop;

        $scope.countdown = function() {
          
          stop = $interval(function() {
              $scope.time -= 1;
          }, 1000);
        };

      }]);
