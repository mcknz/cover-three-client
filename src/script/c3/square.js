/*global c3 */

c3.square = (function(app) {
    "use strict";
    function getSquare(size, playerId) {
        return {
            type:"square",
            pl:playerId,
            sz:size
        };
    }

    return {
        get:getSquare,
        none:getSquare(app.none, app.none)
    };
}(c3));