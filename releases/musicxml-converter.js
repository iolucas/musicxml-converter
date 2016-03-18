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

        //In the future add score-timewise
    }

    throw "Parse Error: Invalid MusicXML File.";

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

//Function to get the key sig object based on its music xml key tag
function parseKeySig(scoreKey) {
    //If it got less than 2 children, means invalid key, return null
    if(scoreKey.children.length < 1)
        return null;

    var keySigValue = null;

    //Iterate thry key childs
    for(var i = 0; i < scoreKey.children.length; i++) {
        var keyChild = scoreKey.children[i];

        switch(keyChild.nodeName) {
            case "fifths":
                keySigValue = parseInt(keyChild.textContent);
                break;
        }
    }

    //if the key sig value is not valid, return null, other wise, return itself
    if(isNaN(keySigValue))
        return null;

    return keySigValue;
}

function parseScoreMeasure(scoreMeasure) {

    function createMeasure() {
        return { chords: [] , chordPointer: -1, endBar: "light" } 
    }

    //keep working here
    //modify this to parse every node that may appear on measure
    //and put them into an array called members




    var measuresCollection = [],
        measuresMetadata = {}

    //Iterate thru scoreMeasure childs
    for(var i = 0; i < scoreMeasure.children.length; i++) {
        var currChild = scoreMeasure.children[i];

        switch(currChild.nodeName) {
            case "attributes":
                //iterate thru the attributes children
                for(var j = 0; j < currChild.children.length; j++) {
                    var attrChild = currChild.children[j];

                    switch(attrChild.nodeName) {
                        case "clef":
                            var clefObj = parseClef(attrChild);

                            if(clefObj == null) //If the clef obj is not found,
                                break;  //exit

                            var clefAttr = getNodeAttributes(attrChild);

                            //if there is no number attribute at the clef, 
                            if(clefAttr.number == undefined) {
                                measuresMetadata.clef = clefObj;
                            } else {  //if there is number attr
                                var partInd = clefAttr.number - 1;  //set its number subtracting 1

                                //Check if the measure specified by the clef has already been created, if not create it
                                if(measuresCollection[partInd] == undefined)
                                    measuresCollection[partInd] = createMeasure();

                                measuresCollection[partInd].clef = clefObj;   
                            }

                            break;

                        case "key":
                            var keySigObj = parseKeySig(attrChild);
                            if(keySigObj != null)
                                measuresMetadata.keySig = keySigObj; 
                            break;

                        case "time":
                            var timeSigObj = parseTimeSig(attrChild);
                            if(timeSigObj != null)
                                measuresMetadata.timeSig = timeSigObj;
                            break;
                    }
                }
                break;

            case "direction": //measure tempo will be found here
                var tempoObj = parseTempo(currChild);
                if(tempoObj != null)
                    measuresMetadata.tempo = tempoObj;
                break;

            case "barline":
                var barObj = parseBar(currChild);
                if(barObj != undefined && barObj.name != undefined) {
                    if(barObj.place == "start")
                        measuresMetadata.startBar = barObj.name;    
                    else if(barObj.place == "end")
                        measuresMetadata.endBar = barObj.name;   
                }
                break;

            case "note":

                var noteObj = parseScoreNote(currChild);

                //get the part index of the note
                var partInd = noteObj.partInd;
                delete noteObj.partInd; //delete part index member from the note obj

                if(measuresCollection[partInd] == undefined)
                    measuresCollection[partInd] = createMeasure();

                //Get the note measure reference
                var measureRef = measuresCollection[partInd];

                if(noteObj.chordFlag == undefined || measureRef.chordPointer == -1) { 
                    measureRef.chordPointer++; //increase chord pointer 
                    measureRef.chords[measureRef.chordPointer] = { notes:[] , denominator: 1}  //inits the new chord object
                } else {
                    delete noteObj.chordFlag;   //if it is a chord, only delete this member
                }

                var currChord = measureRef.chords[measureRef.chordPointer];

                if(noteObj.dot != undefined) {
                    currChord.dot = noteObj.dot;
                    delete noteObj.dot;
                }

                if(noteObj.denominator != undefined) {
                    currChord.denominator = noteObj.denominator;
                    delete noteObj.denominator;
                }

                if(noteObj.slur != undefined) {
                    currChord.slur = noteObj.slur;
                    delete noteObj.slur;
                }

                if(noteObj.tied != undefined) {
                    currChord.tied = noteObj.tied;
                    delete noteObj.tied;
                }

                if(noteObj.step != undefined && noteObj.octave != undefined)
                    currChord.notes.push(noteObj);

                break;
        }
    }

    //Add metadata to the measures and remove unecessary members
    for(var i = 0; i < measuresCollection.length; i++) {
        var currMeasure = measuresCollection[i];
        
        delete currMeasure.chordPointer;  

        //Copy all properties of the measure metadata to the measures on the measure collection
        for(var prop in measuresMetadata)
            currMeasure[prop] = measuresMetadata[prop];    
    }

    return measuresCollection;
}
function parseScoreNote(scoreNote) {
    
    var noteObj = { partInd: 0 }    //note object to store note information with the part index of the note

    for(var i = 0; i < scoreNote.children.length; i++) {
        var noteChild = scoreNote.children[i];

        switch(noteChild.nodeName) {

            //Get note denominator
            case "type":
                noteObj.denominator = getNoteDen(noteChild.textContent);
                break;

            case "pitch":

                for(var j = 0; j < noteChild.children.length; j++) {
                    var pitchChild = noteChild.children[j];

                    switch(pitchChild.nodeName) {

                        case "step":
                            noteObj.step = pitchChild.textContent;
                            break;

                        case "octave":
                            var noteOctave = parseInt(pitchChild.textContent);
                            noteObj.octave = isNaN(noteOctave) ? null : noteOctave;
                            break;
                    }
                }
                break;

            case "accidental":
                noteObj.accidental = noteChild.textContent; 
                break;

            case "dot":
                //if the dot stuff hasn't been defined yet, define it as one,
                if(noteObj.dot == undefined)
                    noteObj.dot = 1;
                else //if it has already been defined, update to 2
                    noteObj.dot = 2;
                break;

            case "chord":
                noteObj.chordFlag = true;
                break;

            case "voice":
                var noteVoice = parseInt(noteChild.textContent);                    

                //If the note voice is a valid number, get the part index from it
                if(!isNaN(noteVoice))
                    noteObj.partInd = parseInt((noteVoice - 1) / 4); 

                break;

            case "notations":
                for(var j = 0; j < noteChild.children.length; j++) {
                    var notationsChild = noteChild.children[j];

                    switch(notationsChild.nodeName) {

                        case "slur":
                            var slurAttr = getNodeAttributes(notationsChild);
                            if(slurAttr.type != undefined)
                                noteObj.slur = slurAttr.type;    

                            break;

                        case "tied":
                            var tiedAttr = getNodeAttributes(notationsChild);
                            if(tiedAttr.type != undefined)
                                noteObj.tied = tiedAttr.type;                               

                            break;
                    }
                }

                break;
        }
    }

    return noteObj;
}
function parseScorePart(scorePart) {

    var partsCollection = [];

    //if(scorePart.id != undefined)
        //newPart.id = scorePart.id;


    ForeachChild(scorePart, {
        'measure': function(currChild) {
            var measuresCollection = parseScoreMeasure(currChild); 

            for(var j = 0; j < measuresCollection.length; j++) {
                //create the part object if doesn't exists
                if(partsCollection[j] == undefined)
                    partsCollection[j] = { measures: [] }

                partsCollection[j].measures.push(measuresCollection[j]);    

            }
        }
    });


    //Iterate thru scorePart childs
    /*for(var i = 0; i < scorePart.children.length; i++) {
        var currChild = scorePart.children[i];

        switch(currChild.nodeName) {
            case "measure":
                var measuresCollection = parseScoreMeasure(currChild); 

                for(var j = 0; j < measuresCollection.length; j++) {
                    //create the part object if doesn't exists
                    if(partsCollection[j] == undefined)
                        partsCollection[j] = { measures: [] }

                    partsCollection[j].measures.push(measuresCollection[j]);    

                }

                break;
        }
    }*/

    return partsCollection
}
function parseScorePartwise(scorePartwise) {

    var newPartwise = { parts: [] };

    ForeachChild(scorePartwise, {

        'movement-title': function(currChild) {
            //If the title has already been set, put the setted as subtitle
            if(newPartwise.title != undefined)
                newPartwise.subtitle = newPartwise.textContent; 
            
            newPartwise.title = currChild.textContent;
        },

        'work': function(currChild) {
            //iterate thru the work children

            ForeachChild(currChild, {

                'work-title': function(workChild) {
                    if(newPartwise.title == undefined) 
                        newPartwise.title = workChild.textContent;
                    else
                        newPartwise.subtitle = workChild.textContent;
                }

            });
        },

        'identification': function(currChild) {

            ForeachChild(currChild, {

                'creator':function(identChild) {
                    var creatorAttr = getNodeAttributes(identChild);
                    if(creatorAttr.type != undefined)
                        newPartwise[creatorAttr.type] = identChild.textContent;
                }

            });
        },

        'part': function(currChild) {
            //Get the parts of the score
            var partsColl = parseScorePart(currChild);

            //Push all the parts to the new partwise parts array
            for(var j = 0; j < partsColl.length; j++)
                newPartwise.parts.push(partsColl[j]);
        }

    });




    //Iterate thru scorePartwise childs
    /*for(var i = 0; i < scorePartwise.children.length; i++) {
        var currChild = scorePartwise.children[i];
        
        switch(currChild.nodeName) {

            case "movement-title":
                //If the title has already been set, put the setted as subtitle
                if(newPartwise.title != undefined)
                    newPartwise.subtitle = newPartwise.textContent; 
                
                newPartwise.title = currChild.textContent;
                break;

            case "work":
                //iterate thru the work children
                for(var j = 0; j < currChild.children.length; j++) {
                    var workChild = currChild.children[j];

                    switch(workChild.nodeName) {
                        case "work-title":
                            if(newPartwise.title == undefined) 
                                newPartwise.title = workChild.textContent;
                            else
                                newPartwise.subtitle = workChild.textContent;
                            break;
                    }
                }
                break;

            case "identification":
                //Iterate thry the identification children
                for(var j = 0; j < currChild.children.length; j++) {
                    var identChild = currChild.children[j];

                    switch(identChild.nodeName) {
                        case "creator":
                            var creatorAttr = getNodeAttributes(identChild);
                            if(creatorAttr.type != undefined)
                                newPartwise[creatorAttr.type] = identChild.textContent;     

                            break;
                    }
                }
                break;

            case "part":
                //Get the parts of the score
                var partsColl = parseScorePart(currChild);

                //Push all the parts to the new partwise parts array
                for(var j = 0; j < partsColl.length; j++)
                    newPartwise.parts.push(partsColl[j]);

                break;
        }

    }*/

    return newPartwise;
}

function parseTempo(scoreTempo) {

    var tempoObj = {};

    for(var i = 0; i < scoreTempo.children.length; i++) {
        var scoreTempoChild = scoreTempo.children[i];

        switch(scoreTempoChild.nodeName) {

            case "direction-type":
                for(var j = 0; j < scoreTempoChild.children.length; j++) {
                    var directionTypeChild = scoreTempoChild.children[j];

                    switch(directionTypeChild.nodeName) {

                        case "metronome":
                            for(var l = 0; l < directionTypeChild.children.length; l++) {
                                var metronomeChild = directionTypeChild.children[l];

                                switch(metronomeChild.nodeName) {

                                    case "beat-unit":

                                        switch(metronomeChild.textContent) {
                                            case "eighth":
                                                tempoObj.denominator = 8;
                                                break;

                                            case "quarter":
                                                tempoObj.denominator = 4;
                                                break;

                                            case "half":
                                                tempoObj.denominator = 2;
                                                break;
                                        }

                                        break;

                                    case "per-minute":
                                        tempoObj.value = metronomeChild.textContent;
                                        break;
                                }
                            }
                            break;
                    }
                }
                break;
        }
    }

    if(tempoObj.value == undefined || tempoObj.denominator == undefined)
        return null;

    return tempoObj;
}
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
//Function to parse XML strings to xml dom
function parseXmlDom(xmlString) {
    var xmlDom = null;

    if (window.DOMParser) {

        try { 
            xmlDom = (new DOMParser()).parseFromString(xmlString, "text/xml"); 
        } catch (e) { 
            xmlDom = null; 
        }

    } else if (window.ActiveXObject) {

        try {
            xmlDom = new ActiveXObject('Microsoft.XMLDOM');
            xmlDom.async = false;
            if (!xmlDom.loadXML(xmlString)) // parse error ..
                xmlDom = null;
                //window.alert(xmlDom.parseError.reason + xmlDom.parseError.srcText);
        } catch (e) { 
            xmlDom = null; 
        }

    } else {
        xmlDom = null;
        //console.error("Cannot parse xml string!");
    }        

    return xmlDom;
}
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