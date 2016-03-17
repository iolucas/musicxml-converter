//Function to get the clef object based on its music xml clef tag
function parseClef(scoreClef) {

    //If it got less than 2 children, means invalid clef, return null
    if(scoreClef.children.length < 2)
        return null;

    var clefObj = {}

    //Iterate thry clefs child
    for(var i = 0; i < scoreClef.children.length; i++) {
        var clefChild = scoreClef.children[i];

        switch(clefChild.nodeName) {
            case "sign":
                clefObj.sign = clefChild.textContent;
                break;

            case "line":
                clefObj.line = clefChild.textContent;
                break;
        }
    }

    //If some of the members are not defined, return null
    if(clefObj.sign == undefined || clefObj.line == undefined)
        return null;

    return clefObj.sign + clefObj.line;
}
