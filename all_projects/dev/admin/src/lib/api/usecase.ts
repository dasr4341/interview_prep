import { GetUseCaseCollections, } from 'generatedTypes';
import { 
  GetUseCaseCollectionsQuery 
} from 'lib/query/usecase/get-usecase-collections';
import { client } from '../../apiClient';

export default function useCaseApi() {
  return {
    getUseCaseCollections: async () => {
      return client.query<GetUseCaseCollections>({
        query: GetUseCaseCollectionsQuery,
      });
    }
  };
}