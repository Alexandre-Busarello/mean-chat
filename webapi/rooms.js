var mongoService = require('../services/mongoService.js');
var Room = mongoService.Room;

function validate(room, response) {
    if (!room.name) {
        response.status(400).json({ status: 400, data: 'Nome da sala é obrigatório.' })
        return false;
    }
    if (!room.description) {
        response.status(400).json({ status: 400, data: 'É necessário informar uma descrição para a sala.' })
        return false;
    }
    return true;
}

exports.initialize = function(app) {
	app.get('/api/rooms', getRooms);
	app.get('/api/rooms/:id', getRoom);
	app.post('/api/rooms', postRoom);
	app.put('/api/rooms/:id/message', putMessage);
	
	function getRooms(request, response) {
        response.status(500, 'Erro não esperado.');

        Room.find({}, function(err, rooms) {
            if (err) {
                console.error(err);
                response.status(500).json({ status: 500, data: 'Erro ocorrido: ' + err });
            }
            if (rooms.length > 0)
                response.status(200).json({ status: 200, data: rooms });
            else
                response.status(200).json({ status: 200, data: [] });
        });
    };

	function getRoom(request, response) {
        var id = request.params.id;
		
        response.status(500, 'Erro não esperado.');
		
        Room.findOne({ _id: id }, function(err, room) {
            if (err) {
                console.error(err);
                response.status(500).json({ status: 500, data: 'Erro ocorrido: ' + err });
            }
			console.log(room);
            if (room) 
                response.status(200).json({ status: 200, data: room });
            else
                response.status(404).json({ status: 404, data: 'Sala não encontrada.' });
        });
    };

    function postRoom(request, response) {
        var room = request.body;

        if (!validate(room, response))
            return;

        response.status(500, 'Erro não esperado.');

        var newRoom = new Room(room);

        newRoom.save(function(err, room) {
            if (err) return console.error(err);
            console.dir('Sala criada -> ' + room);
            response.status(200).json({ status: 200, data: 'Sucesso!' });
        });
    };
	
    function putMessage(request, response) {
        var m = request.body;
        var id = request.params.id;
	
		console.log(m);
        response.status(500, 'Erro não esperado.');
		
        Room.findOne({ _id: id }, function(err, room) {
            if (err) {
                console.error(err);
                response.status(500).json({ status: 500, data: 'Erro ocorrido: ' + err });
            }
			
            if (room) {
                room.messages.push(m.message);
				room.save(function(err, r) {
					if (err) return console.error(err);
					response.status(200).json({status: 200, data:'Sucesso!'});
				});				
			}
            else
                response.status(404).json({ status: 404, data: 'Sala não encontrada.' });
        });
    };	
};

