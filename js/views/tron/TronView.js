define([
  'jquery',
  'underscore',
  'backbone',
  'models/game/Tron',
  'text!templates/tron/tronTemplate.html'
], function($, _, Backbone, TronModel, tronTemplate){

  var HomeView = Backbone.View.extend({
    el: $("#page"),

    render: function(){
      
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
     
      this.$el.html(tronTemplate);

      var tronModel = new TronModel();
 
    }

  });

  return HomeView;
  
});
