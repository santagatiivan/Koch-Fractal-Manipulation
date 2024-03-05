// Initialize global variables for storing points and UI elements.
let points = [];
let detailSlider, zoomSlider;
let drawSnowflake = true; // Flag to toggle between snowflake and antiflake drawing.
let toggleButton;

// Sets up the canvas and UI components.
function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window.
  
  // Create and position the detail slider.
  let detailLabel = createP('Details of the snowflake/antisnowflake:');
  detailLabel.position(10, 80);
  detailLabel.style('color', 'white');
  detailSlider = createSlider(0, 6, 0, 1);
  detailSlider.position(10, 120);
  
  // Create and position the zoom slider.
  let zoomLabel = createP('Zoom:');
  zoomLabel.position(10, 140);
  zoomLabel.style('color', 'white');
  zoomSlider = createSlider(1, 10, 1, 0.1);
  zoomSlider.position(10, 180);
  
  // Create and configure the toggle button.
  toggleButton = createButton('Snowflake');
  toggleButton.position(10, 220);
  toggleButton.mousePressed(toggleDrawMode);
  
  // Calculate initial points for the fractal shape.
  calculateInitialPoints();
}

// Calculate the initial triangle points for the snowflake.
function calculateInitialPoints() {
  let angles = [0, TWO_PI / 3, 2 * TWO_PI / 3];
  points = angles.map(a => createVector(Math.cos(a + PI / 6) * 200, Math.sin(a + PI / 6) * 200));
}

// Toggle the drawing mode between snowflake and antisnowflake.
function toggleDrawMode() {
  drawSnowflake = !drawSnowflake;
  toggleButton.html(drawSnowflake ? 'Snowflake' : 'Antisnowflake');
}

// The main drawing loop.
function draw() {
  background(0);
  let detail = detailSlider.value();
  let zoom = zoomSlider.value();

  resetMatrix();
  translate(width / 2, height / 2);
  scale(zoom);
  
  if (drawSnowflake) {
    drawSnowflakeFunction(detail);
  } else {
    drawAntiSnowflake(detail);
  }
}

// Draw the Koch snowflake based on the current detail level.
function drawSnowflakeFunction(detail) {
  stroke(255);
  strokeWeight(0.2);
  beginShape();
  points.forEach((point, i) => {
    let nextIndex = (i + 1) % points.length;
    koch(points[i], points[nextIndex], detail);
  });
  endShape(CLOSE);
}

// Draw the anti-snowflake variant.
function drawAntiSnowflake(detail) {
  stroke(255);
  strokeWeight(0.2);
  beginShape();
  points.forEach((point, i) => {
    let nextIndex = (i + 1) % points.length;
    antiKoch(points[i], points[nextIndex], detail);
  });
  endShape(CLOSE);
}

// Recursively divide a line segment to create the Koch curve.
function koch(start, end, detail) {
  if (detail === 0) {
    line(start.x, start.y, end.x, end.y);
    return;
  }
  let v = p5.Vector.sub(end, start).div(3);
  let p1 = start.copy();
  let p2 = p5.Vector.add(start, v);
  let p3 = p5.Vector.add(p2, v.copy().rotate(-PI / 3));
  let p4 = p5.Vector.add(start, v.mult(2));
  koch(p1, p2, detail - 1);
  koch(p2, p3, detail - 1);
  koch(p3, p4, detail - 1);
  koch(p4, end, detail - 1);
}

// Recursively create the anti-Koch curve by adjusting the division angle.
function antiKoch(start, end, detail) {
  if (detail === 0) {
    line(start.x, start.y, end.x, end.y);
  } else {
    let v = p5.Vector.sub(end, start).div(3);
    let p1 = start.copy();
    let p2 = p5.Vector.add(p1, v);
    let p3 = p5.Vector.add(p2, v.copy().rotate(PI / 3));
    let p4 = p5.Vector.add(p2, v);

    let direction = p5.Vector.sub(p2, p1).rotate(PI / 3).mult(sqrt(3) / 2);
    p3 =p5.Vector.add(p2, direction);

    antiKoch(p1, p2, detail - 1);
    antiKoch(p2, p3, detail - 1);
    antiKoch(p3, p4, detail - 1);
    antiKoch(p4, end, detail - 1);
  }
}
