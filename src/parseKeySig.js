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
