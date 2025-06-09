const userService = require('../service/userS')

class UserController {

    async createUser(req, res) 
    {
        try 
        {
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        } 
        catch (err) 
        {
            res.status(500).json({ error: err.message });
        }
    }

    async getUserById(req, res) 
    {
        try 
        {
            const user = await userService.getUserById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } 
        catch (err) 
        {
            res.status(500).json({ error: err.message });
        }
    }

    async updateUser(req, res)
    {
        try 
        {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            res.json(updatedUser);
        } 
        catch (err) 
        {
             res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new UserController;
