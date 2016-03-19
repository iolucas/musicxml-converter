//Function to parse <key> node

function parseKey(keyNode) {

	var keyValue;

	ForeachChild(keyNode, {
		'fifths': function(fifthsNode) {
			keyValue = fifthsNode.textContent;	
		}
	});

	return keyValue;
}