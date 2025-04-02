import { UserDetails_pretaaGetUserDetails } from 'generatedTypes';
import { BsPencil } from 'react-icons/bs';
import { LabeledValue } from 'components/LabeledValue';

export default function UserDetail({
  userDetail,
  onRedirectToUserEdit,
}: {
  userDetail?: UserDetails_pretaaGetUserDetails;
  onRedirectToUserEdit?: any;
}) {
  return (
    <>
      <h3 className="h3 mb-2 mt-7 text-base">
        User detail
        <button className="px-2 pl-0" onClick={onRedirectToUserEdit}>
          <BsPencil className="text-primary-light inline ml-3" />
        </button>
      </h3>
      <div className="grid lg:grid-cols-1 sm:grid-cols-1 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl px-5 py-6">
          <div
            className="bg-white grid lg:grid-cols-3 
              md:grid-cols-2 gap-y-6 
              rounded-xl">
            <LabeledValue label="Email">{userDetail?.email}</LabeledValue>
            <LabeledValue label="Manager">
              {userDetail?.userManager.map((u) => `${u.manager.firstName} ${u.manager.lastName}`).join(',')}
            </LabeledValue>
            <LabeledValue label="Department">{userDetail?.department}</LabeledValue>
          </div>
          <div
            className="bg-white grid lg:grid-cols-3 
              md:grid-cols-2  gap-y-6 mt-4
              rounded-xl">
            <LabeledValue label="Salary Band">
              {userDetail?.dynamicFields?.salaryBand || 'NA'}
            </LabeledValue>

            <LabeledValue label="Region">{userDetail?.dynamicFields?.region || 'NA'}</LabeledValue>
          </div>
          <div
            className="bg-white grid lg:grid-cols-3 
              md:grid-cols-2  gap-y-6 mt-4
              rounded-xl">
            <LabeledValue label="Pretaa Status">{userDetail?.active ? 'Active' : 'Inactive'}</LabeledValue>
            <LabeledValue label="CRM Status">
              {userDetail?.crmStatus ? 'Active' : 'Inactive'}
            </LabeledValue>
            <LabeledValue label="CSM Status">{userDetail?.csmStatus ? 'Active' : 'Inactive'}</LabeledValue>
          </div>
        </div>
      </div>
    </>
  );
}
