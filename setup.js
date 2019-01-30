canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
Vector3 = THREE.Vector3; // Wrapper for THREE.Vector3

Vector3.prototype.rotate = function(axis, angle) {
    // A wrapper for THREE.Vector3.applyAxisAngle
    if (typeof axis == 'string') {
        switch (axis) {
            case 'x':
                axis = new Vector3(1,0,0);
                break;
            case 'y':
                axis = new Vector3(0,1,0);
                break;
            case 'z':
                axis = new Vector3(0,0,1);
                break;
        }
    }
    return this.applyAxisAngle(axis, angle);
}

Vector3.prototype.negative = function() {
    /*
    A wrapper for THREE.Vector3
    Can be called on a Vector3 to return the negative of that vector
    */
    var v = new Vector3(0,0,0);
    v.copy(this);
    return v.negate();
}

// Global variables
x_hat = new Vector3(1,0,0);
y_hat = new Vector3(0,1,0);
z_hat = new Vector3(0,0,1);
