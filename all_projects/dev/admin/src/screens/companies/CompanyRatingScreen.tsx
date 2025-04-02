/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import HappyFaceIcon from '../../assets/images/happy_face.svg';
import UnHappyFaceIcon from '../../assets/images/unhappy_face.svg';
import NeutralFaceIcon from '../../assets/images/neutral_face.svg';
import companyRatingTypeQuery from 'lib/query/company/company-rating-type';
import { CompanyRatingTypeQuery, GetCompanyRating, SortOrder } from 'generatedTypes';
import { useLazyQuery, useQuery } from '@apollo/client';
import DateFormat from 'components/DateFormat';
import Button from 'components/ui/button/Button';
import { useEffect, useState } from 'react';
import companyApi from 'lib/api/company';
import { toast } from 'react-toastify';
import { GetCompanyRatingQuery } from 'lib/query/company/company-rating';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import 'scss/modules/_company-rating.scss';
import queryString from 'query-string';
import catchError from 'lib/catch-error';
import { errorList, successList } from '../../lib/message.json';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export function Loading() {
  return (
    <>
      <div className="ph-item">
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-6 empty"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CompanyRatingScreen(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = queryString.parse(location.search);
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);

  const { error, data: ratingType, loading } = useQuery<CompanyRatingTypeQuery>(companyRatingTypeQuery);

  const [getRating, { data: companyRating }] = useLazyQuery<GetCompanyRating>(GetCompanyRatingQuery, {
    variables: {
      companyId,
      orderBy: [
        {
          id: SortOrder.desc,
        },
      ],
      where: {
        userId: {
          equals: user?.id,
        },
      },
    },
  });
  const [ratingAdded, setRatingAdded] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [ratingSubmit, setRatingSubmit] = useState(false);

  useEffect(() => {
    if (companyId) {
      getRating();
    }
  }, [companyId]);

  const getFaceIcon = (activatedFaceStatus: string) => {
    switch (activatedFaceStatus) {
      case 'HAPPY':
        return HappyFaceIcon;
      case 'UNHAPPY':
        return UnHappyFaceIcon;
      case 'NEUTRAL':
        return NeutralFaceIcon;
      default:
        return '';
    }
  };

  const onFeedbackClick = async (face: number) => {
    setRatingAdded(face);
    setRatingError('');
  };

  const onSubmit = async () => {
    try {
      if (ratingComment?.length < 25) {
        setCommentError(errorList.ratingComment);
      } else {
        setCommentError('');
      }

      if (ratingAdded === 0) {
        setRatingError(errorList.rating);
      } else {
        setRatingError('');
      }

      if (ratingAdded > 0 && ratingComment?.length >= 25) {
        setRatingSubmit(true);
        const comment = ratingComment.trim() ? ratingComment.trim() : undefined;
        await companyApi().addCompanyRating(ratingAdded, String(companyId), comment);
        toast.success(successList.ratingAdd);
        navigate(-1);
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyRatings.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="New Rating" />
      <ContentFrame className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          {error && <ErrorMessage message={error.message} />}
          <div className="text-left mb-3">
            <h3 className="ml-2 text-md font-bold">How does the company feel about us?</h3>
          </div>
          {loading && <Loading />}
          {ratingType && (
            <div className="grid lg:grid-cols-2 gap-4 sm:grid-cols-1">
              <div className={'flex flex-col md:h-46	w-full'}>
                <div className="flex flex-row justify-between mt-4">
                  {ratingType?.pretaaGetRatingTypes?.map((type, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex flex-col md:h-53	shadow-inner
                      bg-white border border-gray-100 
                      rounded-xxl px-5 py-8 w-full mr-12
                      ${ratingAdded === type?.id ? 'active-card' : 'inactive-card'}`}>
                        <button data-rating={type?.status} className="flex flex-col items-center gap-2" onClick={() => onFeedbackClick(type?.id)} key={type?.id}>
                          <img src={getFaceIcon(type?.status)} alt="unhappy" className="w-12 h-12" />
                          {type?.status === 'HAPPY' && (
                            <span
                              className="text-green font-bold
                          uppercase text-base">
                              {type?.status}
                            </span>
                          )}
                          {type?.status === 'UNHAPPY' && (
                            <span
                              className="text-pt-red-800
                          font-bold uppercase text-base">
                              {type?.status}
                            </span>
                          )}
                          {type?.status === 'NEUTRAL' && (
                            <span
                              className="text-pt-red-900 font-bold
                              uppercase text-base">
                              {type?.status}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 mb-6 mt-1">{ratingError && <ErrorMessage message={ratingError} testId="server-side-login-error" />}</div>
          <div className="grid lg:grid-cols-2 gap-4 sm:grid-cols-1">
            <textarea
              className="border border-gray-300 rounded-lg px-4 py-5 h-44"
              placeholder="Add Comment"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              minLength={25}
            />
          </div>
          <div className="mb-1 mt-1 text-gray-150">
            {ratingComment?.length > 0 &&
              `You have entered 
          ${ratingComment?.length} character`}
          </div>
          <div className="grid lg:grid-cols-2 sm:grid-cols-1">
            {commentError && ratingComment?.length < 25 && <ErrorMessage message={commentError} testId="server-side-login-error" />}
          </div>
          <div className="grid lg:grid-cols-2 gap-4 sm:grid-cols-1">
            <div className="text-left mb-3 mt-4">
              {companyRating?.pretaaGetCompanyRating?.user?.firstName && companyRating?.pretaaGetCompanyRating?.user?.lastName && (
                <div>
                  <span className="text-gray-600 text-xs font-medium italic">
                    Last rating as of <DateFormat date={companyRating.pretaaGetCompanyRating?.createdAt} /> by {companyRating.pretaaGetCompanyRating?.user?.firstName}{' '}
                    {companyRating.pretaaGetCompanyRating?.user?.lastName}, {companyRating.pretaaGetCompanyRating?.user?.department}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:bottom-9 flex pt-4">
          <Button style="primary" size="lg" onClick={onSubmit} loading={ratingSubmit} disabled={ratingSubmit}>
            Submit
          </Button>
          <Button
            style="bg-none"
            classes="ml-8"
            size="lg"
            onClick={() => {
              navigate(-1);
            }}>
            Cancel
          </Button>
        </div>
      </ContentFrame>
    </>
  );
}
