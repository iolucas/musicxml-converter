//function to parse <measure> nodes

function parseMeasure(measureNode) {

	var measureObject = { members: [] }

	var measureNodeAttr = getNodeAttributes(measureNode);


	//Required Attributes

	if(measureNodeAttr.number == undefined)
		return null;

	measureObject.number = measureNodeAttr.number;

	//Optional attributes

	if(measureNodeAttr.implicit != undefined)
		measureObject.implicit = measureNodeAttr.implicit;

	if(measureNodeAttr['non-controlling'] != undefined)
		measureObject['non-controlling'] = measureNodeAttr['non-controlling'];

	if(measureNodeAttr.width != undefined)
		measureObject.width = measureNodeAttr.width;




	//Iterate thru children
	ForeachChild(measureNode, {

		'note': function(noteNode) {
			var noteObject = parseNote(noteNode);

			var lastMember = measureObject.members.length == 0 ? null : 
				measureObject.members[measureObject.members.length - 1];

			//Verify object is a rest, or is not a chord or there is no element before this
			if(noteObject.isRest || 
				!noteObject.isChord || 
				lastMember == null ||
				lastMember.name != 'note') {

				//create new note object with keys element
				measureObject.members.push({
					name: 'note',
					keys: [noteObject]
				});

			} else {

				lastMember.keys.push(noteObject);

			}
		},

		'backup': function() {

		},

		'forward': function() {

		},

		'direction': function() {

		},

		'attributes': function(attrNode) {
			var attrObject = parseAttributes(attrNode);
			measureObject.members.push(attrObject);
		},

	  	'harmony': function() {

		},

	  	'figured-bass': function() {

		},

	  	'print': function() {

		},

	  	'sound': function() {

		},

	  	'barline': function() {

		},

	  	'grouping': function() {

		},

	  	'link': function() {

		},

	  	'bookmark': function() {

		}

	});

	return measureObject;
}