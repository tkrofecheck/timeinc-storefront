(function() {
  
  App.views.Store = Backbone.View.extend({
    className: "store-view",
    template: Handlebars.templates["store.tmpl"],
    events: {

    },
    initialize: function() {
      console.log("App.views.Store initializing");
      this.hero_view = new App.views.StoreHero();
      this.issues_view = new App.views.StoreIssues();
      this.$el.addClass("scrollable");
    },
    render: function() {
      var cx = {};
      this.$el.html(this.template(cx));
      this.hero_view.render().$el.appendTo(this.el);
      this.issues_view.render().$el.appendTo(this.el);
      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    }
  });

})();
