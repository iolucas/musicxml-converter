//Function to parse <part> nodes

function parsePart(partNode) {

	//Get part attributes
	var partNodeAttr = getNodeAttributes(partNode);

	//If there is no id (REQUIRED), return null
	if(partNodeAttr.id == undefined)
		return null;

	var partObject = {
		id: partNodeAttr.id,
		measures: []
	}

	ForeachChild(partNode, {

		'measure': function(measureNode) {
			var measureObject = parseMeasure(measureNode);

			//If it is a valid measure object
			if(measureObject != null)
				partObject.measures.push(measureObject);
		}

	});

	return partObject;
}