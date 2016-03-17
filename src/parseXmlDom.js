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