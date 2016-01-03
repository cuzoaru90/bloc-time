    var app = angular.module("blocTime", ['firebase', 'ui.router']);

    app.factory('Tasks', ['$firebaseArray', function($firebaseArray) {

      var myDataRef = new Firebase('https://shining-torch-8271.firebaseio.com/');

      var tasks = $firebaseArray(myDataRef);

      return tasks;

    }]);
    
    app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');     
    $stateProvider
      .state('history', {
      url: '/',
      controller: 'taskCtrl',
      templateUrl: '/templates/history.html'
      });
    });

    app.controller('taskCtrl', ['$scope', '$interval', 'Tasks', function($scope, $interval, tasks) {

        var SESSION_TIME = 1500;
        var breakTime = 300;

        var stop;

        var dingSound = new buzz.sound( "assets/sounds/ding_ling.mp3", {
          preload: true
        });

        $scope.time = SESSION_TIME;

        $scope.numSessions = 0;

        $scope.taskName = 'Start';

        $scope.onBreak = false;

        $scope.tasks = tasks;


        /* Starts a 5-minute break (30-minute break after every four completed sessions) */
        $scope.takeBreak = function(){
          $scope.onBreak = true;
          $scope.taskName = 'Break';
          $scope.numSessions++;

          if ($scope.numSessions % 4 != 0){
            breakTime = 300;
          }
          else{
            breakTime = 1800;
          }

          $scope.time = breakTime;
        };
        
        /* Starts a 25-minute session */
        $scope.startSession = function(){
          $scope.onBreak = false;
          $scope.taskName = 'Start';
          $scope.time = SESSION_TIME;
        };

        /* Countdown function starts the timer for both sessions and breaks. New sessions and breaks start when timer is 0 */
        $scope.countdown = function() {
          
          if ( angular.isDefined(stop) ) return;
          
          stop = $interval(function() {
            if ($scope.time > 0 ){
              $scope.time -= 1;
            }
            else{
              $scope.stopTime();
                if (!$scope.onBreak){
                  $scope.addHistory();
                  $scope.takeBreak();
                }
                else{
                  $scope.startSession();
                }
            }
          }, 1000);

          $scope.taskName = 'Reset';
        };

        /* Function watch waits for the timer to hit zero and plays a ding */
        $scope.$watch('time', function(value) {
           if (value == 0){ 
             dingSound.play();
           } 
        });
        
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
            $scope.time = SESSION_TIME;
          }
          else{
            $scope.time = breakTime;
          }
        };

        /* Function starts or resets depending on whether the timer is counting or paused */
        $scope.startReset = function() {
          if ($scope.taskName == 'Start' || $scope.taskName == 'Break' ){
            $scope.countdown();
          }
          else{
            $scope.reset();
          }

        };
        
        /* Function adds the name of the current task to the history sidebar after session timer hits zero */
        $scope.addHistory = function(){
          var input = $('#taskInput').val();
          $scope.tasks.$add({taskName: input});
          $('#taskInput').val('');
        };

      }]);
