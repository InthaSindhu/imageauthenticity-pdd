"""
Logger Utility — Structured multi-level logging for the automation framework.
"""

import logging
import os
from datetime import datetime


def setup_logger(name: str = 'automation', log_dir: str = 'automation/logs',
                 level: int = logging.INFO) -> logging.Logger:
    os.makedirs(log_dir, exist_ok=True)
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_file = os.path.join(log_dir, f'test-run-{ts}.log')

    fmt = logging.Formatter(
        '%(asctime)s [%(levelname)-8s] %(name)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    handler_file    = logging.FileHandler(log_file, encoding='utf-8')
    handler_console = logging.StreamHandler()
    handler_file.setFormatter(fmt)
    handler_console.setFormatter(fmt)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    if not logger.handlers:
        logger.addHandler(handler_file)
        logger.addHandler(handler_console)

    return logger


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(f'automation.{name}')
