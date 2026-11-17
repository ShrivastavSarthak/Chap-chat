import { ChatInterface } from "@/src/utils/interface/chatInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: ChatInterface[] = [];

export const ChatSlice = createSlice({
  name: "Chats",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<ChatInterface>) => {
      const newChat: ChatInterface = {
        ...action.payload,
      };

      const findIndex = state.findIndex((item) => item.id === newChat.id);

      if (findIndex !== -1 && newChat.assistant !== undefined) {
        const answer = newChat.assistant;
        state[findIndex] = {
          ...state[findIndex],
          assistant: Array.isArray(answer)
            ? answer
            : typeof answer === "string"
            ? [answer]
            : [],
        };
      } else {
        state.push({
          ...newChat,
          assistant: newChat.assistant
            ? Array.isArray(newChat.assistant)
              ? newChat.assistant
              : [newChat.assistant]
            : [],
        });
      }
    },
    updateStreamingChunk: (
      state,
      action: PayloadAction<{ id: string; chunk: string }>,
    ) => {
      const { id, chunk } = action.payload;
      const findIndex = state.findIndex((item) => item.id === id);
      if (findIndex !== -1) {
        const currentAssistant = state[findIndex].assistant;
        if (!currentAssistant || currentAssistant.length === 0) {
          state[findIndex].assistant = [chunk];
        } else {
          const firstMsg = currentAssistant[0] || "";
          state[findIndex].assistant = [firstMsg + chunk, ...currentAssistant.slice(1)];
        }
      }
    },
    setAssistantResponse: (
      state,
      action: PayloadAction<{ id: string; assistant: string }>,
    ) => {
      const { id, assistant } = action.payload;
      const findIndex = state.findIndex((item) => item.id === id);
      if (findIndex !== -1) {
        state[findIndex].assistant = [assistant];
      }
    },
    resetChats: () => {
      return [];
    },
    setExistingChat: (_, action: PayloadAction<ChatInterface[]>) => {
      const existingChat = action.payload || [];
      return existingChat.map((item) => ({
        ...item,
        assistant: item.assistant
          ? Array.isArray(item.assistant)
            ? item.assistant
            : [item.assistant]
          : [],
      }));
    },
  },
});

export const {
  addChat,
  updateStreamingChunk,
  setAssistantResponse,
  resetChats,
  setExistingChat,
} = ChatSlice.actions;
export default ChatSlice.reducer;
