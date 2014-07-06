define([
  'underscore',
  'backbone',
  'crafty'
], function(_, Backbone) {
  
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

      // Load Sprites
      Crafty.sprite(this.get("spriteUrl") + "play.png", {button_play:[0,0,98,38]});

      // Wall component for collision
  		Crafty.c("Wall",{})

      // Motorcicle component
  		Crafty.c("Motorcicle",{
  			_speed : 2,
  			_direction : "s",
  			_limitX : 300,
  			_limitY : 300,
        _startX : 0,
        _startY : 50,
  			_activeKeySet : 1,
  			_keySets : {
  				"1" : ["A","D","W","S"],
  				"2" : ["LEFT_ARROW","RIGHT_ARROW","UP_ARROW","DOWN_ARROW"]
  			},

  			init : function(){
  				this.requires("2D, Canvas, Color,Collision");  				
  			},
  			start : function(){
  				var keys = this._keySets[this._activeKeySet];

  				this.bind('KeyDown', function(e) {
			    	if(e.key == Crafty.keys[keys[0]]) {
			    	  	this.setDirection("w");
			    	} else if (e.key == Crafty.keys[keys[1]]) {
			    		this.setDirection("e");
			    	} else if (e.key == Crafty.keys[keys[2]]) {
			    		this.setDirection("n");
			    	} else if (e.key == Crafty.keys[keys[3]]) {
			    		this.setDirection("s");
			    	}
			  	});
  				this.bind("EnterFrame", this._tick);
  				this.onHit("Wall", function(){
  					this.lose()
  					
  				});

          return this;
  			},
  			_tick : function(){
  				this.move(this._direction, this._speed);

  				var x, y , w = this._speed, h = this._speed;

  				if (this._direction == "s"){
  					x = this.x;
  					y = this.y - this._speed;
  					w = this.w;
  				} 


  				if (this._direction == "n"){
  					x = this.x;
  					y = this.y + this.h;
					w = this.w;
  				} 


  				if (this._direction == "w"){
  					x = this.x + this.w;
  					y = this.y; 
  					h = this.h;
  				} 


  				if (this._direction == "e"){
  					x = this.x - this._speed;
  					y = this.y; 
  					h = this.h;
  				} 

  				Crafty.e("2D, Canvas, Color, Collision, Wall")
  						.color("#999999")
  						.attr({
  							x: x,
  							y: y,
  							w: w,
  							h: h

  						})
  						

  				if (this.x < this._startX || this.x > this._limitX || this.y < this._startY || this.y > this._limitY) {
					   this.lose()
  				} 

  			},
  			setDirection : function(direction){
  				this._direction = direction;
  				return this;
  			},
  			setKeys :  function(set){
  				this._activeKeySet = set;
  				return this;
  			},
  			lose : function(){
  				
  				this.stop();
          this.trigger("lose", this);
  			},
        stop : function(){
          this.unbind("EnterFrame");
        }

  		})


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
   				.setDirection("w")
   				.setName(model.get("player_a_name"))
          .setKeys("1")
          .start()
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
  				.setDirection("e")
  				.setName(model.get("player_b_name"))
  				.setKeys("2")
  				.start()
          .bind("lose", function(x){
            winner_text.text("Gana " + moto_a._entityName).textFont({ type: 'italic', family: 'Arial', size: '18px' }).textColor('#FF0000');
            moto_a.stop()
            model.set("player_a_score",  model.get("player_a_score") + 1);
            player_a_score.text(model.get("player_a_name") + ":" + model.get("player_a_score"))
          })
  				
        button_play.bind("Click", function(){
            Crafty.scene("main");                
            Crafty("Wall").destroy();
        })

  		}

  		Crafty.scene("main", main_scene),
  		Crafty.scene("main");
  	}


  });

  return TronModel;

});