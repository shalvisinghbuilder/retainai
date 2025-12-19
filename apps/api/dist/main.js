/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/adapt/adapt.controller.ts":
/*!***************************************!*\
  !*** ./src/adapt/adapt.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdaptController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const adapt_service_1 = __webpack_require__(/*! ./adapt.service */ "./src/adapt/adapt.service.ts");
const approve_dto_1 = __webpack_require__(/*! ./dto/approve.dto */ "./src/adapt/dto/approve.dto.ts");
const override_dto_1 = __webpack_require__(/*! ./dto/override.dto */ "./src/adapt/dto/override.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
let AdaptController = class AdaptController {
    adaptService;
    constructor(adaptService) {
        this.adaptService = adaptService;
    }
    async getQueue() {
        return this.adaptService.getQueue();
    }
    async approve(id, dto) {
        try {
            await this.adaptService.approve(id, dto.managerNote);
            return { success: true };
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'AdaptRecord not found') {
                    throw new common_1.NotFoundException({
                        statusCode: 404,
                        errorCode: 'NOT_FOUND',
                        message: 'AdaptRecord not found',
                        timestamp: new Date().toISOString(),
                    });
                }
                if (error.message.includes('PENDINGREVIEW')) {
                    throw new common_1.BadRequestException({
                        statusCode: 400,
                        errorCode: 'VALIDATION_ERROR',
                        message: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
            }
            throw error;
        }
    }
    async override(id, dto) {
        try {
            await this.adaptService.override(id, dto.exemptionReason);
            return { success: true };
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'AdaptRecord not found') {
                    throw new common_1.NotFoundException({
                        statusCode: 404,
                        errorCode: 'NOT_FOUND',
                        message: 'AdaptRecord not found',
                        timestamp: new Date().toISOString(),
                    });
                }
                if (error.message.includes('PENDINGREVIEW')) {
                    throw new common_1.BadRequestException({
                        statusCode: 400,
                        errorCode: 'VALIDATION_ERROR',
                        message: error.message,
                        timestamp: new Date().toISOString(),
                    });
                }
            }
            throw error;
        }
    }
};
exports.AdaptController = AdaptController;
__decorate([
    (0, common_1.Get)('queue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdaptController.prototype, "getQueue", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof approve_dto_1.ApproveDto !== "undefined" && approve_dto_1.ApproveDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AdaptController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/override'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof override_dto_1.OverrideDto !== "undefined" && override_dto_1.OverrideDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AdaptController.prototype, "override", null);
exports.AdaptController = AdaptController = __decorate([
    (0, common_1.Controller)('adapt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(db_1.Role.MANAGER, db_1.Role.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof adapt_service_1.AdaptService !== "undefined" && adapt_service_1.AdaptService) === "function" ? _a : Object])
], AdaptController);


/***/ }),

/***/ "./src/adapt/adapt.module.ts":
/*!***********************************!*\
  !*** ./src/adapt/adapt.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdaptModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const adapt_controller_1 = __webpack_require__(/*! ./adapt.controller */ "./src/adapt/adapt.controller.ts");
const adapt_service_1 = __webpack_require__(/*! ./adapt.service */ "./src/adapt/adapt.service.ts");
const adapt_scheduler_1 = __webpack_require__(/*! ./adapt.scheduler */ "./src/adapt/adapt.scheduler.ts");
let AdaptModule = class AdaptModule {
};
exports.AdaptModule = AdaptModule;
exports.AdaptModule = AdaptModule = __decorate([
    (0, common_1.Module)({
        controllers: [adapt_controller_1.AdaptController],
        providers: [adapt_service_1.AdaptService, adapt_scheduler_1.AdaptScheduler],
    })
], AdaptModule);


/***/ }),

/***/ "./src/adapt/adapt.scheduler.ts":
/*!**************************************!*\
  !*** ./src/adapt/adapt.scheduler.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdaptScheduler = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const adapt_service_1 = __webpack_require__(/*! ./adapt.service */ "./src/adapt/adapt.service.ts");
let AdaptScheduler = class AdaptScheduler {
    adaptService;
    constructor(adaptService) {
        this.adaptService = adaptService;
    }
    async handleDailyAnalysis() {
        console.log('Running ADAPT daily analysis at 04:00...');
        try {
            await this.adaptService.runDailyAnalysis();
            console.log('ADAPT daily analysis completed successfully');
        }
        catch (error) {
            console.error('ADAPT daily analysis failed:', error);
        }
    }
};
exports.AdaptScheduler = AdaptScheduler;
__decorate([
    (0, schedule_1.Cron)('0 4 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdaptScheduler.prototype, "handleDailyAnalysis", null);
exports.AdaptScheduler = AdaptScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof adapt_service_1.AdaptService !== "undefined" && adapt_service_1.AdaptService) === "function" ? _a : Object])
], AdaptScheduler);


/***/ }),

/***/ "./src/adapt/adapt.service.ts":
/*!************************************!*\
  !*** ./src/adapt/adapt.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdaptService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
let AdaptService = class AdaptService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async runDailyAnalysis() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const now = new Date();
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
            return;
        }
        const employeeCounts = scanCounts
            .map((sc) => ({
            employeeId: sc.employeeId,
            scanCount: sc._count.id,
        }))
            .sort((a, b) => a.scanCount - b.scanCount);
        const n = employeeCounts.length;
        const k = Math.max(1, Math.floor(n * 0.05));
        const cutoffIndex = k - 1;
        const cutoffCount = employeeCounts[cutoffIndex]?.scanCount ?? 0;
        const bottomEmployees = employeeCounts.slice(0, k);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (const employee of bottomEmployees) {
            const existing = await this.prisma.adaptRecord.findFirst({
                where: {
                    employeeId: employee.employeeId,
                    type: db_1.AdaptType.PRODUCTIVITY,
                    generatedAt: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                },
            });
            if (existing) {
                continue;
            }
            await this.prisma.adaptRecord.create({
                data: {
                    employeeId: employee.employeeId,
                    type: db_1.AdaptType.PRODUCTIVITY,
                    status: db_1.AdaptStatus.PENDINGREVIEW,
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
                status: db_1.AdaptStatus.PENDINGREVIEW,
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
    async approve(id, managerNote) {
        const record = await this.prisma.adaptRecord.findUnique({
            where: { id },
        });
        if (!record) {
            throw new Error('AdaptRecord not found');
        }
        if (record.status !== db_1.AdaptStatus.PENDINGREVIEW) {
            throw new Error('AdaptRecord is not in PENDINGREVIEW status');
        }
        await this.prisma.adaptRecord.update({
            where: { id },
            data: {
                status: db_1.AdaptStatus.APPROVEDDELIVERED,
                deliveredAt: new Date(),
            },
        });
    }
    async override(id, exemptionReason) {
        const record = await this.prisma.adaptRecord.findUnique({
            where: { id },
        });
        if (!record) {
            throw new Error('AdaptRecord not found');
        }
        if (record.status !== db_1.AdaptStatus.PENDINGREVIEW) {
            throw new Error('AdaptRecord is not in PENDINGREVIEW status');
        }
        await this.prisma.adaptRecord.update({
            where: { id },
            data: {
                status: db_1.AdaptStatus.EXEMPTED,
            },
        });
    }
};
exports.AdaptService = AdaptService;
exports.AdaptService = AdaptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AdaptService);


/***/ }),

/***/ "./src/adapt/dto/approve.dto.ts":
/*!**************************************!*\
  !*** ./src/adapt/dto/approve.dto.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApproveDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class ApproveDto {
    managerNote;
}
exports.ApproveDto = ApproveDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApproveDto.prototype, "managerNote", void 0);


/***/ }),

/***/ "./src/adapt/dto/override.dto.ts":
/*!***************************************!*\
  !*** ./src/adapt/dto/override.dto.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OverrideDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class OverrideDto {
    exemptionReason;
}
exports.OverrideDto = OverrideDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OverrideDto.prototype, "exemptionReason", void 0);


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const health_module_1 = __webpack_require__(/*! ./health/health.module */ "./src/health/health.module.ts");
const database_module_1 = __webpack_require__(/*! ./database/database.module */ "./src/database/database.module.ts");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/auth/auth.module.ts");
const bot_module_1 = __webpack_require__(/*! ./bot/bot.module */ "./src/bot/bot.module.ts");
const candidates_module_1 = __webpack_require__(/*! ./candidates/candidates.module */ "./src/candidates/candidates.module.ts");
const events_module_1 = __webpack_require__(/*! ./events/events.module */ "./src/events/events.module.ts");
const adapt_module_1 = __webpack_require__(/*! ./adapt/adapt.module */ "./src/adapt/adapt.module.ts");
const map_module_1 = __webpack_require__(/*! ./map/map.module */ "./src/map/map.module.ts");
const sentiment_module_1 = __webpack_require__(/*! ./sentiment/sentiment.module */ "./src/sentiment/sentiment.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            bot_module_1.BotModule,
            candidates_module_1.CandidatesModule,
            events_module_1.EventsModule,
            adapt_module_1.AdaptModule,
            map_module_1.MapModule,
            sentiment_module_1.SentimentModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const login_dto_1 = __webpack_require__(/*! ./dto/login.dto */ "./src/auth/dto/login.dto.ts");
const refresh_dto_1 = __webpack_require__(/*! ./dto/refresh.dto */ "./src/auth/dto/refresh.dto.ts");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async refresh(refreshDto) {
        return this.authService.refresh(refreshDto.refreshToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof refresh_dto_1.RefreshDto !== "undefined" && refresh_dto_1.RefreshDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/auth/auth.controller.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/auth/strategies/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWTSECRET'),
                    signOptions: { expiresIn: '15m' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        const employee = await this.prisma.employee.findUnique({
            where: { badgeId: loginDto.badgeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException({
                statusCode: 404,
                errorCode: 'EMPLOYEE_NOT_FOUND',
                message: 'Employee with this badge ID not found',
                timestamp: new Date().toISOString(),
            });
        }
        const payload = {
            sub: employee.id,
            badgeId: employee.badgeId,
            role: employee.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWTSECRET') + '_refresh',
        });
        return {
            accessToken,
            refreshToken,
            employee: {
                id: employee.id,
                badgeId: employee.badgeId,
                role: employee.role,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const secret = this.configService.get('JWTSECRET') + '_refresh';
            const payload = this.jwtService.verify(refreshToken, { secret });
            const employee = await this.prisma.employee.findUnique({
                where: { id: payload.sub },
            });
            if (!employee) {
                throw new common_1.UnauthorizedException({
                    statusCode: 401,
                    errorCode: 'UNAUTHORIZED',
                    message: 'Invalid refresh token',
                    timestamp: new Date().toISOString(),
                });
            }
            const newPayload = {
                sub: employee.id,
                badgeId: employee.badgeId,
                role: employee.role,
            };
            const accessToken = this.jwtService.sign(newPayload, {
                expiresIn: '15m',
            });
            const newRefreshToken = this.jwtService.sign(newPayload, {
                expiresIn: '7d',
                secret,
            });
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                errorCode: 'UNAUTHORIZED',
                message: 'Invalid or expired refresh token',
                timestamp: new Date().toISOString(),
            });
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./src/auth/decorators/roles.decorator.ts":
/*!************************************************!*\
  !*** ./src/auth/decorators/roles.decorator.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/auth/dto/login.dto.ts":
/*!***********************************!*\
  !*** ./src/auth/dto/login.dto.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class LoginDto {
    badgeId;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "badgeId", void 0);


/***/ }),

/***/ "./src/auth/dto/refresh.dto.ts":
/*!*************************************!*\
  !*** ./src/auth/dto/refresh.dto.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class RefreshDto {
    refreshToken;
}
exports.RefreshDto = RefreshDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefreshDto.prototype, "refreshToken", void 0);


/***/ }),

/***/ "./src/auth/guards/jwt-auth.guard.ts":
/*!*******************************************!*\
  !*** ./src/auth/guards/jwt-auth.guard.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/auth/guards/roles.guard.ts":
/*!****************************************!*\
  !*** ./src/auth/guards/roles.guard.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException({
                statusCode: 403,
                errorCode: 'FORBIDDEN',
                message: 'Authentication required',
                timestamp: new Date().toISOString(),
            });
        }
        const hasRole = requiredRoles.some((role) => user.role === role);
        if (!hasRole) {
            throw new common_1.ForbiddenException({
                statusCode: 403,
                errorCode: 'FORBIDDEN',
                message: 'Insufficient permissions',
                timestamp: new Date().toISOString(),
            });
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./src/auth/strategies/jwt.strategy.ts":
/*!*********************************************!*\
  !*** ./src/auth/strategies/jwt.strategy.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_service_1 = __webpack_require__(/*! ../../database/prisma.service */ "./src/database/prisma.service.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    prisma;
    constructor(configService, prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWTSECRET'),
        });
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(payload) {
        const employee = await this.prisma.employee.findUnique({
            where: { id: payload.sub },
        });
        if (!employee) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                errorCode: 'UNAUTHORIZED',
                message: 'Employee not found',
                timestamp: new Date().toISOString(),
            });
        }
        return {
            id: employee.id,
            badgeId: employee.badgeId,
            role: employee.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/bot/bot.controller.ts":
/*!***********************************!*\
  !*** ./src/bot/bot.controller.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BotController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const bot_service_1 = __webpack_require__(/*! ./bot.service */ "./src/bot/bot.service.ts");
const twilio_signature_guard_1 = __webpack_require__(/*! ./guards/twilio-signature.guard */ "./src/bot/guards/twilio-signature.guard.ts");
let BotController = class BotController {
    botService;
    constructor(botService) {
        this.botService = botService;
    }
    async webhook(body, req, res) {
        const phone = body.From;
        const messageBody = body.Body || '';
        if (!phone) {
            return res.status(400).json({
                statusCode: 400,
                errorCode: 'VALIDATION_ERROR',
                message: 'Missing phone number',
                timestamp: new Date().toISOString(),
            });
        }
        const response = await this.botService.handleIncomingMessage(phone, messageBody);
        res.type('text/xml');
        return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${this.escapeXml(response)}</Message></Response>`);
    }
    escapeXml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
};
exports.BotController = BotController;
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.UseGuards)(twilio_signature_guard_1.TwilioSignatureGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "webhook", null);
exports.BotController = BotController = __decorate([
    (0, common_1.Controller)('api/bot'),
    __metadata("design:paramtypes", [typeof (_a = typeof bot_service_1.BotService !== "undefined" && bot_service_1.BotService) === "function" ? _a : Object])
], BotController);


/***/ }),

/***/ "./src/bot/bot.module.ts":
/*!*******************************!*\
  !*** ./src/bot/bot.module.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BotModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const bot_controller_1 = __webpack_require__(/*! ./bot.controller */ "./src/bot/bot.controller.ts");
const bot_service_1 = __webpack_require__(/*! ./bot.service */ "./src/bot/bot.service.ts");
const state_machine_service_1 = __webpack_require__(/*! ./services/state-machine.service */ "./src/bot/services/state-machine.service.ts");
const message_log_service_1 = __webpack_require__(/*! ./services/message-log.service */ "./src/bot/services/message-log.service.ts");
const nonce_service_1 = __webpack_require__(/*! ./services/nonce.service */ "./src/bot/services/nonce.service.ts");
let BotModule = class BotModule {
};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate([
    (0, common_1.Module)({
        controllers: [bot_controller_1.BotController],
        providers: [
            bot_service_1.BotService,
            state_machine_service_1.StateMachineService,
            message_log_service_1.MessageLogService,
            nonce_service_1.NonceService,
        ],
    })
], BotModule);


/***/ }),

/***/ "./src/bot/bot.service.ts":
/*!********************************!*\
  !*** ./src/bot/bot.service.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BotService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
const state_machine_service_1 = __webpack_require__(/*! ./services/state-machine.service */ "./src/bot/services/state-machine.service.ts");
const message_log_service_1 = __webpack_require__(/*! ./services/message-log.service */ "./src/bot/services/message-log.service.ts");
let BotService = class BotService {
    prisma;
    stateMachine;
    messageLog;
    constructor(prisma, stateMachine, messageLog) {
        this.prisma = prisma;
        this.stateMachine = stateMachine;
        this.messageLog = messageLog;
    }
    async handleIncomingMessage(phone, body) {
        const { response, newState } = await this.stateMachine.processMessage(phone, body);
        const candidate = await this.prisma.candidate.findUnique({
            where: { phone },
            include: { conversation: true },
        });
        if (candidate?.conversation) {
            const sessionId = candidate.conversation.id;
            await this.messageLog.logMessage(sessionId, 'INBOUND', body);
            await this.messageLog.logMessage(sessionId, 'OUTBOUND', response);
        }
        return response;
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof state_machine_service_1.StateMachineService !== "undefined" && state_machine_service_1.StateMachineService) === "function" ? _b : Object, typeof (_c = typeof message_log_service_1.MessageLogService !== "undefined" && message_log_service_1.MessageLogService) === "function" ? _c : Object])
], BotService);


/***/ }),

/***/ "./src/bot/guards/twilio-signature.guard.ts":
/*!**************************************************!*\
  !*** ./src/bot/guards/twilio-signature.guard.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TwilioSignatureGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const twilio_1 = __webpack_require__(/*! twilio */ "twilio");
let TwilioSignatureGuard = class TwilioSignatureGuard {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        const signature = request.headers['x-twilio-signature'];
        const url = this.getRequestUrl(request);
        if (!signature) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                errorCode: 'UNAUTHORIZED',
                message: 'Missing Twilio signature',
                timestamp: new Date().toISOString(),
            });
        }
        if (!authToken) {
            throw new common_1.ForbiddenException({
                statusCode: 403,
                errorCode: 'FORBIDDEN',
                message: 'Twilio configuration missing',
                timestamp: new Date().toISOString(),
            });
        }
        const params = request.body || {};
        try {
            const isValid = (0, twilio_1.validateRequest)(authToken, signature, url, params);
            if (!isValid) {
                throw new common_1.ForbiddenException({
                    statusCode: 403,
                    errorCode: 'FORBIDDEN',
                    message: 'Invalid Twilio signature',
                    timestamp: new Date().toISOString(),
                });
            }
            return true;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.ForbiddenException({
                statusCode: 403,
                errorCode: 'FORBIDDEN',
                message: 'Twilio signature validation failed',
                timestamp: new Date().toISOString(),
            });
        }
    }
    getRequestUrl(request) {
        const protocol = request.protocol || 'http';
        const host = request.get('host');
        const originalUrl = request.originalUrl || request.url;
        return `${protocol}://${host}${originalUrl}`;
    }
};
exports.TwilioSignatureGuard = TwilioSignatureGuard;
exports.TwilioSignatureGuard = TwilioSignatureGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], TwilioSignatureGuard);


/***/ }),

/***/ "./src/bot/services/message-log.service.ts":
/*!*************************************************!*\
  !*** ./src/bot/services/message-log.service.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageLogService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../database/prisma.service */ "./src/database/prisma.service.ts");
let MessageLogService = class MessageLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logMessage(sessionId, direction, content) {
        await this.prisma.messageLog.create({
            data: {
                sessionId,
                direction,
                content,
                timestamp: new Date(),
            },
        });
    }
};
exports.MessageLogService = MessageLogService;
exports.MessageLogService = MessageLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MessageLogService);


/***/ }),

/***/ "./src/bot/services/nonce.service.ts":
/*!*******************************************!*\
  !*** ./src/bot/services/nonce.service.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonceService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
let NonceService = class NonceService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    generateVJTNonce(candidateId) {
        const secret = this.configService.get('JWTSECRET');
        if (!secret) {
            throw new Error('JWTSECRET is not configured');
        }
        const payload = {
            candidateId,
            type: 'vjt',
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        };
        return (0, jsonwebtoken_1.sign)(payload, secret);
    }
};
exports.NonceService = NonceService;
exports.NonceService = NonceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], NonceService);


/***/ }),

/***/ "./src/bot/services/state-machine.service.ts":
/*!***************************************************!*\
  !*** ./src/bot/services/state-machine.service.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StateMachineService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_service_1 = __webpack_require__(/*! ../../database/prisma.service */ "./src/database/prisma.service.ts");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
const nonce_service_1 = __webpack_require__(/*! ./nonce.service */ "./src/bot/services/nonce.service.ts");
let StateMachineService = class StateMachineService {
    prisma;
    configService;
    nonceService;
    YES_ALIASES = ['Y', 'YES', 'YEP', 'OK', 'SURE'];
    NO_ALIASES = ['N', 'NO', 'NOPE'];
    constructor(prisma, configService, nonceService) {
        this.prisma = prisma;
        this.configService = configService;
        this.nonceService = nonceService;
    }
    normalizeInput(input) {
        return input.trim().toUpperCase();
    }
    isYes(input) {
        const normalized = this.normalizeInput(input);
        return this.YES_ALIASES.includes(normalized);
    }
    isNo(input) {
        const normalized = this.normalizeInput(input);
        return this.NO_ALIASES.includes(normalized);
    }
    async processMessage(phone, body) {
        let candidate = await this.prisma.candidate.findUnique({
            where: { phone },
            include: { conversation: true },
        });
        if (!candidate) {
            candidate = await this.prisma.candidate.create({
                data: {
                    phone,
                    status: db_1.CandidateStatus.NEW,
                    conversation: {
                        create: {
                            currentState: 'GREETING',
                        },
                    },
                },
                include: { conversation: true },
            });
        }
        let session = candidate.conversation;
        if (!session) {
            session = await this.prisma.conversationSession.create({
                data: {
                    candidateId: candidate.id,
                    currentState: 'GREETING',
                },
            });
        }
        const currentState = session.currentState;
        const normalizedBody = body.trim();
        switch (currentState) {
            case 'GREETING':
                return this.handleGreeting(candidate.id, normalizedBody);
            case 'AWAITING_NAME':
                return this.handleName(candidate.id, normalizedBody);
            case 'AWAITING_AGE_CONFIRM':
                return this.handleAgeConfirm(candidate.id, normalizedBody);
            case 'AWAITING_LIFT_CONFIRM':
                return this.handleLiftConfirm(candidate.id, normalizedBody);
            case 'VJT_LINK_SENT':
                return this.handleVJTLinkSent(candidate.id);
            case 'REJECTED':
                return this.handleRejected();
            default:
                return {
                    response: 'Hello! Thank you for your interest. What is your full legal name?',
                    newState: 'AWAITING_NAME',
                };
        }
    }
    async handleGreeting(candidateId, body) {
        await this.updateCandidateStatus(candidateId, db_1.CandidateStatus.SCREENING);
        await this.updateSessionState(candidateId, 'AWAITING_NAME');
        return {
            response: 'Hello! Thank you for your interest. What is your full legal name?',
            newState: 'AWAITING_NAME',
        };
    }
    async handleName(candidateId, body) {
        if (!body || body.length === 0) {
            return {
                response: 'Please provide your full legal name.',
                newState: 'AWAITING_NAME',
            };
        }
        await this.prisma.candidate.update({
            where: { id: candidateId },
            data: { name: body },
        });
        await this.updateSessionState(candidateId, 'AWAITING_AGE_CONFIRM');
        return {
            response: 'Are you 18 years or older? Please reply YES or NO.',
            newState: 'AWAITING_AGE_CONFIRM',
        };
    }
    async handleAgeConfirm(candidateId, body) {
        if (this.isYes(body)) {
            await this.updateSessionState(candidateId, 'AWAITING_LIFT_CONFIRM');
            return {
                response: 'Can you lift 50lbs repeatedly? Please reply YES or NO.',
                newState: 'AWAITING_LIFT_CONFIRM',
            };
        }
        else if (this.isNo(body)) {
            await this.updateCandidateStatus(candidateId, db_1.CandidateStatus.REJECTEDCOOLDOWN);
            await this.updateSessionState(candidateId, 'REJECTED');
            return {
                response: 'Thank you for your interest. Unfortunately, you must be 18 or older to apply.',
                newState: 'REJECTED',
            };
        }
        else {
            return {
                response: 'Please reply YES or NO. Are you 18 years or older?',
                newState: 'AWAITING_AGE_CONFIRM',
            };
        }
    }
    async handleLiftConfirm(candidateId, body) {
        if (this.isYes(body)) {
            await this.updateCandidateStatus(candidateId, db_1.CandidateStatus.VJTPENDING);
            await this.updateSessionState(candidateId, 'VJT_LINK_SENT');
            const vjtLink = this.generateVJTLink(candidateId);
            return {
                response: `Great! Please complete this assessment: ${vjtLink}`,
                newState: 'VJT_LINK_SENT',
            };
        }
        else if (this.isNo(body)) {
            await this.updateCandidateStatus(candidateId, db_1.CandidateStatus.REJECTEDCOOLDOWN);
            await this.updateSessionState(candidateId, 'REJECTED');
            return {
                response: 'Thank you for your interest. Unfortunately, this role requires the ability to lift 50lbs repeatedly.',
                newState: 'REJECTED',
            };
        }
        else {
            return {
                response: 'Please reply YES or NO. Can you lift 50lbs repeatedly?',
                newState: 'AWAITING_LIFT_CONFIRM',
            };
        }
    }
    async handleVJTLinkSent(candidateId) {
        const vjtLink = this.generateVJTLink(candidateId);
        return {
            response: `Here's your assessment link again: ${vjtLink}`,
            newState: 'VJT_LINK_SENT',
        };
    }
    handleRejected() {
        return {
            response: 'Thank you for your interest. Unfortunately, you do not meet the requirements at this time.',
            newState: 'REJECTED',
        };
    }
    generateVJTLink(candidateId) {
        const baseUrl = this.configService.get('VJT_BASE_URL', 'http://localhost:3001');
        const nonce = this.nonceService.generateVJTNonce(candidateId);
        return `${baseUrl}?candidate=${candidateId}&nonce=${nonce}`;
    }
    async updateCandidateStatus(candidateId, status) {
        await this.prisma.candidate.update({
            where: { id: candidateId },
            data: { status },
        });
    }
    async updateSessionState(candidateId, state) {
        await this.prisma.conversationSession.upsert({
            where: { candidateId },
            update: { currentState: state },
            create: {
                candidateId,
                currentState: state,
            },
        });
    }
};
exports.StateMachineService = StateMachineService;
exports.StateMachineService = StateMachineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof nonce_service_1.NonceService !== "undefined" && nonce_service_1.NonceService) === "function" ? _c : Object])
], StateMachineService);


/***/ }),

/***/ "./src/candidates/candidates.controller.ts":
/*!*************************************************!*\
  !*** ./src/candidates/candidates.controller.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CandidatesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const candidates_service_1 = __webpack_require__(/*! ./candidates.service */ "./src/candidates/candidates.service.ts");
const vjt_submit_dto_1 = __webpack_require__(/*! ./dto/vjt-submit.dto */ "./src/candidates/dto/vjt-submit.dto.ts");
let CandidatesController = class CandidatesController {
    candidatesService;
    constructor(candidatesService) {
        this.candidatesService = candidatesService;
    }
    async submitVJT(dto) {
        return this.candidatesService.submitVJT(dto);
    }
};
exports.CandidatesController = CandidatesController;
__decorate([
    (0, common_1.Post)('vjt/submit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof vjt_submit_dto_1.VjtSubmitDto !== "undefined" && vjt_submit_dto_1.VjtSubmitDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "submitVJT", null);
exports.CandidatesController = CandidatesController = __decorate([
    (0, common_1.Controller)('candidates'),
    __metadata("design:paramtypes", [typeof (_a = typeof candidates_service_1.CandidatesService !== "undefined" && candidates_service_1.CandidatesService) === "function" ? _a : Object])
], CandidatesController);


/***/ }),

/***/ "./src/candidates/candidates.module.ts":
/*!*********************************************!*\
  !*** ./src/candidates/candidates.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CandidatesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const candidates_controller_1 = __webpack_require__(/*! ./candidates.controller */ "./src/candidates/candidates.controller.ts");
const candidates_service_1 = __webpack_require__(/*! ./candidates.service */ "./src/candidates/candidates.service.ts");
const nonce_validation_service_1 = __webpack_require__(/*! ./services/nonce-validation.service */ "./src/candidates/services/nonce-validation.service.ts");
let CandidatesModule = class CandidatesModule {
};
exports.CandidatesModule = CandidatesModule;
exports.CandidatesModule = CandidatesModule = __decorate([
    (0, common_1.Module)({
        controllers: [candidates_controller_1.CandidatesController],
        providers: [candidates_service_1.CandidatesService, nonce_validation_service_1.NonceValidationService],
    })
], CandidatesModule);


/***/ }),

/***/ "./src/candidates/candidates.service.ts":
/*!**********************************************!*\
  !*** ./src/candidates/candidates.service.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CandidatesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
const nonce_validation_service_1 = __webpack_require__(/*! ./services/nonce-validation.service */ "./src/candidates/services/nonce-validation.service.ts");
let CandidatesService = class CandidatesService {
    prisma;
    nonceValidation;
    PASS_THRESHOLD = 600;
    constructor(prisma, nonceValidation) {
        this.prisma = prisma;
        this.nonceValidation = nonceValidation;
    }
    async submitVJT(dto) {
        this.nonceValidation.validateVJTNonce(dto.nonce, dto.candidateId);
        const candidate = await this.prisma.candidate.findUnique({
            where: { id: dto.candidateId },
        });
        if (!candidate) {
            throw new common_1.NotFoundException({
                statusCode: 404,
                errorCode: 'NOT_FOUND',
                message: 'Candidate not found',
                timestamp: new Date().toISOString(),
            });
        }
        if (candidate.coolDownUntil && candidate.coolDownUntil > new Date()) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                errorCode: 'VALIDATION_ERROR',
                message: `Candidate is in cooldown until ${candidate.coolDownUntil.toISOString()}`,
                timestamp: new Date().toISOString(),
            });
        }
        if (candidate.status !== db_1.CandidateStatus.VJTPENDING) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                errorCode: 'VALIDATION_ERROR',
                message: `Candidate status must be VJTPENDING, current: ${candidate.status}`,
                timestamp: new Date().toISOString(),
            });
        }
        const passed = dto.skillScore >= this.PASS_THRESHOLD;
        const newStatus = passed
            ? db_1.CandidateStatus.VJTPASSED
            : db_1.CandidateStatus.VJTFAILED;
        const coolDownUntil = passed
            ? null
            : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        await this.prisma.candidate.update({
            where: { id: dto.candidateId },
            data: {
                status: newStatus,
                coolDownUntil,
            },
        });
        await this.prisma.assessmentResult.upsert({
            where: { candidateId: dto.candidateId },
            update: {
                skillScore: dto.skillScore,
                passed,
                completedAt: new Date(),
            },
            create: {
                candidateId: dto.candidateId,
                skillScore: dto.skillScore,
                passed,
                completedAt: new Date(),
            },
        });
        return {
            passed,
            candidateStatus: newStatus,
            coolDownUntil,
        };
    }
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof nonce_validation_service_1.NonceValidationService !== "undefined" && nonce_validation_service_1.NonceValidationService) === "function" ? _b : Object])
], CandidatesService);


/***/ }),

/***/ "./src/candidates/dto/vjt-submit.dto.ts":
/*!**********************************************!*\
  !*** ./src/candidates/dto/vjt-submit.dto.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VjtSubmitDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class MetaDto {
    clientVersion;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MetaDto.prototype, "clientVersion", void 0);
class VjtSubmitDto {
    candidateId;
    nonce;
    skillScore;
    meta;
}
exports.VjtSubmitDto = VjtSubmitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VjtSubmitDto.prototype, "candidateId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VjtSubmitDto.prototype, "nonce", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], VjtSubmitDto.prototype, "skillScore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MetaDto),
    __metadata("design:type", MetaDto)
], VjtSubmitDto.prototype, "meta", void 0);


/***/ }),

/***/ "./src/candidates/services/nonce-validation.service.ts":
/*!*************************************************************!*\
  !*** ./src/candidates/services/nonce-validation.service.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonceValidationService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
let NonceValidationService = class NonceValidationService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    validateVJTNonce(nonce, candidateId) {
        const secret = this.configService.get('JWTSECRET');
        if (!secret) {
            throw new Error('JWTSECRET is not configured');
        }
        try {
            const decoded = (0, jsonwebtoken_1.verify)(nonce, secret);
            if (decoded.type !== 'vjt') {
                throw new common_1.UnauthorizedException({
                    statusCode: 401,
                    errorCode: 'UNAUTHORIZED',
                    message: 'Invalid nonce type',
                    timestamp: new Date().toISOString(),
                });
            }
            if (decoded.candidateId !== candidateId) {
                throw new common_1.UnauthorizedException({
                    statusCode: 401,
                    errorCode: 'UNAUTHORIZED',
                    message: 'Nonce does not match candidate',
                    timestamp: new Date().toISOString(),
                });
            }
            return true;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                errorCode: 'UNAUTHORIZED',
                message: 'Invalid or expired nonce',
                timestamp: new Date().toISOString(),
            });
        }
    }
};
exports.NonceValidationService = NonceValidationService;
exports.NonceValidationService = NonceValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], NonceValidationService);


/***/ }),

/***/ "./src/common/filters/http-exception.filter.ts":
/*!*****************************************************!*\
  !*** ./src/common/filters/http-exception.filter.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let statusCode;
        let errorCode;
        let message;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                errorCode = exceptionResponse.errorCode || 'HTTP_EXCEPTION';
                message = exceptionResponse.message || exception.message;
            }
            else {
                errorCode = 'HTTP_EXCEPTION';
                message = String(exceptionResponse);
            }
        }
        else {
            statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            errorCode = 'INTERNAL_ERROR';
            message = 'An unexpected error occurred';
        }
        const errorResponse = {
            statusCode,
            errorCode,
            message,
            timestamp: new Date().toISOString(),
        };
        response.status(statusCode).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);


/***/ }),

/***/ "./src/database/database.module.ts":
/*!*****************************************!*\
  !*** ./src/database/database.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/database/prisma.service.ts");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], DatabaseModule);


/***/ }),

/***/ "./src/database/prisma.service.ts":
/*!****************************************!*\
  !*** ./src/database/prisma.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
let PrismaService = class PrismaService extends db_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),

/***/ "./src/events/dto/batch-events.dto.ts":
/*!********************************************!*\
  !*** ./src/events/dto/batch-events.dto.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BatchEventsDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const scan_event_dto_1 = __webpack_require__(/*! ./scan-event.dto */ "./src/events/dto/scan-event.dto.ts");
class BatchEventsDto {
    events;
}
exports.BatchEventsDto = BatchEventsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => scan_event_dto_1.ScanEventDto),
    __metadata("design:type", Array)
], BatchEventsDto.prototype, "events", void 0);


/***/ }),

/***/ "./src/events/dto/scan-event.dto.ts":
/*!******************************************!*\
  !*** ./src/events/dto/scan-event.dto.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScanEventDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
class ScanEventDto {
    eventId;
    employeeId;
    barcode;
    location;
    actionType;
    timestamp;
    expectedSeconds;
    actualSeconds;
    isError;
    errorCode;
}
exports.ScanEventDto = ScanEventDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScanEventDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScanEventDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScanEventDto.prototype, "barcode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScanEventDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(db_1.ScanType),
    __metadata("design:type", typeof (_a = typeof db_1.ScanType !== "undefined" && db_1.ScanType) === "function" ? _a : Object)
], ScanEventDto.prototype, "actionType", void 0);
__decorate([
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScanEventDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ScanEventDto.prototype, "expectedSeconds", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ScanEventDto.prototype, "actualSeconds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ScanEventDto.prototype, "isError", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScanEventDto.prototype, "errorCode", void 0);


/***/ }),

/***/ "./src/events/events.controller.ts":
/*!*****************************************!*\
  !*** ./src/events/events.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const events_service_1 = __webpack_require__(/*! ./events.service */ "./src/events/events.service.ts");
const batch_events_dto_1 = __webpack_require__(/*! ./dto/batch-events.dto */ "./src/events/dto/batch-events.dto.ts");
const scan_event_dto_1 = __webpack_require__(/*! ./dto/scan-event.dto */ "./src/events/dto/scan-event.dto.ts");
let EventsController = class EventsController {
    eventsService;
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async batch(dto, res) {
        const result = await this.eventsService.processBatch(dto.events);
        if (result.failed > 0 && result.synced > 0) {
            return res.status(common_1.HttpStatus.PARTIAL_CONTENT).json({
                synced: result.synced,
                failed: result.failed,
                errors: result.errors,
            });
        }
        if (result.failed > 0 && result.synced === 0) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                synced: result.synced,
                failed: result.failed,
                errors: result.errors,
            });
        }
        return res.status(common_1.HttpStatus.OK).json({
            synced: result.synced,
            failed: 0,
            errors: [],
        });
    }
    async scan(dto) {
        const result = await this.eventsService.processSingleScan(dto);
        return result;
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof batch_events_dto_1.BatchEventsDto !== "undefined" && batch_events_dto_1.BatchEventsDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "batch", null);
__decorate([
    (0, common_1.Post)('scan'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof scan_event_dto_1.ScanEventDto !== "undefined" && scan_event_dto_1.ScanEventDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "scan", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [typeof (_a = typeof events_service_1.EventsService !== "undefined" && events_service_1.EventsService) === "function" ? _a : Object])
], EventsController);


/***/ }),

/***/ "./src/events/events.module.ts":
/*!*************************************!*\
  !*** ./src/events/events.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const events_controller_1 = __webpack_require__(/*! ./events.controller */ "./src/events/events.controller.ts");
const events_service_1 = __webpack_require__(/*! ./events.service */ "./src/events/events.service.ts");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        controllers: [events_controller_1.EventsController],
        providers: [events_service_1.EventsService],
    })
], EventsModule);


/***/ }),

/***/ "./src/events/events.service.ts":
/*!**************************************!*\
  !*** ./src/events/events.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
let EventsService = class EventsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processBatch(events) {
        const results = [];
        for (const event of events) {
            try {
                await this.processSingleEvent(event);
                results.push({ eventId: event.eventId, success: true });
            }
            catch (error) {
                results.push({
                    eventId: event.eventId,
                    success: false,
                    error: {
                        reason: 'VALIDATION_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        }
        const synced = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        const errors = results
            .filter((r) => !r.success)
            .map((r) => ({
            eventId: r.eventId,
            reason: r.error.reason,
            message: r.error.message,
        }));
        return { synced, failed, errors };
    }
    async processSingleEvent(event) {
        const existing = await this.prisma.scanEvent.findUnique({
            where: { id: event.eventId },
        });
        if (existing) {
            return;
        }
        const employee = await this.prisma.employee.findUnique({
            where: { id: event.employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${event.employeeId} not found`);
        }
        const timestamp = new Date(event.timestamp);
        if (isNaN(timestamp.getTime())) {
            throw new common_1.BadRequestException('Invalid timestamp format');
        }
        await this.prisma.scanEvent.create({
            data: {
                id: event.eventId,
                employeeId: event.employeeId,
                barcode: event.barcode,
                location: event.location,
                actionType: event.actionType,
                timestamp,
                expectedSeconds: event.expectedSeconds,
                actualSeconds: event.actualSeconds ?? null,
                isError: event.isError ?? false,
                errorCode: event.errorCode ?? null,
            },
        });
    }
    async processSingleScan(event) {
        try {
            await this.processSingleEvent(event);
            return { success: true };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], EventsService);


/***/ }),

/***/ "./src/health/health.controller.ts":
/*!*****************************************!*\
  !*** ./src/health/health.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
let HealthController = class HealthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async health() {
        let dbStatus = 'ok';
        try {
            await this.prisma.$queryRaw `SELECT 1`;
        }
        catch (error) {
            dbStatus = 'error';
        }
        return {
            status: dbStatus === 'ok' ? 'ok' : 'degraded',
            database: dbStatus,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "health", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], HealthController);


/***/ }),

/***/ "./src/health/health.module.ts":
/*!*************************************!*\
  !*** ./src/health/health.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const health_controller_1 = __webpack_require__(/*! ./health.controller */ "./src/health/health.controller.ts");
const database_module_1 = __webpack_require__(/*! ../database/database.module */ "./src/database/database.module.ts");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [health_controller_1.HealthController],
    })
], HealthModule);


/***/ }),

/***/ "./src/map/map.controller.ts":
/*!***********************************!*\
  !*** ./src/map/map.controller.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const map_service_1 = __webpack_require__(/*! ./map.service */ "./src/map/map.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
let MapController = class MapController {
    mapService;
    constructor(mapService) {
        this.mapService = mapService;
    }
    async getFloorState() {
        return this.mapService.getFloorState();
    }
};
exports.MapController = MapController;
__decorate([
    (0, common_1.Get)('floor-state'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getFloorState", null);
exports.MapController = MapController = __decorate([
    (0, common_1.Controller)('map'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(db_1.Role.MANAGER, db_1.Role.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof map_service_1.MapService !== "undefined" && map_service_1.MapService) === "function" ? _a : Object])
], MapController);


/***/ }),

/***/ "./src/map/map.module.ts":
/*!*******************************!*\
  !*** ./src/map/map.module.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const map_controller_1 = __webpack_require__(/*! ./map.controller */ "./src/map/map.controller.ts");
const map_service_1 = __webpack_require__(/*! ./map.service */ "./src/map/map.service.ts");
let MapModule = class MapModule {
};
exports.MapModule = MapModule;
exports.MapModule = MapModule = __decorate([
    (0, common_1.Module)({
        controllers: [map_controller_1.MapController],
        providers: [map_service_1.MapService],
    })
], MapModule);


/***/ }),

/***/ "./src/map/map.service.ts":
/*!********************************!*\
  !*** ./src/map/map.service.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
const crypto = __webpack_require__(/*! crypto */ "crypto");
let MapService = class MapService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    locationToGrid(location) {
        const hash = crypto.createHash('md5').update(location).digest('hex');
        const x = parseInt(hash.substring(0, 4), 16) % 100;
        const y = parseInt(hash.substring(4, 8), 16) % 100;
        return { x, y };
    }
    calculateStatus(lastScanTime) {
        const now = new Date();
        const minutesSinceLastScan = (now.getTime() - lastScanTime.getTime()) / (1000 * 60);
        if (minutesSinceLastScan < 2) {
            return 'active';
        }
        else if (minutesSinceLastScan < 15) {
            return 'idle';
        }
        else {
            return 'offline';
        }
    }
    async getFloorState() {
        const employees = await this.prisma.employee.findMany({
            where: {
                role: {
                    in: ['ASSOCIATE', 'MANAGER', 'ADMIN'],
                },
            },
        });
        const workers = [];
        for (const employee of employees) {
            const latestScan = await this.prisma.scanEvent.findFirst({
                where: {
                    employeeId: employee.id,
                },
                orderBy: {
                    timestamp: 'desc',
                },
            });
            if (!latestScan) {
                workers.push({
                    employeeId: employee.id,
                    x: 0,
                    y: 0,
                    status: 'offline',
                    lastScan: new Date(0).toISOString(),
                });
                continue;
            }
            const { x, y } = this.locationToGrid(latestScan.location);
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
};
exports.MapService = MapService;
exports.MapService = MapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MapService);


/***/ }),

/***/ "./src/sentiment/dto/sentiment-submit.dto.ts":
/*!***************************************************!*\
  !*** ./src/sentiment/dto/sentiment-submit.dto.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SentimentSubmitDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class SentimentSubmitDto {
    questionId;
    score;
    respondedAt;
}
exports.SentimentSubmitDto = SentimentSubmitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SentimentSubmitDto.prototype, "questionId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SentimentSubmitDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SentimentSubmitDto.prototype, "respondedAt", void 0);


/***/ }),

/***/ "./src/sentiment/sentiment.controller.ts":
/*!***********************************************!*\
  !*** ./src/sentiment/sentiment.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SentimentController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const sentiment_service_1 = __webpack_require__(/*! ./sentiment.service */ "./src/sentiment/sentiment.service.ts");
const sentiment_submit_dto_1 = __webpack_require__(/*! ./dto/sentiment-submit.dto */ "./src/sentiment/dto/sentiment-submit.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
const db_1 = __webpack_require__(/*! @retainai/db */ "@retainai/db");
let SentimentController = class SentimentController {
    sentimentService;
    constructor(sentimentService) {
        this.sentimentService = sentimentService;
    }
    async submitSentiment(req, sentimentDto) {
        const employeeId = req.user.id;
        const result = await this.sentimentService.submitSentiment(employeeId, sentimentDto);
        return result;
    }
};
exports.SentimentController = SentimentController;
__decorate([
    (0, common_1.Post)('submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof sentiment_submit_dto_1.SentimentSubmitDto !== "undefined" && sentiment_submit_dto_1.SentimentSubmitDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SentimentController.prototype, "submitSentiment", null);
exports.SentimentController = SentimentController = __decorate([
    (0, common_1.Controller)('sentiment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(db_1.Role.ASSOCIATE, db_1.Role.MANAGER, db_1.Role.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof sentiment_service_1.SentimentService !== "undefined" && sentiment_service_1.SentimentService) === "function" ? _a : Object])
], SentimentController);


/***/ }),

/***/ "./src/sentiment/sentiment.module.ts":
/*!*******************************************!*\
  !*** ./src/sentiment/sentiment.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SentimentModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const sentiment_controller_1 = __webpack_require__(/*! ./sentiment.controller */ "./src/sentiment/sentiment.controller.ts");
const sentiment_service_1 = __webpack_require__(/*! ./sentiment.service */ "./src/sentiment/sentiment.service.ts");
let SentimentModule = class SentimentModule {
};
exports.SentimentModule = SentimentModule;
exports.SentimentModule = SentimentModule = __decorate([
    (0, common_1.Module)({
        controllers: [sentiment_controller_1.SentimentController],
        providers: [sentiment_service_1.SentimentService],
    })
], SentimentModule);


/***/ }),

/***/ "./src/sentiment/sentiment.service.ts":
/*!********************************************!*\
  !*** ./src/sentiment/sentiment.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SentimentService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../database/prisma.service */ "./src/database/prisma.service.ts");
let SentimentService = class SentimentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitSentiment(employeeId, sentimentDto) {
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException({
                statusCode: 404,
                errorCode: 'EMPLOYEE_NOT_FOUND',
                message: 'Employee not found',
                timestamp: new Date().toISOString(),
            });
        }
        const respondedAt = new Date(sentimentDto.respondedAt);
        const dateStart = new Date(Date.UTC(respondedAt.getUTCFullYear(), respondedAt.getUTCMonth(), respondedAt.getUTCDate()));
        const dateEnd = new Date(dateStart);
        dateEnd.setUTCDate(dateEnd.getUTCDate() + 1);
        const existing = await this.prisma.sentimentResponse.findFirst({
            where: {
                employeeId,
                questionId: sentimentDto.questionId,
                respondedAt: {
                    gte: dateStart,
                    lt: dateEnd,
                },
            },
        });
        if (existing) {
            return {
                id: existing.id,
                message: 'Sentiment already submitted for today',
            };
        }
        const sentimentResponse = await this.prisma.sentimentResponse.create({
            data: {
                employeeId,
                questionId: sentimentDto.questionId,
                score: sentimentDto.score,
                respondedAt: respondedAt,
            },
        });
        return {
            id: sentimentResponse.id,
            message: 'Sentiment submitted successfully',
        };
    }
};
exports.SentimentService = SentimentService;
exports.SentimentService = SentimentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SentimentService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@retainai/db":
/*!*******************************!*\
  !*** external "@retainai/db" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@retainai/db");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "twilio":
/*!*************************!*\
  !*** external "twilio" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("twilio");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const http_exception_filter_1 = __webpack_require__(/*! ./common/filters/http-exception.filter */ "./src/common/filters/http-exception.filter.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 RetainAI API running on http://0.0.0.0:${port}`);
    console.log(`📱 Accessible from network at http://192.168.1.152:${port}`);
}
bootstrap();

})();

/******/ })()
;