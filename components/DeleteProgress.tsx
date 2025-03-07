import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface DeleteProgressProps {
  current: number;
  total: number;
}

export const DeleteProgress: React.FC<DeleteProgressProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Deleting orders: {current} of {total}
      </Typography>
    </Box>
  );
}