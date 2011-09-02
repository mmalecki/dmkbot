
/* Writes each line from a file to the channel. One line each N intervals. */

function TalkModule(settings) {
	this.settings = settings;
	this.routes = [];
	this.settings.lines = this.settings.lines || [];
	this.current = 0;
	
	this.enabled = false;
	this.interval = null;
	
	var obj = this;
	var current_line = 0;
	this.intervals = [[ function(cb) {
		require('fs').readFile(obj.settings.file, 'utf-8', function(err, data) {
			if(err) {
				console.error('Error: ' + err);
				return;
			}
			var lines = data.split('\n');
			var line = lines[current_line];
			if(!line) {
				current_line = 0;
				return;
			}
			cb('[' + current_line + '/' + lines.length + '] ' + line);
			current_line++;
			if(current_line >= lines.length) current_line = 0;
		});
		
	}, this.settings.interval || 15*1000]];
}

exports.Module = TalkModule;
