function parseScoreMeasure(scoreMeasure) {

    function createMeasure() {
        return { chords: [] , chordPointer: -1, endBar: "light" } 
    }

    keep working here
    modify this to parse every node that may appear on measure
    and put them into an array called members




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