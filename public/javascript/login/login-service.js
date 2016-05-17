angular.module('loginServices', [])

.service("loginService",
    function( $http, $q ) {
		return({
			registerUser: registerUser
		});	

		function registerUser(user) {
			var request = $http.post('/api/users', user);		
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