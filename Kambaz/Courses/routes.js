import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();
  
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    const coursesArray = courses.map(c => c.toObject ? c.toObject() : c);
    res.json(coursesArray);
  };
  
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    const coursesArray = courses.map(c => c.toObject ? c.toObject() : c);
    res.json(coursesArray);
  };
  
  const createCourse = async (req, res) => {
    const newCourse = await dao.createCourse(req.body);
    const currentUser = req.session["currentUser"];
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }
    const courseObject = newCourse.toObject ? newCourse.toObject() : newCourse;
    res.json(courseObject);
  };
  
  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.json(status);
  };
  
  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.json(status);
  };
  
  const findCourseById = async (req, res) => {
    const { courseId } = req.params;
    const course = await dao.findCourseById(courseId);
    const courseObject = course.toObject ? course.toObject() : course;
    res.json(courseObject);
  };

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    
    await enrollmentsDao.enrollUserInCourse(uid, cid);
    
    // Get updated courses for this user
    const enrolledCourses = await enrollmentsDao.findCoursesForUser(uid);
    const courseIds = enrolledCourses.map(c => c._id);
    
    // Update session
    if (req.session["currentUser"] && req.session["currentUser"]._id === uid) {
      req.session["currentUser"].enrolledCourses = courseIds;
      res.json(req.session["currentUser"]);
    } else {
      res.json({ enrolledCourses: courseIds });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    
    await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    
    // Get updated courses for this user
    const enrolledCourses = await enrollmentsDao.findCoursesForUser(uid);
    const courseIds = enrolledCourses.map(c => c._id);
    
    // Update session
    if (req.session["currentUser"] && req.session["currentUser"]._id === uid) {
      req.session["currentUser"].enrolledCourses = courseIds;
      res.json(req.session["currentUser"]);
    } else {
      res.json({ enrolledCourses: courseIds });
    }
  };

  const findUsersForCourse = async (req, res) => {
  const { cid } = req.params;
  const users = await enrollmentsDao.findUsersForCourse(cid);
  const usersArray = users.map(u => u.toObject ? u.toObject() : u);
  res.json(usersArray);
};
  
  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId", findCourseById);
  app.post("/api/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  app.get("/api/courses/:cid/users", findUsersForCourse);
}