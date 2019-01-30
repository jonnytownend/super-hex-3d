// ---------------------------
// GLOBAL FUNCTIONS
function clearCanvas() {
    // 'Quick and nasty' function for clearing the canvas during testing
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function test() {
    /*  'Quick and dirty' function to turn on 'testing'
        When testing is on, the animation loop cannot progress. The game is essentially frozen. */
    game.test = true;
}

// ----------------------------
// CLASSES

function Game() {
    // Game class holds all info about the game, including objects in the game and 'meta' methods like pausing and restarting the game.
    
    this.test = false;
    this.bgcolor = "black";
    this.objects = [];  // Holds objects to be updated and rendered in scene
    
    this.playerInput = {
        // Contains x,y input from player (ie. 'w,a,s,d' key presses)
        x: 0,
        y: 0,
        z: 0
    };
    
    this.addObject = function(obj) {
        // Adds an object to the scene
        obj.parent = this;
        this.objects.push(obj);
    }
    
    this.rotate = function(axis, angle) {
        // Rotate entire scene
        for (var i in this.objects)
            this.objects[i].rotate(axis, angle);
    }
    
    this.update = function() {
        // Update each object in the scene
        for (var i in this.objects)
            this.objects[i].update();
    }
    
    this.draw = function() {
        // Draw each object in the scene
        for (var i in this.objects)
            this.objects[i].draw();
    }
}

function GameObject() {
    // Base class for all objects in the game (all game objects inherit from this class)
    
    this.parent = null; // If 'true', then Game.playerInput effects this
    this.player = false;
    this.anchor = new Vector3(canvas.width/2, canvas.height/2, 0);
}

function CubeVert(x,y,z,i) {
    /*  An abstracted Vector3 used for Cube vertices
        Cube vert allows the vertex to be given an index so that vertex order can be tracked. It can also be made 'in-active', meaning that it will won't be drawn. */
    Vector3.apply(this, arguments);
    this.index = i;
    this.active = true;
}
CubeVert.prototype = Object.create(Vector3.prototype);

function Cube() {
    // A single rotating cube, controlled by the user.
    
    this.color = "green"; // Draw color
    this.size = canvas.width/5; // Radial size, not edge size!!
    this.modes = ['wireframe']; // Modes of rendering [wireframe, outline]
    this.verts = [];
    this.disabledEdges = []; // Pairs of neighbouring indexes that won't be draw
    this.controlVect = new Vector3(0,0,-1); // Vector used to represent that entire orientation of the Cube
    this.controlMode = 'full';
    
    this.init = function() {
        var s = this.size;
        this.verts = [
            new CubeVert(-s,-s,s, 0),
            new CubeVert(s,-s,s, 1),
            new CubeVert(s,-s,-s, 2),
            new CubeVert(-s,-s,-s, 3),
            new CubeVert(s,s,-s, 4),
            new CubeVert(-s,s,-s, 5),
            new CubeVert(s,s,s, 6),
            new CubeVert(-s,s,s, 7)
        ];
        for (var i in this.verts) {
            // Rotate into default 'hexagon' outline shape
            this.verts[i].rotate('y',Math.PI/4);
            this.verts[i].rotate('x',Math.PI/5.1);
        }
    }
    this.init();
    
    this.disableEdge = function(i1, i2) {
        // Disables edge between CubeVerts with indices i1, i2
        this.disabledEdges.push([i1, i2]);
    }
    
    this.rotateVerts = function(axis, angle) {
        // Rotate each CubeVert
        for (var i in this.verts) {
            this.verts[i].rotate(axis, angle);
        }
    }
    
    this.rotate = function(axis, angle) {
        this.rotateVerts(axis, angle);
        this.controlVect.rotate(axis, angle); // controlVect is also rotated
    }
    
    this.getXrot = function() {
        // Get the angle of x-rotation between controlVect and Vector3(0,0,-1)
        var xPlane = new Vector3(0,0,0);
        xPlane.copy(this.controlVect);
        xPlane.x = 0;
        var xRot = xPlane.angleTo(z_hat.negative());
        if (this.controlVect.y < 0)
            xRot = -Math.abs(xRot);
        return xRot;
    }
    
    this.getYrot = function() {
        // Get the angle of y-rotation between controlVect and Vector3(0,0,-1)
        var yPlane = new Vector3(0,0,0);
        yPlane.copy(this.controlVect);
        yPlane.y = 0;
        var yRot = yPlane.angleTo(z_hat.negative());
        if (this.controlVect.x < 0)
            yRot = -Math.abs(yRot);
        return yRot;
    }
    
    this.drawWireframe = function() {
        var x = this.anchor.x;
        var y = this.anchor.y;
        ctx.beginPath();
        for (var i in this.verts) {
            for (var j in this.verts) {
                if (i!=j) {
                    ctx.moveTo(
                        x + this.verts[i].x,
                        y + this.verts[i].y
                    );
                    ctx.lineTo(
                        x + this.verts[j].x,
                        y + this.verts[j].y
                    );
                }
            }
        }
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    
    this.drawOutline = function() {
        var wd = this.anchor.x;
        var ht = this.anchor.y;
        
        var outline = this.verts.slice();
        outline.sort( function(a,b) {
            return a.z - b.z;
        });
        outline = outline.slice(1,outline.length-1);
        
        outline.sort( function(a,b) {
            var v_a = new THREE.Vector2(a.x, a.y);
            var v_b = new THREE.Vector2(b.x, b.y);
            var aAng = v_a.angle();
            var bAng = v_b.angle();
            return aAng - bAng;
        });
        
        for (var i=0; i<outline.length; i++) {
            ctx.beginPath();
            ctx.moveTo(
                wd + outline[i].x,
                ht + outline[i].y
            );
            if (i == outline.length-1)
                j = 0;
            else
                j = i+1;
            ctx.lineTo(
                wd + outline[j].x,
                ht + outline[j].y
            );
            
            var doDraw = true;
            for (var k in this.disabledEdges) {
                if (
                    (outline[i].index == this.disabledEdges[k][0] &&
                    outline[j].index == this.disabledEdges[k][1]) ||
                    (outline[i].index == this.disabledEdges[k][1] &&
                    outline[j].index == this.disabledEdges[k][0])
                ) {
                    doDraw = false;
                }
            }
                
            if (doDraw) {
                ctx.lineWidth = 8;
                ctx.strokeStyle = this.color;
                ctx.stroke();
            }
        }
    }
    
    this.draw = function(modes) {
        /*  Will draw for all modes in this.modes
            Can be overwridden with 'modes' argument */
        if (typeof modes == 'undefined')
            modes = this.modes;
        for (var i in modes) {
            if (modes[i] == 'wireframe')
                this.drawWireframe();
            else if (modes[i] == 'outline')
                this.drawOutline();
        }
    }
    
    this.fullUpdate = function() {
        this.init();
        var xRot = this.getXrot();
        var yRot = this.getYrot();
        this.rotateVerts('x', xRot);
        this.rotateVerts('y', yRot);
    }
    
    this.update = function() {
        if (this.controlMode == 'test') {
            this.controlVect.y -= 0.01;
            this.fullUpdate();
        }
        
        if (this.player && this.controlMode == 'full') {
            /*  Complete player control
                Player input corresponds to the exact rotation of the Cube */
            var rotSpeed = 0.01;
            this.rotate('y', rotSpeed*this.parent.playerInput.x);
            this.rotate('x', rotSpeed*this.parent.playerInput.y);
            this.rotate('z', rotSpeed*this.parent.playerInput.z);
        }
        
        if (this.controlMode == 'snap') {
            var rotSpeed = 0.05;
            var inpX = this.parent.playerInput.x;
            var inpY = this.parent.playerInput.y;
            
            if (inpY==0) {
                this.controlVect.rotate(
                    'x',
                    -Math.sign(this.controlVect.y)*rotSpeed
                );
            }
            
            if (inpX==0) {
                this.controlVect.rotate(
                    'y',
                    Math.sign(this.controlVect.x)*rotSpeed
                );
            }
            
            var xRot = this.getXrot();
            var yRot = this.getYrot();
            
            this.controlVect.rotate('y', -inpX*rotSpeed);
            this.controlVect.rotate('x', inpY*rotSpeed);
            
            var maxX = 0.95;
            var minX = -0.6
            if (xRot > maxX) {
                this.controlVect.rotate('x', -xRot);
                this.controlVect.rotate('x', maxX);
            }
            if (xRot < minX) {
                this.controlVect.rotate('x', -xRot);
                this.controlVect.rotate('x', minX);
            }
            
            var maxY = 
            
            this.fullUpdate();
        }
        
        for (var i in this.verts) {
            // Scale vertices
            this.verts[i].setLength(this.size);
        }
    }
    this.update();
}
Cube.prototype = new GameObject();