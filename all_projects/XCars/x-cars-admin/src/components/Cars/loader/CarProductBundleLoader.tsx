import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function CarProductBundleLoader() {
  return (
    <div>
      <div className="font-semibold text-3xl text-teal-900 mb-10 ">
        Car Products Bundles
      </div>

      <Card sx={{ maxWidth: 345, margin: '1rem' }}>
        <CardActionArea>
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: '8px', m: 2 }}
            height={160}
          />
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="20%" height={30} />
            </Box>

            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />

            <Box display="flex" gap={1} flexWrap="wrap">
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={60}
                  height={20}
                />
              ))}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
