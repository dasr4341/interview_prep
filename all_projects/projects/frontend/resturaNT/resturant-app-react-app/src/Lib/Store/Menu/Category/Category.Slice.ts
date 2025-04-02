import { createSlice } from '@reduxjs/toolkit';
import { CategoryData, ItemData, SubCategoryData } from '../../../Interface/Category/category.interface';

export interface CategorySliceState {
    category: CategoryData[] | null,
    subcategory: SubCategoryData[] | null,
    item: ItemData[] | null,
    particularItem: ItemData,
    error: string | null,
    trigger: string
}

const initialState: CategorySliceState = {
    category: null,
    subcategory: null,
    item: null,
    particularItem: {
        id: 0,
        img: '',
        price: 0,
        description: '',
        name: '',
        status: true,
        subcategory_id: '',
        category: {
            id: 0,
            name: ''
        },
        item_limit: '',
        created_at: '',
        updated_at: ''
    },
    error: '',
    trigger: ''
};

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        getCategory: () => {
        },
        addCategory: (state, action: { payload: { searchedCategory: CategoryData[], subarr: SubCategoryData[], itemarr: any } }) => {
            state.category = action.payload.searchedCategory;
            state.subcategory = action.payload.subarr;
            state.item = action.payload.itemarr;
        },
        updateCategoryStatus: (state, action) => {
            console.log(state, action);
        },
        updateCategory: (state, action) => {
            console.log(state, action);
        },
        updateItemStatus: (state, action) => {
            console.log(state, action);
        },
        triggerSearch: (state, action: { payload: string }) => {
            state.trigger = action.payload;
        },
        addNewCategory: (state, action) => {
            console.log(state, action);
        },
        addNewSubCategory: (state, action) => {
            console.log(state, action);
        },
        addNewItem: (state, action) => {
            console.log(state, action);
        },
        deleteCategory: (state, action) => {
            console.log(state, action);
        },
        deleteItem: (state, action) => {
            console.log(state, action);
        },
        getParticularItem: (state, action) => {
            console.log(state, action);
        },
        addParticularItem: (state, action: { payload: ItemData }) => {
            state.particularItem = action.payload;
        },
        updateItem: (state, action) => {
            console.log(state, action);
        }
    }
});

export const categorySliceActions = categorySlice.actions;
export default categorySlice.reducer;