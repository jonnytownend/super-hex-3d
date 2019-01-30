//--Canvas and event listeners setup--
function canvasSetup() {
	canvas = document.getElementById("mainCanvas"); //Link canvas var with mainCanvas element
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
	
	mouse = new Vector3(0,0,0); //global mouse position variable
	inpt = new Vector3(0,0,0); //global arrow key input
	
	canvas.globalAlpha = 0; //Set global alpha for crazy effects
	
	function getMouse(event) {
		mouse.x = event.pageX;
		mouse.y = event.pageY;
	}
	canvas.addEventListener("mousemove", getMouse, false);
	
	function keyDown(event) {
		//Get arrow key input
		if (event.keyCode==38) inpt.y = 1;
		else if (event.keyCode==40) inpt.y = -1;
		else if (event.keyCode==37) inpt.x = -1;
		else if (event.keyCode==39) inpt.x = 1;
	}
	window.addEventListener("keydown", keyDown, false);
	
	function keyUp(event) {
		//Get arrow key input
		if (event.keyCode==38) inpt.y = 0;
		else if (event.keyCode==40) inpt.y = 0;
		else if (event.keyCode==37) inpt.x = 0;
		else if (event.keyCode==39) inpt.x = 0;
	}
	window.addEventListener("keyup", keyUp, false);
}
canvasSetup();

//Classes and global function
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
function Scene() { //Main class to create all global variables
	this.dt = 0;
	this.objects = [];
	this.rotation = new Vector3(0,0,0);
	
	this.add = function( object ) { //Adds a scene object to the Scene.objects array
		object.parent = this;
		this.objects.push( object );
	}
	
	this.drawPoints = function( points, strokeCol, fillCol, lineWidth ) {//Global function to draw an array of points
		if (fillCol == null)
			ctx.fillStyle = "rgba(0,0,0,0)";
		else ctx.fillStyle = fillCol;
		if (strokeCol == null)
			ctx.strokeStyle = "rgba(0,0,0,0)";
		else ctx.strokeStyle = strokeCol;
		if (lineWidth == null) {
			ctx.lineWidth = 2;
			lineWidth = 2;
		}
		else ctx.lineWidth = lineWidth;
		
		//Centre origin
		var wd = canvas.width;
		var ht = canvas.height;
		
		ctx.beginPath();
		for (var i=0; i<points.length; i++) {
			if (i==0) ctx.moveTo( wd/2 + points[i].x, ht/2 + points[i].y );
			else ctx.lineTo( wd/2 + points[i].x, ht/2 + points[i].y );
		}
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
	
	this.scaleAll = function( scale ) { //Scales all objects in Scene.objects array
		for (var i=0; i<this.objects.length; i++) {
			this.objects[i].size += scale;
		}
	}
	
	this.draw = function() { //Calls Object.draw() function on every Object in the Scene.objects array
		for (var i=0; i<this.objects.length; i++) {
			if (this.objects[i].size > 0)
				this.objects[i].draw();
		}
	}
	
	this.update = function() { //Updates all Objects in Scene.objects array. This should be called before Scene.draw()
		this.dt += 1;
		for (var i=0; i<this.objects.length; i++) {
			this.objects[i].update();
		}
	}
	
	this.addCubeArray = function() { //Adds an array of cubes of increasing size
		
	}
}
function Cube(size) { //Cube object. Holds all data for a cube mesh
	this.parent = null;
	this.size = size;
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	var s = this.size;
	this.verts = [
		new Vector3(-s, -s, s),
		new Vector3(s,-s,s),
		new Vector3(s,-s,-s),
		new Vector3(-s,-s,-s),
		new Vector3(s,s,-s),
		new Vector3(-s,s,-s),
		new Vector3(s,s,s),
		new Vector3(-s,s,s)
	];
	
	//--Drawing parameters--
	this.wireframe = true;
	this.wireframeCol = "black";
	this.fill = null;
	this.borderCol = null;
	this.borderWidth = null;
	
	this.reset = function() { //Sets cube back to original state
		this.verts[0].set(-s, -s, s),
		this.verts[1].set(s,-s,s),
		this.verts[2].set(s,-s,-s),
		this.verts[3].set(-s,-s,-s),
		this.verts[4].set(s,s,-s),
		this.verts[5].set(-s,s,-s),
		this.verts[6].set(s,s,s),
		this.verts[7].set(-s,s,s)
	}
	
	this.update = function() { //Resets cube, then rotates and scales it
		this.reset();
		var rotation = this.rotation.add( this.parent.rotation );
		for (var i=0; i<this.verts.length; i++) {
			this.verts[i].scale( this.size );
			this.verts[i].rotate( rotation );
		}
	}
	
	this.draw = function() { //Draws cube. Takes drawing parameters to choose draw characteristic.
		scene.drawPoints( this.projection(), null, this.fill, null );
		if (this.wireframe) this.drawWireframe( this.wireframeCol );
		scene.drawPoints( this.projection(), this.borderCol, null, this.borderWidth );
	}
	
	this.drawWireframe = function( col ) { //Function to draw wireframe (ie. from vert to vert)
		ctx.strokeStyle = col;
		ctx.lineWidth = 1;
		var wd = canvas.width;
		var ht = canvas.height;
        for (var i=0; i<this.verts.length; i++) {
			//!!STEPTHROUGH!!
            for (var j=i; j<this.verts.length; j++) {
				//!!STEPTHROUGH!!
                if (j!=i) {
                    var a = wd/2 + this.position.x + this.verts[i].x;
                    var b = ht/2 + this.position.y + this.verts[i].y;
                    var c = wd/2 + this.position.x + this.verts[j].x;
                    var d = ht/2 + this.position.y + this.verts[j].y;

                    ctx.beginPath();
                    ctx.moveTo(a, b);
                    ctx.lineTo(c, d);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
	}
	
	this.projection = function() { //Returns ordered array of circumfrence verts
		var outline = this.verts.slice();
		
		outline.sort( function(a,b) {
			return a.z - b.z;
		});
		
		outline = outline.slice(1,outline.length-1);
		
		outline.sort( function(a,b) {
			var aAng = a.angleToAxis("x");
			var bAng = b.angleToAxis("x");
			return aAng - bAng;
		});
		return outline;
	}
}


//--------------------------

//Set up variables
function setup() {
	//CALLED BEFORE RENDERLOOP STARTS
	scene = new Scene();
	cube = new Cube(200);
	cube.wireframeCol = "white";
	cube.rotation.set(Math.PI/5.1, Math.PI/4, 0);
	scene.add(cube);
}

//Render loop
function renderLoop() {
	window.requestAnimationFrame( renderLoop );
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	
	//DRAW CODE GOES HERE
	scene.rotation.z += inpt.x/100;
	scene.rotation.x += inpt.y/100;
	
	scene.update();
	scene.draw();
	
}

setup();
renderLoop();