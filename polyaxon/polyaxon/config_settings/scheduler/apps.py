from ..apps import *
from ..auditor_apps import AUDITOR_APPS

PROJECT_APPS = AUDITOR_APPS + (
    'api.apps.APIsConfig',
    'publisher.apps.PublisherConfig',
    'scheduler.apps.SchedulerConfig',
)

INSTALLED_APPS += PROJECT_APPS
