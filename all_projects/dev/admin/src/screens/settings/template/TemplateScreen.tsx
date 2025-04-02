/* eslint-disable max-len */
import { useLazyQuery } from '@apollo/client';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { GetEmailTemplate, UserPermissionNames } from 'generatedTypes';
import { getEmailTemplateQuery } from 'lib/query/templates/get-email-template';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SafeHtml from 'components/SafeHtml';
import { routes } from 'routes';
import { FiMessageSquare } from 'react-icons/fi';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { TrackingApi } from 'components/Analytics';
import usePermission from 'lib/use-permission';

export default function EmailTemplateScreen(): JSX.Element {
  const { id } = useParams() as any;
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);
  const emailMessageTemplate = usePermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES);
  const [getTemplate, { data: template }] = useLazyQuery<GetEmailTemplate>(getEmailTemplateQuery);

  useEffect(() => {
    if (id) {
      getTemplate({
        variables: {
          templateId: { id: id },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.templateDetails.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={template?.pretaaGetEmailTemplate?.title as string} />
      <ContentFrame>
        <h2 className="h2">{template?.pretaaGetEmailTemplate?.subject}</h2>
        <div
          className="flex flex-col mt-7 w-full md:w-1/2 mb-20 text-gray-650 
        font-normal text-base">
          <SafeHtml rawHtml={template?.pretaaGetEmailTemplate?.text as string} className="mt-0 email-content" />
        </div>

        {template?.pretaaGetEmailTemplate?.creator.id === user?.id && emailMessageTemplate?.capabilities.EDIT && (
          <Link to={`${routes.templateEdit.build(String(id))}`}>
            <Button text="Edit" style="outline" classes="mt-5 md:w-96">
              <FiMessageSquare className="h-5 w-6 mr-2" />
            </Button>
          </Link>
        )}
      </ContentFrame>
    </>
  );
}
