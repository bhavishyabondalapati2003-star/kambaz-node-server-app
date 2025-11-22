import PathParameters from "./PathParameters.js";
import QueryParameters from "./QueryParameters.js";
import WorkingWithObjects from "./WorkingWithObjects.js";
import WorkingWithArrays from "./WorkingWithArrays.js";
import HttpRoutes from "./HttpRoutes.js";

export default function Lab5(app) {
  // Welcome route
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });

  // Register all Lab 5 modules
  PathParameters(app);
  QueryParameters(app);
  WorkingWithObjects(app);
    WorkingWithArrays(app);
    HttpRoutes(app);
}
