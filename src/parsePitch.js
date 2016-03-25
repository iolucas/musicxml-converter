//Function to parse <pitch> node
function parsePitch(pitchNode) {

	var pitchObject = {}

	ForeachChild(pitchNode, {

		'step': function(stepNode) {
			pitchObject.step = stepNode.textContent;
		},

		'octave': function(octaveNode) {
			pitchObject.octave = octaveNode.textContent;
		},

		'alter': function(alterNode) {
			pitchObject.alter = alterNode.textContent;
		}

	});

	return pitchObject;
}