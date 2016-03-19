//Function to parse <time> node

function parseTime(timeNode) {

	var timeObject = {}

	var timeAttr = getNodeAttributes(timeNode);

	if(timeAttr['time-symbol'] != undefined)
		timeObject['time-symbol'] = timeAttr['time-symbol'];

	ForeachChild(timeNode, {

		'beats': function(beatsNode) {
			timeObject.beats = beatsNode.textContent;	
		},

		'beat-type': function(beatTypeNode) {
			timeObject['beat-type'] = beatTypeNode.textContent;
		}

	});

	return timeObject;
}