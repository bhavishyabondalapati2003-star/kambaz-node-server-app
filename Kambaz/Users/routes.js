import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  
  // Helper function to add enrolled courses to user
  const addEnrolledCourses = (user) => {
    const { enrollments } = db;
    const userEnrollments = enrollments
      .filter((e) => e.user === user._id)
      .map((e) => e.course);
    return { ...user, enrolledCourses: userEnrollments };
  };
  
  const createUser = (req, res) => { };
  const deleteUser = (req, res) => { };
  const findAllUsers = (req, res) => { };
  const findUserById = (req, res) => { };
  
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    let currentUser = dao.findUserById(userId);
    currentUser = addEnrolledCourses(currentUser);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    let currentUser = dao.createUser(req.body);
    currentUser = addEnrolledCourses(currentUser);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  
  const signin = (req, res) => {
    const { username, password } = req.body;
    let currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      currentUser = addEnrolledCourses(currentUser); // ADD THIS LINE
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  
  const profile = (req, res) => {
    let currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    currentUser = addEnrolledCourses(currentUser); // ADD THIS LINE
    res.json(currentUser);
  };

  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const { enrollments, users } = db;
    
    const enrolledUserIds = enrollments
      .filter((e) => e.course === courseId)
      .map((e) => e.user);
    
    const enrolledUsers = users.filter((user) =>
      enrolledUserIds.includes(user._id)
    );
    
    res.json(enrolledUsers);
  };
  
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
}