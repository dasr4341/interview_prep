
export interface MetaDataInterface {
  loading: boolean;
  data?: {
    caption_count: number;
    created_at: string;
    freeze: boolean;
    id: number;
    name: string;
    status: string;
    tile_count: number;
    total_spent: string;
    updated_at: string;
    show: number;
    show_id: number;
    user_id: string | null;
  };
}

