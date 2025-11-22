import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const enrollUserInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);
    
    // Update user's enrolledCourses array
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    currentUser.enrolledCourses = enrollments.map((e) => e.course);
    req.session["currentUser"] = currentUser;
    
    res.json(currentUser);
  };

  const unenrollUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    dao.unenrollUserFromCourse(currentUser._id, courseId);
    
    // Update user's enrolledCourses array
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    currentUser.enrolledCourses = enrollments.map((e) => e.course);
    req.session["currentUser"] = currentUser;
    
    res.json(currentUser);
  };

  const findEnrollmentsForUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  const findEnrollmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  };

  app.post("/api/courses/:courseId/enrollments", enrollUserInCourse);
  app.delete("/api/courses/:courseId/enrollments", unenrollUserFromCourse);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
}