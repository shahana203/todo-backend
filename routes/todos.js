const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); 
const authenticateToken = require('../middleware/authMiddleware');


router.post('/', authenticateToken, async (req, res) => {
    const { title } = req.body; 

        const newTodo = new Todo({
            title,
            user: req.user.id 
        });
        try{
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({  error:'Error creating todo' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const taskList = await Todo.find({ user: req.user.id });
        res.json(taskList);
    } catch (error) {
        res.status(500).json({  error:'Error Fetching Todos' });
    }
});

router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            
            req.body,
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating task", error });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id // Ensure user owns the todo
        });

        if (!deletedTodo) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully", deletedTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task", error });
    }
});

module.exports = router;
