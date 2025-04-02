import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import SafeHtml from 'components/SafeHtml';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { config } from 'config';
import catchError, { getGraphError } from 'lib/catch-error';
import React, { useEffect, useRef, useState } from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { useLazyQuery } from '@apollo/client';
import { downloadCSVFile } from 'graphql/downloadCSV.query';
import { DownloadASampleCsv } from 'health-generatedTypes';

interface CsvFileStatusInterface {
  error?: string | null;
  file: any | null;
  loading: boolean;
  successMsg?: string | null;
}
// Allowed file extensions
const allowedFileTypes = ['csv', 'xlsx'];

export default function EmployeeManagementCsvUpload() {
  const navigate = useNavigate();
  const fileInputField = useRef<any>(null);
  const [csvFileState, setCsvFileState] = useState<CsvFileStatusInterface>({
    file: null,
    loading: false,
  });
  // download csv file
  const [getCSV, { loading: csvLoading }] = useLazyQuery<DownloadASampleCsv>(downloadCSVFile, {
    onCompleted: (c) => c && setCsvFileState({
      file: c.pretaaHealthDownloadASampleCsv?.fileURL,
      loading: csvLoading
    }),
    onError: (e) => catchError(e, true)
  });

  const handleFileChange = (csvFile: FileList | null) => {
    if (csvFile && csvFile.length) {
      const currentExtension = csvFile[0]?.name?.split('.').pop();

      if (currentExtension && allowedFileTypes.includes(currentExtension)) {
        setCsvFileState({
          ...csvFileState,
          successMsg: null,
          error: null,
          file: csvFile[0],
        });
      } else {
        setCsvFileState({
          ...csvFileState,
          error: 'Please upload csv file, only  csv, xlsx files are allowed',
        });
      }
    }
  };

  async function handleSubmit(e: any) {
    try {
      e.preventDefault();

      setCsvFileState({
        ...csvFileState,
        loading: true,
      });

      if (!csvFileState.file) {
        setCsvFileState({
          ...csvFileState,
          error: 'Please upload csv file'
        })
      }

      const fileData = new FormData();
      const headers = new Headers();

      fileData.append(
        'operations',
        JSON.stringify({
          query: `mutation EHRImportCareTeam($file: Upload!) {
            pretaaHealthEHRImportCareTeam(file: $file, updateExistingUsers:  ${true})
          }`,
          variables: {
            file: null,
          },
        })
      );
      const variables = {
        '0': ['variables.file'],
      };
      fileData.append('map', JSON.stringify(variables));

      fileData.append('0', csvFileState.file, 'user-template_1.csv');

      headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

      const requestOptions: any = {
        method: 'POST',
        headers: headers,
        body: fileData,
        redirect: 'follow',
        'Content-Type': 'multipart/form-data',
      };

      const response = await (await fetch(String(config.pretaa.apiURL), requestOptions)).json();
    
      if (!!response?.errors) {        
        throw new Error(...getGraphError(response.errors));
      }

      setCsvFileState({
        ...csvFileState,
        file: null,
        loading: false,
        error: response.error ? getGraphError(response.errors).join('\n') : null,
        
        successMsg: response.data.pretaaHealthEHRImportCareTeam
          ? Object.keys(response.data.pretaaHealthEHRImportCareTeam)
            .map((key) => { 
              const message = response.data.pretaaHealthEHRImportCareTeam[key] || 0;
              if (message !== 0 && String(message).includes('https')) {
                return `<div>Found some errors, please see the error details. <a class='underline font-bold' href=${message}> Follow the link</a></div>`;
              }
              return `<div>${key}: ${message}</div>`;
              })
              .join('')
          : null,
      });

    } catch (err: any) {
      setCsvFileState({
        ...csvFileState,
        successMsg: null,
        error: !fileInputField?.current?.value ? 'Please upload csv file' : err.message
      });
    }
  }

  useEffect(() => {
    getCSV();
  }, []);

  return (
    <React.Fragment>
      <ContentHeader title="Staff Management" />
      <ContentFrame>
        <div className=" font-semibold text-md mb-6">Upload File</div>
        {csvFileState.file && 
        <a href={csvFileState.file}
        download className=" cursor-pointer text-sm underline text-primary-light">
          Download Template File 
        </a>
        }
        {/* <button type='button' className=" cursor-pointer text-sm underline text-primary-light" >Download Template File</button> */}
        <div className=" grid grid-cols-6 grid-auto-rows ">
          <form className="md:col-span-4 col-span-6" onSubmit={handleSubmit}>
            <div
              className=" bg-gray-300 rounded w-full mt-4 h-44 cursor-pointer flex flex-col justify-center items-center"
              onClick={() => fileInputField.current && fileInputField?.current.click()}>
              {csvFileState.loading ? <Loader size={30} color="blue" /> : <BsCloudUpload size={25} className="mb-1 text-gray-700" />}
              {!!csvFileState.file?.name ? (
                <div className=" text-sm text-gray-600 ">{csvFileState.file.name}</div>
              ) : (
                <div className=" text-sm text-gray-700 ">Browse</div>
              )}
            </div>
            <input
              onClick={(e) => {
                (e.target as HTMLInputElement).value = '';
              }}
              onChange={(f) => handleFileChange(f.target.files)}
              ref={fileInputField}
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".csv, .xlsx"
              className="hidden"
            />
            <div className=" flex space-x-2 mt-4">
              <input
                type="checkbox"
                className="checkbox ml-3 
                   border-primary-light rounded-sm mt-1 cursor-pointer"
                name="checkbox"
                id="checkboxForLabel"
              />
              <label className="font-normal text-gray-150 cursor-pointer" htmlFor="checkboxForLabel">
                Update any existing users <br />
                If any imported users are already in your records , we’ll automatically replace their information with the data from your
                import. This option may make the import process take longer.
              </label>
            </div>
            <div className="flex space-x-4 mt-8">
              <Button type="submit" disabled={csvFileState.loading} loading={csvFileState.loading}>
                Save
              </Button>
              <Button type="button" buttonStyle="bg-none" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
            {csvFileState.error && <ErrorMessage message={csvFileState.error} />}
            {!!csvFileState?.successMsg?.length && (
              <div className="text-green text-sm mt-4 margin-top-8 sentence-case capitalize">
                <SafeHtml rawHtml={csvFileState.successMsg} />
              </div>
            )}
          </form>
        </div>
      </ContentFrame>
    </React.Fragment>
  );
}
