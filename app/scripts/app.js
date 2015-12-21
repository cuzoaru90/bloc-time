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

        $scope.time = 1500;

        $scope.taskName = 'Start';

        $scope.onBreak = false;

        var stop;

        /* Countdown function starts the timer for both sessions and breaks */
        $scope.countdown = function() {

          if ( angular.isDefined(stop) ) return;
          
          stop = $interval(function() {
            if ($scope.time > 0 ){
              $scope.time -= 1;
            }
            else{
              $scope.stopTime();
                if (!$scope.onBreak){
                  $scope.onBreak = true;
                  $scope.taskName = 'Break';
                  $scope.time = 300;
                }
                else{
                  $scope.onBreak = false;
                  $scope.taskName = 'Start';
                  $scope.time = 1500;
                }
            }
          }, 1000);

          $scope.taskName = 'Reset';
        };
        
        /* Function stopTime stops the timer during sessions and breaks */
        $scope.stopTime = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
          if (!$scope.onBreak){
            $scope.taskName = 'Start';
          }
          else{
            $scope.taskName = 'Break';
          }
        };

        /* Function reset makes the timer start at the beginning of a session or break */
        $scope.reset = function() {
          $scope.stopTime();
          if (!$scope.onBreak){
            $scope.time = 1500;
          }
          else{
            $scope.time = 300;
          }
        };

        /* Function starts or resets depending on whether the timer is starting or stopping */
        $scope.startReset = function() {
          if ($scope.taskName == 'Start' || $scope.taskName == 'Break' ){
            $scope.countdown();
          }
          else{
            $scope.reset();
          }
        };



      }]);
