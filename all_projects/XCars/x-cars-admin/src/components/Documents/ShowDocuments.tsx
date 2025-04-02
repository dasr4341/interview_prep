import React, { useState } from 'react';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';
import { config } from '@/config/config';
import Image from 'next/image';
import useRemoveDocument from './customHooks/useRemoveDocument';
import { DeleteDocType } from '@/generated/graphql';
import { Loader } from '@mantine/core';
import { IShowDocuments } from './interface/showDocuments.interface';
import NoDataFound from '../NoDataFound';
import { message } from '@/config/message';
import { IoVideocamOutline } from 'react-icons/io5';

const ViewBtn = ({ href }: { href: string }) => (
  <Link
    href={href}
    target="_blank"
    download={true}
    className=" transform -translate-x-1/2 top-1/2 left-1/2  -translate-y-1/2 px-3 text-sm py-0.5 text-white bg-green-600 border border-green-600 tracking-wider backdrop-blur-sm opacity-85 rounded-md absolute hidden group-hover:block font-semibold "
  >
    view
  </Link>
);

function DocumentCard({
  file,
  loading,
  onDelete,
}: {
  file: IShowDocuments;
  loading: boolean;
  onDelete: (() => void) | null;
}) {
  return (
    <div
      className={` col-span-1 group flex backdrop-blur-md relative max-h-[110px] flex-col justify-center items-center
${file.path.includes(config.documents.acceptedTypes.pdf) ? 'gap-3' : 'gap-1'}
p-2 gradient-overlay  rounded-md  `}
    >
      {file.path.includes(config.documents.acceptedTypes.pdf) && (
        <AiOutlineFilePdf size={40} color="red" />
      )}
      {(file.path.includes(config.documents.acceptedTypes.jpg) ||
        file.path.includes(config.documents.acceptedTypes.png)) && (
        <Image
          loader={() => {
            return file.path;
          }}
          src={file.path}
          width={100}
          height={100}
          className="h-[50px] object-cover w-full rounded-lg mx-auto"
          priority
          alt={file.fileName}
        />
      )}
      {file.path.includes('vimeo') && (
        <IoVideocamOutline size={40} color="blue" />
      )}

      {!loading && file.path.includes('vimeo') && (
        <ViewBtn href={file.path.substring(file.path.lastIndexOf('https'))} />
      )}
      {!loading && !file.path.includes('vimeo') && <ViewBtn href={file.path} />}
      {loading && (
        <Loader
          color="gray"
          className=" absolute transform -translate-x-1/2 top-1/2 left-1/2  -translate-y-1/2"
          size={30}
        />
      )}
      <span className=" truncate w-5/6 text-light text-gray-200 tracking-wide text-xs capitalize ">
        {file.fileName.toLowerCase().replaceAll('_', ' ')}
      </span>
      {onDelete && (
        <IoMdClose
          onClick={() => !loading && onDelete()}
          size={25}
          className=" cursor-pointer bg-red-400 rounded-full p-1 text-white  absolute -top-2 -right-2"
        />
      )}
    </div>
  );
}

export default function ShowDocuments({
  documents,
  documentsType,
  onDeleteCompleted,
  isDocumentDeletable,
}: {
  onDeleteCompleted: () => void;
  documentsType: DeleteDocType;
  documents: {
    [key: string]: { amount: string; data: IShowDocuments[] };
  } | null;
  isDocumentDeletable: boolean;
}) {
  const { loading, deleteDocument } = useRemoveDocument(onDeleteCompleted);
  const [selectedForDelete, setSelectedForDelete] = useState<string | null>(
    null
  );

  return (
    <div>
      {!documents ||
        (!Object.entries(documents).length && (
          <NoDataFound message={' No document uploaded !!'} />
        ))}
      {documents &&
        Object.entries(documents).map(([key, value]) => {
          return (
            <div key={key} className=" flex flex-col my-6  ">
              <h3 className=" text-gray-600 font-semibold capitalize">
                {key.replaceAll('_', ' ').toLowerCase()}
              </h3>
              <div className=" grid grid-cols-8 mt-3 justify-stretch  items-stretch  gap-8 flex-wrap">
                {value.data?.map((file, index) => (
                  <DocumentCard
                    key={index}
                    file={file}
                    loading={selectedForDelete === file.id && loading}
                    onDelete={
                      isDocumentDeletable
                        ? () => {
                            deleteDocument(file.id, documentsType);
                            setSelectedForDelete(file.id);
                          }
                        : null
                    }
                  />
                ))}
                {!value.data?.length && (
                  <NoDataFound message={message.noDocumentsFound} />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
