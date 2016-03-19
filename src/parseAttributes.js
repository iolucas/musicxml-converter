//Function to parse <attributes> node

function parseAttributes(attrNode) {

	var attrObject = {
		name: 'attributes'
	}

	ForeachChild(attrNode, {

		'divisions': function(divisionsNode) {
			attrObject.divisions = divisionsNode.textContent;
		},

		'key': function(keyNode) {
			attrObject.key = parseKey(keyNode);
		},

		'time': function(timeNode) {
			attrObject.time = parseTime(timeNode);
		},

		'clef': function(clefNode) {
			attrObject.clef = parseClef(clefNode);
		}

	});

	return attrObject;
}