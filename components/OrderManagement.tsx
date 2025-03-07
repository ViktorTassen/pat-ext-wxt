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
import LoadboardDateTimePicker from "./LoadboardDateTimePicker";
import LoadboardTextField from "./LoadboardTextField";
import LoadboardSelect from "./LoadboardSelect";
import ChangesSummary from "./ChangesSummary";
import { DeleteProgress } from "./DeleteProgress";

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
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  // State for all orders from storage
  const [allOrders, setAllOrders] = useState<any[]>([]);
  
  // Progress states
  const [deleteProgress, setDeleteProgress] = useState<{
    completed: number;
    failed: number;
    total: number;
    isComplete: boolean;
  } | null>(null);
  const [modifyProgress, setModifyProgress] = useState<typeof deleteProgress>(null);
  const [cloneProgress, setCloneProgress] = useState<typeof deleteProgress>(null);
  
  // Error states
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [modifyError, setModifyError] = useState<string | null>(null);
  const [cloneError, setCloneError] = useState<string | null>(null);
  
  // Action state
  const [activeAction, setActiveAction] = useState("0");
  
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
    const handleOrderSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { orderId, selected } = customEvent.detail;
      
      setSelectedOrderIds(prev => {
        const newSet = new Set(prev);
        if (selected) {
          newSet.add(orderId);
        } else {
          newSet.delete(orderId);
        }
        return newSet;
      });
    };

    // Listen for progress events
    const handleDeleteProgress = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDeleteProgress(customEvent.detail);
    };

    const handleModifyProgress = (event: Event) => {
      const customEvent = event as CustomEvent;
      setModifyProgress(customEvent.detail);
    };

    const handleCloneProgress = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCloneProgress(customEvent.detail);
    };

    // Listen for success/error events
    const handleDeleteSuccess = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDeleteProgress({
        ...customEvent.detail,
        isComplete: true
      });
      setDeleteError(null);
    };

    const handleDeleteError = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDeleteError(customEvent.detail.error);
      setDeleteProgress(null);
    };

    const handleModifySuccess = (event: Event) => {
      const customEvent = event as CustomEvent;
      setModifyProgress({
        ...customEvent.detail,
        isComplete: true
      });
      setModifyError(null);
    };

    const handleModifyError = (event: Event) => {
      const customEvent = event as CustomEvent;
      setModifyError(customEvent.detail.error);
      setModifyProgress(null);
    };

    const handleCloneSuccess = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCloneProgress({
        ...customEvent.detail,
        isComplete: true
      });
      setCloneError(null);
    };

    const handleCloneError = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCloneError(customEvent.detail.error);
      setCloneProgress(null);
    };
    
    window.addEventListener('orderSelected', handleOrderSelected);
    window.addEventListener('deleteProgress', handleDeleteProgress);
    window.addEventListener('modifyProgress', handleModifyProgress);
    window.addEventListener('cloneProgress', handleCloneProgress);
    window.addEventListener('deleteOrdersSuccess', handleDeleteSuccess);
    window.addEventListener('deleteOrdersError', handleDeleteError);
    window.addEventListener('modifyOrdersSuccess', handleModifySuccess);
    window.addEventListener('modifyOrdersError', handleModifyError);
    window.addEventListener('cloneOrdersSuccess', handleCloneSuccess);
    window.addEventListener('cloneOrdersError', handleCloneError);
    
    return () => {
      window.removeEventListener('orderSelected', handleOrderSelected);
      window.removeEventListener('deleteProgress', handleDeleteProgress);
      window.removeEventListener('modifyProgress', handleModifyProgress);
      window.removeEventListener('cloneProgress', handleCloneProgress);
      window.removeEventListener('deleteOrdersSuccess', handleDeleteSuccess);
      window.removeEventListener('deleteOrdersError', handleDeleteError);
      window.removeEventListener('modifyOrdersSuccess', handleModifySuccess);
      window.removeEventListener('modifyOrdersError', handleModifyError);
      window.removeEventListener('cloneOrdersSuccess', handleCloneSuccess);
      window.removeEventListener('cloneOrdersError', handleCloneError);
    };
  }, []);

  // Reset form fields when changing action
  useEffect(() => {
    // Reset form
    setStartDateTime(null);
    setEndDateTime(null);
    setDeleteProgress(null);
    setModifyProgress(null);
    setCloneProgress(null);
    setDeleteError(null);
    setModifyError(null);
    setCloneError(null);
    
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
    setDeleteError(null);
    const ordersToDelete = allOrders.map(order => ({
      id: order.id,
      version: order.version
    }));
    
    window.dispatchEvent(new CustomEvent('deleteOrdersRequest', {
      detail: { orders: ordersToDelete }
    }));
  };

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrderIds.size === 0) {
      return;
    }
    
    setDeleteError(null);
    const ordersToDelete = allOrders
      .filter(order => selectedOrderIds.has(order.alias))
      .map(order => ({
        id: order.id,
        version: order.version
      }));
    
    window.dispatchEvent(new CustomEvent('deleteOrdersRequest', {
      detail: { orders: ordersToDelete }
    }));
  };

  const handleModifyOrders = () => {
    if (selectedOrderIds.size === 0) {
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

    const ordersToModify = allOrders.filter(order => selectedOrderIds.has(order.alias));
    
    window.dispatchEvent(new CustomEvent('modifyOrdersRequest', {
      detail: { 
        orders: ordersToModify,
        changes
      }
    }));
  };

  const handleCloneOrders = () => {
    if (selectedOrderIds.size === 0) {
      return;
    }
    
    // Build clone configuration - all fields are optional
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

    const ordersToClone = allOrders.filter(order => selectedOrderIds.has(order.alias));
    
    window.dispatchEvent(new CustomEvent('cloneOrdersRequest', {
      detail: { 
        orders: ordersToClone,
        changes
      }
    }));
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

  // Get changes for summary component
  const getChangesForSummary = () => {
    const changes: Record<string, string> = {};
    
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
    
    if (maxStops) {
      changes.maxStops = maxStops;
    }
    
    if (originRadius && originRadius !== "none") {
      changes.originRadius = originRadius;
    }
    
    if (destinationRadius && destinationRadius !== "none") {
      changes.destinationRadius = destinationRadius;
    }
    
    return changes;
  };

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
              { value: "0", label: "---" },
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
          {selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''} selected
        </Box>
      </Box>
      
      <Divider sx={{ mt: 2 }} />
      
      {(activeAction === "modify" || activeAction === "clone") && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LoadboardDateTimePicker
                  index={0}
                  value={startDateTime ? startDateTime.toISOString() : null}
                  isOpen={startCalendarOpen}
                  handleChange={handleStartDateTimeChange}
                  handleOpenChange={handleStartCalendarOpenChange}
                />
              </Grid>
              <Grid item xs={6}>
                <LoadboardDateTimePicker
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
                  label="Min Price/mile"
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
                  label="Origin Radius"
                  value={originRadius}
                  onChange={(e) => setOriginRadius(e.target.value)}
                  options={radiusOptions}
                />
              </Grid>
              <Grid item xs={6}>
                <LoadboardSelect
                  id="destination-radius-label"
                  label="Dest. Radius"
                  value={destinationRadius}
                  onChange={(e) => setDestinationRadius(e.target.value)}
                  options={radiusOptions}
                />
              </Grid>
            </Grid>
            
            <ChangesSummary
              changes={getChangesForSummary()}
              mode={activeAction as 'modify' | 'clone'}
              selectedCount={selectedOrderIds.size}
            />
            
            {activeAction === "modify" && modifyProgress && (
              <DeleteProgress 
                completed={modifyProgress.completed}
                failed={modifyProgress.failed}
                total={modifyProgress.total}
                isComplete={modifyProgress.isComplete}
              />
            )}
            
            {activeAction === "clone" && cloneProgress && (
              <DeleteProgress 
                completed={cloneProgress.completed}
                failed={cloneProgress.failed}
                total={cloneProgress.total}
                isComplete={cloneProgress.isComplete}
              />
            )}
            
            {activeAction === "modify" && modifyError && (
              <Typography 
                color="error" 
                variant="caption" 
                sx={{ display: 'block', mt: 1 }}
              >
                {modifyError}
              </Typography>
            )}
            
            {activeAction === "clone" && cloneError && (
              <Typography 
                color="error" 
                variant="caption" 
                sx={{ display: 'block', mt: 1 }}
              >
                {cloneError}
              </Typography>
            )}
            
            <Button 
              variant="contained"
              onClick={activeAction === "modify" ? handleModifyOrders : handleCloneOrders}
              disabled={selectedOrderIds.size === 0}
              sx={{ mt: 1, height: 32, fontSize: '0.875rem' }}
              fullWidth
            >
              {activeAction === "modify" ? "Update" : "Clone"} {selectedOrderIds.size} Order{selectedOrderIds.size !== 1 ? 's' : ''}
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
            disabled={selectedOrderIds.size === 0}
            sx={{ height: 32, fontSize: '0.875rem' }}
            fullWidth
          >
            Delete {selectedOrderIds.size} Selected Order{selectedOrderIds.size !== 1 ? 's' : ''}
          </Button>
          {deleteProgress && (
            <DeleteProgress 
              completed={deleteProgress.completed}
              failed={deleteProgress.failed}
              total={deleteProgress.total}
              isComplete={deleteProgress.isComplete}
            />
          )}
          {deleteError && (
            <Typography 
              color="error" 
              variant="caption" 
              sx={{ display: 'block', mt: 1 }}
            >
              {deleteError}
            </Typography>
          )}
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
          {deleteProgress && (
            <DeleteProgress 
              completed={deleteProgress.completed}
              failed={deleteProgress.failed}
              total={deleteProgress.total}
              isComplete={deleteProgress.isComplete}
            />
          )}
          {deleteError && (
            <Typography 
              color="error" 
              variant="caption" 
              sx={{ display: 'block', mt: 1 }}
            >
              {deleteError}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}