angular.module('rooms', ['roomServices'])
 .controller('roomsController', ['$scope', '$window', 'roomService', 'chatService', function($scope, $window, roomService, chatService) {	 
 
	loadRemoteData();
	
	$scope.goRoom = function(id) {	
	
		roomService.getRoom(id)
			.then(
				function(room) {
					$scope.room = room;
					
					$scope.socket = chatService.connectSocket('http://localhost:5000');
					chatService.onConnect(onConnectSocket);
					chatService.onUpdateChat(onUpdateChat);	
				},
				function(message) {
					$scope.errors.push(message);
				}			
			);		
			
	}
	
	$scope.exitRoom = function() {
		$window.location.href = '/rooms';
	}
	
	$scope.createRoom = function() {
		
		roomService.createRoom($scope.room)		
			.then(
				function(rooms) {
					$window.location.href = '/rooms';
				},
				function(message) {
					$scope.errors = [];
					$scope.errors.push(message);
				}
			)
		;
		
	}
	
	$scope.sendMessage = function(message) {
		
		if (!chatService.sendMessage(message)) {
			alert('Socket não conectado.')
		}
		
		$scope.message = '';
		$(document).ready(function(){
			$(".message-box").scrollTop($(".message-box")[0].scrollHeight);
		});		
		
	}
	
	$scope.logout = function() {
		$window.location.href = 'http://aaa:bbsdcassaewqdb@localhost:5000/rooms';
	}
	
	function loadRemoteData() {
		
		roomService.getAllRooms()
			.then(
				function(rooms) {
					$scope.rooms = rooms;
				},
				function(message) {
					$scope.errors.push(message);
				}
			)
		;
		
	}
	
	function onConnectSocket() {
		$scope.socket.emit('adduser', $scope.room._id);
	}
	
	function onUpdateChat(username, data) {
		var msg = username + ': ' + data;
		roomService.addMessageRoom($scope.room._id, msg);				
		$scope.$apply($scope.room.messages.push(msg));		
	}
 }]);