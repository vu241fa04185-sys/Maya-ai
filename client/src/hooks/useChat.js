import { useState, useCallback } from 'react';
import axios from 'axios';

export function useChat() {
  const [messages, setMessages]               = useState([]);
  const [isLoading, setIsLoading]             = useState(false);
  const [conversationId, setConversationId]   = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post('/api/chat', {
        message: text.trim(),
        conversationId,          // send current convo ID (null = create new)
      });

      // Save conversationId for subsequent messages
      if (res.data.conversationId) {
        setConversationId(res.data.conversationId);
      }

      let finalReply = res.data.reply;
      
      // Detect and execute frontend actions (like opening websites)
      const openWebRegex = /\[OPEN_WEBSITE:(.*?)\]/;
      const match = finalReply.match(openWebRegex);
      if (match) {
        const url = match[1].trim();
        window.open(url, '_blank');
        // Remove the ugly tag from the text the user actually reads
        finalReply = finalReply.replace(match[0], '').trim();
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: finalReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorText = err.response?.data?.error || 'Something went wrong.';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: `⚠️ **Error:** ${errorText}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, conversationId]);

  // Load an existing conversation from MongoDB
  const loadConversation = useCallback(async (convId) => {
    try {
      const res = await axios.get(`/api/conversations/${convId}`);
      const msgs = res.data.messages.map((m) => ({
        id: m._id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.createdAt),
      }));
      setMessages(msgs);
      setConversationId(convId);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return { messages, isLoading, conversationId, sendMessage, loadConversation, clearChat };
}
