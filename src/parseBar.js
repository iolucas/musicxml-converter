function parseBar(scoreBar) {

    var barObj = {}

    var scoreBarAttr = getNodeAttributes(scoreBar);

    if(scoreBarAttr.location == undefined)
        return null;

    switch(scoreBarAttr.location) {
        case "right":
            barObj.place = "end";
            break;

        case "left":
            barObj.place = "start";
            break;
    }

    for(var i = 0; i < scoreBar.children.length; i++) {
        var scoreBarChild = scoreBar.children[i];

        switch(scoreBarChild.nodeName) {

            case "repeat": //Repeat bars have priority, so we dont check if the bar name has already been set
                var repeatAttr = getNodeAttributes(scoreBarChild);

                if(repeatAttr.direction == undefined)
                    break;

                barObj.name = repeatAttr.direction;
                break;

            case "bar-style":
                if(barObj.name == undefined)    
                    barObj.name = scoreBarChild.textContent;
                break;
        }
    }

    return barObj;
}
