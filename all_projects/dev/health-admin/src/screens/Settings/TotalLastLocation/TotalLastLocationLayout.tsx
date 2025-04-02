import { ContentHeader } from 'components/ContentHeader';
import './_total-last-location.scoped.scss';
export default function TotalLastLocation() {
  return (
    <div>
      <ContentHeader disableGoBack={true} className="lg:sticky">
        <div className="block sm:flex sm:justify-between heading-area mt-3">
          <div className="header-left">
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5">{'Total Last Known Location '}</h1>
          </div>
        </div>
      </ContentHeader>
    </div>
  );
}