import { createSlice } from '@reduxjs/toolkit';

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
  },
  reducers: {
    setRecipes(state, action) {
      state.items = action.payload;
    },
    updateRecipe(state, action) {
      const updatedRecipe = action.payload;
      const index = state.items.findIndex((item) => item.id === updatedRecipe.id);
      if (index !== -1) {
        state.items[index] = updatedRecipe;
      }
    },
    deleteRecipe(state, action) {
      const recipeId = action.payload;
      state.items = state.items.filter((item) => item.id !== recipeId);
    },
  },
});

export const { setRecipes, updateRecipe, deleteRecipe } = recipeSlice.actions;

export default recipeSlice.reducer;