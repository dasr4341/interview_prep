/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CreateCompanyListMutation } from 'lib/mutation/company-management/create-company-list';
import { UpdateCompanyListMutation } from 'lib/mutation/company-management/update-company-detail';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { CreateCompanyListVariables, GetCompanyList, GetCompanyListVariables, UpdateCompanyListVariables } from 'generatedTypes';
import { getCompanyListDetailsQuery } from 'lib/query/company-management/get-company-list-detail';
import { userManagementActions } from 'lib/store/slice/user-management';
import SpaceOnly from 'lib/form-validation/space-only';
import queryString from 'query-string';
import { errorList, successList } from '../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';

interface FormInput {
  listName: string;
}

export default function CompanyGroupForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const query = queryString.parse(location.search);
  const selectedCompanies = useSelector((state: RootState) => state.companyManagement.selectedCompanies);
  const companyListCount = useSelector((state: RootState) => state.companyManagement.companyListCount);
  const deletedCompanies = useSelector((state: RootState) => state.companyManagement.deletedCompanies);

  // Hooks for getting one existing company list details
  const [getCompanyList, { data: companyListData }] = useLazyQuery<GetCompanyList, GetCompanyListVariables>(getCompanyListDetailsQuery, {
    variables: {
      listId: String(id),
      // This is required when groups modify
      take: 100000,
    },
  });
  const companyListDetails = companyListData?.pretaaGetList;

  // Hooks for creating new company list
  const [createList, { loading: createListLoading }] = useMutation(CreateCompanyListMutation);
  // Hooks for updating a existing company list
  const [updateList, { loading: updateListLoading }] = useMutation(UpdateCompanyListMutation);

  const companyFormSchema = yup.object().shape({
    listName: yup.string().max(30, errorList.companyListNameCharacter).transform(SpaceOnly).typeError(errorList.companyListName).required(),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(companyFormSchema),
  });

  useEffect(() => {
    if (companyListDetails?.id) {
      setValue('listName', companyListDetails?.name);
    }
  }, [companyListDetails]);

  useEffect(() => {
    if (query?.name) {
      setValue('listName', query?.name as string);
    }
  }, [query]);

  // Sending creating and updating request
  async function onSubmit(formValue: FormInput) {
    try {
      if (!id) {
        const createVariables: CreateCompanyListVariables = {
          name: formValue?.listName,
          listCompanies: {
            createMany: {
              data: selectedCompanies.map((i) => {
                return {
                  companyId: i,
                };
              }),
            },
          },
        };
        const { data } = await createList({
          variables: createVariables,
        });
        dispatch(userManagementActions.resetUserGroup());
        if (data) {
          navigate(routes.companyGroupList.match);
          toast.success(successList.listCreated);
        }
      } else {
        const updateVariables: UpdateCompanyListVariables = {
          listId: String(id),
          updatedName: formValue?.listName,
          updatedListCompanies: {
            createMany: {
              data: selectedCompanies.map((i) => {
                return {
                  companyId: i,
                };
              }),
            },
            deleteMany: deletedCompanies.map((d) => {
              return {
                companyId: {
                  in: [d],
                },
              };
            }),
          },
        };

        const { data } = await updateList({
          variables: updateVariables,
        });
        dispatch(userManagementActions.resetUserGroup());
        if (data) {
          navigate(routes.companyGroupList.match);
          toast.success(successList.listUpdate);
        }
      }
    } catch (e) {
      catchError(e, true);
    }
  }

  function manageCompanies() {
    if (id) {
      navigate(
        routes.selectedCompanyList.build({
          companyId: id,
          selectedCompany: true
        })
      );
    } else {
      navigate(routes.companyList.build({
        companyId: id
      }));
    }
  }

  useEffect(() => {
    if (id) {
      getCompanyList();
    }
  }, [id]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyGroupCreate.name,
    });
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <ContentHeader className="md:relative" title={id ? 'Edit List' : 'New Company List'}>
        <Button
          classes="md:absolute md:right-4 xl:right-10
          2xl:right-16 md:bottom-10"
          text={`Manage Companies (${companyListCount || companyListDetails?.listCompanies.length})`}
          type="button"
          onClick={manageCompanies}
        />
      </ContentHeader>

      <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
        <ContentFrame type="with-footer" classes={['pb-0 flex-1']}>
          <div className="px-5 py-5 lg:py-8 lg:px-16 space-y-3">
            <div>
              <h2 className="h2">Company list name</h2>
              <div className="max-w-sm space-y-1">
                <input type="text" className="input w-full" {...register('listName')} />

                <ErrorMessage message={errors?.listName?.message ? errors?.listName?.message : ''} />
              </div>
            </div>
          </div>
        </ContentFrame>

        <ContentFooter>
          <Button classes="mx-auto md:mx-0 lg:mx-0" loading={createListLoading || updateListLoading} disabled={createListLoading || updateListLoading}>
            Save
          </Button>
          <Button
            type="button"
            style="bg-none"
            classes="mx-auto md:mx-0 lg:mx-0"
            onClick={() => {
              navigate(-1);
            }}>
            Cancel
          </Button>
        </ContentFooter>
      </form>
    </div>
  );
}
