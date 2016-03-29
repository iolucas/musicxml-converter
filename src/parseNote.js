//Function to parse <note> objects

function parseNote(noteNode) {

	var noteArr = [];

	var noteObject = { 
		//name: 'note',
		isRest: false,
		isChord: false
	}

	ForeachChild(noteNode, {

		'pitch': function(pitchNode) {
			noteObject.pitch = parsePitch(pitchNode);
		},

		'duration': function(durationNode) {
			noteObject.duration = durationNode.textContent;
		},

		'voice': function(voiceNode) {
			noteObject.voice = voiceNode.textContent;
		},

		'rest': function() {
			noteObject.isRest = true;
		},

		'chord': function() {
			noteObject.isChord = true;
		},

		'type': function(typeNode) {
			noteObject.type = typeNode.textContent;
		},

		'stem': function(stemNode) {
			noteObject.stem = stemNode.textContent;
		},

		'accidental': function(accidentalNode) {

			var accAttributes = getNodeAttributes(accidentalNode);

			noteObject.accidental = { 
				type: accidentalNode.textContent
			}

			if(accAttributes['parentheses'] ==  'yes')
				noteObject.accidental.cautionary = true;
		}

	});


	return noteObject;	
}