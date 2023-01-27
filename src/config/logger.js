const winston = require("winston");
require("winston-daily-rotate-file");

var transport = new winston.transports.DailyRotateFile({
  dirname: "logs",
  filename: "logger-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

transport.on("rotate", function(oldFilename, newFilename) {
  // do something fun
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) =>
      JSON.stringify({
        t: info.timestamp,
        l: info.level,
        m: info.message,
        s: info.splat !== undefined ? `${info.splat}` : '',
      }) + ','
    )
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    // new winston.transports.File({
    //   filename: 'error.log',
    //   level: 'error'
    // }),
    // new winston.transports.File({
    //   filename: 'combined.log'
    // }),
    transport,
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

let logError = (errorLog) => {
  if (errorLog instanceof Error) {
    logger.error({
      level: "error",
      message: `${errorLog.stack || errorLog}`,
    });
  } else {
    logger.log({
      level: "error",
      message: errorLog,
    });
  }
};

let logWarning = (errorLog) => {
  if (errorLog instanceof Error) {
    logger.error({
      level: "warn",
      message: `${errorLog.stack || errorLog}`,
    });
  } else {
    logger.log({
      level: "warn",
      message: errorLog,
    });
  }
};

let logInfo = (errorLog) => {
  if (errorLog instanceof Error) {
    logger.error({
      level: "info",
      message: `${errorLog.stack || errorLog}`,
    });
  } else {
    logger.log({
      level: "info",
      message: errorLog,
    });
  }
};


let logAgendaJob = (errorLog) => {

  let todayDate = new Date().toLocaleString();
  if (errorLog instanceof Error) {
    logger.error({
      level: "info",
      message: 'AGENDA_JOB :' + todayDate + `${errorLog.stack || errorLog}`,
    });
  } else {
    logger.log({
      level: "info",
      message: 'AGENDA_JOB :' + todayDate + errorLog,
    });
  }
};



let logDebug = (errorLog, userId) => {
  if (!userId) {
    userId = "UNKNOWNUSER";
  }
  if (errorLog instanceof Error) {
    logger.error({
      level: "error",
      message: userId + "-" + `${errorLog.stack || errorLog}`,
    });
  } else {
    logger.log({
      level: "error",
      message: userId + "-" + errorLog,
    });
  }
};

module.exports = {
  logger,
  logError,
  logWarning,
  logInfo,
  logDebug,
  logAgendaJob
};