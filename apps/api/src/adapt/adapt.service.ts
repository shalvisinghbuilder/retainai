import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AdaptType, AdaptStatus } from '@retainai/db';

interface EmployeeScanCount {
  employeeId: string;
  scanCount: number;
}

@Injectable()
export class AdaptService {
  constructor(private prisma: PrismaService) {}

  async runDailyAnalysis(): Promise<void> {
    // Get last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const now = new Date();

    // Group ScanEvent by employeeId and count scans
    const scanCounts = await this.prisma.scanEvent.groupBy({
      by: ['employeeId'],
      where: {
        timestamp: {
          gte: twentyFourHoursAgo,
          lte: now,
        },
      },
      _count: {
        id: true,
      },
    });

    if (scanCounts.length === 0) {
      return; // No scans in last 24 hours
    }

    // Convert to array and sort ascending
    const employeeCounts: EmployeeScanCount[] = scanCounts
      .map((sc) => ({
        employeeId: sc.employeeId,
        scanCount: sc._count.id,
      }))
      .sort((a, b) => a.scanCount - b.scanCount);

    // Calculate bottom 5% (minimum 1)
    const n = employeeCounts.length;
    const k = Math.max(1, Math.floor(n * 0.05));
    const cutoffIndex = k - 1; // 0-indexed
    const cutoffCount = employeeCounts[cutoffIndex]?.scanCount ?? 0;

    // Get bottom 5% employees
    const bottomEmployees = employeeCounts.slice(0, k);

    // Get today's date bucket (for de-duplication)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create AdaptRecords for bottom 5%
    for (const employee of bottomEmployees) {
      // Check if AdaptRecord already exists for this employee/type/date
      const existing = await this.prisma.adaptRecord.findFirst({
        where: {
          employeeId: employee.employeeId,
          type: AdaptType.PRODUCTIVITY,
          generatedAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      if (existing) {
        // Already exists, skip (de-duplication)
        continue;
      }

      // Create new AdaptRecord
      await this.prisma.adaptRecord.create({
        data: {
          employeeId: employee.employeeId,
          type: AdaptType.PRODUCTIVITY,
          status: AdaptStatus.PENDINGREVIEW,
          metricValue: employee.scanCount,
          metricThreshold: cutoffCount,
          generatedAt: new Date(),
        },
      });
    }
  }

  async getQueue() {
    const records = await this.prisma.adaptRecord.findMany({
      where: {
        status: AdaptStatus.PENDINGREVIEW,
      },
      orderBy: {
        generatedAt: 'desc',
      },
      include: {
        employee: {
          select: {
            id: true,
            badgeId: true,
          },
        },
      },
    });

    return {
      items: records.map((record) => ({
        id: record.id,
        employeeId: record.employeeId,
        employeeBadgeId: record.employee.badgeId,
        type: record.type,
        status: record.status,
        metricValue: record.metricValue,
        metricThreshold: record.metricThreshold,
        generatedAt: record.generatedAt.toISOString(),
        deliveredAt: record.deliveredAt?.toISOString() ?? null,
      })),
    };
  }

  async approve(id: string, managerNote?: string): Promise<void> {
    const record = await this.prisma.adaptRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new Error('AdaptRecord not found');
    }

    if (record.status !== AdaptStatus.PENDINGREVIEW) {
      throw new Error('AdaptRecord is not in PENDINGREVIEW status');
    }

    await this.prisma.adaptRecord.update({
      where: { id },
      data: {
        status: AdaptStatus.APPROVEDDELIVERED,
        deliveredAt: new Date(),
      },
    });
  }

  async override(id: string, exemptionReason: string): Promise<void> {
    const record = await this.prisma.adaptRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new Error('AdaptRecord not found');
    }

    if (record.status !== AdaptStatus.PENDINGREVIEW) {
      throw new Error('AdaptRecord is not in PENDINGREVIEW status');
    }

    await this.prisma.adaptRecord.update({
      where: { id },
      data: {
        status: AdaptStatus.EXEMPTED,
      },
    });
  }
}

