/*  */
import React, { useEffect, useState } from 'react';
import { BsGear } from 'react-icons/bs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { makeSettingsNavLinks } from './SideNavBar';
import MenuLink from './MenuLinks';

export default function PretaaAdminNav({ onClick }: { onClick: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  
  useEffect(() => {
    setClientMenuOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`flex flex-col px-8 -ml-8 -mr-12 rounded-l-2xl overflow-auto 
                    ${location.pathname.includes('/pretaa-admin') || clientMenuOpen ? 'bg-white py-4' : ''}`}>
      <div
        onClick={() => {
          setClientMenuOpen(!clientMenuOpen);
          navigate(routes.owner.clientManagement.match);
        }}
        className={
          ' block cursor-pointer ' +
          (location.pathname.includes('/pretaa-admin') || clientMenuOpen ? 'text-primary ' : 'text-white')
        }>
        <div className="flex flex-row items-center font-bold text-base">
          <BsGear className="mr-2" /> Pretaa Admin
        </div>
      </div>

      {(location.pathname.includes('/pretaa-admin') || clientMenuOpen) && (
        <>
          {/* menu */}
          <div className="px-2 mt-4">
            <div className="flex flex-col">
              <div className="px-4 mt-1">
                <MenuLink
                  text="Client Management"
                  onClick={onClick}
                  to={routes.owner.clientManagement.match}
                  activeMenuPaths="/dashboard/pretaa-admin/client-management"
                />

                <div
                  className="nav-link-fontsize text-primary"
                  onClick={onClick}>
                  {makeSettingsNavLinks(
                    [
                      routes.owner.surveyList.match,
                      routes.owner.addSurvey.match,
                      routes.owner.surveyDetails.details.build(String(params.templateId)),
                      routes.owner.surveyDetails.jsonView.build(String(params.templateId)),
                    ],
                    'Standard Template'
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
