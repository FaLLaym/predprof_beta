from loguru import logger

logger.add("./backend/utils/logs/{time:DD-MM-YYYY_HH-mm-ss}.log", format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level:5} | {name}:{function}:{line} - {message}",
           level="DEBUG", rotation="10 MB", compression="zip")
