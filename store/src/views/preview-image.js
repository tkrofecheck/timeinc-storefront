(function() {
  App.views.IssuePreviewImage = Backbone.View.extend({
    className: "issue-preview-image",
    template: Handlebars.templates["issue-preview-image.tmpl"],
    events: {
      "click .buy-issue-button": "buy_issue",
      "click .close-btn": "close",
      "swipedown .controls": "close"
    },
    initialize: function(folio) {
      var that = this,
          coverdate = folio.get_coverdate().format("YYYY-MM-DD");
      this.folio = folio;
      this.render(function() {
        // don't allow multiple image previews at once
        if ($(".issue-preview-image").length) return;

        that.$el.appendTo("body");
        that.omni_pv = App.omni.pageview("previewimage|"+coverdate, "event1");
        that.animate();
      });

      var render = _.bind(this.render, this);
      render = _.partial(_.delay, render, 50);
      render = _.debounce(render, 200);

      $(window).on("resize.image-preview", render);

    },
    render: function(cb) {
      cb = cb || $.noop;
      var that = this,
          $window = $(window),
          w = $window.width(),
          h = $window.height(),
          is_portrait = h > w;

      this.get_img(w, h, is_portrait, function(img_url) {
          var cx = {
            settings: settings, 
            folio: _.bindAll(that.folio),
            portrait: is_portrait,
            img: { width: w, height: h, url: img_url }
          };
          that.$el.html(that.template(cx));
          (cb || $.noop)();
      });
      return this;
    },
    get_img: function(w, h, p, cb) {
      cb("http://content.dreader.timeinc.net/issues/preview/"+this.folio.productId+"/image_vertical.png")
    },
    animate: function(cb) {
      cb = cb || $.noop;
      var h = $(window).height(),
          $img = this.$(".scrollable img"); 

      $img.hide();
      this.$(".container")
        .transition({y: h}, 0)
        .transition({y: 0}, 500);

      setTimeout(function() {
        $img.show();
        cb();
      }, 550);
    },
    buy_issue: function(evt) {
      var $this = $(evt.currentTarget),
          dialog = new App.dialogs.WelcomeDownloading(),
          $progress = dialog.$(".progress");

      App.omni.event("pr_"+$this.data("action")+"_taps");

      this.folio.purchase_and_download({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        },
        error: function(error_code) {
          if (error_code < 0) {
            settings.error_code = error_code;
            new App.dialogs.ErrorMsg();
          }
          dialog.remove();
        },
        cancelled: function() {
          dialog.remove();
        }
      });
    },
    close: function() {
      var that = this,
          animation_duration = 350;

      TcmOmni.set_pagename(this.omni_pv.prev);

      this.$(".container").transition({y: $(window).height()}, animation_duration);

      setTimeout(function() {
        that.remove();
        $(window).off("resize.image-preview");
      }, animation_duration);
    }
  });

})();
