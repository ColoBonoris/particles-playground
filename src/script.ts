// @ts-ignore
const canvas = document.getElementById('canvas1'); 
// @ts-ignore
const ctx = canvas.getContext('2d');
// @ts-ignore
canvas.width = window.innerWidth;
// @ts-ignore
canvas.height = window.innerHeight;
let particleArray: Particle[] = [];

// handle mouse
interface MousePosition {
    x: number | null;
    y: number | null;
}
const mousePosition: MousePosition = {
    x: null,
    y: null
}
const mouseRadius = 300;

// @ts-ignore
window.addEventListener('mousemove', function(e){
    mousePosition.x = e.x;
    mousePosition.y = e.y;
});

ctx.fillStyle = '#EDCD44'
ctx.font = '300px Verdana';
ctx.fillText('A', 0, 300);
const data = ctx.getImageData(0, 0, 100, 100);

class Particle {
    x: number;
    y: number;
    size: number;
    initialX: number;
    initialY: number;
    density: number;
    color: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.initialX = this.x;
        this.initialY = this.y;
        this.density = (Math.random() * 70) + 1;

        // choosing between 2 colors randomly
        // this.color = (Math.random() < 0.5 ? '#DC3E26' : '#EDCD44')
        this.color = '#EDCD44';
    }

    draw() {
        ctx.fillStyle = this.color;

        ctx.beginPath();

        // shadows
        // ctx.shadowBlur=5;
        // ctx.shadowColor="#777777";

        // drawing the particles
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Calculating distance between mouse and particle
        let xDiff = mousePosition.x! - this.x;
        let yDiff = mousePosition.y! - this.y;
        let dist = Math.sqrt(xDiff ** 2 + yDiff ** 2);

        // Calculating particle movement's direction and speed
        let xDirection;
        let yDirection; 
        if(dist < mouseRadius) {
            // For mouse interaction
            let speed = (mouseRadius - dist) / mouseRadius; 
            xDirection = (xDiff / dist) * speed * this.density;
            yDirection = (yDiff / dist) * speed * this.density;
        } else {
            // For returning to initial position
            xDirection = (this.x - this.initialX) / 20;
            yDirection = (this.y - this.initialY) / 20;
        }

        // Updating particle's position
        this.x -= xDirection;
        this.y -= yDirection;
    }

}

function init(){
    particleArray = [];
    for (let i = 0; i < 500; i++) {
        const particle = new Particle(
            //@ts-ignore
            Math.random() * canvas.width,
            //@ts-ignore
            Math.random() * canvas.height
        );
        particleArray.push(particle);
    }
}

init();

function animate(){
    // @ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    // connect();
    // @ts-ignore
    requestAnimationFrame(animate);
}

animate()