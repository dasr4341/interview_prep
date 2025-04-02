import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

import { captionsActions } from 'Lib/Store/Captions/CaptionsSlice';
import { useAppDispatch, useAppSelector } from 'Lib/Store/hooks';
import MessageComponent from 'Components/MessageComponent/MessageComponent';
import { CaptionsInterface } from 'Interface/Captions';

export default function CreatableSelectComponent({ control }: { control: any }) {
  const dispatch = useAppDispatch();
  const captions = useAppSelector((state) => state.captions.captions);

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: 'captions',
    control,
  });

  const captionTransformer = (item: CaptionsInterface) => ({
    label: item.caption_text,
    value: item.caption_text,
    key: item.id,
  });
  const captionList: { label: string; value: string }[] = captions.map(captionTransformer);

  const setSelected = (selectedCaptions: typeof captionList) => {
    console.log(selectedCaptions);
    onChange(selectedCaptions.map(({ value: valuer }) => valuer));
  };

  useEffect(() => {
    dispatch(captionsActions.getCaptions());
  }, [dispatch]);

  const formatCreate = (inputValue: string) => {
    return <p> new caption "{inputValue}"</p>;
  };

  return (
    <>
      <CreatableSelect
        isMulti
        className='w-full overflow-visible'
        placeholder='Add captions'
        options={captionList}
        formatCreateLabel={formatCreate}
        value={value?.map((v: string) => ({ label: v, value: v }))}
        isValidNewOption={(val) => val.length <= 55 && val.length > 0}
        onChange={(selectedSkills) => setSelected(selectedSkills as typeof captionList)}
      />
      <div className='pt-2'>
        <MessageComponent children={error?.message} />
      </div>
    </>
  );
}
