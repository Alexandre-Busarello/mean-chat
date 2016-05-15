var mongoService = require('../services/mongoService.js');
var User = mongoService.User;

function validade(user, response) {
	if(!user.name) {
		response.status(400).json({ status: 400, data: 'Nome do usuário é obrigatório.' })
		return false;
	}
	if(!user.login) {
		response.status(400).json({ status: 400, data: 'Usuário é obrigatório.' })
		return false;
	}
	if(!user.password) {
		response.status(400).json({ status: 400, data: 'Senha é obrigatório.' })
		return false;
	}
		
	return true;
}

exports.initialize = function(app) {
	app.post('/api/users', setUser);

	function setUser(request, response) {
		var user = request.body;

		if (!validade(user, response))
			return;

		response.status(500, 'Erro não esperado.');

		var newUser = new User({
			name: user.name,
			login: user.login,
			password: user.password
		});

		User.find({login: user.login}, function(err, users) {
			if (users.length > 0) {
				response.status(400).json({ status: 400, data: 'Usuário ja cadastrado.' })
				return false;
			} else {
				newUser.save(function(err, user) {
					if (err) return console.error(err);
					console.dir('Usuário criado -> ' + user);
					response.status(200).json({status: 200, data:'Sucesso!'});
				});			
			}
		});		
	}
};
