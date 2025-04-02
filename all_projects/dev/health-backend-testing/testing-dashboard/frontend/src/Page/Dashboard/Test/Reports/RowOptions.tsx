import { Popover, Button } from '@mantine/core';
import { SlOptionsVertical } from 'react-icons/sl';
import { useClickOutside, useDisclosure } from '@mantine/hooks';

export default function RowOptions({ data, paramsTest }: { data: any, paramsTest: any }) {
  const [opened, { close, open }] = useDisclosure(false);
  const ref = useClickOutside(() => close());

  function log() {
    paramsTest(data);
    close();
  }

  return (
    <div ref={ref}>
      <Popover
      opened={opened}
      width={200}
      position='bottom'
      withArrow
      shadow='md'>
      <Popover.Target>
        <Button onClick={open}>
          <SlOptionsVertical />
        </Button>
      </Popover.Target>
      <Popover.Dropdown className='p-0 text-left'>
      <Button  fullWidth variant="default"  onClick={() => log()}>
         Get Logs
      </Button>
      <Button  fullWidth variant="default" onClick={() => log()}>
         View Events
      </Button>
      </Popover.Dropdown>
    </Popover>
    </div>
  );
}
