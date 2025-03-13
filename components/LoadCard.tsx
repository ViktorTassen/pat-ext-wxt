import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Popover, 
  TextField, 
  Button, 
  Box, 
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import { WorkOpportunity, Driver } from '../utils/types';
import LoadboardSelect from './LoadboardSelect';

// Constants from OrderManagement component
const STEM_TIME_OPTIONS = ["5", "15", "30", "45", "60", "90", "120", "150", "180", "210", "240", "480", "720", "1440"];
const RADIUS_OPTIONS = ["5", "10", "15", "20", "25", "50", "75", "100"];

const formatStemTime = (minutes: string): string => {
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
};

interface LoadCardProps {
  workOpportunityId: string;
  workOpportunity: WorkOpportunity;
}

export function LoadCard({ workOpportunityId, workOpportunity }: LoadCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [minPayout, setMinPayout] = useState(Math.floor(workOpportunity.payout.value).toString());
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [stemTime, setStemTime] = useState<string>("60"); // Default to 60 minutes
  const [originRadius, setOriginRadius] = useState<string>("25"); // Default to 25 miles/km
  const [destinationRadius, setDestinationRadius] = useState<string>("25"); // Default to 25 miles/km
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate current price per distance
  const totalDistance = workOpportunity.totalDistance?.value || 0;
  const initialPayout = workOpportunity.payout.value;
  
  const calculateRateFromPayout = (payout: number): string => {
    if (totalDistance <= 0) return "0.00";
    return (payout / totalDistance).toFixed(2);
  };
  
  const calculatePayoutFromRate = (rate: number): string => {
    return Math.floor(rate * totalDistance).toString();
  };
  
  // Format to 2 decimal places
  const formattedCurrentPricePerDistance = calculateRateFromPayout(initialPayout);
  
  // Use the current rate as the default value
  const [minPricePerDistance, setMinPricePerDistance] = useState(formattedCurrentPricePerDistance);
  
  // Track whether the update is coming from user input or programmatically
  const [isUpdatingProgrammatically, setIsUpdatingProgrammatically] = useState(false);

  // Load drivers from storage
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const drivers = await storage.getItem('local:drivers') as Driver[];
        if (drivers) {
          const activeDrivers = drivers.filter(driver => driver.status === 'active');
          setAllDrivers(activeDrivers);
        }
      } catch (error) {
        console.error("Error loading drivers from storage:", error);
      }
    };

    loadDrivers();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePostTruck = () => {
    setIsLoading(true);
    
    // Prepare event handlers outside of the main function
    const handleSuccess = (e: CustomEvent) => {
      console.log('Order created successfully', e.detail);
      setIsLoading(false);
      handleClose();
    };
    
    const handleError = (e: CustomEvent) => {
      console.error('Error creating order:', e.detail.error);
      setIsLoading(false);
    };
    
    // Set up listeners and cleanup with useEffect
    React.useEffect(() => {
      // Only add listeners when isLoading is true (we've started the process)
      if (!isLoading) return;
      
      // Add event listeners
      window.addEventListener('pat-postTruckSuccess', handleSuccess as EventListener);
      window.addEventListener('pat-postTruckError', handleError as EventListener);
      
      // Set a timeout to prevent UI from being stuck
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 5000); // 5 seconds timeout
      
      // Cleanup function that runs when the component unmounts or dependencies change
      return () => {
        window.removeEventListener('pat-postTruckSuccess', handleSuccess as EventListener);
        window.removeEventListener('pat-postTruckError', handleError as EventListener);
        clearTimeout(timeoutId);
      };
    }, [isLoading]); // Re-run this effect when isLoading changes
    
    // Dispatch custom event for action handler
    const detail = {
      workOpportunityId,
      minPayout: parseInt(minPayout),
      minPricePerDistance: parseFloat(minPricePerDistance),
      distanceUnit: workOpportunity.totalDistance?.unit || 'miles',
      stemTime: parseInt(stemTime),
      originRadius: parseInt(originRadius),
      destinationRadius: parseInt(destinationRadius),
      selectedDriverIds: selectedDriverIds.length > 0 ? selectedDriverIds : null,
      action: 'postTruck',
      workOpportunity  // Pass the entire workOpportunity object
    };
    
    // Create and dispatch the event
    const event = new CustomEvent('pat-postTruck', { detail });
    window.dispatchEvent(event);
  };

  // Get currency symbol based on currency code
  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'CAD': return 'C$';
      case 'INR': return '₹';
      case 'PLN': return 'zł';
      case 'CZK': return 'Kč';
      default: return '$';
    }
  };

  const handleDriverChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    // Handle driver selection
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    
    // Check driver limit based on transit operator type
    const maxDrivers = workOpportunity.transitOperatorType === 'TEAM' ? 2 : 1;
    setSelectedDriverIds(selectedValues.slice(0, maxDrivers));
  };

  const stemTimeOptions = STEM_TIME_OPTIONS.map(option => ({ 
    value: option, 
    label: formatStemTime(option) 
  }));

  const open = Boolean(anchorEl);
  const id = open ? 'load-card-popover' : undefined;
  const currencySymbol = getCurrencySymbol(workOpportunity.payout.unit);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.light',
          },
        }}
        aria-label="Post truck"
        title="Post truck for this load"
      >
        <LocalShipping sx={{ fontSize: 20 }} />
      </IconButton>
      
      <Popover
        id={id}
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
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            borderRadius: 1,
          },
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            Create order
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              size="small"
              label="Payout (min)"
              type="number"
              value={minPayout}
              onChange={(e) => {
                const newPayout = e.target.value;
                setMinPayout(newPayout);
                
                if (!isUpdatingProgrammatically && totalDistance > 0) {
                  setIsUpdatingProgrammatically(true);
                  try {
                    // Calculate and update the rate based on the new payout
                    const newRate = calculateRateFromPayout(parseFloat(newPayout) || 0);
                    setMinPricePerDistance(newRate);
                  } finally {
                    setIsUpdatingProgrammatically(false);
                  }
                }
              }}
              disabled={isLoading}
              InputProps={{
                startAdornment: <span style={{ marginRight: 2, color: '#777' }}>{currencySymbol}</span>
              }}
              sx={{
                width: '50%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  fontSize: '0.875rem',
                },
              }}
            />
            
            <TextField
              size="small"
              label={`Price/${workOpportunity.totalDistance?.unit === 'km' ? 'km' : 'mile'} (min)`}
              type="number"
              value={minPricePerDistance}
              onChange={(e) => {
                const newRate = e.target.value;
                setMinPricePerDistance(newRate);
                
                if (!isUpdatingProgrammatically && totalDistance > 0) {
                  setIsUpdatingProgrammatically(true);
                  try {
                    // Calculate and update the payout based on the new rate
                    const newPayout = calculatePayoutFromRate(parseFloat(newRate) || 0);
                    setMinPayout(newPayout);
                  } finally {
                    setIsUpdatingProgrammatically(false);
                  }
                }
              }}
              disabled={isLoading}
              InputProps={{
                startAdornment: <span style={{ marginRight: 2, color: '#777' }}>{currencySymbol}</span>
              }}
              sx={{
                width: '50%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>
          
          {/* Origin Row */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              label="Origin"
              value={`${workOpportunity.startLocation.city}, ${workOpportunity.startLocation.state}`}
              disabled
              sx={{ flexGrow: 1 }}
            />
            
            <FormControl size="small" sx={{ width: '100px' }}>
              <InputLabel id="origin-radius-label">Radius</InputLabel>
              <Select
                labelId="origin-radius-label"
                value={originRadius}
                label="Radius"
                onChange={(e) => {
                  console.log('Origin radius changed to:', e.target.value);
                  setOriginRadius(e.target.value);
                }}
                sx={{ fontSize: '0.875rem' }}
              >
                {RADIUS_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>
                    {option} {workOpportunity.totalDistance?.unit === 'km' ? 'km' : 'mi'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* Destination Row */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              label="Destination"
              value={`${workOpportunity.endLocation.city}, ${workOpportunity.endLocation.state}`}
              disabled
              sx={{ flexGrow: 1 }}
            />
            
            <FormControl size="small" sx={{ width: '100px' }}>
              <InputLabel id="destination-radius-label">Radius</InputLabel>
              <Select
                labelId="destination-radius-label"
                value={destinationRadius}
                label="Radius"
                onChange={(e) => {
                  console.log('Destination radius changed to:', e.target.value);
                  setDestinationRadius(e.target.value);
                }}
                sx={{ fontSize: '0.875rem' }}
              >
                {RADIUS_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>
                    {option} {workOpportunity.totalDistance?.unit === 'km' ? 'km' : 'mi'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* Stem Time Row */}
          <Box sx={{ mb: 2 }}>
            <LoadboardSelect
              id="stem-time-label"
              label="Stem Time"
              value={stemTime}
              onChange={(e) => setStemTime(e.target.value)}
              options={stemTimeOptions}
              size="small"
            />
          </Box>
          
          <FormControl fullWidth variant="filled" size="small" sx={{ mb: 2 }}>
            <InputLabel shrink id="driver-select-label">
              Select {workOpportunity.transitOperatorType === 'TEAM' ? 'Drivers (max 2)' : 'Driver'}
            </InputLabel>
            <Select
              labelId="driver-select-label"
              multiple
              value={selectedDriverIds}
              onChange={handleDriverChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const driver = allDrivers.find(d => d.latestTransientDriverId === value);
                    return (
                      <Box key={value} sx={{ fontSize: '0.75rem' }}>
                        {driver ? `${driver.firstName} ${driver.lastName}` : value}
                      </Box>
                    );
                  })}
                </Box>
              )}
              disabled={isLoading}
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
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {allDrivers.map((driver) => (
                <MenuItem 
                  key={driver.latestTransientDriverId} 
                  value={driver.latestTransientDriverId}
                  disabled={
                    (workOpportunity.transitOperatorType === 'TEAM' 
                      ? selectedDriverIds.length >= 2 
                      : selectedDriverIds.length >= 1) 
                    && !selectedDriverIds.includes(driver.latestTransientDriverId)
                  }
                >
                  {driver.firstName} {driver.lastName} ({driver.emailId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            fullWidth
            variant="contained"
            onClick={handlePostTruck}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              height: 36,
              fontSize: '0.875rem',
            }}
          >
            {isLoading ? 'Posting...' : 'Submit'}
          </Button>
        </Box>
      </Popover>
    </>
  );
}