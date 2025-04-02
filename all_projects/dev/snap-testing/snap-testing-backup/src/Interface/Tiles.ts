import { CaptionsInterface } from 'Interface/Captions';
export interface TilesInterface {
  compilation_id: number;
  s3_key: string;
  captions?: Array<CaptionsInterface> | undefined;
  id?: number;
}

export interface TilesFormField {
  compilation_id: number;
  s3_key: string;
}

export interface TilesForm {
  tiles: TilesFormField[];
}

export interface ImageUploadInterface {
  s3_key: string;
  compilation_id: number;
}

export interface ImageInterface {
  img: string;
  loading: boolean;
  s3_key: string;
  duplicate: boolean;
}
