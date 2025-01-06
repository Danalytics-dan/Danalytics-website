const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Number of dots
const numDots = 100;
const dots = [];

// Define the FPS (frames per second) target
const targetFPS = 120; // Change this value to your desired FPS (e.g., 24, 30, 60)
const frameInterval = 1000 / targetFPS; // Interval between frames in milliseconds
let lastFrameTime = 0; // Track the last time a frame was rendered

// Create a Dot class
class Dot {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 3;
    }

    // Update position of dot with easing for smoother movement
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce the dots off the edges
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    // Draw the dot
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#66FCF1';  // Color updated to #66FCF1
        ctx.fill();
        ctx.closePath();
    }
}

// Generate random dots with random velocities
for (let i = 0; i < numDots; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const vx = (Math.random() - 0.5) * 2;  // Random velocity
    const vy = (Math.random() - 0.5) * 2;
    dots.push(new Dot(x, y, vx, vy));
}

// Optimized mouse move event using requestAnimationFrame
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

// Function to draw the canvas content
function draw(timestamp) {
    // Calculate the time elapsed since the last frame
    const deltaTime = timestamp - lastFrameTime;

    // Only draw if enough time has passed (frame limiter)
    if (deltaTime >= frameInterval) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw all the dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].update();  // Move the dot
            dots[i].draw();    // Draw the dot
        }

        // Draw lines between dots near the cursor
        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];
            const distance = Math.sqrt(Math.pow(dot.x - cursorX, 2) + Math.pow(dot.y - cursorY, 2));

            if (distance < 150) {  // If the dot is within 150px from the cursor
                ctx.beginPath();
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(cursorX, cursorY);
                ctx.strokeStyle = '#66FCF1';  // Color updated to #66FCF1
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();
            }
        }

        // Update the last frame time
        lastFrameTime = timestamp;
    }

    // Request the next frame
    requestAnimationFrame(draw);
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start the drawing loop
requestAnimationFrame(draw);
