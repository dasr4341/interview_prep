/* eslint-disable no-unused-vars */
'use client';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { RxCrossCircled } from 'react-icons/rx';
import FormControl from '@mui/material/FormControl';
import { Loader } from '@mantine/core';
import { ErrorMessage } from '@/components/ErrorMessage';
import PreviewSelectedDocument from './PreviewSelectedDocument';
import { config } from '@/config/config';
import { DocumentTypeDocumentType } from '@/generated/graphql';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { message } from '@/config/message';
import { ISelectedProduct } from '@/components/Cars/carDetails/CarProducts';

interface IFileTypeList {
  inputValue?: string;
  label: string;
  value: string;
}

interface IDragDropInput {
  defaultData?: ISelectedProduct | null;
  loading?: boolean;
  onUpload: (
    selectedFile: File[],
    fileName: string,
    type: DocumentTypeDocumentType,
    onCompleted: () => void,
    selectedDocumentPrice: number,
    discountedAmount: number
  ) => void;
  fileTypeList?: IFileTypeList[];
  acceptedFiles: string[];
  isPaid?: boolean;
  maxFilesAllowed?: number;
}

const DragDropInput: FC<IDragDropInput> = ({
  defaultData,
  loading,
  maxFilesAllowed = config.app.maxAllowedFiles,
  acceptedFiles,
  fileTypeList,
  onUpload,
  isPaid,
}) => {
  const [fileName, setFileName] = useState<IFileTypeList | null>(
    defaultData
      ? { value: defaultData.name, label: defaultData.name }
      : fileTypeList?.length
        ? fileTypeList[0]
        : null
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);

  const [selectedFileURL, setSelectedFileURL] = useState<
    { fileURL: string; fileType: string }[]
  >(
    defaultData?.documents.map((docs) => ({
      fileURL: docs.path,
      fileType:
        DocumentTypeDocumentType.Document === docs.documentType
          ? config.documents.acceptedTypes.pdf
          : DocumentTypeDocumentType.Video === docs.documentType
            ? config.documents.acceptedTypes.mp4
            : DocumentTypeDocumentType.Image,
    })) ?? []
  );

  const [selectedDocumentPrice, setSelectedDocumentPrice] = useState<string>(
    () => String(defaultData?.amount) ?? ''
  );
  const [selectedDiscountedPrice, setSelectedDiscountedPrice] =
    useState<string>(String(defaultData?.discountedAmount) ?? '');

  const [acceptedTypes, setAcceptedTypes] = useState<{
    types: string[];
    dropZoneAcceptedTypes: Accept;
  }>({
    types: acceptedFiles,
    dropZoneAcceptedTypes: {},
  });

  const onDrop = useCallback(
    (uploadedFiles: File[]) => {
      if ([...selectedFile, ...uploadedFiles].length > maxFilesAllowed) {
        setError(message.maxAllowedFiles(maxFilesAllowed));
      } else {
        setError(null);
      }
      if (uploadedFiles.length) {
        setSelectedFile((prev) =>
          [...prev, ...uploadedFiles].slice(0, maxFilesAllowed)
        );
        setSelectedFileURL((prev) => {
          return [
            ...prev,
            ...uploadedFiles.map((file) => ({
              fileURL: URL.createObjectURL(file),
              fileType: file.path,
            })),
          ].slice(0, maxFilesAllowed);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSelectedFile, setSelectedFileURL]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedTypes.dropZoneAcceptedTypes,
  });

  const handleFileUpload = () => {
    const path = selectedFile[0]?.path || '';
    let type: DocumentTypeDocumentType = DocumentTypeDocumentType.Image;
    if (path.includes(config.documents.acceptedTypes.mp4)) {
      type = DocumentTypeDocumentType.Video;
    } else if (path.includes(config.documents.acceptedTypes.pdf)) {
      type = DocumentTypeDocumentType.Document;
    }

    onUpload(
      selectedFile || [],
      fileName?.value || '',
      type,
      () => {
        setSelectedFile([]);
        setSelectedFileURL([]);
        setSelectedDocumentPrice('');
        setSelectedDiscountedPrice('');
        setFileName(fileTypeList?.length ? fileTypeList[0] : null);
      },
      Number(selectedDocumentPrice),
      Number(selectedDiscountedPrice)
    );
  };
  const isFormDirty = () => {
    if (loading || error) {
      return true;
    }
    if (isPaid) {
      return (
        !fileName?.value ||
        !selectedDocumentPrice ||
        selectedDocumentPrice === 'undefined' ||
        (defaultData ? false : !selectedFile.length)
      );
    }
    if (defaultData) {
      return !defaultData?.documents.length || !fileName?.value.length;
    }
    return !fileName?.value.length || !selectedFile.length;
  };

  const filter = createFilterOptions<IFileTypeList>();

  useMemo(() => {
    const types = [];
    // images
    if (
      fileName?.value.includes(config.documents.cars.thumbnail.value) ||
      fileName?.value.includes(config.documents.cars.images.value)
    ) {
      types.push(config.documents.acceptedTypes.png);
      types.push(config.documents.acceptedTypes.jpg);
    } else if (fileName?.value.includes(config.documents.cars.video.value)) {
      types.push(config.documents.acceptedTypes.mp4);
    } else {
      types.push(...acceptedFiles);
    }

    const dropZoneAcceptedTypes = types.reduce((prev: Accept, curr) => {
      const customTypes: Accept = { ...prev };
      switch (curr) {
        case config.documents.acceptedTypes.mp4: {
          customTypes[`video/${curr.replaceAll('.', '')}`] = [];
          break;
        }
        case config.documents.acceptedTypes.jpg: {
          if (!customTypes[`image/*`]) {
            customTypes[`image/*`] = [];
          }
          customTypes[`image/*`].push(config.documents.acceptedTypes.jpg);
          break;
        }
        case config.documents.acceptedTypes.png: {
          if (!customTypes[`image/*`]) {
            customTypes[`image/*`] = [];
          }
          customTypes[`image/*`].push(config.documents.acceptedTypes.png);
          break;
        }
        case config.documents.acceptedTypes.pdf: {
          customTypes[`application/${curr.replaceAll('.', '')}`] = [];
          break;
        }
      }

      return customTypes;
    }, {});
    setAcceptedTypes({ types, dropZoneAcceptedTypes });
  }, [acceptedFiles, fileName]);

  // useEffect(() => {
  //   if (selectedFile.length < maxFilesAllowed) {
  //     setError(null);
  //   }
  // }, [selectedFile, maxFilesAllowed]);

  return (
    <div className=" flex flex-col items-start gap-6 ">
      <div className=" flex flex-row w-full mt-8 gap-8 ">
        {!!fileTypeList?.length && (
          <Stack sx={{ width: 250 }}>
            <Autocomplete
              value={fileName}
              onChange={(_event, newValue) => {
                if (typeof newValue === 'string') {
                  setFileName({ value: newValue, label: newValue });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setFileName({
                    value: newValue.inputValue,
                    label: newValue.inputValue,
                  });
                } else {
                  setFileName(newValue);
                }
                setSelectedFile([]);
                setSelectedFileURL([]);
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.value
                );
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    value: inputValue,
                    label: `Add "${inputValue}"`,
                  });
                }
                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={fileTypeList}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.label;
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    {option.label}
                  </li>
                );
              }}
              sx={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Select document" />
              )}
            />
          </Stack>
        )}

        {!fileTypeList?.length && (
          <div className=" flex flex-row gap-4 items-center flex-wrap">
            <FormControl sx={{ width: 250 }} className="select">
              <label
                htmlFor="select"
                className=" font-medium text-gray-600 text-md   mb-2"
              >
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                disabled={loading}
                className="border border-blue-100 p-4 capitalize rounded-md"
                value={fileName?.value || ''}
                placeholder="Please enter product name"
                onChange={(e) => {
                  setFileName({ value: e.target.value, label: e.target.value });
                  if (e.target.value) {
                    setError(null);
                  }
                }}
              />
            </FormControl>
            {isPaid && (
              <FormControl sx={{ width: 250 }} className="select">
                <label
                  htmlFor="select"
                  className=" font-medium text-gray-600 text-md  mb-2"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  disabled={loading}
                  className="border border-blue-100 p-4 capitalize rounded-md"
                  type="number"
                  value={
                    selectedDocumentPrice ? Number(selectedDocumentPrice) : ''
                  }
                  placeholder="Please enter the price"
                  onChange={(e) => {
                    setSelectedDocumentPrice(e.target.value);
                    if (e.target.value && Number(e.target.value) > 0) {
                      setError(null);
                    } else {
                      setError('Price is mandatory and must be greater than 0');
                    }
                  }}
                />
              </FormControl>
            )}

            {isPaid && (
              <FormControl sx={{ width: 250 }} className="select">
                <label
                  htmlFor="select"
                  className=" font-medium text-gray-600 text-md  mb-2"
                >
                  Discounted Price
                </label>
                <input
                  disabled={loading}
                  className="border border-blue-100 p-4 capitalize rounded-md"
                  type="number"
                  value={
                    selectedDiscountedPrice
                      ? Number(selectedDiscountedPrice)
                      : ''
                  }
                  placeholder="Please enter the discounted price"
                  onChange={(e) => {
                    setSelectedDiscountedPrice(e.target.value);
                    if (
                      (e.target.value && Number(e.target.value) > 0) ||
                      e.target.value === ''
                    ) {
                      setError(null);
                    } else {
                      setError('Discounted price should be greater than 0');
                    }
                  }}
                />
              </FormControl>
            )}
          </div>
        )}
      </div>

      <div className=" flex flex-col items-start w-full gap-4  ">
        <div
          className=" cursor-pointer w-full p-8 bg-blue-100 border-2 border-blue-400 border-dashed flex justify-center items-center rounded-xl"
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col gap-1 justify-center items-center mx-auto ">
            <span className=" text-md text-blue-950">
              Drop your files here!
            </span>

            {!!selectedFile.length && (
              <span className=" text-gray-500 tracking-wide text-sm mx-auto">{`${selectedFile.length} files selected`}</span>
            )}
            <span className="text-gray-500 tracking-wide text-sm mx-auto ">
              Files supported - {acceptedTypes.types.join(', ')} only
            </span>
            <button
              disabled={loading}
              type="submit"
              className="text-md hover:bg-blue-600 px-4 py-1 mt-8 bg-blue-500 text-white rounded-md font-medium border border-transparent w-fit"
              onClick={(e) => e.preventDefault()}
            >
              Choose File
            </button>
          </div>
        </div>

        <button
          disabled={isFormDirty() || !!error || loading}
          type="submit"
          className={`px-6 rounded-md py-1 flex justify-start gap-2 items-start text-md hover:bg-blue-700 tracking-wider font-semibold ${!isFormDirty() ? 'bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}  text-white border `}
          onClick={handleFileUpload}
        >
          Upload {loading && <Loader size={20} color="blue" />}
        </button>

        {error && <ErrorMessage message={error} />}

        {!!selectedFileURL.length && (
          <div className="flex flex-col bg-gray-100 w-full p-2 gap-3 rounded-md ">
            <div className=" font-semibold text-gray-700 tracking-wide  ">
              Preview
            </div>
            <div className=" flex flex-row flex-wrap gap-4">
              {selectedFileURL.map((file, i) => (
                <div
                  key={i}
                  className="relative gradient-overlay  p-1 rounded-lg"
                >
                  <RxCrossCircled
                    className=" absolute -top-2 -right-2 hover:cursor-pointer"
                    onClick={() =>
                      setSelectedFileURL((files) =>
                        files.filter((file, index) => index !== i)
                      )
                    }
                    color="blue"
                    size={20}
                  />
                  <PreviewSelectedDocument file={file} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropInput;
