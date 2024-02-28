/*globals self, document, window */
(function () {
    // Highlight selected element style
    var style = document.createElement("style"),
        pt_highlight_class = "pt-highlight";
    document.getElementsByTagName("head")[0].appendChild(style);
    if (style.sheet) {
        style.sheet.insertRule("." + pt_highlight_class + "{filter: blur(10px) !important; background: #f5ecb1 !important; outline: dashed black 2px !important;", 0);
    }
})();
