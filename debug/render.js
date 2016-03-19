function renderScore(mJson) {

	console.log('Fix bug in case time signature product odd durations values');
	console.log(mJson);


	var canvas = $("canvas")[0];
	var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
	var ctx = renderer.getContext();
	

	foreach(mJson.parts, function(part) {

		var staff = new Vex.Flow.Stave(10, 250, 800)
			.setContext(ctx);

		var staffNoteDivisions = 1;
		var staffMembers = [];

		foreach(part.measures, function(measure, isFirst, isLast) {

			var currentClef = 'treble';

			foreach(measure.members, function(member) {

				if(member.name == 'attributes') {
					
					if(isFirst)	{

						if(member.divisions != undefined)
							staffNoteDivisions = parseInt(member.divisions);
						
						if(member.time != undefined)
							staff.setTimeSignature(member.time['beats'] + '/' + member.time['beat-type']);
						
						if(member.clef != undefined) {
							var clefName = getClefName(member.clef.sign + member.clef.line);
							currentClef = clefName;
							staff.setClef(clefName);
						}
						
						if(member.key != undefined && member.key != 0)
							staff.setKeySignature(getKeyName(member.key));

					} else {

						if(member.clef != undefined) {
							
							var clefName = getClefName(member.clef.sign + member.clef.line);
							currentClef = clefName;
							staffMembers.push(new Vex.Flow.ClefNote(clefName, 'small'));
						}
					}

				} if(member.name == 'note') {

					var noteDuration = getDurationName(1) + 'r';
					var noteKeys = [];

					foreach(member.keys, function(key) {

						noteDuration = getDurationName(4 * staffNoteDivisions / parseInt(key.duration));

						if(key.isRest) {
							noteKeys.push('b/4');
							noteDuration += 'r';

						} else {
							noteKeys.push(key.pitch.step + "/" + key.pitch.octave);	
						}								
					});

					staffMembers.push(new Vex.Flow.StaveNote({ 
						clef: currentClef,
						keys: noteKeys, 
						duration: noteDuration,
						auto_stem: true
					}));
				}

			});

			if(!isLast)
				staffMembers.push(new Vex.Flow.BarNote().setType(Vex.Flow.Barline.type.SINGLE));
		});

		//Draw stave
		staff.draw();

		// Helper function to justify and draw a 4/4 voice
  		Vex.Flow.Formatter.FormatAndDraw(ctx, staff, staffMembers);
	});


}

function getDurationName(durationValue) {

	switch(durationValue) {

		case 1:
			return 'w';

		case 2:
			return 'h';

		case 4:
			return 'q';

		default:
			return durationValue.toString();
	}
}

function foreach(array, callback) {
	for (var i = 0; i < array.length; i++) {
		callback.call(this, array[i], i == 0, i == array.length - 1);
	}
}

function getClefName(clefString) {
	switch(clefString) {
		case 'G2':
			return 'treble';

		case 'F4':
			return 'bass';

		case 'C3':
			return 'alto';
	}
}

function getKeyName(keyValue) {

	switch(keyValue) {

		case '-7':
			return 'Cb';

		case '-6':
			return 'Gb';

		case '-5':
			return 'Db';

		case '-4':
			return 'Ab';

		case '-3':
			return 'Eb';

		case '-2':
			return 'Bb';

		case '-1':
			return 'F';

		case '1':
			return 'G';

		case '2':
			return 'D';

		case '3':
			return 'A';

		case '4':
			return 'E';

		case '5':
			return 'B';

		case '6':
			return 'F#';

		case '7':
			return 'C#';
	}	
}