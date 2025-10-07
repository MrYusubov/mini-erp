import logging

def configure_logging(logfile: str = "mini_erp.log"):
    root = logging.getLogger()
    root.setLevel(logging.INFO)
    fh = logging.FileHandler(logfile)
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    if not any(isinstance(h, logging.FileHandler) and h.baseFilename == fh.baseFilename for h in root.handlers):
        root.addHandler(fh)