function parseScorePartwise(scorePartwise) {

    var newPartwise = { parts: [] };

    var scorePartwiseAttr = getNodeAttributes(scorePartwise);

    if(scorePartwiseAttr.version != undefined)
        newPartwise.version = scorePartwiseAttr.version;   

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
            //var partsColl = parseScorePart(currChild);

            var partsColl = [parsePart(currChild)];

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
