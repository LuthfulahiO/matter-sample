var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
  world = engine.world;

Matter.Runner.run(engine);

let w = window.innerWidth;
let h = window.innerHeight;

// create renderer
var render = Render.create({
  element: document.getElementById("canvas"),
  engine: engine,
  options: {
    width: w,
    height: h,
    wireframes: false,
    pixelRatio: window.devicePixelRatio,
    //   showAngleIndicator: true,
  },
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var stack = Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
  var sides = Math.round(Common.random(1, 8));

  // round the edges of some bodies
  var chamfer = null;
  if (sides > 2 && Common.random() > 0.7) {
    chamfer = {
      radius: 10,
    };
  }

  switch (Math.round(Common.random(0, 1))) {
    case 0:
      if (Common.random() < 0.8) {
        return Bodies.rectangle(
          x,
          y,
          Common.random(25, 50),
          Common.random(25, 50),
          { chamfer: chamfer }
        );
      } else {
        return Bodies.rectangle(
          x,
          y,
          Common.random(80, 120),
          Common.random(25, 30),
          { chamfer: chamfer }
        );
      }
    case 1:
      return Bodies.polygon(x, y, sides, Common.random(25, 50), {
        chamfer: chamfer,
      });
  }
});

const wallOptions = {
  isStatic: true,
  render: {
    visible: true,
  },
};

const ground = Bodies.rectangle(w / 2, h + 50, w + 100, 100, wallOptions);
const ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions);
const leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions);
const rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions);

Composite.add(world, stack);

Composite.add(world, [ceiling, ground, rightWall, leftWall]);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;
