import React, { useEffect, useState } from 'react';
import LoginHeader from 'components/LoginHeader';
import CustomInputField from 'components/Input/CustomInputField';
import { useForm, useFieldArray } from 'react-hook-form';
import { BsPlusCircle, BsDashCircle } from 'react-icons/bs';
import Button from 'components/ui/button/Button';
import _ from 'lodash';
import { ErrorMessage, ErrorMessageSmall, SuccessMessage } from 'components/ui/error/ErrorMessage';
import { getRedirectUrl, resetState } from 'lib/api/users';
import './_fitbit-invitation-screen.scoped.scss';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { useNavigate } from 'react-router-dom';
import { appSliceActions } from 'lib/store/slice/app/app.slice';

type FormValues = {
  guardians: {
    email: string;
    isPrimary: boolean;
  }[];
};

export default function FitbitInvitation() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [currentState, setCurrentState] = useState<{ loading: boolean; data?: null; error: null | string; successMessage?: null | string }>({
    loading: false,
    data: null,
    error: null,
    successMessage: null,
  });

  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
    defaultValues: {
      guardians: [{ email: '', isPrimary: true }],
    },
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    name: 'guardians',
    control,
  });

  const [isPrimaryMailSelected, setIsPrimaryMailSelected] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let rows = _.cloneDeep(getValues('guardians'));
    rows = rows.map((r) => {
      return {
        ...r,
        isPrimary: false,
      };
    });
    rows[index].isPrimary = event.target.value === 'false';
    setValue('guardians', rows);
    setIsPrimaryMailSelected(false);
  };

  const onSubmit = async (data: FormValues) => {
    setCurrentState({ loading: true, data: null, error: null });
    console.log({ data });
    const primarySelected = data.guardians.some((r) => r.isPrimary);
    setIsPrimaryMailSelected(primarySelected);
  };

  function logOut() {
    resetState();
    setIsLoggedOut(true);
  }

  useEffect(() => {
    if (currentUser) {
      const url = getRedirectUrl(currentUser);
      dispatch(appSliceActions.setAppEvents(null));
      navigate(url);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <LoginHeader />
      <section className="pt-10 pb-6 xl:pt-28 xl:pb-14  px-5">
        <h3 className="text-md xl:text-lg text-gray-150 mb-6 mt-6 xxl:mt-12 xxl:mb-20 text-center header-text pb-2">Welcome to Pretaa!</h3>

        <div className='hidden'>
          <p className="text-base text-gray-150 mb-5 text-center sub-text pb-10">
            You can go ahead and invite friend and family who can have access your Pretaa account
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <section className={`section-${index}`} key={field.id}>
                    <div className="flex flex-row justify-between items-center">
                      <div className="w-3/4 p-2">
                        <CustomInputField
                          label="Email"
                          placeholder='Enter Email'
                          type="email"
                          autoFocus={false}
                          error={Boolean(errors.guardians?.[index]?.email)}
                          register={register(`guardians.${index}.email`, {
                            required: true,
                          })}
                        />
                      </div>
                      <div className="p-2 w-1/3 radio-field-area">
                        {field.isPrimary && <div className="primary-email-box">Primary Email</div>}
                        <input
                          className="primary-mail-selector"
                          type="radio"
                          key={field.id}
                          checked={field.isPrimary}
                          value={String(field.isPrimary)}
                          onChange={(e) => handleChange(e, index)}
                        />
                      </div>
                      <div className="p-2 grow-0 w-14">
                        <div className="flex flex-row">
                        { !(index === 0 &&  (fields.length - 1) === 0)   &&
                          <button
                          type="button"
                          onClick={() => remove(index)}
                            className="text-white bg-pt-red-800 hover:bg-pt-red-900 
                            focus:ring-4 focus:outline-none focus:bg-pt-red-800 font-medium text-md 
                            rounded-full p-1 text-center inline-flex items-center mr-2">
                          <BsDashCircle />
                        </button>
                        }

                          {index === fields.length - 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                append({
                                  email: '',
                                  isPrimary: false,
                                })
                              }
                              className="text-black bg-yellow-500 hover:bg-yellow-800 
                            focus:ring-4 focus:outline-none focus:bg-yellow-500 font-medium text-md 
                            rounded-full p-1 text-center inline-flex items-center mr-2">
                              <BsPlusCircle />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {errors.guardians?.[index]?.email && <ErrorMessageSmall message={'Email is a Required Field'} className="mt-1" />}
                  </section>
                </div>
              );
            })}

            <div className="text-center mt-5 border-t border-slate-900 pt-5 ">
              {!isPrimaryMailSelected && isSubmitted && <ErrorMessageSmall className="pb-5" message={'Please select at least a primary email'} />}
              <div className="flex justify-center mt-3">
                <Button type="submit">Send</Button>
              </div>
            </div>

            {currentState.error && <ErrorMessage message={currentState.error} />}
            {currentState.successMessage && <SuccessMessage message={currentState.successMessage} />}
          </form>
        </div>

          <div className='md:flex justify-center mt-8'>
              {!isLoggedOut && (
                  <Button type="button" classes="whitespace-nowrap w-full md:w-auto" buttonStyle='outline' onClick={logOut}>Logout from pretaa</Button>
              )}
              <a className='ml-4 w-full  md:w-auto' href="https://www.fitbit.com/logout/transferpage">
                <Button type="button" classes="whitespace-nowrap w-full  md:w-auto" buttonStyle='outline'>Logout from fitbit</Button>
              </a>
          </div>

        {isLoggedOut && (
          <div className='flex justify-center mt-2'>
            Successfully logged out from pretaa
          </div>
        )}
      </section>
    </div>
  );
}
