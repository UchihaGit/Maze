//Boiler code

const {Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse} = Matter;

const engine = Engine.create();

const {world} = engine;

let width = 800;
let height = 600;

const render = Render.create({
  element : document.body,
  engine : engine,
  options :{
    wireframes : false,
    width : width,
    height : height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

World.add(world, MouseConstraint.create(engine, {
  mouse: Mouse.create(render.canvas)
}));

// Draw Border

const walls = [
 Bodies.rectangle(400, 0, 800, 10, {isStatic : true}),

 Bodies.rectangle(400, 600, 800, 10, {isStatic : true}),

 Bodies.rectangle(800, 300, 10, 600, {isStatic : true}),

 Bodies.rectangle(0, 300, 10, 600, {isStatic : true})

]
World.add(world, walls);

// Draw box
//World.add(world, Bodies.rectangle(200, 200, 100, 100, {isStatic : false}), Bodies.circle(400, 200, 100));

// Random shapes

for (var i = 0; i < 20; i++) {
  if(Math.random()<0.5)
    World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 30))
  else
  World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 100, 100, {
    render : {
      fillStyle : "red"
  }}))
}

let a;
console.log(a);
if (a) {
  console.log(a);
}
