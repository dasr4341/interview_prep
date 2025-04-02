export interface CaptionsInterface {
  id: string;
  tile_id: number;
  snap_ad_status: 'AD_NOT_CREATED' | 'CREATED' | 'COMPLETED' | 'REJECTED';
  created_at: string;
  tile: number;
  updated_at: string;
  caption_text: string;
}
