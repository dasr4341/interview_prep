'use client';
import React from 'react';
import ReactPlayer from 'react-player';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import Button from '@/components/buttons/Button';
import { RiCloseFill } from 'react-icons/ri';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%' },
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
};

const VideoPlayer = ({
  modalState,
  setModalState,
}: {
  modalState: string | null;
  // eslint-disable-next-line no-unused-vars
  setModalState: (val: string | null) => void;
}) => {
  const videoUrl = modalState?.substring(modalState?.lastIndexOf('https'));
  return (
    <>
      {modalState && (
        <Modal
          open={true}
          onClose={() => setModalState(null)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Button onClick={() => setModalState(null)}>
              <div className="bg-gray-200 p-2 rounded-md absolute top-2 right-2 z-20">
                <RiCloseFill size={'20px'} className="text-gray-700" />
              </div>
            </Button>
            <div className="player-wrapper h-full w-full">
              <ReactPlayer
                playing
                className={`react-player`}
                loop
                config={{
                  vimeo: {
                    playerOptions: {
                      autoplay: true,
                      controls: true,
                      fullscreen: true,
                      keyboard: true,
                      dnt: true,
                      byline: false,
                      title: false,
                      portrait: false,
                      progress: true,
                    },
                  },
                }}
                url={videoUrl}
                width="100%"
                height="100%"
              />
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default VideoPlayer;
