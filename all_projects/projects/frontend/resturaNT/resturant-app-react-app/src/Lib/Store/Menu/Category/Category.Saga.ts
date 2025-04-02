/* eslint-disable max-lines */
import { toast } from 'react-toastify';
import { fork, put, select, takeEvery } from 'redux-saga/effects';
import { apiErrorHandler } from '../../../Api/Axios/axios';
import { categoryApi } from '../../../Api/Category/category';
import { CategoryData, SubCategoryData } from '../../../Interface/Category/category.interface';
import routes from '../../../Routes/Routes';
import { helperSliceActions } from '../../Helper/Helper.Slice';
import { menuEditorActions } from '../MenuEdiotor/MenuEditor.Slice';
import { categorySliceActions } from './Category.Slice';

const triggerState = (state: { category: { trigger: string; }; }) => state.category.trigger;
const triggerMenuState = (state: { menueditor: { trigger: string; }; }) => state.menueditor.trigger;

function* categoryMiddleware(): any {
  try {
    const category = yield categoryApi.getAllCategory();
    const trigger = yield select(triggerState);
    const searchedCategory = category.filter((item: CategoryData) => {
      if (item.name.toLowerCase().includes(trigger.toLowerCase())) {
        return item;
      }
    });
    const subCategory = searchedCategory.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    yield put(categorySliceActions.addCategory({ searchedCategory, subarr, itemarr }));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* categoryAllMiddleware(): any {
  try {
    const category = yield categoryApi.getAllCategory();
    const trigger = yield select(triggerMenuState);
    const searchedCategory = category.filter((item: CategoryData) => {
      if (item.name.toLowerCase().includes(trigger.toLowerCase())) {
        return item;
      }
    });
    const subarr = searchedCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const itemarr = subarr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    yield put(menuEditorActions.addAllCategory({ searchedCategory, subarr, itemarr }));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* currentCategory(action: { payload: { id: number } }): any {
  try {
    const { id } = action.payload;
    const category = yield categoryApi.getCurrentCategory(id);
    yield put(menuEditorActions.addCurrentCategory(category));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* categoryStatusUpdate(action: { payload : { id: number, data: boolean, parentId: string, active: string, name: string } }): any {
  try {
    const { id, data, parentId, active, name } = action.payload;
    console.log('Active ---> ', active, name);
    yield categoryApi.putCategory(id, data);
    const category = yield categoryApi.getAllCategory();
    let maincategory, subcategory, parentCategoryId;
    let subarr = [];
    let isSubArr = [];
    let itemarr = [];
    if (parentId === null) {
      if (data === false) {
        subarr = [];
        itemarr = [];
      } else {
        maincategory = yield categoryApi.getCurrentCategory(id);
        subarr = maincategory.subcategory;
        isSubArr = subarr.filter((item: SubCategoryData) => {
          if (item.status) {
            return item;
          }
        });
        itemarr = isSubArr
          .map((item: SubCategoryData) => {
            return item.item;
          })
          .flat(Infinity);
      }
    } else {
      if (active) {
        subcategory = yield categoryApi.getCurrentCategory(id);
        parentCategoryId = subcategory.parent_id;
        maincategory = yield categoryApi.getCurrentCategory(parentCategoryId);
        subarr = maincategory.subcategory;
        isSubArr = subarr.filter((item: SubCategoryData) => {
          if (item.status) {
            return item;
          }
        });
        itemarr = isSubArr
          .map((item: SubCategoryData) => {
            return item.item;
          })
          .flat(Infinity);
      } else {
        const subCategory = yield categoryApi.getAllCategory();
        subarr = subCategory
        .map((item: CategoryData) => {
          return item.subcategory;
        })
        .flat(Infinity);
        isSubArr = subarr.filter((item: SubCategoryData) => {
        if (item.status) {
          return item;
        }
        });
        itemarr = isSubArr
        .map((item: SubCategoryData) => {
          return item.item;
        })
        .flat(Infinity);
      }
    }
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* itemStatusUpdate(action: { payload: { id: number; data: boolean; activeCategory: any; activeSubCategory: any; }; }): any {
  try {
    const { id, data, activeCategory, activeSubCategory } = action.payload;
    yield categoryApi.putItem(id, data);
    const category = yield categoryApi.getAllCategory();
    if (!activeCategory) {
      if (!activeSubCategory) {
        const subCategory = category.filter((item: any) => {
          if (item.status) {
            return item;
          }
        });
        const subarr = subCategory
          .map((item: CategoryData) => {
            return item.subcategory;
          })
          .flat(Infinity);
        const isSubArr = subarr.filter((item: SubCategoryData) => {
          if (item.status) {
            return item;
          }
        });
        const itemarr = isSubArr
          .map((item: SubCategoryData) => {
            return item.item;
          })
          .flat(Infinity);
        yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
      }
    } 
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* categoryAdd(action: { payload: { name: string; }; }): any {
  try {
    const { name } = action.payload;
    const success = yield categoryApi.createCategory(name);
    const category = yield categoryApi.getAllCategory();
    const subCategory = category.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
    yield put(menuEditorActions.addAllCategory({ searchedCategory: null, subarr: null, itemarr: null }));
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.menu.children.item_availability.path));
    toast.success(success.message);
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* subCategoryAdd(action: { payload: { name: string; parentId: string; }; }): any {
  try {
    const { name, parentId } = action.payload;
    yield categoryApi.createSubCategory(name, parentId);
    const category = yield categoryApi.getAllCategory();
    const subCategory = category.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    toast.success('SubCategory Added Successfully');
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
    yield put(menuEditorActions.addAllCategory({ searchedCategory: null, subarr: null, itemarr: null }));
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.menu.children.item_availability.path));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* itemAdd(action: { payload: { name: string; subcategoryId: string; price: number; description: string; img: any; limit: string; }; }): any {
  try {
    const { name, subcategoryId, price, description, img, limit } = action.payload;
    const success = yield categoryApi.createItem(name, subcategoryId, price, description, img, limit);
    const category = yield categoryApi.getAllCategory();
    const subCategory = category.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    toast.success(success.message);
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
    yield put(menuEditorActions.addAllCategory({ searchedCategory: null, subarr: null, itemarr: null }));
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.menu.children.item_availability.path));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* categoryDelete(action: { payload: { id: number; }; }): any {
  try {
    const { id } = action.payload;
    const success = yield categoryApi.deleteCategory(id);
    const category = yield categoryApi.getAllCategory();
    const subCategory = category.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    toast.success(success.message);
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
    yield put(menuEditorActions.addAllCategory({ searchedCategory: null, subarr: null, itemarr: null }));
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.menu.children.item_availability.path));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* itemDelete(action: { payload: { id: number; }; }): any {
  try {
    const { id } = action.payload;
    const success = yield categoryApi.deleteItem(id);
    const category = yield categoryApi.getAllCategory();
    const subCategory = category.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    toast.success(success.message);
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
    yield put(menuEditorActions.addAllCategory({ searchedCategory: null, subarr: null, itemarr: null }));
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.menu.children.item_availability.path));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* getParticularItem(action: { payload: { id: number; }; }): any {
  try {
    const { id } = action.payload;
    const item = yield categoryApi.getParticularItem(id);
    yield put(categorySliceActions.addParticularItem(item));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* updateCategory(action: { payload: { id: number; name: string; parentId: string; }; }): any {
  try {
    const { id, name, parentId } = action.payload;
    let success;
    if (!parentId) {
      success = yield categoryApi.updateCategory(id, name);
    } else {
      success = yield categoryApi.updateSubCategory(id, name, parentId);
    }
    const category = yield categoryApi.getAllCategory();
    const subCategory = category.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    toast.success(success.message);
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
    yield put(menuEditorActions.addAllCategory({ searchedCategory: null, subarr: null, itemarr: null }));
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.menu.children.item_availability.path));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* updateItem(action: { payload: { id: number; name: string; subcategoryId: string; price: number; description: string; img: any; limit: string; }; }): any {
  try {
    const { id, name, subcategoryId, price, description, img, limit } = action.payload;
    const success = yield categoryApi.updateItem(id, name, subcategoryId, price, description, img, limit);
    const category = yield categoryApi.getAllCategory();
    const subCategory = category.filter((item: CategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const subarr = subCategory
      .map((item: CategoryData) => {
        return item.subcategory;
      })
      .flat(Infinity);
    const isSubArr = subarr.filter((item: SubCategoryData) => {
      if (item.status) {
        return item;
      }
    });
    const itemarr = isSubArr
      .map((item: SubCategoryData) => {
        return item.item;
      })
      .flat(Infinity);
    toast.success(success.message);
    yield put(categorySliceActions.addCategory({ searchedCategory: category, subarr, itemarr }));
    yield put(menuEditorActions.addAllCategory({ searchedCategory: null, subarr: null, itemarr: null }));
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.menu.children.item_availability.path));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* categorySaga() {
  yield takeEvery(categorySliceActions.getCategory as any, categoryMiddleware);
  yield takeEvery(menuEditorActions.getAllCategory as any, categoryAllMiddleware);
  yield takeEvery(menuEditorActions.getCurrentCategory as any, currentCategory);
  yield takeEvery(categorySliceActions.updateCategoryStatus as any, categoryStatusUpdate);
  yield takeEvery(categorySliceActions.updateItemStatus as any, itemStatusUpdate);
  yield takeEvery(categorySliceActions.addNewCategory as any, categoryAdd);
  yield takeEvery(categorySliceActions.addNewSubCategory as any, subCategoryAdd);
  yield takeEvery(categorySliceActions.addNewItem as any, itemAdd);
  yield takeEvery(categorySliceActions.deleteCategory as any, categoryDelete);
  yield takeEvery(categorySliceActions.deleteItem as any, itemDelete);
  yield takeEvery(categorySliceActions.getParticularItem as any, getParticularItem);
  yield takeEvery(categorySliceActions.updateCategory as any, updateCategory);
  yield takeEvery(categorySliceActions.updateItem as any, updateItem);
}

export default function* menuSaga() {
  yield fork(categorySaga);
}
