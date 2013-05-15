
console.log("----------  STARTING APP  ----------");

// disable scrolling the body element (which shows the a white background outside 
// the document and just generally feels, not-very-appy
$(document).on("touchmove", function(evt) { evt.preventDefault() });
$(document).on("touchmove", ".scrollable", function(evt) { evt.stopPropagation() });

$(function() {
  console.log("dom ready");

  // make click events fire at touchstart (https://github.com/ftlabs/fastclick)
  FastClick.attach(document.body);
  
  if  (DEBUG && typeof adobeDPS == "undefined") {
    App._raw_api = MockAPI;
    App._using_adobe_api = false;
  }
  else {
    App._raw_api = adobeDPS;
    App._using_adobe_api = true;
  }

  App._raw_api.initializationComplete.addOnce(function() {
    console.log("init complete");
    
    APIWrapper(App._raw_api, function(wrapped_api) {
      App.api = wrapped_api;
      
      // launch the app
      new App.views.Main().render();
    });
  });

});

