import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao() {
  const findAssignmentsForCourse = (courseId) => {
    return model.find({ course: courseId });
  };

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  };

  const deleteAssignment = (assignmentId) => {
    return model.deleteOne({ _id: assignmentId });
  };

  const updateAssignment = (assignmentId, assignmentUpdates) => {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  };

  const findAssignmentById = (assignmentId) => {
    return model.findById(assignmentId);
  };

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
    findAssignmentById,
  };
}