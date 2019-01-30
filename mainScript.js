//Setup canvas
var canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var wd = canvas.width;
var ht = canvas.height;

//Get context
var ctx = canvas.getContext("2d");
//ctx.globalAlpha = 0.01;

//Link THREE.Vector3 class
//Vector3 = THREE.Vector3;
//$V = Vector3;

//Global variables
var mouse = new Vector3(0,0,0);
var key = function() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.hide = false;
}
key.hide=false;

var globalUp = new Vector3(0,1,0);
var blue = 0;
var bgAlpha = 0.5;
var dir = 1;

//Add event listeners
function getMouse(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
}
canvas.addEventListener("mousemove", getMouse, false);

function keyDown(event) {
    if (event.keyCode==87) key.up = true;
    else if (event.keyCode==83) key.down = true;
    else if (event.keyCode==65) key.left = true;
    else if (event.keyCode==68) key.right = true;
    else if (event.keyCode==70) {
        if (key.hide) key.hide = false;
        else key.hide = true;
    }
    else if (event.keyCode==72) {
        speedUp = 10;
    }
    else if (event.keyCode==84) {
        if (ctx.globalAlpha==1) ctx.globalAlpha = 0.01;
        else ctx.globalAlpha=1;
    }
    else if (event.keyCode==89) {
        if (bgAlpha==0.5) bgAlpha=0.01;
        else bgAlpha=0.5;
    }
    else if (event.keyCode==85) {
        if (bgAlpha==1) bgAlpha=0.5;
        else bgAlpha=1;
    }
    //alert(event.keyCode);
}

function keyUp(event) {
    if (event.keyCode==87) key.up = false;
    else if (event.keyCode==83) key.down = false;
    else if (event.keyCode==65) key.left = false;
    else if (event.keyCode==68) key.right = false;
    else if (event.keyCode==72) {
        speedUp = 1;
    }
}
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

function draw( array ) {
    //ctx.strokeStyle = "#44ff44";
    ctx.strokeStyle = "rgb(64, "+parseInt(255-blue)+","+parseInt(blue)+")";
    ctx.lineWidth = 20;
    ctx.beginPath();
    var last = array[array.length-1];
    ctx.moveTo(wd/2 + last.x, ht/2 + last.y);
    for (var i=0; i<array.length-1; i++) {
        if (array[i].active) {
            ctx.lineTo(wd/2 + array[i].x, ht/2 + array[i].y);
        }
        else {
            //ctx.closePath();
            //ctx.beginPath();
            alert("innactive");
        }
    }
    ctx.closePath();
    ctx.stroke();
}


//--CLASSES AND GLOBAL FUNCTIONS--
function drawFill( array ) {
    ctx.beginPath();
    ctx.moveTo(wd/2 + array[0].x, ht/2 + array[0].y);
    for (var i=0; i<array.length-1; i++) {
        ctx.lineTo(wd/2 + array[i+1].x, ht/2 + array[i+1].y);
    }
    ctx.closePath();
    //ctx.fillStyle = "#002200";
    ctx.fillStyle = "rgba(0, "+(30-parseInt(blue/8.5))+","+parseInt(blue/8.5)+","+bgAlpha+")";
    ctx.fill();
}

function Vector3(x,y,z) { //Simple vector class
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
    
    this.rotate = function( axis, angle ) {
        var a;
        var b;
        if (axis=="z") {
            a = this.x*Math.cos(angle) - this.y*Math.sin(angle);
            b = this.x*Math.sin(angle) + this.y*Math.cos(angle);
            this.x = a;
            this.y = b;
        }
        else if (axis=="y") {
            a = this.z*Math.cos(angle) - this.x*Math.sin(angle);
            b = this.z*Math.sin(angle) + this.x*Math.cos(angle);
            this.z = a;
            this.x = b;
        }
        else if (axis=="x") {
            a = this.y*Math.cos(angle) - this.z*Math.sin(angle);
            b = this.y*Math.sin(angle) + this.z*Math.cos(angle);
            this.y = a;
            this.z = b;
        }
    }
    
    this.angleToAxis = function( axis ) {
        if (axis == "x") {
            return Math.atan2(this.y, this.x);
        }
    }

}

function Cube() {//Main cube class
    this.size = wd/10;
    this.initSize = wd/10;
    this.x = 0;
    this.y = 0;
    this.verts = [];
    
    this.reset = function() {
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
    }
    this.reset();
    
    this.controlVect = this.verts[0].add( this.verts[4] );
    
    this.rotate = function(axis, angle) {
        for (var i=0; i<this.verts.length; i++) {
            this.verts[i].rotate(axis, angle);
        }
    }
    
    this.setRotation = function(axis, angle) {
        this.reset();
        this.rotate(axis, angle);
    }
    
    this.drawWireframe = function() {
        //ctx.strokeStyle = "#003300";
        if (key.hide==false) var bl = blue/2.55;
        ctx.strokeStyle = "rgb(0, "+parseInt(100-bl)+","+parseInt(bl)+")";
        ctx.lineWidth = 2;
        for (var i=0; i<this.verts.length; i++) {
			//!!STEPTHROUGH!!
            for (var j=0; j<this.verts.length; j++) {
				//!!STEPTHROUGH!!
                if (j!=i) {
                    var a = this.verts[i].x;
                    var b = this.verts[i].y;
                    var c = this.verts[j].x;
                    var d = this.verts[j].y;

                    ctx.beginPath();
                    ctx.moveTo(wd/2 + a, ht/2 + b);
                    ctx.lineTo(wd/2 + c, ht/2 + d);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
    
    this.getOutline = function() {
        var max = -10000;
        var min = 10000;
        for (var i=0; i<this.verts.length; i++) {
			//!!STEPTHROUGH!!
            if (this.verts[i].z > max)
                max = this.verts[i].z;
            if (this.verts[i].z < min)
                min = this.verts[i].z;
        }
        var outline = [];
        for (var i=0; i<this.verts.length; i++) {
			//!!STEPTHROUGH!!
            if (this.verts[i].z != max && this.verts[i].z != -max) {
                outline.push( this.verts[i] );
            }
        }
        return outline;
    }
    
    this.draw = function( arg ) {
        var outline = this.getOutline();
        outline.sort( function(a,b) {
            var aAng = a.angleToAxis("x");
            var bAng = b.angleToAxis("x");
            return aAng - bAng;
        });
        
        if (arg!="outlineOnly")
            drawFill( outline );
        
        if (arg=="outline" || arg=="outlineOnly") {
            if (key.hide==false || this.size==7) draw( outline );
        }
    }
    
    this.highlightVerts = function( array ) {
        if (array==null)
            array = this.verts;
        for (var i=0; i<array.length; i++) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            var x = wd/2 + array[i].x;
            var y = ht/2 + array[i].y;
            ctx.arc( x, y, 5, 0, Math.PI*2, false)
            ctx.fill();
            ctx.closePath();
        }
    }
}


function Cubes( amount, spacing ) {
    this.amount = amount;
    this.spacing = spacing;
    this.cubes = [];
    for (var i=0; i<amount; i++) {
        var cube = new Cube();
        cube.size = this.spacing*this.amount;
        cube.size -= i*this.spacing;
        cube.reset();
        this.cubes.push( cube );
    }
    
    this.centreCube = new Cube();
    this.centreCube.size = 7;
    
    this.controlVect = this.cubes[0].verts[0].add( this.cubes[0].verts[4] );
    
    this.reset = function() {
        for (var i=0; i<this.cubes.length; i++) {
            this.cubes[i].reset();
        }
        this.centreCube.reset();
        
        this.rotate("y", Math.PI/4);
        this.rotate("x", -Math.PI/8);
        
        this.rotateCentre("y", Math.PI/4);
        this.rotateCentre("x", -Math.PI/8);
    }
    
    this.setControlVect = function(x,y,z) {
        for (var i=0; i<this.cubes.length; i++) {
            this.cubes[i].reset();
        }
    }
    
    this.rotate = function( axis, angle ) {
        for (var i=0; i<this.cubes.length; i++) {
            this.cubes[i].rotate( axis, angle );
        }
    }
    
    this.rotateCentre = function( axis, angle ) {
        this.centreCube.rotate( axis, angle );
    }
    
    this.draw = function()  {
        for (var i=0; i<this.cubes.length; i++) {
            if(this.cubes[i].size>0) {
                this.cubes[i].draw();
                this.cubes[i].drawWireframe();
            }
        }
        for (var i=0; i<this.cubes.length; i++) {
            this.cubes[i].draw("outlineOnly");
        }
        this.centreCube.draw("outlineOnly");
        
        /*
        this.cubes[this.cubes.length-1].highlightVerts([
            this.cubes[this.cubes.length-1].verts[0],
            this.cubes[this.cubes.length-1].verts[4]
        ]);
        */
        
    }
    this.reset();
    
}



//Initiate cubes
var cubes = new Cubes(7, 200);
cubes.cubes[0].verts[2].active = false;
var speedUp = 1;

var zRot = 0;
var xRot = 0;
function render() {
    requestAnimationFrame( render );
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0,0,wd,ht);
    
    //--Drawing code goes here--
    cubes.reset();
    cubes.rotate('x', xRot);
    cubes.rotate('z', zRot);
    cubes.rotateCentre('x', xRot);
    cubes.rotateCentre('z', zRot);
    
    if (key.down) xRot += 0.02;
    if (key.up) xRot -= 0.02;
    if (key.right) zRot += 0.02;
    if (key.left) zRot -= 0.02;
    
    //Slowly rotate in both axes
    zRot += 0.005;
    xRot += 0.001;
    
    
    for (var i=0; i<cubes.cubes.length; i++) {
        cubes.cubes[i].size -= 0.5*speedUp;
    }
    
    //Cubes shrink and then grow
    /*
    if (Math.abs(cubes.cubes[cubes.cubes.length-1].size) > cubes.spacing*cubes.amount/2) {
        var cube = new Cube();
        cube.size = cubes.spacing*cubes.amount/2;
        cubes.cubes.pop();
        cubes.cubes.unshift( cube );
    }
    */
    
    //Cubes shrink and then dissapere
    for (var i=0; i<cubes.cubes.length; i++) {
        if (cubes.cubes[i].size < 1) {
            var cube = new Cube();
            cube.size = cubes.spacing*cubes.amount/2;
            cubes.cubes.pop();
            cubes.cubes.unshift( cube );
        }
    }
    
    
    cubes.draw();
    
    blue += dir*0.5;
    if (blue > 300 || blue < 0) dir *= -1;
}
render();