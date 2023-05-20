//Boiler code

const {Engine, Render, Runner, World, Bodies, Body, Events} = Matter;


const cellsHorizontal = 14;
const cellsVertical = 10;
let width = window.innerWidth;
let height = window.innerHeight;

let unitLengthx = width / cellsHorizontal;
let unitLengthy = width / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;

const {world} = engine;

const render = Render.create({
  element : document.body,
  engine : engine,
  options :{
    width,
    wireframes : false,
    height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);


// Draw Border

const walls = [
 Bodies.rectangle(width / 2, 0, width, 2, {isStatic : true}),

 Bodies.rectangle(width / 2, height, width, 2, {isStatic : true}),

 Bodies.rectangle(0, height / 2, 2, height, {isStatic : true}),

 Bodies.rectangle(width, height / 2, 2, height, {isStatic : true})

]
World.add(world, walls);



const shuffle = (arr) =>{
  let counter = arr.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
     arr[counter] = arr[index];
     arr[index] = temp;
  }
  return arr;
}

//2d array
// for (var i = 0; i < 3; i++) {
//   grid.push([]);
//   for (var j = 0; j < 3; j++) {
//       grid[i].push([false]);
//   }
// }
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

//vertical Array

const vertical = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal-1).fill(false));

const horizontal = Array(cellsVertical-1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughNeighbour =  (row, column) => {
  //check if already visited
  if (grid[row][column]) {
    return;
  }

  //if visiting for first time
  grid[row][column] = true;

  //neighbours
  const neighbours = shuffle([
    [row - 1, column, "up"],
    [row, column - 1, "left"],
    [row, column + 1, "right"],
    [row + 1, column, "down"]
  ])

  //check for out of bounds
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;

    if(nextRow < 0 || nextRow >= cellsVertical || nextColumn >= cellsHorizontal || nextColumn < 0){
      continue;
    }

    if(grid[nextRow][nextColumn]) {
      continue;
    }
    if (direction === "left") {
      vertical[row][column -1] = true;
    }else if (direction === "right") {
      vertical[row][column] = true;
    }else if (direction === "up") {
      horizontal[row -1][column] = true
    }else if (direction === "down") {
      horizontal[row][column] = true
    }
    stepThroughNeighbour(nextRow, nextColumn);
  }
}

stepThroughNeighbour(startRow, startColumn);

horizontal.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthx + unitLengthx / 2,
      rowIndex * unitLengthy + unitLengthy,
      unitLengthx,
      5,{
        label : 'wall',
        isStatic : true,
        render: {
          fillStyle : 'red'
        }
      }
    );
    World.add(world, wall)
  });
});

vertical.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthx + unitLengthx,
      rowIndex * unitLengthy + unitLengthy / 2,
      5,
      unitLengthy,{
        label : 'wall',
        isStatic : true,
        render: {
          fillStyle : 'red'
        }
      }
    );
    World.add(world, wall)
  });
});

const goal = Bodies.rectangle(
  width - unitLengthx/2,
  height - unitLengthy/2,
  unitLengthx * 0.7,
  unitLengthy * 0.7,
  {
    label : "goal",
    isStatic : true,
    render: {
      fillStyle : 'green'
    }
  }
)

World.add(world, goal);

const ballRadius = Math.min(unitLengthx, unitLengthy) / 4;
const ball = Bodies.circle(
  unitLengthx/2,
  unitLengthy/2,
  ballRadius,{
    label : "ball",
    render: {
      fillStyle : 'white'
    }
  }
)
World.add(world, ball);

document.addEventListener("keydown",(event)=>{

  const {x, y} = ball.velocity;

  if (event.keyCode === 87) {
    Body.setVelocity(ball, {x, y: y - 5 });
  }
  if (event.keyCode === 68) {
    Body.setVelocity(ball, {x: x + 5, y });
  }
  if(event.keyCode === 83) {
    Body.setVelocity(ball, {x, y: y + 5 });
  }
  if (event.keyCode === 65) {
    Body.setVelocity(ball, {x:x - 5, y });
  }
})


Events.on(engine, 'collisionStart', event =>{
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if(labels.includes(collision.bodyA.label)&&labels.includes(collision.bodyB.label)){
      world.gravity.y = 1;
      world.bodies.forEach(body =>{
        if(body.label ==="wall"){
          Body.setStatic(body, false);
        }
      })
    }
  });

})
