import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import {
  AccessTime,
  AttachMoney,
  Speed,
  Timer,
  LocationOn,
  Numbers
} from '@mui/icons-material';
import { formatDistance, formatCurrency } from '../utils/domainHelper';

interface ChangesSummaryProps {
  changes: {
    startDateTime?: string;
    endDateTime?: string;
    minPayout?: string;
    minPricePerMile?: string;
    stemTime?: string;
    maxStops?: string;
    originRadius?: string;
    destinationRadius?: string;
  };
  mode: 'modify' | 'clone';
  selectedCount: number;
}

const ChangesSummary: React.FC<ChangesSummaryProps> = ({ changes, mode, selectedCount }) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'startDateTime':
      case 'endDateTime':
        return <AccessTime sx={{ fontSize: 16 }} />;
      case 'minPayout':
      case 'minPricePerMile':
        return <AttachMoney sx={{ fontSize: 16 }} />;
      case 'stemTime':
        return <Timer sx={{ fontSize: 16 }} />;
      case 'maxStops':
        return <Numbers sx={{ fontSize: 16 }} />;
      case 'originRadius':
        return <LocationOn sx={{ fontSize: 16 }} />;
      case 'destinationRadius':
        return <LocationOn sx={{ fontSize: 16 }} />;
      default:
        return <Speed sx={{ fontSize: 16 }} />;
    }
  };

  const formatValue = (key: string, value: string) => {
    switch (key) {
      case 'startDateTime':
      case 'endDateTime':
        return value;
      case 'minPayout':
      case 'minPricePerMile':
        return formatCurrency(value);
      case 'originRadius':
      case 'destinationRadius':
        return formatDistance(value);
      default:
        return value;
    }
  };

  const getLabel = (key: string): string => {
    switch (key) {
      case 'startDateTime':
        return 'Start';
      case 'endDateTime':
        return 'End';
      case 'minPayout':
        return 'Min payout';
      case 'minPricePerMile':
        return 'Price/mile';
      case 'stemTime':
        return 'Stem time';
      case 'maxStops':
        return 'Stops';
      case 'originRadius':
        return 'Origin';
      case 'destinationRadius':
        return 'Destination';
      default:
        return key;
    }
  };

  const hasChanges = Object.values(changes).some(value => value !== undefined && value !== 'none');

  if (!hasChanges) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        mt: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 0.75,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'primary.50'
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'primary.900',
            fontWeight: 500,
            fontSize: '0.75rem'
          }}
        >
          {mode === 'modify' ? 'Changes to apply' : 'Clone details'}
        </Typography>
      </Box>
      
      <Stack 
        direction="row" 
        spacing={0.5} 
        sx={{ 
          flexWrap: 'wrap',
          gap: 0.5,
          p: 1
        }}
      >
        {Object.entries(changes).map(([key, value]) => {
          if (!value || value === 'none') return null;
          
          return (
            <Chip
              key={key}
              icon={getIcon(key)}
              label={
                <Typography variant="caption">
                  {getLabel(key)}: <strong>{formatValue(key, value)}</strong>
                </Typography>
              }
              size="small"
              sx={{
                height: 24,
                '& .MuiChip-icon': {
                  ml: 0.5,
                  mr: -0.5
                }
              }}
            />
          );
        })}
        
        {mode === 'clone' && (
          <Chip
            icon={<Numbers sx={{ fontSize: 16 }} />}
            label={
              <Typography variant="caption">
                Orders: <strong>{selectedCount}</strong>
              </Typography>
            }
            size="small"
            sx={{
              height: 24,
              '& .MuiChip-icon': {
                ml: 0.5,
                mr: -0.5
              }
            }}
          />
        )}
      </Stack>
    </Box>
  );
};

export default ChangesSummary;