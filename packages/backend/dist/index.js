"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const express_winston_1 = __importDefault(require("express-winston"));
const auth_1 = __importDefault(require("./routes/auth"));
const services_1 = __importDefault(require("./routes/services"));
const orders_1 = __importDefault(require("./routes/orders"));
const logger_1 = require("./utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
const metrics_1 = require("./utils/metrics");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_winston_1.default.logger({
        winstonInstance: logger_1.logger,
        msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        meta: true,
    }));
    app.use((req, res, next) => {
        const end = metrics_1.httpRequestDuration.startTimer();
        res.on('finish', () => {
            var _a;
            end({ method: req.method, route: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path, code: res.statusCode });
        });
        next();
    });
    app.use('/auth', auth_1.default);
    app.use('/services', services_1.default);
    app.use('/orders', orders_1.default);
    app.get('/healthz', (_, res) => res.json({ status: 'ok' }));
    app.get('/readyz', (_, res) => {
        const ready = mongoose_1.default.connection.readyState === 1;
        const status = ready ? 200 : 500;
        res.status(status).json({ ready });
    });
    app.get('/metrics', async (_, res) => {
        res.set('Content-Type', metrics_1.register.contentType);
        res.end(await metrics_1.register.metrics());
    });
    app.use(express_winston_1.default.errorLogger({ winstonInstance: logger_1.logger }));
    app.use((err, _req, res, _next) => {
        res.status(500).json({ message: err.message });
    });
    return app;
}
if (require.main === module) {
    const port = process.env.PORT || 4000;
    createApp().listen(port, () => {
        logger_1.logger.info(`API listening on port ${port}`);
    });
}
