import { Logger, LogFormatter } from '@aws-lambda-powertools/logger';
import {
  LogAttributes,
  LogLevel,
  UnformattedAttributes,
} from '@aws-lambda-powertools/logger/lib/types';

class CustomFormatter extends LogFormatter {
  public formatAttributes(attributes: UnformattedAttributes): LogAttributes {
    return {
      message: attributes.message,
      level: attributes.logLevel,
      xrayTraceId: attributes.xRayTraceId,
      error: attributes.error,
    };
  }
}

export const logger = new Logger({
  logFormatter: new CustomFormatter(),
  logLevel: (process.env.LOG_LEVEL || 'INFO') as LogLevel,
});
