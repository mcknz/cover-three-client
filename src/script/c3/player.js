/*global c3 */

c3.player = function(app, id) {
  "use strict";
  var type = "player";

  function equals(other) {
    app.ensureType(type, other);
    return app.equals(id, other.id);
  }

  return {
    type:type,
    id:id,
    equals:equals
  };
};