type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorReport {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  timestamp: number;
  context?: Record<string, any>;
}

export class ErrorReporter {
  private static instance: ErrorReporter;
  private errors: ErrorReport[] = [];
  private readonly MAX_ERRORS = 1000;

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  private setupGlobalHandlers() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.reportError(error || new Error(message as string), 'high');
    };

    window.onunhandledrejection = (event) => {
      this.reportError(event.reason, 'high');
    };
  }

  reportError(error: Error, severity: ErrorSeverity, context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      severity,
      timestamp: Date.now(),
      context
    };

    this.errors.push(errorReport);

    // Prevent array from growing too large
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(-this.MAX_ERRORS);
    }

    // In production, this would send to a monitoring service
    console.error('Error Report:', errorReport);
  }

  getErrors(severity?: ErrorSeverity): ErrorReport[] {
    if (severity) {
      return this.errors.filter(error => error.severity === severity);
    }
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}