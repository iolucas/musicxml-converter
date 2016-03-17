//Function to get the time sig object based on its music xml key tag
function parseTimeSig(scoreTime) {
    
    //Check if the score got a symbol on its attributes
    var scoreTimeAttr = getNodeAttributes(scoreTime);

    //if so, return this symbol as the time sig object
    if(scoreTimeAttr.symbol != undefined)
        return scoreTimeAttr.symbol;

    //If not, proceed

    //If it got less than 2 children, means invalid time sig, return null
    if(scoreTime.children.length < 2)
        return null;

    var timeSigObj = {}

    //Iterate thry time childs
    for(var i = 0; i < scoreTime.children.length; i++) {
        var timeChild = scoreTime.children[i];

        switch(timeChild.nodeName) {
            case "beats":
                timeSigObj.beats = timeChild.textContent;
                break;

            case "beat-type":
                timeSigObj.beatType = timeChild.textContent;
                break;
        }
    }

    //If some of the members are not defined, return null
    if(timeSigObj.beats == undefined || timeSigObj.beatType == undefined)
        return null;

    return timeSigObj.beats + "," + timeSigObj.beatType; 

}