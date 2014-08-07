module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index', {title: 'Conversation Board'});
	});

	//check to see if user's sessionID is already stored in user list
	// app.io.on('connection', function(req){
	// 	req.io.emit('new_user');
	// });
	var users_list = {};
	var message_log = [];

app.io.on('connection', function(req, res){
	// console.log('Logged in sessionID: ', req.handshake.sessionID);
	console.log('conection event.  sessionID:',req.handshake.sessionID);
	if(!users_list[req.handshake.sessionID])
	{
		req.emit('new_user');
	}
	
});

app.io.route('new_user_log_in', function(req){
	req.session.user_name = req.data.name
	// console.log('FROM SESSION: '+ req.session.user_name);
});

app.io.route('new_message', function(req){
	var date = new Date();
	var hours = date.getHours();
	if(hours > 12){
		hours = hours - 12;
	}
	var minutes = date.getMinutes();
	if (minutes < 10 ){
		minutes = '0' + minutes;
	} 
	var strTime = hours + ':' + minutes;
	// console.log('User: ' + req.session.user_name + 'Message: ' + req.data.message);
	message_log.push(req.session.user_name + ' ' + strTime + ' : ' + req.data.message);
	// console.log(message_log[0]);
	console.log(message_log);
	app.io.broadcast('update_log', {message_log: message_log});

})

	// app.io.route('new_user_log_in', function(req){
	// 	console.log('new user listener!');

	// });
}