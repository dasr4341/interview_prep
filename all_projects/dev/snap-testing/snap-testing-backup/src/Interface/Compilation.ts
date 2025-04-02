export interface CompilationInterface {
  compilation_id?: string;
  name: string;
  s3_key?: string;
  captions?: Array<string>;
  id?: string;
}

export interface CompilationFormFields {
  name: string;
  s3_key?: string;
  captions?: Array<string>;
}