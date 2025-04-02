import { TilesInterface } from './Tiles';
export interface TilesSliceInterface {
  errorMessage: null | string;
  successMessage: null | string;
  tilesCreateLoading: boolean;
  listLoader: boolean;
  tiles: TilesInterface[];
  loading: boolean;
  captionForm: CaptionForm;
  deleteLoader: number | null;
}

export interface CaptionForm {
  adding: boolean,
  error: null | string,
  onFocus: boolean
}

