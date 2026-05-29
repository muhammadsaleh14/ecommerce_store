'use client'

import { useState } from 'react'
import { useTenants, useAddTenant, useUpdateTenant } from '@/hooks/queries/useTenants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export default function SuperAdminTenantsPage() {
  const { data: tenants, isLoading, error } = useTenants()
  const addTenant = useAddTenant()
  const updateTenant = useUpdateTenant()

  const [newId, setNewId] = useState('')
  const [newName, setNewName] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newId || !newName) return
    try {
      await addTenant.mutateAsync({ id: newId, name: newName })
      setNewId('')
      setNewName('')
    } catch {
      /* handled by react-query */
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editingName) return
    try {
      await updateTenant.mutateAsync({ id, name: editingName })
      setEditingId(null)
      setEditingName('')
    } catch {
      /* handled */
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load tenants: {(error as Error).message}</p>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manage Tenants</h2>

      <form onSubmit={handleAdd} className="flex items-end gap-3 max-w-lg">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Tenant ID</label>
          <Input value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="e.g. womencouture" />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Women Couture" />
        </div>
        <Button type="submit" disabled={addTenant.isPending || !newId || !newName}>
          Add Tenant
        </Button>
      </form>

      {!tenants || tenants.length === 0 ? (
        <p className="text-muted-foreground">No tenants yet.</p>
      ) : (
        <div className="space-y-2">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="border rounded-lg p-4 bg-white flex items-center justify-between">
              {editingId === tenant.id ? (
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-mono text-muted-foreground w-32">{tenant.id}</span>
                  <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="max-w-xs" />
                  <Button size="sm" onClick={() => handleUpdate(tenant.id)} disabled={updateTenant.isPending}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold text-sm">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{tenant.id}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(tenant.id)
                      setEditingName(tenant.name)
                    }}
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
