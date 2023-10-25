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
const mouseRadius = 100;

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
    // Current position
    x: number;
    y: number;
    // Initial position
    initialX: number;
    initialY: number;
    // Weight
    density: number;
    // Particle size
    size: number;
    // Color
    color: string;
    // initial motion direction (number bewtween -1 and 1)
    motionX: number;
    motionY: number;

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
        // Setting initial motion direction modifiers randomly between 0 and 0.5
        this.motionX = Math.random() * 2;
        if(this.motionX > 1) this.motionX = -this.motionX + 1;
        this.motionY = Math.random();
        if(this.motionY > 1) this.motionY = -this.motionY + 1;
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

    updateFree() {
        // Calculating distance between mouse and particle
        let xDiff = mousePosition.x! - this.x;
        let yDiff = mousePosition.y! - this.y;
        let dist = Math.sqrt(xDiff ** 2 + yDiff ** 2);

        // Linking with close particles
        const closeParticles = particleArray.filter(particle => {
            (particle.x - this.x < 50) && (particle.y - this.y < 50)
        });
        for (let i = 0; i < closeParticles.length; i++) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.2;
            ctx.strokeWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(closeParticles[i].x, closeParticles[i].y);
            ctx.stroke();
        }

        // Calculating particle movement's direction and speed
        let xDirection = 1;
        let yDirection = 1; 
        if(dist < mouseRadius) {
            // For mouse interaction
            let speed = (mouseRadius - dist) / mouseRadius; 
            xDirection = (xDiff / dist) * speed * this.density;
            yDirection = (yDiff / dist) * speed * this.density;
        }

        // Updating particle's position with modified motion direction
        this.x -= xDirection * this.motionX;
        this.y -= yDirection * this.motionY;

        // Managing bounce
        if(this.x < 0 || this.x > canvas.width) {
            this.motionX = -this.motionX;
        }
        if(this.y < 0 || this.y > canvas.height) {
            this.motionY = -this.motionY;
        }

        /* Bugs:
            - particles are strady when interacting with mouse
            - some particles stick to the mouse back and forth at high speed
        */
    }

    updateRepelling() {
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

function repellingAnimate(){
    // @ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].updateRepelling();
    }
    // connect();
    // @ts-ignore
    requestAnimationFrame(repellingAnimate);
}
function animateFree(){
    // @ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].updateFree();
    }
    // connect();
    // @ts-ignore
    requestAnimationFrame(animateFree);
}

function animate(type: "free" | "repelling" = "free"){
    switch(type) {
        case "free":
            animateFree();
            break;
        case "repelling":
            repellingAnimate();
            break;
    }
}

animate("free")