define('battle/waitingRoomView', ['text!./waitingRoomView.html'], function(tmpl) {
	var WaitingRoomView = Backbone.View.extend({
		events: {
			'click .start': 'start'
		},
		initialize: function() {
			var content = $(tmpl),
				challenge = this.options.challenge,
				usersEl = content.find('ul');
			
			this.unsubs = [];
			this.bus = this.options.bus;
			this.el.children().remove();

			function addUser(data) {
				$('<li>').text(data.user.login).appendTo(usersEl);
			}

			challenge.users.forEach(function(user) {
				addUser({ user: user });
			});

			this.unsubs.push(this.bus.sub('new-user', function(data) {
				addUser(data);
			}));

			// Only allow the leader to start matches
			if (challenge.leader.id !== this.options.user.id) {
				content.find('.start').hide();	
			}
			
			this.el.append(content);
		},
		start: function() {
			this.options.bus.pub('kick-off');
		},
		remove: function() {
			this.el.children().remove();
			this.unsubs.forEach(function(unsub) { unsub(); });
		}
	});	

	return WaitingRoomView;
});
