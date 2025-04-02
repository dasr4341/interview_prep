import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import TemplateFormControl from './components/TemplateFormControl';
import { useParams } from 'react-router-dom';

export default function MobileTemplateFormScreen() {
  const { id } = useParams();

  return (
    <div className='flex flex-col flex-1'>
      <ContentHeader title={id ? 'Update Assessment Template' : 'New Assessment Template'}>
      </ContentHeader>
      <ContentFrame className='flex flex-col flex-1'>
        <TemplateFormControl templateId={id} />
      </ContentFrame>
    </div>
  );
}
