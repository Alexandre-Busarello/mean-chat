angular.module('app', [])
 .controller('roomsController', ['$scope', '$http', '$window', function($scope, $http, $window) {	 
	var onSuccessFn = function(response) {
		$scope.rooms = response.data.data;
	}
	
	var onErrorFn = function(response) {
		$scope.errors.push(response.data.data);
	}
	
	$http.get('/api/rooms').then(onSuccessFn, onErrorFn);
	
	$scope.goRoom = function(id) {	
		var onSuccessFn = function(response) {
			$scope.room = response.data.data;

			$scope.socket = io.connect('http://localhost:5000');

			$scope.socket.on('connect', function(){
				$scope.socket.emit('adduser', $scope.room._id);
			});

			$scope.socket.on('updatechat', function (username, data) {
				var msg = username + ': ' + data;
				$http.put('/api/rooms/' + $scope.room._id, {message: msg}).then(function(response) { }, function(response) { });					
				$scope.$apply($scope.room.messages.push(msg));				
			});	 
		}
		
		var onErrorFn = function(response) {
			$scope.errors.push(response.data.data);
		}

		$http.get('/api/rooms/' + id).then(onSuccessFn, onErrorFn);				
	}
	
	$scope.exitRoom = function() {
		$window.location.href = '/rooms';
	}
	
	$scope.createRoom = function() {
		var onSuccessFn = function(response) {
			$window.location.href = '/rooms';
		}
		
		var onErrorFn = function(response) {
			$scope.errors = [];
			$scope.errors.push(response.data.data);
		}

		$http.post('/api/rooms', $scope.room).then(onSuccessFn, onErrorFn);		
	}
	
	$scope.sendMessage = function(message) {
		$scope.socket.emit('sendchat', message);
		$scope.message = "";
		
		$(document).ready(function(){
			$(".message-box").scrollTop($(".message-box")[0].scrollHeight);
		});		
	}
	
	$scope.logout = function() {
		$window.location.href = 'http://aaa:bbsdcassaewqdb@localhost:5000/rooms';
	}
 }]);