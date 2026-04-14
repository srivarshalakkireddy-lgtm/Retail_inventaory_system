import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Typography,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';
import { getInventory } from '../../store/slices/inventorySlice';

const InventoryList = () => {
  const dispatch = useDispatch();
  const { inventory, isLoading } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(getInventory());
  }, [dispatch]);

  const getStockStatus = (item) => {
    const available = item.quantity_available;
    const reorderPoint = item.product?.reorder_point || 0;
    const minStock = item.product?.min_stock_level || 0;

    if (available <= minStock) return { label: 'Low', color: 'error' };
    if (available <= reorderPoint) return { label: 'Reorder', color: 'warning' };
    return { label: 'OK', color: 'success' };
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Inventory
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Track inventory levels across all locations
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell align="right">Reserved</TableCell>
                <TableCell align="right">In Transit</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!inventory || inventory.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No inventory data available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {item.product?.name || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.product?.sku || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.location?.name || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.location?.code || ''}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          fontWeight="600"
                          color={status.color === 'error' ? 'error.main' : 'text.primary'}
                        >
                          {item.quantity_available}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{item.quantity_reserved}</TableCell>
                      <TableCell align="right">{item.quantity_in_transit}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default InventoryList;
