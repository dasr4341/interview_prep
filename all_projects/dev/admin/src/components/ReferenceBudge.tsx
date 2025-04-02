import { IoIosClose } from 'react-icons/io';
import ConfirmationBox from 'components/ConfirmationDialog';
import { useMutation } from '@apollo/client';
import { DeleteCompanyReference, DeleteCompanyReferenceVariables } from 'generatedTypes';
import { deleteReference } from 'lib/mutation/companies/company-delete-reference';
import { toast } from 'react-toastify';
import { successList } from '../lib/message.json';
import { useState } from 'react';
import catchError from 'lib/catch-error';

const ReferenceBudge = ({
  companyId,
  type,
  onRemoved,
  className,
}: {
  companyId: string;
  type?: string;
  onRemoved: any;
  className?: any;
}) => {
  const [selectedReference, setSelectedReference] = useState<string | null>(null);

  const [deleteReferenceAction, { loading: loadingDeleteReference }] = useMutation<
    DeleteCompanyReference,
    DeleteCompanyReferenceVariables
  >(deleteReference, {
    onCompleted: () => {
      toast.success(successList.referenceDelete);
      onRemoved(type);
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  function onConfirm(selectedId: string) {
    deleteReferenceAction({
      variables: {
        companyId: selectedId,
      },
    });
    setSelectedReference(null);
  }

  function onCancel() {
    setSelectedReference(null);
  }

  return (
    <>
      <div className={`${className ? '' : 'block mt-2'}`}>
        <div
          className={`flex justify-center	items-center  bg-green rounded-full text-white uppercase
            h-6 w-28 text-xxs py-2 px-2.5 font-bold pt-2 cursor-pointer ${className ? className : 'block mt-2'}`}
          onClick={() => {
            setSelectedReference(String(companyId));
          }}>
          <span>Reference</span>
          <IoIosClose size="20" />
        </div>
      </div>
      <ConfirmationBox
        modalState={selectedReference ? true : false}
        className="max-w-sm rounded-xl p0"
        confirmBtnText="Remove"
        disabledBtn={loadingDeleteReference}
        onConfirm={() => onConfirm(String(selectedReference))}
        onCancel={() => onCancel()}
        changeBtnStyle={true}
        buttonRowAlign="border-t border-border-dark"
        contentWrapperClass="pt-8 px-8 xl:px-12">
        <div className="text-xmd font-bold-500">Are you sure?</div>
        <div className="mt-4">If you proceed, this customer will no longer appear in reference search results.</div>
      </ConfirmationBox>
    </>
  );
};

export default ReferenceBudge;
