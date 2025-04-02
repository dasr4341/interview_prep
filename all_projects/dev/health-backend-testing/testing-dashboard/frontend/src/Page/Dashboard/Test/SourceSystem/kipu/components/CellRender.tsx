import { ActionIcon, CopyButton, Tooltip, rem } from '@mantine/core';
import { ICellRendererParams } from 'ag-grid-community';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { DataSourceEnum } from 'config';
import './scss/cellRender.scoped.scss';

interface CellRenderInterface extends ICellRendererParams {
  colName?: string;
  showData?: boolean;
  customData?: any;
}

function getColor(isPatientPresent: boolean | 'null', dataMatched: boolean) {
  if (isPatientPresent === 'null') {
    return {
      color: '',
      label: '',
    };
  }
  if (!isPatientPresent) {
    return {
      color: ' bg-yellow-300',
      label: 'Patient not found',
    };
  }
  if (dataMatched) {
    return {
      color: ' bg-green-600',
      label: 'Matched',
    };
  }
  return {
    color: 'bg-red-600',
    label: 'Not Matched',
  };
}

function getValue(props: CellRenderInterface) {
  if (props.value && props.value.hasOwnProperty('data')) {
    return props.value?.data;
  }
  return props.value ?? '';
}

export default function CellRender(props: CellRenderInterface) {
  let isPresent: boolean | 'null' =
    props?.value && props?.value?.hasOwnProperty('isPatientPresent')
      ? props.value?.isPatientPresent
      : 'null';
  let matched = props.value?.matched || false;

  if (
    props?.colName &&
    props?.data?.errors &&
    props?.data?.errors[props.colName]
  ) {
    const data = props?.data?.errors[props.colName];
    isPresent =
      data && data?.hasOwnProperty('isPatientPresent')
        ? data?.isPatientPresent
        : 'null';
    matched = data?.matched;
  } else if (
    props?.data?.errors &&
    props.colName &&
    props.colName?.toLowerCase() === 'source' &&
    props.value === DataSourceEnum.KIPU
  ) {
    isPresent = props.data.errors?.isPatientPresent;
    matched = !props.data.errors?.isErrorExist;
  }

  const { color, label } = getColor(isPresent, matched);

  const value = getValue(props);

  return (
    <div className=' flex w-36 justify-between cell items-center cursor-pointer'>
      <div className='flex justify-start space-x-3 items-center'>
      <Tooltip label={label}>
        <div className={` w-3 h-3 ${color}  rounded-full`}></div>
        </Tooltip>
        <div className='value-container'> {value} </div>
      </div>
      
        {!!value.length && (
          <div className=' copy-btn justify-center'>
            <CopyButton
              value={value}
              timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? 'Copied' : 'Copy'}
                  withArrow
                  position='right'>
                  <ActionIcon
                    color={copied ? 'teal' : 'gray'}
                    variant='subtle'
                    onClick={copy}>
                    {copied ? (
                      <IconCheck style={{ width: rem(16) }} />
                    ) : (
                      <IconCopy style={{ width: rem(16) }} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>
        )}
      </div>
  );
}
