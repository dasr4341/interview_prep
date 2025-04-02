export interface DeleteCaptionInterface {
  id: string
  tile_id: number;
  caption_text: string;
}

export interface DeleteCaptionPayload {
  tile_id: number;
  caption_text: string;
}

export interface DeleteTilesPayload  {
  tile_id: number;
}