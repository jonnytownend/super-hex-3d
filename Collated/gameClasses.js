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

function Scene() { //Main class to create all global variables
	this.dt = 0;
	this.objects = [];
	this.rotation = new Vector3(0,0,0);
	
	this.add = function( object ) { //Adds an scene object to the Scene.objects array
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
		
		for (var i=0; i<points.length; i++) {
			ctx.lineWidth = lineWidth;
			if (points[i].active == false) ctx.lineWidth = 2;
			
			ctx.beginPath();
			ctx.moveTo( wd/2 + points[i].x, ht/2 + points[i].y );
			if (i != points.length-1)
				ctx.lineTo( wd/2 + points[i+1].x, ht/2 + points[i+1].y );
			else {
				ctx.lineTo( wd/2 + points[0].x, ht/2 + points[0].y );
			}
			
			ctx.stroke();
		}
		ctx.closePath();
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
}
function Side(a, b) {
	this.a = a;
	this.b = b;
	this.active = true;
}
function Cube(size) { //Cube object. Holds all data for a cube mesh
	this.parent = null;
	this.size = size;
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	var s = size;
	this.verts = [
		new Vector3(-s, -s, s),
		new Vector3(s,-s,s),
		new Vector3(s,-s,-s),
		new Vector3(-s,-s,-s),
		new Vector3(-s,s,s),
		new Vector3(s,s,s),
		new Vector3(s,s,-s),
		new Vector3(-s,s,-s)
	];
	
	this.sides = [
		new Side(this.verts[0], this.verts[1]),
		new Side(this.verts[1], this.verts[2]),
		new Side(this.verts[2], this.verts[3]),
		new Side(this.verts[3], this.verts[0]),
		new Side(this.verts[4], this.verts[5]),
		new Side(this.verts[5], this.verts[6]),
		new Side(this.verts[6], this.verts[7]),
		new Side(this.verts[7], this.verts[4]),
		new Side(this.verts[0], this.verts[4]),
		new Side(this.verts[1], this.verts[5]),
		new Side(this.verts[2], this.verts[6]),
		new Side(this.verts[3], this.verts[7])
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
		this.verts[4].set(-s,s,s),
		this.verts[5].set(s,s,s),
		this.verts[6].set(s,s,-s),
		this.verts[7].set(-s,s,-s)
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
		
		var count = 0;
		for (var i=0; i<outline.length-1; i++) {
			for (var j=0; j<this.sides.length; j++) {
				if (outline[i] == this.sides[j].a && outline[i+1] == this.sides[j].b) {
					if (this.sides[j].active == false) {
						outline[i].active = false;
						count += 1;
					}
				}
				else if (outline[i] == this.sides[j].b && outline[i+1] == this.sides[j].a) {
					if (this.sides[j].active == false) {
						outline[i].active = false;
						count += 1;
					}
				}
			}
		}
		
		return outline;
	}
	
	this.highlightVerts = function( array ) {
		for (var i=0; i<array.length; i++) {
			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.arc(canvas.width/2 + this.verts[array[i]].x, canvas.height/2 + this.verts[array[i]].y, 5, 0, 2*Math.PI, false);
			ctx.fill();
		}
	}
}