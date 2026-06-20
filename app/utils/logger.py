import logging
import sys
from pathlib import Path

# Logs folder banao
Path("logs").mkdir(exist_ok=True)

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # Format
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # 🌟 FIXED: encoding='utf-8' add kiya taaki Hindi/Special chars error na dein
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)
    # StreamHandler me encoding direct set nahi hoti, isliye hum stream ko hi utf-8 mode me wrap kar rahe hain
    console_handler.stream = sys.stdout

    # File mein save karo (Yahan encoding='utf-8' support karta hai)
    file_handler = logging.FileHandler("logs/app.log", encoding='utf-8')
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    if not logger.handlers:
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)

    return logger