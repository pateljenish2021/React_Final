import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
  },
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
    },
    updateProduct(state, action) {
      const updatedProduct = action.payload;
      const index = state.items.findIndex((item) => item.id === updatedProduct.id);
      if (index !== -1) {
        state.items[index] = updatedProduct;
      }
    },
    deleteRecipe(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
  },
});

export const { setProducts, updateProduct, deleteProduct } = productSlice.actions;

export default productSlice.reducer;