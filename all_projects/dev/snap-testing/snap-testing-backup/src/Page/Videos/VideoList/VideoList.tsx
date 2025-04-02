import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import 'Styles/Dialog.scss';
import routes from 'Lib/Routes/Routes';
import { Link } from 'react-router-dom';
import VideoModalComponent from 'Components/VideoModal/VideoModal';

export default function VideoList() {
  const [openModal, setOpenModal] = useState(false);
  const [openVideoModal, setVideoModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenVideoModal = () => {
    setVideoModal(true);
    setOpenModal(false);
  };

  const handleCloseVideoModal = () => {
    setVideoModal(false);
  };

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: '700',
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function createTableData(id: number, videoTitle: string, uploadedAt: string) {
    return { id, videoTitle, uploadedAt };
  }

  const tableRows = [createTableData(1, 'Lorem, ipsum, dolor', '11 Aug 2022')];

  return (
    <div className='p-6'>
      <Link to={routes.compilationList.path}>
        <Button variant='outlined' startIcon={<KeyboardBackspaceIcon />}>
          Back
        </Button>
      </Link>
      <Typography variant='h4' paddingBottom={4} paddingTop={4} fontWeight='700'>
        Videos of Frozen yoghurt
      </Typography>
      <div>
        <Button variant='contained' onClick={handleOpenModal}>
          Add video
        </Button>
        <VideoModalComponent
          open={openModal}
          onClose={handleCloseModal}
          onClick={handleCloseModal}
          onClickModal={handleOpenVideoModal}
        />
        <VideoModalComponent
          open={openVideoModal}
          onClose={handleCloseVideoModal}
          onClick={handleCloseVideoModal}
          onClickModal={handleOpenVideoModal}
        />
      </div>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table sx={{ minWidth: 100 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell className='w-1/6 bg-gray-200' sx={{ paddingLeft: 8 }}>
                ID
              </StyledTableCell>
              <StyledTableCell className=' bg-gray-200'>Video Title</StyledTableCell>
              <StyledTableCell className=' bg-gray-200'>Uploaded At</StyledTableCell>
              {/* <StyledTableCell className=' bg-gray-200' align='center'>
                ...
              </StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell sx={{ paddingLeft: 8 }}>{row.id}</StyledTableCell>
                <StyledTableCell>{row.videoTitle}</StyledTableCell>

                <StyledTableCell>{row.uploadedAt}</StyledTableCell>
                {/*<StyledTableCell align='center'>
                  ...
                   <Popover>
                    <PopOverItem>Edit</PopOverItem>

                    <PopOverItem>Remove</PopOverItem>
                  </Popover> 
                </StyledTableCell>
                */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
