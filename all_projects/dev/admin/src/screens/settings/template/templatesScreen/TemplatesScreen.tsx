import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { GetTemplates, GetTemplatesVariables, GetTemplates_pretaaGetEmailTemplatesCreatedOrSharedOrAssigned, UserPermissionNames } from 'generatedTypes';
import useOnScreen from 'lib/use-onscreen';
import { FC, useEffect, useRef, useState } from 'react';
import TemplateList from './TemplateList';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { useLazyQuery } from '@apollo/client';
import { GetEmailTemplates } from 'lib/query/templates/get-email-templates';
import NoDataFound from 'components/NoDataFound';
import { client } from 'apiClient';
import catchError from 'lib/catch-error';
import { range } from 'lodash';
import usePermission from 'lib/use-permission';
import { TrackingApi } from 'components/Analytics';

const Loading: FC = () => (
  <>
    {range(0, 5).map((i) => (
      <div className="ph-item mb-0" key={i}>
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-4 empty"></div>
            <div className="ph-col-2"></div>
          </div>
        </div>
      </div>
    ))}
  </>
);

export default function SettingsTemplateScreen(): JSX.Element {
  const [templatesList, setTemplatesList] = useState<GetTemplates_pretaaGetEmailTemplatesCreatedOrSharedOrAssigned[]>([]);
  const emailTemplatePermission = usePermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES);

  const loadMoreButton = useRef<any>();
  const loadMoreVisible = useOnScreen(loadMoreButton);
  const [hideLoadMore, setHideLoadMore] = useState(true);
  const location = useLocation();

  const [getTemplatesQuery, { data: templates, loading, refetch: refetchTemplates }] = useLazyQuery<GetTemplates, GetTemplatesVariables>(GetEmailTemplates);

  function createTemplateQuery() {
    const queryVariables: GetTemplatesVariables = {
      take: 20,
      skip: 0,
    };

    return queryVariables;
  }

  async function loadMore() {
    try {
      const q = createTemplateQuery();
      const result = await client.query<GetTemplates, GetTemplatesVariables>({
        query: GetEmailTemplates,
        variables: {
          ...q,
          skip: templatesList.length,
        },
      });
      setHideLoadMore(result.data.pretaaGetEmailTemplatesCreatedOrSharedOrAssigned.length !== 20);
      setTemplatesList(templatesList.concat(result.data.pretaaGetEmailTemplatesCreatedOrSharedOrAssigned));
    } catch (err) {
      catchError(err);
    }
  }

  useEffect(() => {
    if (!templates)
      getTemplatesQuery({
        variables: createTemplateQuery(),
      });
    if (templates) {
      setHideLoadMore(templates.pretaaGetEmailTemplatesCreatedOrSharedOrAssigned.length !== 20);
      setTemplatesList(templates.pretaaGetEmailTemplatesCreatedOrSharedOrAssigned);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, templates]);

  useEffect(() => {
    if (loadMoreVisible && !hideLoadMore) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMoreVisible]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.templateList.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={'Templates'} className="lg:pb-0" disableGoBack={true} breadcrumb={false}>
        <div className="flex flex-row gap-7 text-base font-bold md:mt-14">
          <div
            className="pb-1 border-b-2 cursor-pointer
           border-primary-light text-primary-light">
            Emails
          </div>
        </div>
      </ContentHeader>
      <ContentFrame>
        <div
          className="flex flex-col lg:flex-row mt-11 
          justify-between items-start lg:items-center space-y-2 lg:space-y-0">
          <span className="text-primary text-md font-normal">Email templates</span>
          {emailTemplatePermission?.capabilities.CREATE && (
            <div>
              <Link  data-test-id="create-new" to={`${routes.templateAdd.match}`}>
                <Button size="md">Create New</Button>
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-col mt-6">
          {loading && templatesList.length === 0 && <Loading />}
          {!templatesList.length && !loading && <NoDataFound />}
          <TemplateList templatesList={templatesList} refetchTemplates={refetchTemplates} />
          <div className="text-center invisible" ref={loadMoreButton}>
            <button className="btn btn-primary mt-4" onClick={() => loadMore()}>
              Load More
            </button>
          </div>
        </div>
      </ContentFrame>
    </>
  );
}
