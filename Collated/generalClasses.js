function Vector3(x,y,z) { //Simple vector3 class
    this.x = x;
    this.y = y;
    this.z = z;
    this.active = true;
    
    this.len = function() {
        sqr = (this.x*this.x) + (this.y*this.y) + (this.z*this.z);
        return Math.sqrt( sqr );
    }
    
    this.add = function( vect ) {
        var x = this.x + vect.x;
        var y = this.y + vect.y;
        var z = this.z + vect.z;
        
        return new Vector3(x,y,z);
    }
    
    this.subtract = function( vect ) {
        var x = this.x - vect.x;
        var y = this.y - vect.y;
        var z = this.z - vect.z;
        
        return new Vector3(x,y,z);
    }
	
	this.scale = function( scale ) {
		var x = this.x*scale/this.len();
		var y = this.y*scale/this.len();
		var z = this.z*scale/this.len();
		this.x = x;
		this.y = y;
		this.z = z;
	}
    
    this.rotate = function( vect ) {//!!--Might have a problem with order of rotation here? Not sure--!!
        var a;
        var b;
		
		//y-rotation
		a = this.z*Math.cos(vect.y) - this.x*Math.sin(vect.y);
		b = this.z*Math.sin(vect.y) + this.x*Math.cos(vect.y);
		this.z = a;
		this.x = b;
		
		//x-rotation
		a = this.y*Math.cos(vect.x) - this.z*Math.sin(vect.x);
		b = this.y*Math.sin(vect.x) + this.z*Math.cos(vect.x);
		this.y = a;
		this.z = b;
		
		//z-rotation
		a = this.x*Math.cos(vect.z) - this.y*Math.sin(vect.z);
		b = this.x*Math.sin(vect.z) + this.y*Math.cos(vect.z);
		this.x = a;
		this.y = b;
    }
	
	this.set = function(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
    
    this.angleToAxis = function( axis ) { //Returns the angle to the given axis (only in the plane of the screen atm)
        if (axis == "x") {
            return Math.atan2(this.y, this.x);
        }
    }

}