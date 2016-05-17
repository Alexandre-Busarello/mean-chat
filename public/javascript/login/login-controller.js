angular.module('login', ['loginServices'])
 .controller('loginController', ['$scope', '$window', 'loginService', function($scope, $window, loginService) {
	$scope.stage = 1; 
	$scope.errors = [];
	
	$scope.loginClick = function(login, password) {
		if ($scope.loginForm.$valid) {
			$window.location.href = 'http://' + login + ':' + password + '@localhost:5000/rooms';
		}
	}
   
	$scope.registerClick = function() {
		if ($scope.registerForm.$valid) {
			
			loginService.registerUser($scope.user)
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
	}   
 }]);