$(document).keydown(function(e) {
    var c = String.fromCharCode(e.which);
    
    switch (c) {
        case 'A':
            game.playerInput.x = 1;
            break;
        case 'D':
            game.playerInput.x = -1;
            break;
        case 'W':
            game.playerInput.y = -1;
            break;
        case 'S':
            game.playerInput.y = 1;
            break;
        case 'Q':
            game.playerInput.z = 1;
            break;
        case 'E':
            game.playerInput.z = -1;
    }
});

$(document).keyup(function(e) {
    var c = String.fromCharCode(e.which);
    
    switch (c) {
        case 'A':
            game.playerInput.x = 0;
            break;
        case 'D':
            game.playerInput.x = 0;
            break;
        case 'W':
            game.playerInput.y = 0;
            break;
        case 'S':
            game.playerInput.y = 0;
            break;
        case 'Q':
            game.playerInput.z = 0;
            break;
        case 'E':
            game.playerInput.z = 0;
            break;
    }
});