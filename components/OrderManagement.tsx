import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Trash2, Copy, Clock, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DateTimePicker } from "@/components/ui/date-time-picker";

// Radius options for origin and destination
const RADIUS_OPTIONS = ["5", "10", "15", "20", "25", "50", "75", "100"];

// Stem time options in minutes
const STEM_TIME_OPTIONS = ["5", "15", "30", "45", "60", "90", "120", "150", "180", "210", "240", "480", "720", "1440"];

export function OrderManagement() {
  // State for selected order IDs
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  // State for all orders from storage
  const [allOrders, setAllOrders] = useState<any[]>([]);
  
  // Action state
  const [activeAction, setActiveAction] = useState("");
  
  // Date time states
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(undefined);
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(undefined);
  
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
    if (activeAction === "modify") {
      // For modify, start with empty values
      setStartDateTime(undefined);
      setEndDateTime(undefined);
    } else if (activeAction === "clone") {
      // For clone, default to current date/time
      setStartDateTime(new Date());
      setEndDateTime(new Date());
    } else {
      // For other actions, reset all fields
      setStartDateTime(undefined);
      setEndDateTime(undefined);
    }
    
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
    if (confirm("Are you sure you want to delete ALL orders? This action cannot be undone.")) {
      // Will implement API call later
      console.log("Deleting all orders");
      setAllOrders([]);
      setSelectedOrderIds([]);
      await storage.setItem('local:orders', []);
      alert("All orders deleted");
    }
  };

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrderIds.length === 0) {
      alert("No orders selected");
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedOrderIds.length} selected orders? This action cannot be undone.`)) {
      // Will implement API call later
      console.log("Deleting selected orders:", selectedOrderIds);
      
      const updatedOrders = allOrders.filter(order => !selectedOrderIds.includes(order.id));
      setAllOrders(updatedOrders);
      setSelectedOrderIds([]);
      await storage.setItem('local:orders', updatedOrders);
      alert(`${selectedOrderIds.length} orders deleted`);
    }
  };

  const handleModifyOrders = () => {
    if (selectedOrderIds.length === 0) {
      alert("No orders selected");
      return;
    }
    
    // Only include fields that have values
    const changes: Record<string, any> = {};
    
    if (startDateTime) {
      changes.startDateTime = format(startDateTime, "yyyy-MM-dd HH:mm");
    }
    
    if (endDateTime) {
      changes.endDateTime = format(endDateTime, "yyyy-MM-dd HH:mm");
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
      alert("No changes specified");
      return;
    }
    
    console.log("Modifying orders with changes:", changes);
    // Will implement API call later
    alert(`Orders updated with specified changes`);
  };

  const handleCloneOrders = () => {
    if (selectedOrderIds.length === 0) {
      alert("No orders selected");
      return;
    }
    
    // Required fields for cloning
    if (!startDateTime || !endDateTime) {
      alert("Start and end date/time are required for cloning");
      return;
    }
    
    // Build clone configuration
    const cloneConfig: Record<string, any> = {
      startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm"),
      endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm"),
    };
    
    // Add optional fields if provided
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
    // Will implement API call later
    alert(`${selectedOrderIds.length} orders cloned`);
  };

  // Get summary of changes
  const getChangesSummary = () => {
    const changes = [];
    
    if (startDateTime) {
      if (activeAction === "modify") {
        changes.push(`Start time: ${format(startDateTime, "yyyy-MM-dd HH:mm")}`);
      } else {
        changes.push(`New start: ${format(startDateTime, "yyyy-MM-dd HH:mm")}`);
      }
    }
    
    if (endDateTime) {
      if (activeAction === "modify") {
        changes.push(`End time: ${format(endDateTime, "yyyy-MM-dd HH:mm")}`);
      } else {
        changes.push(`New end: ${format(endDateTime, "yyyy-MM-dd HH:mm")}`);
      }
    }
    
    if (minPayout) {
      changes.push(`Min payout: $${minPayout}`);
    }
    
    if (minPricePerMile) {
      changes.push(`Min price per mile: $${minPricePerMile}`);
    }
    
    if (stemTime && stemTime !== "none") {
      changes.push(`Stem time: ${stemTime} minutes`);
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

  return (
    <div className="order-management bg-white rounded-lg shadow-md p-3 mb-4 max-w-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Order Management</h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-md">
          {selectedOrderIds.length} order{selectedOrderIds.length !== 1 ? 's' : ''} selected
        </span>
      </div>
      
      <div className="mb-3">
        <Select value={activeAction} onValueChange={setActiveAction}>
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modify">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Modify Orders</span>
              </div>
            </SelectItem>
            <SelectItem value="clone">
              <div className="flex items-center">
                <Copy className="h-4 w-4 mr-2" />
                <span>Clone Orders</span>
              </div>
            </SelectItem>
            <SelectItem value="delete-selected">
              <div className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Delete Selected</span>
              </div>
            </SelectItem>
            <SelectItem value="delete-all">
              <div className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Delete All</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(activeAction === "modify" || activeAction === "clone") && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">
            {activeAction === "modify" ? "Modify Orders" : "Clone Orders"}
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            {activeAction === "modify" 
              ? "Leave fields empty to keep current values" 
              : "Start/end times required, other fields optional"}
          </p>
          
          <div className="space-y-3">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col w-full">
                <Label htmlFor="start-date-time" className="text-xs mb-1">
                  {activeAction === "modify" ? "Start Date/Time" : "New Start Date/Time*"}
                </Label>
                <DateTimePicker
                  date={startDateTime}
                  setDate={setStartDateTime}
                  label="Select date and time"
                />
              </div>
              <div className="flex flex-col w-full">
                <Label htmlFor="end-date-time" className="text-xs mb-1">
                  {activeAction === "modify" ? "End Date/Time" : "New End Date/Time*"}
                </Label>
                <DateTimePicker
                  date={endDateTime}
                  setDate={setEndDateTime}
                  label="Select date and time"
                />
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-payout" className="text-xs">Min Payout ($)</Label>
                <Input 
                  id="min-payout" 
                  type="number" 
                  value={minPayout} 
                  onChange={(e) => setMinPayout(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Keep current" 
                />
              </div>
              <div>
                <Label htmlFor="min-price-per-mile" className="text-xs">Min Price/Mile ($)</Label>
                <Input 
                  id="min-price-per-mile" 
                  type="number" 
                  step="0.1" 
                  value={minPricePerMile} 
                  onChange={(e) => setMinPricePerMile(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Keep current" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="stem-time" className="text-xs">Stem Time (min)</Label>
                <Select value={stemTime} onValueChange={setStemTime}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Keep current" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keep current</SelectItem>
                    {STEM_TIME_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max-stops" className="text-xs">Max Stops</Label>
                <Input 
                  id="max-stops" 
                  type="number" 
                  value={maxStops} 
                  onChange={(e) => setMaxStops(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Keep current" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="origin-radius" className="text-xs">Origin Radius (miles)</Label>
                <Select value={originRadius} onValueChange={setOriginRadius}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Keep current" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keep current</SelectItem>
                    {RADIUS_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destination-radius" className="text-xs">Dest. Radius (miles)</Label>
                <Select value={destinationRadius} onValueChange={setDestinationRadius}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Keep current" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keep current</SelectItem>
                    {RADIUS_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Summary of changes */}
            {getChangesSummary().length > 0 && (
              <div className="mt-3 bg-blue-50 p-2 rounded border border-blue-200">
                <h4 className="text-xs font-medium text-blue-800 mb-1">
                  {activeAction === "modify" ? "Changes to apply:" : "Clone details:"}
                </h4>
                <ul className="text-xs text-blue-700 pl-5 list-disc">
                  {getChangesSummary().map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                  {activeAction === "clone" && (
                    <li>Orders to clone: {selectedOrderIds.length}</li>
                  )}
                </ul>
              </div>
            )}
            
            <Button 
              onClick={activeAction === "modify" ? handleModifyOrders : handleCloneOrders}
              disabled={
                selectedOrderIds.length === 0 || 
                (activeAction === "modify" && getChangesSummary().length === 0) ||
                (activeAction === "clone" && (!startDateTime || !endDateTime))
              }
              className="w-full h-8 text-sm mt-2"
            >
              {activeAction === "modify" ? "Update" : "Clone"} {selectedOrderIds.length} Order{selectedOrderIds.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
      
      {activeAction === "delete-selected" && (
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="space-y-3">
            <div className="flex items-center text-amber-800 mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <h4 className="text-sm font-medium">Warning</h4>
            </div>
            
            <div className="bg-amber-50 p-2 rounded border border-amber-200">
              <p className="text-xs text-amber-800">
                Deleting orders cannot be undone. Please confirm your selection before proceeding.
              </p>
            </div>
            
            <div className="bg-blue-50 p-2 rounded border border-blue-200">
              <h4 className="text-xs font-medium text-blue-800 mb-1">Operation details:</h4>
              <ul className="text-xs text-blue-700 pl-5 list-disc">
                <li>Action: Delete selected orders</li>
                <li>Orders to delete: {selectedOrderIds.length}</li>
              </ul>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteSelectedOrders}
              disabled={selectedOrderIds.length === 0}
              className="w-full h-8 text-sm"
            >
              Delete {selectedOrderIds.length} Selected Order{selectedOrderIds.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
      
      {activeAction === "delete-all" && (
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="space-y-3">
            <div className="flex items-center text-amber-800 mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <h4 className="text-sm font-medium">Warning</h4>
            </div>
            
            <div className="bg-amber-50 p-2 rounded border border-amber-200">
              <p className="text-xs text-amber-800">
                This will delete ALL orders. This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-blue-50 p-2 rounded border border-blue-200">
              <h4 className="text-xs font-medium text-blue-800 mb-1">Operation details:</h4>
              <ul className="text-xs text-blue-700 pl-5 list-disc">
                <li>Action: Delete all orders</li>
                <li>Total orders: {allOrders.length}</li>
              </ul>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteAllOrders}
              className="w-full h-8 text-sm"
            >
              Delete All Orders
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}