import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'crypto';

interface WorkerPosition {
  employeeId: string;
  x: number;
  y: number;
  status: 'active' | 'idle' | 'offline';
  lastScan: string;
}

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  /**
   * Maps location string to grid coordinates using stable hashing
   */
  private locationToGrid(location: string): { x: number; y: number } {
    // Create a stable hash from location string
    const hash = crypto.createHash('md5').update(location).digest('hex');
    
    // Convert first 8 hex chars to numbers for x and y
    // Use modulo to keep within reasonable grid bounds (e.g., 0-99)
    const x = parseInt(hash.substring(0, 4), 16) % 100;
    const y = parseInt(hash.substring(4, 8), 16) % 100;
    
    return { x, y };
  }

  /**
   * Calculates worker status based on time since last scan
   */
  private calculateStatus(lastScanTime: Date): 'active' | 'idle' | 'offline' {
    const now = new Date();
    const minutesSinceLastScan = (now.getTime() - lastScanTime.getTime()) / (1000 * 60);

    if (minutesSinceLastScan < 2) {
      return 'active';
    } else if (minutesSinceLastScan < 15) {
      return 'idle';
    } else {
      return 'offline';
    }
  }

  async getFloorState(): Promise<{
    workers: WorkerPosition[];
    timestamp: string;
  }> {
    // Get all employees
    const employees = await this.prisma.employee.findMany({
      where: {
        role: {
          in: ['ASSOCIATE', 'MANAGER', 'ADMIN'],
        },
      },
    });

    const workers: WorkerPosition[] = [];

    for (const employee of employees) {
      // Get latest scan for this employee
      const latestScan = await this.prisma.scanEvent.findFirst({
        where: {
          employeeId: employee.id,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      if (!latestScan) {
        // No scans yet, mark as offline
        workers.push({
          employeeId: employee.id,
          x: 0,
          y: 0,
          status: 'offline',
          lastScan: new Date(0).toISOString(),
        });
        continue;
      }

      // Map location to grid coordinates
      const { x, y } = this.locationToGrid(latestScan.location);

      // Calculate status
      const status = this.calculateStatus(latestScan.timestamp);

      workers.push({
        employeeId: employee.id,
        x,
        y,
        status,
        lastScan: latestScan.timestamp.toISOString(),
      });
    }

    return {
      workers,
      timestamp: new Date().toISOString(),
    };
  }
}

