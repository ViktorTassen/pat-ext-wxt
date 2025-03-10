import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import LoadboardTextField from './LoadboardTextField';
import LoadboardSelect from './LoadboardSelect';
import { useLoadboard } from '../utils/LoadboardContext';
import type { Driver } from '../utils/types';

interface LoadCardProps {
  workOpportunityId: string;
}

const STEM_TIME_OPTIONS = ["5", "15", "30", "45", "60", "90", "120", "150", "180", "210", "240", "480", "720", "1440"].map(value => ({
  value,
  label: formatStemTime(value)
}));

function formatStemTime(minutes: string): string {
  const mins = parseInt(minutes, 10);
  if (mins < 60) {
    return `${mins} min`;
  } else {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${remainingMins} min`;
    }
  }
}

export const LoadCard: React.FC<LoadCardProps> = ({ workOpportunityId }) => {
  const { opportunities, drivers, isLoading } = useLoadboard();
  const [minPayout, setMinPayout] = useState<string>('');
  const [minPricePerMile, setMinPricePerMile] = useState<string>('');
  const [stemTime, setStemTime] = useState<string>('none');
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);

  const workOpportunity = opportunities.find(opp => opp.id === workOpportunityId);

  const handleDriverChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setSelectedDriverIds(selectedValues.slice(0, 2));
  };

  const handlePostTruck = () => {
    // TODO: Implement post truck functionality
    console.log('Posting truck with:', {
      workOpportunityId,
      minPayout,
      minPricePerMile,
      stemTime,
      selectedDriverIds
    });
  };

  if (isLoading || !workOpportunity) {
    return null;
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <LoadboardTextField
        label="Min Payout"
        value={minPayout}
        onChange={(e) => setMinPayout(e.target.value)}
        placeholder="Enter min payout"
        fullWidth
      />
      
      <LoadboardTextField
        label="Min Price/mile"
        value={minPricePerMile}
        onChange={(e) => setMinPricePerMile(e.target.value)}
        placeholder="Enter min price per mile"
        fullWidth
      />
      
      <LoadboardSelect
        id="stem-time-select"
        label="Stem Time"
        value={stemTime}
        onChange={(e) => setStemTime(e.target.value)}
        options={[
          { value: "none", label: "Select stem time" },
          ...STEM_TIME_OPTIONS
        ]}
      />

      <FormControl fullWidth variant="filled">
        <InputLabel shrink id="driver-select-label">Select Drivers (max 2)</InputLabel>
        <Select
          labelId="driver-select-label"
          multiple
          value={selectedDriverIds}
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
          {drivers.map((driver) => (
            <MenuItem 
              key={driver.latestTransientDriverId} 
              value={driver.latestTransientDriverId}
              disabled={selectedDriverIds.length >= 2 && !selectedDriverIds.includes(driver.latestTransientDriverId)}
            >
              {driver.firstName} {driver.lastName} ({driver.emailId})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handlePostTruck}
        sx={{ mt: 1, height: 32, fontSize: '0.875rem' }}
        fullWidth
      >
        Post a Truck
      </Button>
    </Box>
  );
};