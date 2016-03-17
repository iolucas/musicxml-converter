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