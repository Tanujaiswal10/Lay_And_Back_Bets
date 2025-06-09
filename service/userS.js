const User = require('../model/userM')

class UserService {
  
    async createUser(userData) 
    {
        const user = new User(userData);
        return await user.save();
    }


    async getUserById(userId) 
    {
        return await User.findById(userId);
    }


    async updateUser(userId, updateFields) 
    {
        return await User.findByIdAndUpdate(userId, updateFields, { new: true });
    }
}

module.exports = new UserService;