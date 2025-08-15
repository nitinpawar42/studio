// src/app/account/customers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { ResellerCustomer } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  addResellerCustomer,
  getResellerCustomers,
  deleteResellerCustomer,
  updateResellerCustomer,
} from '@/lib/firebase/firestore';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import CustomerFormModal from './customer-form-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ResellerCustomersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<ResellerCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<ResellerCustomer | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      async function fetchCustomers() {
        const { customers: fetchedCustomers, error } = await getResellerCustomers(user.uid);
        if (error) {
          toast({
            title: 'Error fetching customers',
            description: 'There was an issue retrieving your customer list.',
            variant: 'destructive',
          });
        } else if (fetchedCustomers) {
          setCustomers(fetchedCustomers);
        }
        setLoading(false);
      }
      fetchCustomers();
    }
  }, [user, authLoading, router, toast]);

  const handleFormSubmit = async (customerData: Omit<ResellerCustomer, 'id' | 'resellerId'>) => {
    if (!user) return;

    if (editingCustomer) {
      // Update existing customer
      const { error } = await updateResellerCustomer(user.uid, editingCustomer.id, customerData);
      if (error) {
        toast({ title: 'Error', description: 'Could not update customer.', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Customer updated successfully.' });
        setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...customerData } : c));
      }
    } else {
      // Add new customer
      const { customer: newCustomer, error } = await addResellerCustomer(user.uid, customerData);
      if (error || !newCustomer) {
        toast({ title: 'Error', description: 'Could not save customer.', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Customer saved successfully.' });
        setCustomers([...customers, newCustomer]);
      }
    }

    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = async (id: string) => {
    if(!user) return;
    const { error } = await deleteResellerCustomer(user.uid, id);
    if (error) {
      toast({
        title: 'Error deleting customer',
        description: 'Could not delete the customer. Please try again.',
        variant: 'destructive',
      });
    } else {
      setCustomers(customers.filter(c => c.id !== id));
      toast({
        title: 'Customer Deleted',
        description: 'The customer has been successfully deleted.',
      });
    }
  };
  
  const openNewCustomerModal = () => {
      setEditingCustomer(null);
      setIsModalOpen(true);
  }

  if (loading || authLoading) {
    return (
        <div className="container py-12 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <>
      <CustomerFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        customer={editingCustomer}
      />
      <div className="container py-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-4xl font-headline">My Customers</CardTitle>
                <CardDescription>A list of your customers for faster checkouts.</CardDescription>
            </div>
            <Button onClick={openNewCustomerModal}>
              <PlusCircle className="mr-2" /> Add Customer
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Shipping Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No customers found. Add your first customer!
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.mobile}</TableCell>
                      <TableCell>{customer.shippingAddress}, {customer.pincode}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingCustomer(customer); setIsModalOpen(true); }}>
                          <Edit />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this customer profile.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(customer.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
