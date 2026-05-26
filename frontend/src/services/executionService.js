import { apiClient } from "./apiService";

export const EXECUTION_ERROR_TYPES = {
  NETWORK: "network",
  TIMEOUT: "timeout",
  COMPILE: "compile",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  API: "api",
  UNKNOWN: "unknown",
};

export class ExecutionError extends Error {
  constructor(message, { type = EXECUTION_ERROR_TYPES.UNKNOWN, statusCode, details } = {}) {
    super(message);
    this.name = "ExecutionError";
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

const mapAxiosError = (error) => {
  if (error.code === "ECONNABORTED") {
    return new ExecutionError(
      "The request timed out. Your program may be taking too long to run.",
      { type: EXECUTION_ERROR_TYPES.TIMEOUT, statusCode: 408 }
    );
  }

  if (!error.response) {
    return new ExecutionError(
      "Cannot reach the execution server. Start the backend (python app.py) and check your connection.",
      { type: EXECUTION_ERROR_TYPES.NETWORK, statusCode: 0 }
    );
  }

  const { status, data } = error.response;
  const serverType = data?.error?.type || data?.type;
  const message =
    data?.error?.message ||
    data?.message ||
    data?.error ||
    `Execution failed (HTTP ${status}).`;

  return new ExecutionError(message, {
    type: serverType || EXECUTION_ERROR_TYPES.API,
    statusCode: status,
    details: data,
  });
};

/**
 * Execute source code via the Flask backend (Judge0 CE proxy).
 * @returns {Promise<{ success: boolean, run: object, error: object|null, status: string }>}
 */
export const executeCode = async (language, sourceCode, stdin = "") => {
  try {
    const response = await apiClient.post("/execute", {
      language,
      source_code: sourceCode,
      stdin,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ExecutionError) {
      throw error;
    }
    throw mapAxiosError(error);
  }
};
