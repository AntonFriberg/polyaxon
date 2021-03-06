import os

from libs.paths.utils import create_path


def get_experiment_subpath(experiment_name):
    values = experiment_name.split('.')
    if len(values) == 3:
        values.insert(2, 'experiments')
    else:
        values.insert(2, 'groups')
    return '/'.join(values)


def create_experiment_path(experiment_name, path):
    values = experiment_name.split('.')
    if len(values) == 3:
        values.insert(2, 'experiments')
    else:
        values.insert(2, 'groups')

    for value in values[:-1]:
        path = os.path.join(path, value)
        if not os.path.isdir(path):
            create_path(path)

    return path
