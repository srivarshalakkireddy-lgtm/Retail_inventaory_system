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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { Edit, AddPerson } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { getUsers, createUser, updateUser } from '../../store/slices/userSlice';

const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  role: yup.string().oneOf(['admin', 'manager', 'staff', 'viewer'], 'Invalid role').required('Role is required'),
  is_active: yup.boolean(),
  password: yup.string().when('$isEdit', {
    is: false,
    then: () => yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    otherwise: () => yup.string()
  })
});

const UserList = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    context: { isEdit: !!editingId },
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'staff',
      is_active: true,
      password: ''
    }
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleOpenNew = () => {
    setEditingId(null);
    reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'staff',
      is_active: true,
      password: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (user) => {
    setEditingId(user.id);
    reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      is_active: user.is_active,
      password: ''
    });
    setOpenDialog(true);
  };

  const onClose = () => {
    setOpenDialog(false);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await dispatch(updateUser({ id: editingId, userData: data })).unwrap();
        toast.success('User updated successfully');
      } else {
        await dispatch(createUser(data)).unwrap();
        toast.success('User created successfully');
      }
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to save user');
    }
  };

  if (isLoading && !openDialog) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">Personnel Management</Typography>
        <Button variant="contained" onClick={handleOpenNew}>Add User</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.is_active ? 'Active' : 'Inactive'} 
                      color={user.is_active ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenEdit(user)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center">No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openDialog} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit User' : 'Create New User'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="First Name" fullWidth margin="dense" error={!!errors.first_name} helperText={errors.first_name?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Last Name" fullWidth margin="dense" error={!!errors.last_name} helperText={errors.last_name?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Email" fullWidth margin="dense" error={!!errors.email} helperText={errors.email?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label={editingId ? "Reset Password (Optional)" : "Password"} type="password" fullWidth margin="dense" error={!!errors.password} helperText={errors.password?.message} />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Role" fullWidth margin="dense" error={!!errors.role} helperText={errors.role?.message}>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                      <MenuItem value="viewer">Viewer</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Status" fullWidth margin="dense">
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserList;
