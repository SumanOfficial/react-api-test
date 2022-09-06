const express = require("express");
const { validationResult } = require("express-validator");
const getUser = require("../middleware/getUser");
const router = express.Router();
const Notes = require("../models/Notes");
const { addNoteValidation } = require("../validation/validation");

// get all notes using: GET "/api/notes/". || login required
/**
 * "/" - api end point
 * getUser - jwt token middleware validation
 * async callback function
 */
router.get("/", getUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
});

// add new note using: POST "/api/notes/addnote". || login required
/**
 * "/addnote" - api end point
 * getUser - jwt token middleware validation
 * addNoteValidation - custom express validation
 * async callback function
 */
router.post("/addnote", getUser, addNoteValidation, async (req, res) => {
    try {
        // check || catch || display the validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description } = req.body;

        const notes = new Notes({
            user: req.user.id,
            title,
            description,
        });
        const noteSaved = await notes.save();
        res.json(noteSaved);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
});

// update a note using: PUT "/api/notes/updatenote/:id". || login required
/**
 * "/updatenote/:id" - api end point
 * getUser - jwt token middleware validation
 * async callback function
 */
router.put("/updatenote/:id", getUser, async (req, res) => {
    try {
        const { title, description } = req.body;

        //newNote - createing a object for new notes
        const newNote = {};

        // check if title, description are present in the body then only update
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }

        // find the note to be update
        let note = await Notes.findById(req.params.id);

        // if the note not found return 404 error
        if (!note) {
            return res.status(404).status("not found");
        }

        // check note to be updated user === with the current user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).status("not allowed");
        }

        // update the note
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
});

// delete a note using: DELETE "/api/notes/deletenote/:id". || login required
/**
 * "/deletenote/:id" - api end point
 * getUser - jwt token middleware validation
 * async callback function
 */
router.delete("/deletenote/:id", getUser, async (req, res) => {
    try {
        // find the note to be delete
        let note = await Notes.findById(req.params.id);

        // if the note not found return 404 error
        if (!note) {
            return res.status(404).status("not found");
        }

        // check note to be updated user === with the current user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).status("not allowed");
        }

        // update the note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ success: "note deleted successfully", note: note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
});

module.exports = router;
