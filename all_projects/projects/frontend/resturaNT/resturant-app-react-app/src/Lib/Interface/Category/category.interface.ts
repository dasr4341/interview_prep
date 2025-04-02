export interface CategoryData {
    id: number;
    name: string;
    status: boolean;
    parent_id: string;
    subcategory: SubCategoryData[];
    created_at: string;
    updated_at: string;
}

export interface SubCategoryData {
    id: number;
    name: string;
    status: boolean;
    parent_id: string;
    item: ItemData[];
    created_at: string;
    updated_at: string;
}

export interface ItemData {
    id: number;
    img: string;
    price: number;
    description: string
    name: string;
    status: boolean;
    subcategory_id: string;
    item_limit: string;
    category: {
        id: number,
        name: string
    }
    created_at: string;
    updated_at: string;
}

export interface CategoryAllResponse {
    success: boolean;
    message: string;
    data: CategoryData[],
    totalCount: number
}

export interface CategoryResponse {
    success: boolean;
    message: string;
    data: CategoryData;
} 

export interface SubCategoryResponse {
    success: boolean;
    message: string;
    data: SubCategoryData;
}
export interface ItemResponse {
    success: boolean;
    message: string;
    data: ItemData
}

export interface CurrentCategoryResponse {
    success: boolean;
    message: string;
    data: CategoryData
}

export interface CategoryNew {
    name: string,
    parent_id: string
}

export interface ItemNew {
    name: string,
    price: number,
    description: string,
    subcategory_id: string,
    limit: string,
    file: any
}
