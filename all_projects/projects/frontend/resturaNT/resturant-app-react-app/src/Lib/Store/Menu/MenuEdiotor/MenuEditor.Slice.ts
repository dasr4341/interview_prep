import { createSlice } from '@reduxjs/toolkit';
import { CategoryData, ItemData, SubCategoryData } from '../../../Interface/Category/category.interface';

export interface MenuEditorSliceState {
  allcategory: CategoryData[] | null;
  allsubcategory: SubCategoryData[] | null;
  allitem: ItemData[] | null;
  categoryPage: string;
  categoryNewPage: string;
  itemPage: string;
  itemNewPage: string;
  itemData: ItemData[] | null;
  currentCategory: CategoryData | SubCategoryData | null;
  trigger: string;
}

const initialState: MenuEditorSliceState = {
  allcategory: null,
  allsubcategory: null,
  allitem: null,
  categoryPage: '',
  categoryNewPage: 'hidden',
  itemPage: '',
  itemNewPage: 'hidden',
  itemData: [],
  currentCategory: null,
  trigger: '',
};

export const menuEditorSlice = createSlice({
  name: 'menueditor',
  initialState,
  reducers: {
    triggerSearch: (state, action: { payload: string }) => {
      state.trigger = action.payload;
    },
    getAllCategory: () => {},
    addAllCategory: (state, action: { payload: { searchedCategory: CategoryData[] | null, subarr: SubCategoryData[] | null, itemarr: any } }) => {
      state.allcategory = action.payload.searchedCategory;
      state.allsubcategory = action.payload.subarr;
      state.allitem = action.payload.itemarr;
    },
    changeCategoryClass: (state, action: { payload: { categoryPage: string, categoryNewPage: string } }) => {
      state.categoryPage = action.payload.categoryPage;
      state.categoryNewPage = action.payload.categoryNewPage;
    },
    changeItemClass: (state, action: { payload: { itemPage: string, itemNewPage: string } }) => {
      state.itemPage = action.payload.itemPage;
      state.itemNewPage = action.payload.itemNewPage;
    },
    addItem: (state, action) => {
      state.itemData = action.payload;
    },
    getCurrentCategory: (state, action) => {
      console.log(state, action);
    },
    addCurrentCategory: (state, action: { payload: CategoryData | null }) => {
      state.currentCategory = action.payload;
    },
  },
});

export const menuEditorActions = menuEditorSlice.actions;
export default menuEditorSlice.reducer;
