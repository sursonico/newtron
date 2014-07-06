define([
  'underscore',
  'backbone',
  'crafty',
  'game/Motorcycle'
], function(_, Backbone, Crafty) {
  
  var TronModel = Backbone.Model.extend({

  	defaults : {
        spriteUrl: "js/game/assets/images/",
        screenX: 800,
        screenY : 400,
        player_a_score : 0,
        player_b_score : 0,
        player_a_name : "Player 1",
        player_b_name : "Player 2"
  	},
  	initialize : function(){

      var model = this;

      // Start Crafty
   		Crafty.init(this.get("screenX"),this.get("screenY"), "game-container");
   		Crafty.canvas.init();
      // Load Sprites
      Crafty.sprite(this.get("spriteUrl") + "play.png", {button_play:[0,0,98,38]});

		var main_scene = function(){
  			var moto_a = Crafty.e("Motorcicle"),
  				moto_b = Crafty.e("Motorcicle"),
  				button_play = Crafty.e("Canvas, Mouse,  button_play"),
  				winner_text = Crafty.e("2D, Canvas, Text"),
  				player_a_score = Crafty.e("2D, Canvas, Text"),
  				player_b_score = Crafty.e("2D, Canvas, Text");

        player_a_score
            .attr({
                x: 200,
                y: 20,
                w: 50,
                h: 20
            })
            .text(model.get("player_a_name") + ":" + model.get("player_a_score"))

        player_b_score
            .attr({
                x: 500,
                y: 20,
                w : 50,
                h: 20
            })
            .text(model.get("player_b_name") + ":" + model.get("player_b_score"))

        winner_text
            .attr({
                x: 300,
                y: 20,
                w: 100,
                h: 20,
                z: 100
            })   

  			moto_a
  				.color("#ff0000")
  				.attr({
  					w: 5,
  					h: 5,
  					x: (model.get("screenX") / 2 ) - 10,
  					y: 150,
  					_limitX : model.get("screenX"),
  					_limitY : model.get("screenY")
   				})
   				.setName(model.get("player_a_name"))
          .setKeys("1")
          .bind("lose", function(x){
            winner_text.text("Gana " + moto_b._entityName).textFont({ type: 'italic', family: 'Arial', size: '18px' }).textColor('#FF0000');
            moto_b.stop()
            model.set("player_b_score",  model.get("player_b_score") + 1);
            player_b_score.text(model.get("player_b_name") + ":" + model.get("player_b_score"))
          })

			moto_b
  				.color("#DDDD00")
  				.attr({
  					c : 2,
  					w: 5,
  					h: 5,
  					x: (model.get("screenX") / 2 ) + 10,
  					y: 150,
  					_limitX : model.get("screenX"),
  					_limitY : model.get("screenY")
  				})
  				.setName(model.get("player_b_name"))
  				.setKeys("2")
  				//.start()
          .bind("lose", function(x){
            winner_text.text("Gana " + moto_a._entityName).textFont({ type: 'italic', family: 'Arial', size: '18px' }).textColor('#FF0000');
            moto_a.stop()
            model.set("player_a_score",  model.get("player_a_score") + 1);
            player_a_score.text(model.get("player_a_name") + ":" + model.get("player_a_score"))
          })
  				
        button_play.bind("Click", function(){
        	_.each(Crafty("Wall").get(), function(x){x.destroy()})
        	
        	moto_a
        		.start()
        		.attr({
        			x: (model.get("screenX") / 2 ) - 10,
  					y: 150,
        		})
        		.setDirection("w");
        	
        	moto_b
        		.start()
        		.attr({
  					x: (model.get("screenX") / 2 ) + 10,
  					y: 150,
        		})
        		.setDirection("e");
        	
        })

  		}

  		Crafty.scene("main", main_scene),
  		Crafty.scene("main");
  	}


  });

  return TronModel;

});