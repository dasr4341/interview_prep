import { ContentHeader } from 'components/ContentHeader';
import './EmployeeManagement.scss';
import { NavLink, useParams } from 'react-router-dom';
import Button from 'components/ui/button/Button';
import EmployeeList from './components/EmployeeList/EmployeeList';
import NoEmployee from './components/NoEmployee/NoEmployee';
import React, { useState } from 'react';
import { routes } from 'routes';
import Popup from 'reactjs-popup';
import { careTeamInvitation } from 'graphql/care-team-invitation.mutation';
import { InviteCareTeams, InviteCareTeamsVariables, UserStaffTypes } from 'health-generatedTypes';
import { useMutation } from '@apollo/client';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import AddEmployee from './components/AddEmployee';
import CustomSearchField from 'components/CustomSearchField';

export default function EmployeeManagement() {
  const [selectedEmployee, setSelectedEmployee] = useState<string[]>([]);
  const [searchedPhase, setSearchedPhase] = useState('');
  const [noEmployee] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [invitationButtonOff, setInvitationButtonOff] = useState<boolean>(false);
  const [isRegisteredStaff, setIsRegisteredStaff] = useState(false);
  const { staffType } = useParams();

  const [completeInvitation, { loading: submitInvitationLoading }] = useMutation<InviteCareTeams, InviteCareTeamsVariables>(
    careTeamInvitation,
    {
      onCompleted: (d) => {
        setSuccessMessage(d.pretaaHealthInviteCareTeams);
        setDialogOpen(true);
      },
      onError: (e) => catchError(e, true),
    }
  );

  function handleOnClose() {
    setDialogOpen(false);
    setTrigger((t) => t + 1);
  }

  function submitInvite() {
    if (selectedEmployee.length < 1) {
      toast.error('Please select an employee');
    } else {
      completeInvitation({
        variables: {
          careTeamMembers: selectedEmployee,
        },
      });
    }
  }

  return (
    <React.Fragment>
      <ContentHeader
        title="Staff Management"
        className="lg:sticky"
        disableGoBack={true}>
        <div className="block sm:flex sm:justify-between heading-area">
          <CustomSearchField
            defaultValue={searchedPhase}
            onChange={setSearchedPhase}
          />
          <div className="header-right mt-3 sm:mt-0 inline-block">
            <AddEmployee />
          </div>
        </div>
        <div className="flex bg-white border-b space-x-4 mt-6">
          <NavLink
            to={routes.admin.employee.list.build(UserStaffTypes.COUNSELLOR)}
            className={`py-1 px-4 text-primary mr-2 font-bold  ${
              staffType === UserStaffTypes.COUNSELLOR ? 'activeTabClasses' : ''
            }`}>
            Care Team
          </NavLink>
          <NavLink
            to={routes.admin.employee.list.build(UserStaffTypes.FACILITY_ADMIN)}
            className={`py-1 px-4 text-primary font-bold ${
              staffType === UserStaffTypes.FACILITY_ADMIN ? 'activeTabClasses' : ''
            }`}>
            Facility Admin
          </NavLink>
          <NavLink
            to={routes.admin.employee.list.build(UserStaffTypes.SUPER_ADMIN)}
            className={`py-1 px-4 text-primary font-bold ${
              staffType === UserStaffTypes.SUPER_ADMIN ? 'activeTabClasses' : ''
            }`}>
            Super Admin
          </NavLink>
        </div>
      </ContentHeader>

      {!noEmployee && (
        <EmployeeList
          setIsRegisteredStaff={setIsRegisteredStaff}
          setSelectedEmployee={setSelectedEmployee}
          trigger={trigger}
          setInvitationButtonOff={setInvitationButtonOff}
          userStaffType={staffType as UserStaffTypes}
        />
      )}

      {noEmployee && <NoEmployee />}

      {!!selectedEmployee.length && invitationButtonOff && !isRegisteredStaff && (
        <ContentFooter>
          <div className="header-right mt-3 sm:mt-0 inline-block">
            <Button
              onClick={submitInvite}
              loading={submitInvitationLoading}
              disabled={submitInvitationLoading}>
              Invite to Pretaa
            </Button>
          </div>
        </ContentFooter>
      )}

      <Popup
        open={dialogOpen}
        closeOnDocumentClick={false}
        contentStyle={{ maxWidth: '600px' }}
        modal>
        <React.Fragment>
          <div className="text-left py-7 px-8">
            <p className="font-bold text-md text-black">{successMessage}</p>
            <div className="pt-8">
              <Button onClick={() => handleOnClose()}>Close</Button>
            </div>
          </div>
        </React.Fragment>
      </Popup>
    </React.Fragment>
  );
}
