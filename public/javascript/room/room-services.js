angular.module('roomServices', [])

.service("roomService",
    function( $http, $q ) {
		return({
			createRoom: createRoom,
			getRoom: getRoom,
			getAllRooms: getAllRooms, 
			addMessageRoom: addMessageRoom
		});	

		function createRoom(room) {
			var request = $http.post('/api/rooms/', room);		
			return( request.then( handleSuccess, handleError ) );			
		}	
		
		function getRoom(id) {
			var request = $http.get('/api/rooms/' + id);		
			return( request.then( handleSuccess, handleError ) );			
		}	
		
		function getAllRooms() {
			var request = $http.get('/api/rooms/');		
			return( request.then( handleSuccess, handleError ) );			
		}		

		function addMessageRoom(id, msg) {
			var request = $http.put('/api/rooms/' + id + '/message', {message: msg});		
			return( request.then( handleSuccess, handleError ) );			
		}			

		function handleError( response ) {
			if (! angular.isObject( response.data ) ||
				! response.data.data) {
				return( $q.reject( "An unknown error occurred." ) );
			}
			return( $q.reject( response.data.data ) );
		}

		function handleSuccess( response ) {
			return( response.data.data );
		}		
	}
)

.service("chatService",
    function() {
		var socket = null;
		
		return({
			connectSocket: connectSocket,
			sendMessage: sendMessage,
			onConnect: onConnect,
			onUpdateChat: onUpdateChat
		});	

		function connectSocket(url) {
			socket = io.connect(url);
			return socket;
		}	
		
		function sendMessage(message) {
			if (!socket) {
				return false;
			}
			
			socket.emit('sendchat', message);	
			
			return true;
		}	

		function onConnect(callback) {	
			socket.on('connect', function(){
				callback();
			});			
		}		
		
		function onUpdateChat(callback) {	
			socket.on('updatechat', function (username, data) {
				callback(username, data);
			});							
		}		
	}
);