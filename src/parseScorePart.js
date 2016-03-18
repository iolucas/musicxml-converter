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