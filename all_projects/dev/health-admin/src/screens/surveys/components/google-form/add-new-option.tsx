import Button from 'components/ui/button/Button';
import React from 'react';

export default function AddNewOption({
  onAdd
}: {
  onAdd: () => void
}) {
  return (
    <div className='mt-3'>
      <Button type="button" align='left' onClick={() => onAdd()}>
        + Add option
      </Button>
    </div>
  );
}
