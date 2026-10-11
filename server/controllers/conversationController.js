const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// GET /api/conversations — get all conversations for logged in user
const getConversations = async (req, res, next) => {
  try {
    console.log('Fetching conversations for user:', req.user._id);
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    console.log('Found conversations count:', conversations.length);
    res.status(200).json({ conversations });
  } catch (err) { next(err); }
};

// GET /api/conversations/:id — get one conversation with all messages
const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!conversation)
      return res.status(404).json({ error: 'Conversation not found.' });

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });

    res.status(200).json({ conversation, messages });
  } catch (err) { next(err); }
};

// POST /api/conversations — create a new conversation
const createConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      userId: req.user._id,
      title: title || 'New Conversation',
    });
    res.status(201).json({ conversation });
  } catch (err) { next(err); }
};

// PATCH /api/conversations/:id — update title
const updateConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: req.body.title },
      { new: true }
    );
    if (!conversation)
      return res.status(404).json({ error: 'Conversation not found.' });
    res.status(200).json({ conversation });
  } catch (err) { next(err); }
};

// DELETE /api/conversations/:id
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!conversation)
      return res.status(404).json({ error: 'Conversation not found.' });
    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId: req.params.id });
    res.status(200).json({ message: 'Conversation deleted.' });
  } catch (err) { next(err); }
};

module.exports = {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
};
