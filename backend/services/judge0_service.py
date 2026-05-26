"""
Judge0 CE code execution service.
Public docs: https://ce.judge0.com
"""

import os
from urllib.parse import urlencode

import requests
from requests.exceptions import RequestException, Timeout

# Judge0 CE language IDs (https://ce.judge0.com/languages)
JUDGE0_LANGUAGE_IDS = {
    "c": 50,
    "cpp": 54,
    "python": 71,
    "java": 62,
    "javascript": 63,
}

SUPPORTED_LANGUAGES = tuple(JUDGE0_LANGUAGE_IDS.keys())

# Judge0 status IDs
STATUS_ACCEPTED = 3
STATUS_COMPILATION_ERROR = 6
STATUS_RUNTIME_ERROR_IDS = {7, 8, 9, 10, 11, 12}
STATUS_TIME_LIMIT = 5
STATUS_MEMORY_LIMIT = 13  # may vary; also check description


class ExecutionServiceError(Exception):
    def __init__(self, message, error_type="api", status_code=500, details=None):
        super().__init__(message)
        self.message = message
        self.error_type = error_type
        self.status_code = status_code
        self.details = details or {}


def _judge0_base_url():
    return os.getenv("JUDGE0_BASE_URL", "https://ce.judge0.com").rstrip("/")


def _timeout_seconds():
    return int(os.getenv("JUDGE0_TIMEOUT_SECONDS", "60"))


def _post_submission(payload):
    base = _judge0_base_url()
    query = urlencode(
        {
            "base64_encoded": "false",
            "wait": "true",
        }
    )
    url = f"{base}/submissions?{query}"

    headers = {
        "Content-Type": "application/json",
        "User-Agent": os.getenv("JUDGE0_USER_AGENT", "Cparser-Online-Compiler/2.0"),
    }
    auth_token = os.getenv("JUDGE0_AUTH_TOKEN", "").strip()
    if auth_token:
        headers["X-Auth-Token"] = auth_token

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=_timeout_seconds(),
        )
        response.raise_for_status()
        return response.json()
    except Timeout as e:
        raise ExecutionServiceError(
            "Execution timed out. Try a simpler program or increase JUDGE0_TIMEOUT_SECONDS.",
            error_type="timeout",
            status_code=408,
        ) from e
    except requests.HTTPError as e:
        parsed = {}
        try:
            parsed = e.response.json() if e.response is not None else {}
        except ValueError:
            parsed = {"raw": e.response.text if e.response is not None else ""}
        message = (
            parsed.get("error")
            or parsed.get("message")
            or f"Judge0 API returned HTTP {e.response.status_code if e.response else 'error'}"
        )
        status_code = e.response.status_code if e.response is not None else 502
        raise ExecutionServiceError(message, error_type="api", status_code=status_code, details=parsed) from e
    except RequestException as e:
        raise ExecutionServiceError(
            "Unable to reach the code execution service. Check your internet connection and try again.",
            error_type="network",
            status_code=502,
        ) from e


def _classify_result(data):
    status = data.get("status") or {}
    status_id = status.get("id")
    description = status.get("description") or "Unknown"

    stdout = (data.get("stdout") or "").strip("\n") if data.get("stdout") else ""
    stderr = data.get("stderr") or ""
    compile_output = data.get("compile_output") or ""
    message = data.get("message") or ""

    memory_kb = data.get("memory")
    memory_bytes = int(memory_kb) * 1024 if memory_kb is not None else 0

    time_str = data.get("time")
    try:
        runtime_ms = float(time_str) * 1000 if time_str else 0
    except (TypeError, ValueError):
        runtime_ms = 0

    if status_id == STATUS_ACCEPTED:
        return {
            "success": True,
            "run": {
                "output": stdout if stdout else "No output",
                "stderr": None,
                "memory": memory_bytes,
                "runtime_ms": runtime_ms,
                "signal": None,
            },
            "error": None,
            "status": description,
        }

    if status_id == STATUS_COMPILATION_ERROR:
        detail = compile_output or stderr or "Compilation failed."
        return {
            "success": False,
            "run": {
                "output": None,
                "stderr": detail,
                "memory": memory_bytes,
                "runtime_ms": runtime_ms,
                "signal": None,
            },
            "error": {
                "type": "compile",
                "message": "Compilation error. See output for details.",
            },
            "status": description,
        }

    if status_id == STATUS_TIME_LIMIT:
        return {
            "success": False,
            "run": {
                "output": None,
                "stderr": "Time limit exceeded. Try optimizing your program or reducing input size.",
                "memory": memory_bytes,
                "runtime_ms": runtime_ms,
                "signal": "SIGKILL",
            },
            "error": {
                "type": "timeout",
                "message": "Execution timed out.",
            },
            "status": description,
        }

    if status_id in STATUS_RUNTIME_ERROR_IDS or "Runtime Error" in description:
        detail = stderr or message or description
        return {
            "success": False,
            "run": {
                "output": stdout or None,
                "stderr": detail,
                "memory": memory_bytes,
                "runtime_ms": runtime_ms,
                "signal": "RUNTIME",
            },
            "error": {
                "type": "runtime",
                "message": "Runtime error. See output for details.",
            },
            "status": description,
        }

    # Wrong answer, internal error, etc.
    detail = stderr or compile_output or message or description
    return {
        "success": False,
        "run": {
            "output": stdout or None,
            "stderr": detail,
            "memory": memory_bytes,
            "runtime_ms": runtime_ms,
            "signal": None,
        },
        "error": {
            "type": "api",
            "message": description,
        },
        "status": description,
    }


def execute_code(language, source_code, stdin=""):
    lang = (language or "").strip().lower()
    if lang not in JUDGE0_LANGUAGE_IDS:
        raise ExecutionServiceError(
            f"Unsupported language '{language}'. Supported: {', '.join(SUPPORTED_LANGUAGES)}",
            error_type="validation",
            status_code=400,
        )

    if not source_code or not str(source_code).strip():
        raise ExecutionServiceError(
            "Source code cannot be empty.",
            error_type="validation",
            status_code=400,
        )

    cpu_limit = os.getenv("JUDGE0_CPU_TIME_LIMIT", "5")
    memory_limit = os.getenv("JUDGE0_MEMORY_LIMIT_KB", "128000")

    payload = {
        "source_code": source_code,
        "language_id": JUDGE0_LANGUAGE_IDS[lang],
        "stdin": stdin or "",
        "cpu_time_limit": cpu_limit,
        "memory_limit": memory_limit,
    }

    data = _post_submission(payload)
    return _classify_result(data)
