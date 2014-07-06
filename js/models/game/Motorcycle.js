define([
  'jquery', 
  'underscore', 
  'backbone',
  'crafty',
], function($, _, Backbone, Crafty){


// Wall component for collision
Crafty.c("Wall",{})

// Motorcicle component
Crafty.c("Motorcicle", {
	_speed : 2,
	_direction : "s",
	_limitX : 300,
	_limitY : 300,
	_startX : 0,
	_startY : 50,
	_activeKeySet : 1,
	_keySets : {
		"1" : [ "A", "D", "W", "S" ],
		"2" : [ "LEFT_ARROW", "RIGHT_ARROW", "UP_ARROW", "DOWN_ARROW" ]
	},

	init : function() {
		this.requires("2D, Canvas, Color,Collision");
	},
	start : function() {
		var keys = this._keySets[this._activeKeySet];

		this.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys[keys[0]]) {
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
		this.onHit("Wall", function() {
			this.lose()

		});

		return this;
	},
	_tick : function() {
		this.move(this._direction, this._speed);

		var x, y, w = this._speed, h = this._speed;

		if (this._direction == "s") {
			x = this.x;
			y = this.y - this._speed;
			w = this.w;
		}

		if (this._direction == "n") {
			x = this.x;
			y = this.y + this.h;
			w = this.w;
		}

		if (this._direction == "w") {
			x = this.x + this.w;
			y = this.y;
			h = this.h;
		}

		if (this._direction == "e") {
			x = this.x - this._speed;
			y = this.y;
			h = this.h;
		}

		Crafty.e("2D, Canvas, Color, Collision, Wall").color("#999999").attr({
			x : x,
			y : y,
			w : w,
			h : h

		})

		if (this.x < this._startX || this.x > this._limitX
				|| this.y < this._startY || this.y > this._limitY) {
			this.lose()
		}

	},
	setDirection : function(direction) {
		this._direction = direction;
		return this;
	},
	setKeys : function(set) {
		this._activeKeySet = set;
		return this;
	},
	lose : function() {

		this.stop();
		this.trigger("lose", this);
	},
	stop : function() {
		this.unbind("EnterFrame");
	}

})


});