angular.module('login', [])
 .controller('loginController', ['$scope', '$http', '$window', function($scope, $http, $window) {
	$scope.stage = 1; 
	$scope.errors = [];
   
	$scope.loginClick = function(login, password) {			
		$window.location.href = '/rooms';	
	} 
	
	$scope.loginClick = function(login, password) {
		if ($scope.loginForm.$valid) {
			$window.location.href = 'http://' + login + ':' + password + '@localhost:5000/rooms';
		}
	}
   
	$scope.registerClick = function() {
		if ($scope.registerForm.$valid) {
			var onSuccessFn = function(response) {
				$window.location.href = '/rooms';
			}

			var onErrorFn = function(response) {
				$scope.errors = [];
				$scope.errors.push(response.data.data);
			}

			$http.post('/api/users', $scope.user).then(onSuccessFn, onErrorFn);
		}
	}   
 }]);