import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { IoMdClose } from 'react-icons/io';
import { GetCarBundleQuery } from '@/generated/graphql';
import Link from 'next/link';

export interface IModal {
  onClose: () => void;
  title?: string;
  open: boolean;
  data: GetCarBundleQuery;
}

const BundleDetailModal: React.FC<IModal> = ({
  title = 'Bundle Details',
  onClose,
  open,
  data,
}) => {
  const bundleData = data?.getCarBundle?.data;

  return (
    <>
      {bundleData && (
        <Modal
          open={open}
          onClose={() => onClose()}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm">
            <Box className="bg-white rounded-md w-[95%] sm:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] p-6 relative ">
              <div className=" w-full flex justify-end ">
                <button className=" ms-auto" onClick={() => onClose()}>
                  <IoMdClose
                    size={30}
                    className=" text-gray-400 p-1 bg-gray-200 rounded-full"
                  />
                </button>
              </div>

              <div className="text-center font-extrabold text-2xl mb-8">
                {title}
              </div>

              <div className="flex justify-between items-center text-orange-600 text-xl mb-6">
                <strong>{bundleData.fileType}</strong>
                <strong>Rs.{bundleData.amount}</strong>
              </div>

              <ol className="list-decimal pl-5 space-y-6 text-lg mb-10">
                {bundleData.bundledItems.map((item) => (
                  <li
                    key={item.CarProduct.id}
                    className="text-gray-700 text-medium"
                  >
                    <strong>{item.CarProduct.fileType}</strong> ({' '}
                    <strong>Rs.{item.CarProduct.amount}</strong>)
                    <div>
                      <ul className="list-disc pl-5 ">
                        {item?.CarProduct?.CarProductDocuments?.map(
                          (doc, idx) => (
                            <li
                              key={idx}
                              className="text-blue-600 hover:underline"
                            >
                              <Link href={doc.path} target="_blank">
                                {doc.fileName} ({doc.documentType})
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>

              <button
                className=" font-semibold bg-orange-500  text-white text-md py-2 border text-center border-orange-500  px-8 rounded-md hover:bg-orange-600 capitalize w-full mb-4"
                type="button"
                autoFocus
                onClick={() => onClose()}
              >
                close
              </button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default BundleDetailModal;
