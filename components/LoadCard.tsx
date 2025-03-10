import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import LoadboardTextField from './LoadboardTextField';
import { storageManager } from '../utils/storageManager';

interface LoadCardProps {
  workOpportunityId: string;
}

export function LoadCard({ workOpportunityId }: LoadCardProps) {
  const [minPayout, setMinPayout] = useState<string>('');
  const [pricePerDistance, setPricePerDistance] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const drivers = storageManager.getDrivers();

  const handleDriverChange = (event: SelectChangeEvent<string>) => {
    setSelectedDriverId(event.target.value);
  };

  const handlePostTruck = () => {
    // TODO: Implement post truck functionality
    console.log('Posting truck with:', {
      workOpportunityId,
      minPayout,
      pricePerDistance,
      selectedDriverId
    });
  };

  return (
    <Box sx={{ 
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      bgcolor: 'background.paper',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <LoadboardTextField
        label="Min Payout"
        value={minPayout}
        onChange={(e) => setMinPayout(e.target.value)}
        placeholder="Enter min payout"
        fullWidth
      />
      
      <LoadboardTextField
        label="Price Per Distance"
        value={pricePerDistance}
        onChange={(e) => setPricePerDistance(e.target.value)}
        placeholder="Enter price per distance"
        fullWidth
      />

      <FormControl fullWidth variant="filled" size="small">
        <InputLabel shrink id="driver-select-label">Select Driver</InputLabel>
        <Select
          labelId="driver-select-label"
          value={selectedDriverId}
          onChange={handleDriverChange}
          sx={{
            overflow: 'hidden',
            borderRadius: 1,
            fontSize: "0.8rem",
            backgroundColor: "transparent",
            border: '1px solid',
            borderColor: "#6f7880",
            '&:hover': {
              backgroundColor: "transparent",
              borderColor: "primary.main",
            },
            '&.Mui-focused': {
              backgroundColor: "transparent",
              boxShadow: '0px 0px 0px 1px',
              borderColor: "primary.main",
            },
            '&:before, &:after': {
              display: 'none',
            }
          }}
        >
          <MenuItem value="">
            <em>Select a driver</em>
          </MenuItem>
          {drivers.map((driver) => (
            <MenuItem 
              key={driver.latestTransientDriverId} 
              value={driver.latestTransientDriverId}
            >
              {driver.firstName} {driver.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handlePostTruck}
        sx={{ 
          height: 32,
          fontSize: '0.875rem',
          textTransform: 'none'
        }}
        fullWidth
      >
        Post a Truck
      </Button>
    </Box>
  );
}