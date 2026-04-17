import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem
} from '@mui/material';
import { Edit, AddBusiness } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { getSuppliers, createSupplier, updateSupplier } from '../../store/slices/supplierSlice';

const supplierSchema = yup.object().shape({
  code: yup.string().required('Supplier code is required'),
  name: yup.string().required('Supplier name is required'),
  contact_person: yup.string().required('Contact person is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string(),
  city: yup.string(),
  country: yup.string(),
  payment_terms: yup.string(),
  rating: yup.number().min(1).max(5),
  is_active: yup.boolean()
});

const SupplierList = () => {
  const dispatch = useDispatch();
  const { suppliers, isLoading } = useSelector((state) => state.suppliers);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      code: '',
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      payment_terms: 'Net 30',
      rating: 5,
      is_active: true
    }
  });

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  const handleOpenNew = () => {
    setEditingId(null);
    reset({
      code: '',
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      payment_terms: 'Net 30',
      rating: 5,
      is_active: true
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (supplier) => {
    setEditingId(supplier.id);
    reset({
      code: supplier.code,
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      country: supplier.country || '',
      payment_terms: supplier.payment_terms || 'Net 30',
      rating: supplier.rating || 5,
      is_active: supplier.is_active
    });
    setOpenDialog(true);
  };

  const onClose = () => {
    setOpenDialog(false);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await dispatch(updateSupplier({ id: editingId, supplierData: data })).unwrap();
        toast.success('Supplier updated successfully');
      } else {
        await dispatch(createSupplier(data)).unwrap();
        toast.success('Supplier created successfully');
      }
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to save supplier');
    }
  };

  if (isLoading && !openDialog) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="600">
            Suppliers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your network of suppliers
          </Typography>
        </div>
        <Button variant="contained" startIcon={<AddBusiness />} onClick={handleOpenNew}>
          Add Supplier
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!suppliers || suppliers.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No suppliers found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id} hover>
                    <TableCell>{supplier.code}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {supplier.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {supplier.city}{supplier.country ? `, ${supplier.country}` : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{supplier.contact_person}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {supplier.email || supplier.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Rating value={supplier.rating || 0} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={supplier.is_active ? 'Active' : 'Inactive'}
                        color={supplier.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" title="Edit" onClick={() => handleOpenEdit(supplier)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openDialog} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controller name="code" control={control} render={({ field }) => (
                  <TextField {...field} label="Supplier Code" fullWidth error={!!errors.code} helperText={errors.code?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller name="name" control={control} render={({ field }) => (
                  <TextField {...field} label="Company Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="contact_person" control={control} render={({ field }) => (
                  <TextField {...field} label="Contact Person" fullWidth error={!!errors.contact_person} helperText={errors.contact_person?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="email" control={control} render={({ field }) => (
                  <TextField {...field} label="Email Address" type="email" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="phone" control={control} render={({ field }) => (
                  <TextField {...field} label="Phone Number" fullWidth error={!!errors.phone} helperText={errors.phone?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="payment_terms" control={control} render={({ field }) => (
                  <TextField {...field} select label="Payment Terms" fullWidth>
                    <MenuItem value="Immediate">Immediate</MenuItem>
                    <MenuItem value="Net 15">Net 15</MenuItem>
                    <MenuItem value="Net 30">Net 30</MenuItem>
                    <MenuItem value="Net 60">Net 60</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="address" control={control} render={({ field }) => (
                  <TextField {...field} label="Address" fullWidth multiline rows={2} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="city" control={control} render={({ field }) => (
                  <TextField {...field} label="City" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="country" control={control} render={({ field }) => (
                  <TextField {...field} label="Country" fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="rating" control={control} render={({ field }) => (
                  <TextField {...field} type="number" label="Rating (1-5)" InputProps={{ inputProps: { min: 1, max: 5 } }} fullWidth />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="is_active" control={control} render={({ field }) => (
                  <TextField {...field} select label="Status" fullWidth>
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </TextField>
                )} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save Supplier</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SupplierList;
