import model from "./model.js";

export default function EnrollmentsDao() {
  const findCoursesForUser = async (userId) => {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  };

  const findUsersForCourse = async (courseId) => {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  };

  const enrollUserInCourse = (userId, courseId) => {
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    return model.deleteOne({ user: userId, course: courseId });
  };

  const unenrollAllUsersFromCourse = (courseId) => {
    return model.deleteMany({ course: courseId });
  };

  const findEnrollmentsForUser = async (userId) => {
    return await model.find({ user: userId });
  };

  const findEnrollmentsForCourse = async (courseId) => {
    return await model.find({ course: courseId });
  };

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
  };
}