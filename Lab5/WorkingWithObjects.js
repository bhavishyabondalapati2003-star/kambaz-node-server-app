const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const module = {
  id: 1,
  name: "NodeJS Module",
  description: "Learn about NodeJS and ExpressJS",
  course: "Web Development",
};

export default function WorkingWithObjects(app) {

  // REQUIRED for async HttpClient
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });

  // GET full assignment object
  app.get("/lab5/assignment", (req, res) => {
    res.json(assignment);
  });

  // UPDATE assignment title
  app.get("/lab5/assignment/title/:title", (req, res) => {
    assignment.title = req.params.title;
    res.json(assignment);
  });

  // UPDATE assignment score
  app.get("/lab5/assignment/score/:score", (req, res) => {
    assignment.score = parseInt(req.params.score);
    res.json(assignment);
  });

  // UPDATE completed
  app.get("/lab5/assignment/completed/:completed", (req, res) => {
    assignment.completed = req.params.completed === "true";
    res.json(assignment);
  });

  // GET individual fields
  app.get("/lab5/assignment/title", (req, res) => {
    res.send(assignment.title);
  });
  app.get("/lab5/assignment/score", (req, res) => {
    res.send(assignment.score.toString());
  });
  app.get("/lab5/assignment/completed", (req, res) => {
    res.send(assignment.completed.toString());
  });

  // MODULE ROUTES
  app.get("/lab5/module", (req, res) => {
    res.json(module);
  });

  app.get("/lab5/module/name/:name", (req, res) => {
    module.name = req.params.name;
    res.json(module);
  });

  app.get("/lab5/module/description/:description", (req, res) => {
    module.description = req.params.description;
    res.json(module);
  });

  app.get("/lab5/module/name", (req, res) => {
    res.send(module.name);
  });

  app.get("/lab5/module/description", (req, res) => {
    res.send(module.description);
  });
}
