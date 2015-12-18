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

        $scope.taskName = 'Start';

        var stop;

        $scope.countdown = function() {

          if ( angular.isDefined(stop) ) return;
          
          stop = $interval(function() {
            $scope.time -= 1;
          }, 1000);

          $scope.taskName = 'Reset';
        };

        $scope.stopTime = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
          $scope.taskName = 'Start';
        };

        $scope.reset = function() {
          $scope.stopTime();
          $scope.time = (60*25);
        };

        $scope.startReset = function() {
          if ($scope.taskName == 'Start' ){
            $scope.countdown();
          }
          else{
            $scope.reset();
          }
        };


      }]);
