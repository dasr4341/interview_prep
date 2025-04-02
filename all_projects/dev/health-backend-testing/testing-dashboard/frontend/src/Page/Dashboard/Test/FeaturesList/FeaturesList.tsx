import { Grid, Card, Image, Text, Button, Group, Badge } from '@mantine/core';
import { testDashboardRoutes } from 'Lib/Routes/TestDashboardRoutes';
import { useNavigate } from 'react-router-dom';
import kipuImg from '../../../../Img/kipu.png';
import schedulerImg from '../../../../Img/schedulingImg.png';
import rittenImg from '../../../../Img/ritten.png';

interface IFeatureList {
  title: string;
  link: string;
  isLatest: boolean;
  icon: string;
}

const FeatureCard = (props: IFeatureList) => {
  const navigate = useNavigate();
  return (
    <Grid.Col span={{ base: 12, md: 3, lg: 2 }}>
      <Card
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder>
        <Card.Section>
          <Image
            src={props.icon}
            height={160}
            alt='Norway'
          />
        </Card.Section>
        <Group
          className='flex flex-nowrap'
          justify='space-between'
          mt='md'
          mb='xs'>
          <Text className=' w-34 overflow-ellipsis whitespace-nowrap overflow-hidden' fw={500} >{props.title}</Text>
          { props.isLatest && <Badge color="pink">New</Badge>}
        </Group>
        <Button
          onClick={() => navigate(props.link)}
          color='cyan'
          fullWidth
          mt='md'
          radius='md'>
          Click To View List
        </Button>
      </Card>
    </Grid.Col>
  );
};

export default function PostDetailsPage() {
  const featureList: IFeatureList[] = [
    {
      title: 'Daily report',
      isLatest: false,
      link: testDashboardRoutes.reportTest.fullPath,
      icon: '/features/events.jpg',
    },
    {
      title: 'Scheduler Stats',
      isLatest: false,
      link: testDashboardRoutes.schedulerFrequencyTest.fullPath,
      icon: schedulerImg,
    },
    {
      title: 'Kipu',
      isLatest: false,
      link: testDashboardRoutes.sourceSystem.kipu.fullPath,
      icon: kipuImg,
    },
    {
      title: 'Ritten',
      isLatest: true,
      link: testDashboardRoutes.sourceSystem.ritten.fullPath,
      icon: rittenImg,
    },
  ];
  return (
    <div className='mt-10 px-10'>
      <Grid>
        {featureList.map((feature) => (
          <FeatureCard {...feature} />
        ))}
      </Grid>
    </div>
  );
}
