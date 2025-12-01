import UsersDao from "./dao.js";
import db from "../Database/index.js";

export default function UserRoutes(app) {
  const dao = UsersDao();
  
  const addEnrolledCourses = (user) => {
    const { enrollments } = db;
    const userEnrollments = enrollments
      .filter((e) => e.user === user._id)
      .map((e) => e.course);
    return { ...user, enrolledCourses: userEnrollments };
  };
  
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    const userObject = user.toObject ? user.toObject() : user;
    res.json(userObject);
  };
  
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    
    if (role) {
      const users = await dao.findUsersByRole(role);
      const usersArray = users.map(u => u.toObject ? u.toObject() : u);
      res.json(usersArray);
      return;
    }
    
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      const usersArray = users.map(u => u.toObject ? u.toObject() : u);
      res.json(usersArray);
      return;
    }
    
    const users = await dao.findAllUsers();
    const usersArray = users.map(u => u.toObject ? u.toObject() : u);
    res.json(usersArray);
  };
  
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    const userObject = user.toObject ? user.toObject() : user;
    res.json(userObject);
  };
  
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    let currentUser = await dao.findUserById(userId);
    const userObject = currentUser.toObject ? currentUser.toObject() : currentUser;
    const userWithCourses = addEnrolledCourses(userObject);
    req.session["currentUser"] = userWithCourses;
    res.json(userWithCourses);
  };
  
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    let currentUser = await dao.createUser(req.body);
    const userObject = currentUser.toObject ? currentUser.toObject() : currentUser;
    const userWithCourses = addEnrolledCourses(userObject);
    req.session["currentUser"] = userWithCourses;
    res.json(userWithCourses);
  };
  
  const signin = async (req, res) => {
    const { username, password } = req.body;
    let currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      const userObject = currentUser.toObject ? currentUser.toObject() : currentUser;
      const userWithCourses = addEnrolledCourses(userObject);
      req.session["currentUser"] = userWithCourses;
      res.json(userWithCourses);
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
    // currentUser from session is already a plain object, but just in case:
    const userObject = currentUser.toObject ? currentUser.toObject() : currentUser;
    const userWithCourses = addEnrolledCourses(userObject);
    res.json(userWithCourses);
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