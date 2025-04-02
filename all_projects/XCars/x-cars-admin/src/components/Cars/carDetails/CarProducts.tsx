'use client';
import UploadProducts from '@/components/Documents/UploadProducts';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import useGetCarDetails from '../hooks/useGetCarDetails';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { IPagination } from '@/interface/pagination.interface';
import { useLazyQuery, useMutation } from '@apollo/client';
import catchError from '@/lib/catch-error';
import { toast } from 'react-toastify';
import { MAKE_BUNDLE_PRODUCTS } from '@/graphql/makeBundle.mutation';
import BundleConfirmationModel from '../components/BundleConfirmationModel';
import { CarDoc, GetCarBundleQuery, ProductType } from '@/generated/graphql';
import BundleDetailModal from '../components/BundleDetailModal';
import { GET_CAR_BUNDLE } from '@/graphql/getCarBundle.query';
import Link from 'next/link';
import { MdDelete } from 'react-icons/md';
import {
  DELETE_PRODUCT,
  DELETE_PRODUCT_BUNDLE,
} from '@/graphql/carProducts.mutation';
import DeleteProductModal from '../components/DeleteProductModal';
import { message } from '@/config/message';
import { GrEdit } from 'react-icons/gr';

export interface ISelectedProduct {
  id: string;
  name: string;
  amount: number;
  discountedAmount: number;
  documents: CarDoc[];
}
export default function CarProducts() {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();
  const searchParams = useSearchParams();
  const uploadProducts = searchParams.get('doc');
  const router = useRouter();
  const { data, loading, refetch } = useGetCarDetails({
    carId,
  });
  const [modalState, setModalState] = useState(!!uploadProducts?.length);
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [paginationModel, setPaginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 10,
  });
  const [bundleConfirmationModal, setBundleConfirmationModal] = useState(false);
  const [bundleDetailModal, setBundleDetailModal] = useState(false);
  const [selectBundles, setSelectBundles] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bundleDeleteError, setBundleDeleteError] = useState<string>('');
  const [deleteId, setDeleteId] = useState<{ type: string; id: string }>({
    type: '',
    id: '',
  });
  const [selectedProduct, setSelectedProduct] =
    useState<ISelectedProduct | null>(null);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const columns: GridColDef[] = [
    {
      field: 'fileType',
      headerName: 'Product Name',
      flex: 2,
      minWidth: 120,
      type: 'string',
    },
    {
      field: 'amount',
      headerName: 'Price (INR)',
      flex: 2,
      minWidth: 120,
      type: 'string',
    },
    {
      field: 'discountedAmount',
      headerName: 'Discounted Price (INR)',
      flex: 2,
      minWidth: 120,
      type: 'string',
    },
    {
      field: 'productType',
      headerName: 'Product Type',
      flex: 2,
      minWidth: 120,
      type: 'string',
    },
    {
      field: 'createdAt',
      headerName: 'Created On',
      flex: 2,
      minWidth: 150,
      renderCell: function (params) {
        return (
          <div>
            {format(new Date(Number(params?.row?.createdAt)), 'yyyy-MM-dd')}
          </div>
        );
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated On',
      flex: 2,
      minWidth: 150,
      renderCell: function (params) {
        return (
          <div>
            {format(new Date(Number(params?.row?.updatedAt)), 'yyyy-MM-dd')}
          </div>
        );
      },
    },
    {
      field: 'products',
      headerName: 'Documents',
      flex: 2,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.productType === ProductType.Product ? (
              params.row.documents?.map((doc: CarDoc, idx: number) => (
                <li
                  key={idx}
                  className=" list-none text-blue-600 underline truncate"
                >
                  <Link href={doc.path} target="_blank">
                    view
                  </Link>
                </li>
              ))
            ) : (
              <div
                onClick={() => {
                  getBundleDetail({
                    variables: {
                      bundleId: params.row.id,
                      carId,
                    },
                  });
                }}
                className="text-blue-600 underline truncate"
              >
                {' '}
                view all
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: '',
      headerName: 'Actions',
      flex: 1.5,
      minWidth: 120,
      renderCell: function (params) {
        return (
          <div className="flex justify-start gap-2 items-center h-full ">
            <MdDelete
              onClick={() => {
                if (params.row.productType === ProductType.Product) {
                  setDeleteId({ type: ProductType.Product, id: params.row.id });
                } else if (params.row.productType === ProductType.Bundle) {
                  setDeleteId({
                    type: ProductType.Bundle,
                    id: params.row.id,
                  });
                }
                setDeleteModalState(true);
              }}
              className="text-red-500 hover:bg-gray-300 hover:text-text-700 bg-gray-200 rounded-full p-2"
              size={35}
            />
            {params.row.productType === ProductType.Product && (
              <GrEdit
                className="text-green-600 hover:bg-gray-300 hover:text-green-700 bg-gray-200 rounded-full p-2"
                size={35}
                onClick={() => {
                  startTransition(() => {
                    setSelectedProduct({
                      id: params.row.id,
                      name: params.row.fileType,
                      amount: params.row.amount,
                      discountedAmount: params.row.discountedAmount,
                      documents: params.row.documents,
                    });
                    toggaleModalState();
                    console.log({ sam: params.row });
                  });
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const [createBundleProducts, { loading: bundleLoading }] = useMutation(
    MAKE_BUNDLE_PRODUCTS,
    {
      onCompleted: (d) => {
        toast.success(d.makeBundle.message);
        setBundleConfirmationModal(false);
        refetch();
      },
      onError: (e) => {
        setBundleConfirmationModal(false);
        catchError(e, true);
      },
    }
  );

  const [getBundleDetail, { data: bundleDetailsData }] = useLazyQuery(
    GET_CAR_BUNDLE,
    {
      onCompleted: () => setBundleDetailModal(true),
      onError: (e) => catchError(e, true),
    }
  );

  const [deleteProduct, { loading: deletePoductLoading }] = useMutation(
    DELETE_PRODUCT,
    {
      onCompleted: () => {
        setDeleteModalState(false);
        toast.success(message.successDelete('Product'));
        refetch();
      },
      onError: (e) => {
        setBundleDeleteError(catchError(e));
      },
    }
  );

  const [deleteProductBundle, { loading: deletePoductBundleLoading }] =
    useMutation(DELETE_PRODUCT_BUNDLE, {
      onCompleted: () => {
        setDeleteModalState(false);
        toast.success(message.successDelete('Bundle'));
        refetch();
      },
      onError: (e) => {
        catchError(e, true);
      },
    });

  const toggaleModalState = () => {
    setModalState((prev) => !prev);
  };

  return (
    <>
      <div>
        <div className=" flex flex-row justify-between items-center">
          <div>
            <div className="text-gray-900 text-lg font-semibold">
              Car Products
            </div>
            <p className=" text-xs text-gray-500 font-thin">
              Add the cars related products to proceed to next step
            </p>
          </div>

          <button
            className=" bg-orange-500 font-semibold text-white rounded-md px-4 py-2 text-sm flex justify-center items-center gap-1 hover:bg-orange-600"
            onClick={() => toggaleModalState()}
          >
            <IoIosAddCircleOutline size={20} /> Add Products
          </button>
        </div>
        <hr className=" w-full bg-gray-300 mt-4" />
        <div className="my-5 w-full flex justify-end gap-4">
          <button
            disabled={
              (data?.getCarDetailAdmin.data.products &&
                data?.getCarDetailAdmin.data.products?.length <= 1) as boolean
            }
            onClick={() => setSelectBundles(!selectBundles)}
            className={`" border text-white font-semibold rounded-md px-4 py-2 text-sm " ${
              data?.getCarDetailAdmin.data.products &&
              data?.getCarDetailAdmin.data.products?.length <= 1
                ? 'bg-gray-300 cursor-not-allowed  border-gray-300'
                : 'border-orange-500 bg-orange-500 cursor-pointer hover:bg-orange-600'
            }`}
          >
            {selectBundles ? 'Abort Bundle' : ' Add New Bundle'}
          </button>
          <button
            disabled={selectedRows.length < 2}
            onClick={() => setBundleConfirmationModal(true)}
            className={` ' border text-white font-semibold rounded-md px-4 py-2 text-sm ' ${
              selectedRows.length < 2
                ? 'bg-gray-300 cursor-not-allowed  border-gray-300'
                : 'border-orange-500 bg-orange-500 cursor-pointer hover:bg-orange-600'
            }`}
          >
            Create bundle
          </button>
        </div>
        <div className="flex flex-col h-[80vh]">
          <DataGrid
            loading={loading}
            rows={data?.getCarDetailAdmin.data.products || []}
            columns={columns}
            pagination
            checkboxSelection={selectBundles}
            onRowSelectionModelChange={(ids) => {
              setSelectedRows(() => ids as string[]);
            }}
            disableRowSelectionOnClick={!selectBundles}
            pageSizeOptions={[10, 50, 100]}
            rowCount={data?.getCarDetailAdmin.data.products?.length || 0}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            filterMode="server"
            disableDensitySelector
            disableColumnSelector
            sx={{
              border: 0,
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
              width: '100%',
              overflowX: 'auto',
            }}
            isRowSelectable={(params: GridRowParams) =>
              params.row.productType === ProductType.Product
            }
            getRowClassName={(params: GridRowParams) =>
              params.row.productType === ProductType.Bundle ? 'no-checkbox' : ''
            }
            className=" overflow-scroll"
          />
        </div>
      </div>
      <BundleConfirmationModel
        loading={bundleLoading}
        title={` Are you sure you want to bundle these (${selectedRows.length}) products ?`}
        open={bundleConfirmationModal}
        onClose={() => {
          setBundleConfirmationModal(false);
        }}
        onConfirm={(
          name: string,
          price: number,
          discountedAmount: number | null
        ) => {
          createBundleProducts({
            variables: {
              carId,
              productIds: selectedRows,
              name,
              amount: price,
              discountedAmount: discountedAmount,
            },
          });
          setSelectBundles(false);
        }}
      />

      <BundleDetailModal
        title="Bundle Details"
        open={bundleDetailModal}
        onClose={() => setBundleDetailModal(false)}
        data={bundleDetailsData as GetCarBundleQuery}
      />

      {!isPending && modalState && (
        <UploadProducts
          maxFilesAllowed={1}
          modalState={modalState}
          onClose={() => {
            toggaleModalState();
            setSelectedProduct(null);
          }}
          selectedProduct={selectedProduct}
          onCompleted={() => {
            refetch();
            if (uploadProducts?.length) {
              router.back();
              setModalState(false);
            }
          }}
        />
      )}

      <DeleteProductModal
        title="Are you sure you want to delete this product?"
        onClose={() => {
          setDeleteModalState(false);
          setBundleDeleteError('');
        }}
        onConfirm={() => {
          if (deleteId.type === ProductType.Product) {
            deleteProduct({
              variables: {
                productIds: [deleteId.id],
              },
            });
          } else if (deleteId.type === ProductType.Bundle) {
            deleteProductBundle({
              variables: {
                bundleId: deleteId.id,
              },
            });
          }
        }}
        open={deleteModalState}
        loading={deletePoductLoading || deletePoductBundleLoading}
        bundleDeleteError={bundleDeleteError}
      />
    </>
  );
}
