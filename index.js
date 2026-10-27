const HEIGHT = 9 * 100;
const WIDTH = 16 * 100;


const BACKGROUND_COLOR = "black"
const FOREGROUND_COLOR = "blue";

const POINT_SIZE = 10;
var ctx;
var canvas;

function init_window()
{
    canvas = document.getElementById("canv");
    canvas.height = HEIGHT;
    canvas.width = WIDTH;

    ctx = canvas.getContext("2d");
} init_window();

function clear_canvas()
{
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0,0 , WIDTH, HEIGHT);
}


function draw_canvas({a, b})
{
    ctx.fillStyle = FOREGROUND_COLOR;
    ctx.fillRect(a - POINT_SIZE / 2,b - POINT_SIZE / 2 , POINT_SIZE, POINT_SIZE);
}


function canvas2clip(x,y)
{
    // go from [0, w] -> [-1, 1];
    // go from [0, h] -> [-1, 1];

    return {
        a: (x * 2.0 / WIDTH  ) - 1,
        b: (y * -2.0 / HEIGHT  ) - 1,
    };
}


function clip2canvas({a, b})
{
    return {
        a: (a + 1) * WIDTH / 2.0,
        b: (b - 1) * -HEIGHT /2.0
    };
}


function project({a, b, c}){
    if (c != 0){
        return {
            a: a / c,
            b: b / c,
        };
    }else{
        return {a:0,b:0};
    }
}



const verts = [
    {a: 0.5, b:0.5, c:0.25},
    {a: -0.5, b:0.5, c:0.25},
    {a: 0.5, b:-0.5, c:0.25},
    {a: -0.5, b:-0.5, c:0.25}

]

function rotate_xz({a,b,c}, theta)
{
    const co = Math.cos(theta);
    const si = Math.sin(theta);

    return {
        a: a * co - c * si,
        b: b,
        c: c * co + a * si,
    }
}

let startTime = null;
var angle = 2 * Math.PI;

const FPS = 60;
var dz = 1;
var angle = 0;
function render(timestamp)
{
    clear_canvas();
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const dt = 1.0 / FPS;
    angle += Math.PI * dt;
    for (const vert of verts){
        draw_canvas(clip2canvas(project(rotate_xz(vert, angle ))));
    }


        window.requestAnimationFrame(render);

}

const requestID = window.requestAnimationFrame(render, 0);
