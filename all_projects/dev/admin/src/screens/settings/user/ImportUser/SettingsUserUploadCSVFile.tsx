import { useEffect, useState } from 'react';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { BsCloudUpload } from 'react-icons/bs';
import './_import-user.scoped.scss';
import { config } from 'config';
import catchError, { getGraphError } from 'lib/catch-error';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import SafeHtml from 'components/SafeHtml';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { ExcelUserExport } from 'generatedTypes';
import { ExcelUserExportQuery } from 'lib/query/user/download-template';
import { ImSpinner7 } from 'react-icons/im';
import { errorList } from '../../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function SettingsUserUploadCSVFile(): JSX.Element {
  const [csvFile, setCsvFile] = useState<null | any>(null);
  const [csvFileError, setCsvFileError] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<null | string>(null);
  const navigate = useNavigate();
  const [downloadTemplateUrl, { data: downloadUrl, error: errors, loading }] = useLazyQuery<ExcelUserExport>(ExcelUserExportQuery);

  const handleFileChange = (files: FileList | null) => {
    setSuccessMessage(null);
    // Allowed extensions
    const exts = ['csv', 'xlsx'];

    if (files && files.length) {
      const currentExtension = files[0]?.name?.split('.').pop();
      if (currentExtension && exts.includes(currentExtension)) {
        setCsvFileError('');
        setCsvFile(files[0]);
      } else {
        setCsvFileError(errorList.csv);
        setCsvFile({});
      }
    }
  };

  const uploadCsvFile = async () => {
    try {
      if (!csvFile) {
        throw new Error(errorList.csv);
      }

      setLoading(true);
      setErrorMessage(null);
      const token = localStorage.getItem('token');
      const fileData: FormData = new FormData();
      const headers = new Headers();

      // https://github.com/graphql/graphql-js/issues/960#issuecomment-364672113
      const query = {
        query: `mutation PretaaCsvUserImport($file: Upload!) {
          pretaaCsvUserImport(file: $file, updateExistingUsers: "${updateExisting}")
        }`,
        variables: {
          file: null,
        },
      };
      const variables = {
        '0': ['variables.file'],
      };

      fileData.append('operations', JSON.stringify(query));
      fileData.append('map', JSON.stringify(variables));

      fileData.append('0', csvFile, 'user-template_1.csv');

      headers.append('Authorization', `Bearer ${token}`);

      const requestOptions: any = {
        method: 'POST',
        headers: headers,
        body: fileData,
        redirect: 'follow',
        'Content-Type': 'multipart/form-data',
      };

      const url = localStorage.getItem('API_URL') || String(config.pretaa.apiURL);
      const result = await (await fetch(url, requestOptions)).json();

      if (result.errors) {
        const message = getGraphError(result.errors).join('\n');
        console.log(message);
        setErrorMessage(message);
      } else {
        console.log(result.data.pretaaCsvUserImport);
        delete result.data.pretaaCsvUserImport.errors;
        setSuccessMessage(
          Object.keys(result.data.pretaaCsvUserImport)
            .map((key) => `${key.replace('total', 'Total ')}: ${result.data.pretaaCsvUserImport[key]}`)
            .join('<br/>')
        );
        setCsvFile(null);
      }
      setLoading(false);
    } catch (error) {
      catchError(error, true);
      setLoading(false);
    }
  };

  function download() {
    downloadTemplateUrl();
  }

  useEffect(() => {
    if (downloadUrl) {
      location.href = downloadUrl?.pretaaExcelUserExport;
    }
  }, [downloadUrl]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.settingsUserUploadCSVFile.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="User Management" disableGoBack={false} />
      <ContentFrame className="bg-white flex-1 user-upload">
        {errors && <ErrorMessage message={errors.message} />}
        <div>
          <div className="text-left mb-3">
            <h3 className="h3">Upload File</h3>
          </div>
          <div className="flex items-center gap-6 mb-0 pb-0">
            <span className="text-primary-light underline capitalize link-text cursor-pointer" onClick={download}>
              Download Template File {loading ? <ImSpinner7 className="animate-spin ml-2" data-testid="loading" /> : ''}
            </span>
          </div>
          <div className="grid lg:grid-cols-6 sm:grid-cols-1 gap-4">
            <div className="col-start-1 col-span-5 ">
              <div
                className="mt-4 flex justify-center px-6 
                    pt-12 pb-12 upload-box border rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm  text-center text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer 
                       rounded-md font-medium text-center">
                      <BsCloudUpload size={25} className="ml-3 mb-1" />
                      <span className="upload-box-text">{csvFile?.name || 'browse'}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        required
                        accept=".csv, .xlsx"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e.target.files)}
                        onClick={(e) => {
                          // Reset each time to allow uploading same file again.
                          (e.target as HTMLInputElement).value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <span className="text-red">{csvFileError || ''}</span>
              <div className="flex space-x-6 mt-4">
                <input
                  type="checkbox"
                  className="checkbox ml-3 
                   border-primary-light rounded-sm mt-1 cursor-pointer"
                  name="checkbox"
                  onChange={(e) => setUpdateExisting(e.target.checked)}
                  checked={updateExisting}
                />
                <p className="text">
                  Update any existing users <br />
                  If any imported users are already in your records , we’ll automatically replace their information with the data from your import. This option may make the import
                  process take longer.
                </p>
              </div>
              {successMessage && (
                <div className="mt-4 bg-gray-400 p-4 pt-1">
                  <p className="text">
                    <SafeHtml rawHtml={successMessage} />
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-6 sm:grid-cols-1 gap-4">
            <div className="col-start-1 col-end-3">
              <div className="flex lg:justify-start justify-center items-center gap-4 mt-12">
                <Button disabled={isLoading} loading={isLoading} onClick={uploadCsvFile}>
                  Save
                </Button>
                <button
                  onClick={() => navigate(-1)}
                  className="flex justify-center 
                         px-4 py-3 h-11 text-base text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <ErrorMessage message={errorMessage as string} />
        </div>
      </ContentFrame>
    </>
  );
}
