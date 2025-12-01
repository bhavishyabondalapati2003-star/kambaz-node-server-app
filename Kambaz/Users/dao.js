import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao() {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };
  
  const findAllUsers = () => model.find();
  
  const findUserById = (userId) => model.findById(userId);
  
  const findUserByUsername = (username) => 
    model.findOne({ username: username });
  
  const findUserByCredentials = (username, password) => 
    model.findOne({ username, password });
  
  const findUsersByRole = (role) => model.find({ role: role });
  
  const findUsersByPartialName = (partialName) => {
    const trimmed = partialName.trim();
    
    // If single word, search firstName OR lastName
    if (!trimmed.includes(' ')) {
      const regex = new RegExp(trimmed, "i");
      return model.find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } }
        ],
      });
    }
    
    // If multiple words, search firstName AND lastName
    const words = trimmed.split(/\s+/);
    const firstWord = new RegExp(words[0], "i");
    const lastWord = new RegExp(words[words.length - 1], "i");
    
    return model.find({
      $and: [
        {
          $or: [
            { firstName: { $regex: firstWord } },
            { lastName: { $regex: firstWord } }
          ]
        },
        {
          $or: [
            { firstName: { $regex: lastWord } },
            { lastName: { $regex: lastWord } }
          ]
        }
      ]
    });
  };
  
  const updateUser = (userId, user) => 
    model.updateOne({ _id: userId }, { $set: user });
  
  const deleteUser = (userId) => model.findByIdAndDelete(userId);
  
  return { 
    createUser, 
    findAllUsers, 
    findUserById, 
    findUserByUsername, 
    findUserByCredentials, 
    findUsersByRole,
    findUsersByPartialName,
    updateUser, 
    deleteUser 
  };
}