import { configureStore } from "@reduxjs/toolkit";
import favSlice from "./slices/favSlice";
import * as recipeActions from './slices/recipeSlice';

const store = configureStore({
    reducer:{
        fav: favSlice,
        recipes: recipeActions,
    },
})

export default store;
