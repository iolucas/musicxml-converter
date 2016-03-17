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