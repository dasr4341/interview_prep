import dynamic from 'next/dynamic';
const QRCode = dynamic(() => import('@/components/qrCode/QRCode'), {
  ssr: false,
});
const Page = () => {
  return <QRCode />;
};

export default Page;
