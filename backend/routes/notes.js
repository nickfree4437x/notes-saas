const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const authMiddleware = require('../middleware/authMiddleware');

// Create a note (member or admin)
router.post('/', authMiddleware(), async (req, res) => {
  try {
    const { title, content } = req.body;
    const { tenantId, id: userId } = req.user;

    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(400).json({ message: 'Invalid tenant' });

    if (tenant.plan === 'free') {
      const count = await Note.countDocuments({ tenantId });
      if (count >= 3) {
        return res.status(403).json({ message: 'Note limit reached. Upgrade to Pro.' });
      }
    }

    const note = await Note.create({
      title,
      content,
      tenantId,
      createdBy: userId,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notes for the current tenant
router.get('/', authMiddleware(), async (req, res) => {
  try {
    const { tenantId } = req.user;
    const notes = await Note.find({ tenantId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific note by id
router.get('/:id', authMiddleware(), async (req, res) => {
  try {
    const { tenantId } = req.user;
    const note = await Note.findOne({ _id: req.params.id, tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note (member or admin)
router.put('/:id', authMiddleware(), async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { title, content } = req.body;

    const note = await Note.findOne({ _id: req.params.id, tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Role enforcement: both member & admin can edit
    if (!['admin', 'member'].includes(role))
      return res.status(403).json({ message: 'Forbidden: Cannot edit note' });

    // Free plan limit check for editing: allow edit, no new note count change
    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note (member or admin)
router.delete('/:id', authMiddleware(), async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    const note = await Note.findOne({ _id: req.params.id, tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!['admin', 'member'].includes(role))
      return res.status(403).json({ message: 'Forbidden: Cannot delete note' });

    await note.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
