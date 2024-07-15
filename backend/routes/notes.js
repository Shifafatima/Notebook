const express = require('express');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const fetchUser = require('../middleware/fetchUser');


//ROUTE 1: Get all notes using:Get "api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchUser,
    async (req, res) => {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    })

//ROUTE 2: Add notes using:POST "api/notes/addnote"
router.post('/addnote', fetchUser, [body('title', 'Enter a valid Title').isLength({ min: 3 }),
body('description', 'Enter a valid Description').isLength({ min: 5 })],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            // If there are errors, return bad request and the errors
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title,
                description,
                tag,
                user: req.user.id
            })
            const saveNotes = await note.save();
            res.json(saveNotes);
        } catch (error) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    })

//ROUTER 3  Update notes using:PUT "api/notes/updatenote"
router.put('/updatenote/:id', fetchUser, [body('title', 'Enter a valid Title').isLength({ min: 3 }),
body('description', 'Enter a valid Description').isLength({ min: 5 })], async (req, res) => {
    // If there are validation errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag }
        let note = await Note.findById(req.params.id);
        //checking the logged in person update only his record not other person
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        //FIND THE NOTES TO BE UPDATED AND UPDATE THEM
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }

})

//ROUTER 4  Delete notes using:DELETE "api/notes/deletenote"
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        //checking the logged in person delete only his record not other person
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        //FIND THE NOTES TO BE UPDATED AND UPDATE THEM
        note = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({succes:"Note has been deleted", note: note });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})


module.exports = router