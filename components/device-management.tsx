'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Device {
  id: string
  userAgent: string
  lastActive: string
  createdAt: string
}

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/user/devices')
      if (response.ok) {
        const data = await response.json()
        setDevices(data)
      } else {
        toast.error('Failed to fetch devices')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      const response = await fetch('/api/user/devices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      })

      if (response.ok) {
        setDevices(devices.filter(device => device.id !== deviceId))
        toast.success('Device removed successfully')
      } else {
        toast.error('Failed to remove device')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {devices.map(device => (
            <li key={device.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{device.userAgent}</p>
                <p className="text-sm text-gray-500">Last active: {new Date(device.lastActive).toLocaleString()}</p>
              </div>
              <Button variant="destructive" onClick={() => handleRemoveDevice(device.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

