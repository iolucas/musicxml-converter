"use strict";

var MusicXmlConverter = {}

MusicXmlConverter.toJson = function (xmlFile) {
    
    var xmlDOM;
    if(typeof xmlFile == 'string')
        xmlDOM = parseXmlDom(xmlFile);
    else
        xmlDOM = xmlFile;
    
    //Check if it got a score partwise object
    for(var i = 0; i < xmlDOM.children.length; i++) {
        var currChild = xmlDOM.children[i];

        //if the current child is a score partwise
        if(currChild.nodeName == "score-partwise")
            return parseScorePartwise(currChild);   //get it
    }

    throw "Parse Error: Invalid MusicXML File.";

}
