import { ArchiveStateInterface } from 'Interface/ArchiveStateInterface';
import { CompilationListInterface } from 'Interface/CompilationListInterface';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
import { toastNetworkError } from 'Lib/Utility/toastNetworkError';
import { CompilationStatus } from 'Page/Tiles/TilesList/TilesList';
import { toast } from 'react-toastify';

// to archive the compilation
export async function archiveCompilation(
  compilationId: string,
  setArchiveState: React.Dispatch<React.SetStateAction<ArchiveStateInterface>>,
  compilationList: CompilationListInterface[]
) {
  setArchiveState((e) => {
    return { ...e, loading: true };
  });

  try {
    const response = await snapActionsApi.archiveCompilation(compilationId);
    toast.success(response.message);

    const nextAvailableCompilation = compilationList.find(
      (e) => String(e.id) !== compilationId && e.status.toLowerCase() !== CompilationStatus.ARCHIVED.toLowerCase()
    );
    return nextAvailableCompilation?.id;
  } catch (e: any) {
    toastNetworkError(e);
    return '';
  } finally {
    setArchiveState({ dialogState: false, loading: false });
  }
}
// --------------------------------------------
