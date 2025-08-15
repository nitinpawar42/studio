// src/app/admin/users/page.tsx
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
import type { UserProfile } from '@/types';
import { getAllUsers, updateUserProfile } from '@/lib/firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      const { users, error } = await getAllUsers();
      if (error) {
        toast({
          title: 'Error fetching users',
          description: 'There was an issue retrieving the user list.',
          variant: 'destructive',
        });
      } else {
        setUsers(users);
      }
      setLoading(false);
    }
    fetchUsers();
  }, [toast]);

  const handleApprovalChange = async (user: UserProfile, approved: boolean) => {
    const { error } = await updateUserProfile(user.uid, { approved });
    if (error) {
      toast({
        title: 'Error updating user',
        description: 'Could not update the user status. Please try again.',
        variant: 'destructive',
      });
    } else {
      setUsers(users.map(u => (u.uid === user.uid ? { ...u, approved } : u)));
      toast({
        title: 'User Updated',
        description: `${user.displayName}'s approval status has been updated.`,
      });
    }
  };

  if (loading) {
    return <div className="container py-12">Loading users...</div>;
  }

  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-headline">User Management</CardTitle>
           <CardDescription>Approve or manage user accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Approved (Resellers)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.displayName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.mobile || '-'}</TableCell>
                  <TableCell>{user.address || '-'}</TableCell>
                  <TableCell className="text-right">
                    {user.role === 'reseller' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <Label htmlFor={`approved-${user.uid}`} className="sr-only">
                            Approve Reseller
                        </Label>
                        <Switch
                          id={`approved-${user.uid}`}
                          checked={user.approved}
                          onCheckedChange={(checked) => handleApprovalChange(user, checked)}
                        />
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
