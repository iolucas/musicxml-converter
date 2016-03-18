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