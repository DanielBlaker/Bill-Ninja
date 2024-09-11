function basicTexture(n) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext('2d');
    var colors = ["#3884AA", "#61686B", "#AA6538", "#61686B", "#AAAA38", "#61686B"];
    ctx.fillStyle = colors[n];
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}
function createTextTexture(text, fontSize = 20, fontFamily = 'Impact') {
    var dimensions = calculateTextDimensions(text, fontSize, fontFamily);
    var canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, 0, index * fontSize);
    });
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function calculateTextDimensions(text, fontSize = 20, fontFamily = 'Arial') {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px ${fontFamily}`;
    var lines = text.split('\n');
    var width = 0;
    var height = lines.length * fontSize;
    lines.forEach(line => {
        var lineWidth = ctx.measureText(line).width;
        if (lineWidth > width) {
            width = lineWidth;
        }
    });
    return { width, height };
}