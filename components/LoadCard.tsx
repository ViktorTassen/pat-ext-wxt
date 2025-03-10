import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  SelectChangeEvent,
  IconButton,
  Popover,
  Typography
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import LoadboardTextField from './LoadboardTextField';
import { storageManager } from '../utils/storageManager';
import type { Driver } from '../utils/types';

interface LoadCardProps {
  workOpportunityId: string;
}

export function LoadCard({ workOpportunityId }: LoadCardProps) {
  const [workOpportunity, setWorkOpportunity] = useState<any>(null);
  const [minPayout, setMinPayout] = useState<string>('');
  const [pricePerDistance, setPricePerDistance] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Initialize storageManager if not already initialized
    storageManager.init().then(() => {
      // Get work opportunity data
      const opportunities = storageManager.getOpportunities();
      const opportunity = opportunities.find(opp => opp.id === workOpportunityId);
      if (opportunity) {
        setWorkOpportunity(opportunity);
        // Prefill the fields
        setMinPayout(opportunity.totalCost?.value?.toString() || '');
        setPricePerDistance(opportunity.costPerDistance?.value?.toString() || '');
      }
      
      // Get drivers
      const availableDrivers = storageManager.getDrivers();
      setDrivers(availableDrivers);
    });
  }, [workOpportunityId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDriverChange = (event: SelectChangeEvent<string>) => {
    setSelectedDriverId(event.target.value);
  };

  const handlePostTruck = () => {
    if (!workOpportunity) return;
    
    // TODO: Implement post truck functionality
    console.log('Posting truck with:', {
      workOpportunityId,
      minPayout,
      pricePerDistance,
      selectedDriverId,
      workOpportunity
    });
    handleClose();
  };

  return (
    <>
      <IconButton 
        onClick={handleClick}
        size="small"
        sx={{
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.50'
          }
        }}
      >
        <LocalShipping />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: 1
          }
        }}
      >
        <Box sx={{ 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: 300
        }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Post a Truck
          </Typography>

          <LoadboardTextField
            label="Min Payout"
            value={minPayout}
            onChange={(e) => setMinPayout(e.target.value)}
            placeholder={workOpportunity?.totalCost?.value?.toString() || "Enter min payout"}
            size="small"
            fullWidth
          />
          
          <LoadboardTextField
            label="Price Per Distance"
            value={pricePerDistance}
            onChange={(e) => setPricePerDistance(e.target.value)}
            placeholder={workOpportunity?.costPerDistance?.value?.toString() || "Enter price per distance"}
            size="small"
            fullWidth
          />

          <FormControl variant="filled" size="small">
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
            disabled={!workOpportunity || !selectedDriverId}
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
      </Popover>
    </>
  );
}