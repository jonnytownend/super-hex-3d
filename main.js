function setup() {
    // Game setup code
    game = new Game();
    cube = new Cube();
    cube.player = true;
    cube.controlMode = 'snap';
    cube.init();
    game.addObject(cube);
}

function draw() {
    // Frame draw code goes here
    cube.update();
    cube.draw(['wireframe', 'outline']);
    cube.verts[0].active = false;
}