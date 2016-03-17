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