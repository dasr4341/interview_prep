import { AiOutlineFilePdf } from 'react-icons/ai';
import { IoVideocamOutline } from 'react-icons/io5';
import Image from 'next/image';
import { config } from '@/config/config';

export default function PreviewSelectedDocument({
  file,
}: {
  file: {
    fileURL: string;
    fileType: string;
  };
}) {
  if (file?.fileType?.includes(config.documents.acceptedTypes.pdf)) {
    return <AiOutlineFilePdf size={50} color="red" />;
  }
  if (file?.fileType?.includes(config.documents.acceptedTypes.mp4)) {
    return <IoVideocamOutline size={50} color="blue" />;
  } else {
    return (
      <Image
        src={file.fileURL}
        width={100}
        height={100}
        objectFit="cover"
        className=" aspect-square object-cover rounded-lg mx-auto"
        priority
        alt="Uploaded preview"
        onError={() => <div>Image here</div>}
      />
    );
  }
}
