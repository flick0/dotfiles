#!/usr/bin/python
import pickle
import os
from pathlib import Path
dat = {
    "app_name":os.getenv("DUNST_APP_NAME"),
    "summary":os.getenv("DUNST_SUMMARY"),
    "body":os.getenv("DUNST_BODY"),
    "icon":os.getenv("DUNST_ICON_path"),
    "urgency":os.getenv("DUNST_URGENCY"),
    "id":os.getenv("DUNST_ID"),
    "progress":os.getenv("DUNST_PROGRESS"),
    "category":os.getenv("DUNST_CATEGORY"),
    "stack_tag":os.getenv("DUNST_STACK_TAG"),
    "urls":os.getenv("DUNST_URLS"),
    "timeout":os.getenv("DUNST_TIMEOUT"),
    "timestamp":os.getenv("DUNST_TIMESTAMP"),
    "desktop-entry":os.getenv("DUNST_DESKTOP_ENTRY"),
    "stack-tag":os.getenv("DUNST_STACK_TAG"),
}
with open(f"{Path.home()}/.config/hypr/store/latest_notif", "wb") as f:
    pickle.dump(dat, f)
