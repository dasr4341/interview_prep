import { CaptionsInterface } from './Captions';
import { CompilationInterface } from './Compilation';
export interface TilesListInterface {
  id: number;
  name: string;
  compilation_id: number;
  compilation: CompilationInterface;
  creative_id: string;
  updated_at: string;
  preview_url: string;
  media_id: string;
  snap_status: 'FAILED_UPLOAD' | 'PENDING' | 'CREATED' | 'COMPLETED' | 'REJECTED';
  created_at: string;
  captions: CaptionsInterface[];
}
