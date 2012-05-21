(function($) {

    var p1Small = "&#9633;";
    var p1Large = "&#9637;";
    var container = $("#gridContainer");
    var squares = $(".sqr");
    var squaresContent = $(".sqr span");
    var defaultCursor = container.css("cursor");

    squaresContent.addClass("hidden");

    squares.click(function(e){
        var content = $("#" + e.target.id + " span");
        content.html(content.text() === p1Small ? p1Large : p1Small);
        content.removeClass("hidden");
        container.css("cursor", "pointer");
    });

    squares.mousedown(function(e){
        //prevent text cursor from showing on click
        e.originalEvent.preventDefault();
    });

    container.fadeIn("slow");

}(jQuery));

