import { createSlice } from "@reduxjs/toolkit";


const loadFromLocalStorage = () => {
  try {
    const favItems = localStorage.getItem("favItems");
    if (favItems) {
      return JSON.parse(favItems);
    }
  } catch (error) {
    console.error("Error loading favorite items from local storage:", error);
  }
  return [];
};

const favSlice = createSlice({
  name: "fav",
  initialState: {
    favItems: loadFromLocalStorage(), 
    totalAmount: 0,
    totalQuantity: 0,
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.favItems.find(
        (item) => item.id === newItem.id
      );

      if (!existingItem) {
        state.favItems.push(newItem);
        state.totalAmount += newItem.price;
        state.totalQuantity++;
        localStorage.setItem("favItems", JSON.stringify(state.favItems));
      }
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.favItems.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalAmount -= existingItem.price;
        state.totalQuantity--;
        state.favItems = state.favItems.filter((item) => item.id !== itemId);
  
        localStorage.setItem("favItems", JSON.stringify(state.favItems));
      }
    },
    deleteItem: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.favItems.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalAmount -= existingItem.price;
        state.totalQuantity--;
        state.favItems = state.favItems.filter((item) => item.id !== itemId);

        localStorage.setItem("favItems", JSON.stringify(state.favItems));
      }
    },
  },
});

export const favActions = favSlice.actions;

export default favSlice.reducer;