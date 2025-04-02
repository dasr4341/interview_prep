import MenuLink from './MenuLink';
import { testDashboardRoutes } from 'Lib/Routes/TestDashboardRoutes';
import { Select } from '@mantine/core';
import { config } from 'config';
import { getDbCurrentInstance, setDbInstance } from 'helper/dbInstance';

export default function SidebarComponent() {
  return (
    <div
      className='flex flex-col sm:flex-row sm:justify-around'
      data-test-id='dashboard-sidebar'>
      <div className='w-72 h-screen'>
        <div className='flex items-center justify-start mx-6 mt-10'>
          <span className='text-gray-600  ml-4 text-2xl font-bold'>
            Testing Dashboard
          </span>
        </div>
        <nav className='mt-10 px-6 '>
          <MenuLink
            text='Home'
            activeMenuPaths={[
              testDashboardRoutes.testMatchingPath,
              testDashboardRoutes.schedulerFrequencyTest.fullPath,
              testDashboardRoutes.sourceSystem.ritten.fullPath,
              testDashboardRoutes.sourceSystem.kipu.fullPath,
            ]}
            link={testDashboardRoutes.list.fullPath}
          />
          <Select
            label='Switch Instance'
            placeholder={(
              getDbCurrentInstance() ?? config.environment.defaultEnv
            ).toUpperCase()}
            data={Object.values(config.environment.list).map((e) =>
              e.toUpperCase()
            )}
            onChange={(data) => {
              if (data) {
                localStorage.clear();
                setDbInstance(data);
                setTimeout(() => {
                  window.location.reload();
                }, 200);
              }
            }}
          />
        </nav>
      </div>
    </div>
  );
}
