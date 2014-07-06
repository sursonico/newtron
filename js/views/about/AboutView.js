define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/about/aboutTemplate.html'
], function($, _, Backbone, aboutTemplate){

  var AboutView = Backbone.View.extend({
    el: $("#page"),

    render: function(){
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(aboutTemplate);   

    }

  });

  return AboutView;
  
});
