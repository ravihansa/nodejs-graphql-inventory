import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const fileTransport = new DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '14d',
    level: 'info',
});

const errorFileTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '30d',
    level: 'error',
});

const infoFormat = winston.format.printf(
    ({ level, message, timestamp, details }) => {
        return `${timestamp} [${level}]: ${message}: ${details}`;
    });

const errorFormat = winston.format.printf(
    ({ level, name, message, timestamp, code, details, stack }) => {
        return `${timestamp} [${level}]: ${code}: ${name}: ${message}: ${details}`;
    }
);

const logFormat = winston.format((info) => {
    if (info.level === 'error') {
        return errorFormat.transform(info);
    }
    return infoFormat.transform(info);
})();

const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat
    )
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        logFormat
    ),
    transports: [
        fileTransport,
        errorFileTransport,
        consoleTransport
    ],
});

export const logError = (name, message, code, details, stack) => {
    logger.error({
        timestamp: new Date().toISOString(),
        name,
        message,
        code,
        details,
        stack
    });
};

export const logInfo = (message, body) => {
    logger.info({
        timestamp: new Date().toISOString(),
        message,
        details: body
    });
};
