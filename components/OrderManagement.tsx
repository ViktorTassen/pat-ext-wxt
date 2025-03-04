import React, { useState, useEffect } from "react";
import { 
  Button, 
  Box, 
  Paper, 
  Divider, 
  Grid, 
  SelectChangeEvent,
  Typography,
  MenuItem
} from "@mui/material";

import { DeleteOutline, ContentCopy, AccessTime } from "@mui/icons-material";
import dayjs from "dayjs";
import PatDateTimePicker from "./PatDateTimePicker";
import LoadboardTextField from "./LoadboardTextField";
import LoadboardSelect from "./LoadboardSelect";

// Radius options for origin and destination
const RADIUS_OPTIONS = ["5", "10", "15", "20", "25", "50", "75", "100"];

// Stem time options in minutes
const STEM_TIME_OPTIONS = ["5", "15", "30", "45", "60", "90", "120", "150", "180", "210", "240", "480", "720", "1440"];

// Format stem time to be more readable
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

export function OrderManagement() {
  // State for selected order IDs
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  // State for all orders from storage
  const [allOrders, setAllOrders] = useState<any[]>([]);
  
  // Action state
  const [activeAction, setActiveAction] = useState("");
  
  // Date time states
  const [startDateTime, setStartDateTime] = useState<dayjs.Dayjs | null>(null);
  const [endDateTime, setEndDateTime] = useState<dayjs.Dayjs | null>(null);
  
  // Calendar open states
  const [startCalendarOpen, setStartCalendarOpen] = useState<boolean>(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState<boolean>(false);
  
  // Other form states - empty string means "don't change"
  const [minPayout, setMinPayout] = useState<string>("");
  const [minPricePerMile, setMinPricePerMile] = useState<string>("");
  const [stemTime, setStemTime] = useState<string>("none");
  const [originRadius, setOriginRadius] = useState<string>("none");
  const [destinationRadius, setDestinationRadius] = useState<string>("none");
  const [maxStops, setMaxStops] = useState<string>("");

  // Load orders from storage on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await storage.getItem('local:orders') as any[];
        if (orders) {
          setAllOrders(orders);
          console.log("Loaded orders:", orders);
        }
      } catch (error) {
        console.error("Error loading orders from storage:", error);
      }
    };

    loadOrders();
    
    // Listen for checkbox selection events
    window.addEventListener('orderSelected', handleOrderSelected);
    
    return () => {
      window.removeEventListener('orderSelected', handleOrderSelected);
    };
  }, []);

  // Handle order selection from checkboxes
  const handleOrderSelected = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { orderId, selected } = customEvent.detail;
    
    setSelectedOrderIds(prev => {
      if (selected && !prev.includes(orderId)) {
        return [...prev, orderId];
      } else if (!selected && prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      }
      return prev;
    });
  };

  // Reset form fields when changing action
  useEffect(() => {
    // Reset form
    setStartDateTime(null);
    setEndDateTime(null);
    
    // Always reset these fields
    setMinPayout("");
    setMinPricePerMile("");
    setStemTime("none");
    setOriginRadius("none");
    setDestinationRadius("none");
    setMaxStops("");
  }, [activeAction]);

  // Action handlers
  const handleDeleteAllOrders = async () => {
    console.log("Deleting all orders");
    setAllOrders([]);
    setSelectedOrderIds([]);
    await storage.setItem('local:orders', []);
  };

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrderIds.length === 0) {
      return;
    }
    
    console.log("Deleting selected orders:", selectedOrderIds);
    
    const updatedOrders = allOrders.filter(order => !selectedOrderIds.includes(order.id));
    setAllOrders(updatedOrders);
    setSelectedOrderIds([]);
    await storage.setItem('local:orders', updatedOrders);
  };

  const handleModifyOrders = () => {
    if (selectedOrderIds.length === 0) {
      return;
    }
    
    // Only include fields that have values
    const changes: Record<string, any> = {};
    
    if (startDateTime) {
      changes.startDateTime = startDateTime.format("YYYY-MM-DD HH:mm");
    }
    
    if (endDateTime) {
      changes.endDateTime = endDateTime.format("YYYY-MM-DD HH:mm");
    }
    
    if (minPayout) {
      changes.minPayout = minPayout;
    }
    
    if (minPricePerMile) {
      changes.minPricePerMile = minPricePerMile;
    }
    
    if (stemTime && stemTime !== "none") {
      changes.stemTime = stemTime;
    }
    
    if (originRadius && originRadius !== "none") {
      changes.originRadius = originRadius;
    }
    
    if (destinationRadius && destinationRadius !== "none") {
      changes.destinationRadius = destinationRadius;
    }
    
    if (maxStops) {
      changes.maxStops = maxStops;
    }
    
    if (Object.keys(changes).length === 0) {
      return;
    }
    
    console.log("Modifying orders with changes:", changes);
  };

  const handleCloneOrders = () => {
    if (selectedOrderIds.length === 0) {
      return;
    }
    
    // Build clone configuration - all fields are optional
    const cloneConfig: Record<string, any> = {};
    
    if (startDateTime) {
      cloneConfig.startDateTime = startDateTime.format("YYYY-MM-DD HH:mm");
    }
    
    if (endDateTime) {
      cloneConfig.endDateTime = endDateTime.format("YYYY-MM-DD HH:mm");
    }
    
    if (minPayout) {
      cloneConfig.minPayout = minPayout;
    }
    
    if (minPricePerMile) {
      cloneConfig.minPricePerMile = minPricePerMile;
    }
    
    if (stemTime && stemTime !== "none") {
      cloneConfig.stemTime = stemTime;
    }
    
    if (originRadius && originRadius !== "none") {
      cloneConfig.originRadius = originRadius;
    }
    
    if (destinationRadius && destinationRadius !== "none") {
      cloneConfig.destinationRadius = destinationRadius;
    }
    
    if (maxStops) {
      cloneConfig.maxStops = maxStops;
    }
    
    console.log("Cloning orders with config:", cloneConfig);
  };

  // Handle date time picker changes
  const handleStartDateTimeChange = (value: any) => {
    if (value && dayjs(value).isValid()) {
      setStartDateTime(dayjs(value));
    } else {
      setStartDateTime(null);
    }
  };

  const handleEndDateTimeChange = (value: any) => {
    if (value && dayjs(value).isValid()) {
      setEndDateTime(dayjs(value));
    } else {
      setEndDateTime(null);
    }
  };

  // Handle calendar open state changes
  const handleStartCalendarOpenChange = (isOpen: boolean) => {
    setStartCalendarOpen(isOpen);
  };

  const handleEndCalendarOpenChange = (isOpen: boolean) => {
    setEndCalendarOpen(isOpen);
  };

  // Get summary of changes
  const getChangesSummary = () => {
    const changes = [];
    
    if (startDateTime) {
      changes.push(`New Start Date/Time: ${startDateTime.format("YYYY-MM-DD HH:mm")}`);
    }
    
    if (endDateTime) {
      changes.push(`New End Date/Time: ${endDateTime.format("YYYY-MM-DD HH:mm")}`);
    }
    
    if (minPayout) {
      changes.push(`Min payout: $${minPayout}`);
    }
    
    if (minPricePerMile) {
      changes.push(`Min price per mile: $${minPricePerMile}`);
    }
    
    if (stemTime && stemTime !== "none") {
      changes.push(`Stem time: ${formatStemTime(stemTime)}`);
    }
    
    if (maxStops) {
      changes.push(`Max stops: ${maxStops}`);
    }
    
    if (originRadius && originRadius !== "none") {
      changes.push(`Origin radius: ${originRadius} miles`);
    }
    
    if (destinationRadius && destinationRadius !== "none") {
      changes.push(`Destination radius: ${destinationRadius} miles`);
    }
    
    return changes;
  };

  const handleActionChange = (event: SelectChangeEvent<string>) => {
    setActiveAction(event.target.value);
  };

  // Action options for the select dropdown
  const actionOptions = [
    {
      value: "modify",
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime sx={{ fontSize: 16, mr: 1 }} />
          <span>Modify Orders</span>
        </Box>
      )
    },
    {
      value: "clone",
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ContentCopy sx={{ fontSize: 16, mr: 1 }} />
          <span>Clone Orders</span>
        </Box>
      )
    },
    {
      value: "delete-selected",
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DeleteOutline sx={{ fontSize: 16, mr: 1 }} />
          <span>Delete Selected</span>
        </Box>
      )
    },
    {
      value: "delete-all",
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DeleteOutline sx={{ fontSize: 16, mr: 1 }} />
          <span>Delete All</span>
        </Box>
      )
    }
  ];

  // Create options arrays for select components
  const stemTimeOptions = [
    { value: "none", label: "Keep current" },
    ...STEM_TIME_OPTIONS.map(option => ({ 
      value: option, 
      label: formatStemTime(option) 
    }))
  ];

  const radiusOptions = [
    { value: "none", label: "Keep current" },
    ...RADIUS_OPTIONS.map(option => ({ 
      value: option, 
      label: option 
    }))
  ];

  return (
    <Paper 
      variant="outlined"
      sx={{ 
        p: 2, 
        mb: 2, 
        maxWidth: 500, 
        borderRadius: 1 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{ width: 200 }}>
          <LoadboardSelect
            id="action-select-label"
            label="Select action"
            value={activeAction}
            onChange={handleActionChange}
            options={[
              { value: "", label: "" },
              ...actionOptions.map(option => ({
                value: option.value,
                label: typeof option.label === 'string' 
                  ? option.label 
                  : option.value === "modify" 
                    ? "Modify Orders"
                    : option.value === "clone"
                    ? "Clone Orders"
                    : option.value === "delete-selected"
                    ? "Delete Selected"
                    : "Delete All"
              }))
            ]}
          />
        </Box>
        <Box 
          sx={{ 
            px: 1, 
            py: 0.5, 
            bgcolor: 'primary.50', 
            color: 'primary.800', 
            borderRadius: 1, 
            fontSize: '0.875rem', 
            fontWeight: 500 
          }}
        >
          {selectedOrderIds.length} order{selectedOrderIds.length !== 1 ? 's' : ''} selected
        </Box>
      </Box>
      
      <Divider sx={{ mt: 2 }} />
      
      {(activeAction === "modify" || activeAction === "clone") && (
        <Box sx={{ mt: 4 }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <PatDateTimePicker
                  index={0}
                  value={startDateTime ? startDateTime.toISOString() : null}
                  isOpen={startCalendarOpen}
                  handleChange={handleStartDateTimeChange}
                  handleOpenChange={handleStartCalendarOpenChange}
                />
              </Grid>
              <Grid item xs={6}>
                <PatDateTimePicker
                  index={1}
                  value={endDateTime ? endDateTime.toISOString() : null}
                  isOpen={endCalendarOpen}
                  handleChange={handleEndDateTimeChange}
                  handleOpenChange={handleEndCalendarOpenChange}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LoadboardTextField
                  label="Min Payout"
                  value={minPayout}
                  onChange={(e) => setMinPayout(e.target.value)}
                  placeholder="Keep current"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <LoadboardTextField
                  label="Min Price/Mile ($)"
                  value={minPricePerMile}
                  onChange={(e) => setMinPricePerMile(e.target.value)}
                  placeholder="Keep current"
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LoadboardSelect
                  id="stem-time-label"
                  label="Stem Time"
                  value={stemTime}
                  onChange={(e) => setStemTime(e.target.value)}
                  options={stemTimeOptions}
                />
              </Grid>
              <Grid item xs={6}>
                <LoadboardTextField
                  label="Max Stops"
                  value={maxStops}
                  onChange={(e) => setMaxStops(e.target.value)}
                  placeholder="Keep current"
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LoadboardSelect
                  id="origin-radius-label"
                  label="Origin Radius (miles)"
                  value={originRadius}
                  onChange={(e) => setOriginRadius(e.target.value)}
                  options={radiusOptions}
                />
              </Grid>
              <Grid item xs={6}>
                <LoadboardSelect
                  id="destination-radius-label"
                  label="Dest. Radius (miles)"
                  value={destinationRadius}
                  onChange={(e) => setDestinationRadius(e.target.value)}
                  options={radiusOptions}
                />
              </Grid>
            </Grid>
            
            {/* Summary of changes */}
            {getChangesSummary().length > 0 && (
              <Box sx={{ 
                mt: 2, 
                bgcolor: 'info.50', 
                p: 1, 
                borderRadius: 1, 
                border: 1, 
                borderColor: 'info.200' 
              }}>
                <Typography variant="caption" sx={{ color: 'info.800', fontWeight: 500, mb: 0.5, display: 'block' }}>
                  {activeAction === "modify" ? "Changes to apply:" : "Clone details:"}
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {getChangesSummary().map((change, index) => (
                    <Box component="li" key={index} sx={{ color: 'info.700', fontSize: '0.75rem' }}>
                      {change}
                    </Box>
                  ))}
                  {activeAction === "clone" && (
                    <Box component="li" sx={{ color: 'info.700', fontSize: '0.75rem' }}>
                      Orders to clone: {selectedOrderIds.length}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            
            <Button 
              variant="contained"
              onClick={activeAction === "modify" ? handleModifyOrders : handleCloneOrders}
              disabled={selectedOrderIds.length === 0}
              sx={{ mt: 1, height: 32, fontSize: '0.875rem' }}
              fullWidth
            >
              {activeAction === "modify" ? "Update" : "Clone"} {selectedOrderIds.length} Order{selectedOrderIds.length !== 1 ? 's' : ''}
            </Button>
          </Box>
        </Box>
      )}
      
      {activeAction === "delete-selected" && (
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteSelectedOrders}
            disabled={selectedOrderIds.length === 0}
            sx={{ height: 32, fontSize: '0.875rem' }}
            fullWidth
          >
            Delete {selectedOrderIds.length} Selected Order{selectedOrderIds.length !== 1 ? 's' : ''}
          </Button>
        </Box>
      )}
      
      {activeAction === "delete-all" && (
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteAllOrders}
            sx={{ height: 32, fontSize: '0.875rem' }}
            fullWidth
          >
            Delete All Orders ({allOrders.length})
          </Button>
        </Box>
      )}
    </Paper>
  );
}