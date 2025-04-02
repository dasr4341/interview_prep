import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { LabeledValue } from 'components/LabeledValue';
import Button from '../../components/ui/button/Button';
import JiraIcon from '../../assets/images/jira.svg';
import GithubIcon from '../../assets/images/github.svg';
import SelesForceIcon from '../../assets/images/salesforce.svg';
import ZendeskIcon from '../../assets/images/zendesk.svg';
import { Link } from 'react-router-dom';
import { TrackingApi } from 'components/Analytics';
import { useEffect } from 'react';
import { routes } from 'routes';

export default function CompanyDataSourceScreen(): JSX.Element {
  
  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyDataSource.name,
    });
  }, []);

  const DataSourceRow = (dataSource: any) => {
    return (
      <div
        className={`bg-white 
      grid grid-cols-3 gap-2 items-center p-6 border-b last:border-b-0 
      last:rounded-b-xl
      first:rounded-t-xl`}>
        <div className="flex">
          <img alt="avatar" src={dataSource.icon} className="w-16 h-16 border-border-dark" />
          <div className="ml-6 flex flex-col justify-center">
            <label className="block font-bold text-primary">{dataSource.dataName}</label>
            <span className="text-gray-600 font-semibold uppercase text-xs">{dataSource.text1}</span>
            {dataSource.text2 && <span className="text-xs text-pt-red-900 font-medium">{dataSource.text2}</span>}
          </div>
        </div>

        <div className="flex justify-center">
          <LabeledValue label="Access Level">Data</LabeledValue>
        </div>
        <button className="flex justify-end">
          <Link to="/">
            <DisclosureIcon />
          </Link>
        </button>
      </div>
    );
  };
  const dataSources = [
    {
      dataName: 'Jira',
      icon: JiraIcon,
      text1: 'Email/Account Connected',
      text2: '',
      link: '/',
    },
    {
      dataName: 'GitHub',
      icon: GithubIcon,
      text1: 'Email/Account Connected',
      text2: 'Connectivity Issues - Contact Your Admin',
      link: '/',
    },
    {
      dataName: 'Salesforce',
      icon: SelesForceIcon,
      text1: 'Email/Account Connected',
      text2: '',
      link: '/',
    },
    {
      dataName: 'Zendesk',
      icon: ZendeskIcon,
      text1: 'Email/Account Connected',
      text2: '',
      link: '/',
    },
  ];
  return (
    <>
      <ContentHeader title="Data Source" />
      <ContentFrame>
        <Button classes={['float-right']} text="Refresh" />
      </ContentFrame>
      <ContentFrame>
        <div className="mt-6">
          {dataSources.map((ds) => {
            return DataSourceRow(ds);
          })}
        </div>
      </ContentFrame>
    </>
  );
}
