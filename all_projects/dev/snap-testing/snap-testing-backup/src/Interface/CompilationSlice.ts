import { CompilationListInterface } from './CompilationListInterface';

export interface CompilationSliceInterface {
  errorMessage: null | string;
  successMessage: null | string;
  loading: boolean;
  compilationCreating: boolean;
  listLoader: boolean;
  compilationList: CompilationListInterface[];
  report: ProcessReport;
}

export interface ProcessReport {
  processingId: number | null;
}