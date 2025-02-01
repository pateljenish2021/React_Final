import { configureStore } from "@reduxjs/toolkit";
import productActions from './productReducer';

const store = configureStore({
    reducer:{
        products: productActions,
    },
})

export default store;