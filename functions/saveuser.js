import User from "../models/schema.js";

const saveUserToDB = async (data) => {
  try {
    const newUser = new User(data);
    const savedUser = await newUser.save();
    return { success: true, user: savedUser };
  } catch (error) {
    console.error("❌ Error saving user:", error.message);
    return { success: false, error: error.message };
  }
};

export default saveUserToDB;
