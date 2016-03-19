//Utils functions to help the library

function ForeachChild(targetElem, childrenTasks) {

	//Iterate thry all the element children
	for (var i = 0; i < targetElem.children.length; i++) {
		var child = targetElem.children[i];

		//If the current child got its name on the childrenTask, execute the task passing the child ref
		if(childrenTasks[child.nodeName])
			childrenTasks[child.nodeName].call(targetElem, child);	
	}
}


function getNodeAttributes(targetNode) {
    if(targetNode.attributes == undefined)
        return {};

    if(targetNode.attributes.length == 0)
        return {};

    var nodeAttributtes = {}

    for(var i = 0; i < targetNode.attributes.length; i++) {
        var currAttr = targetNode.attributes[i];

        nodeAttributtes[currAttr.nodeName] = currAttr.nodeValue;
    }

    return nodeAttributtes;
}

function getNoteDen(type) {
    var currDenominator = null;

    switch(type) {
        case "whole":
            currDenominator = 1;
            break;

        case "half":
            currDenominator = 2;
            break;

        case "quarter":
            currDenominator = 4;
            break;

        case "eighth":
            currDenominator = 8;
            break;

        case "16th":
            currDenominator = 16;
            break;

        case "32nd":
            currDenominator = 32;
            break;

        case "64th":
            currDenominator = 64;
            break;

        case "128th":
            currDenominator = 128;
            break;

        default:
            if(type == undefined) {
                currDenominator = 1;
            } else {
                console.log("Denominator not implemented: ");
                console.log(type);
                //throw "Denominator not implemented: " + measures[i].note[j]; 
            }                                               
    }

    return currDenominator;
}