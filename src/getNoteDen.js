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