/*global c3 */

c3.square = function(size, playerId) {
    "use strict";
    return {
        type:"square",
        pl:playerId,
        sz:size
    };
};