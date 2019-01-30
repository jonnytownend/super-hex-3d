function renderLoop() {
    ctx.fillStyle = game.bgcolor;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    draw();
    
    if (game.test) {
        clearCanvas();
        return;
    }
    window.requestAnimationFrame(renderLoop);
}
setup();
renderLoop();