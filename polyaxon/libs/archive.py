import os
import tarfile

import conf
import stores

from libs.paths.utils import check_archive_path


def create_tarfile(files, tar_path):
    """Create a tar file based on the list of files passed"""
    with tarfile.open(tar_path, "w:gz") as tar:
        for f in files:
            tar.add(f)


def get_files_in_path(path):
    result_files = []
    for root, _, files in os.walk(path):
        for file_name in files:
            result_files.append(os.path.join(root, file_name))
    return result_files


def archive_repo(repo_git, repo_name, commit=None):
    archive_root = conf.get('REPOS_ARCHIVE_ROOT')
    check_archive_path(archive_root)
    archive_name = '{}-{}.tar.gz'.format(repo_name, commit or 'master')
    with open(os.path.join(archive_root, archive_name), 'wb') as fp:
        repo_git.archive(fp, format='tgz', treeish=commit)

    return archive_root, archive_name


def archive_outputs(outputs_path, name):
    archive_root = conf.get('OUTPUTS_ARCHIVE_ROOT')
    check_archive_path(archive_root)
    outputs_files = get_files_in_path(outputs_path)
    tar_name = "{}.tar.gz".format(name.replace('.', '_'))
    create_tarfile(files=outputs_files, tar_path=os.path.join(archive_root, tar_name))
    return archive_root, tar_name


def archive_outputs_file(persistence_outputs, outputs_path, namepath, filepath):
    check_archive_path(conf.get('OUTPUTS_DOWNLOAD_ROOT'))
    namepath = namepath.replace('.', '/')
    download_filepath = os.path.join(conf.get('OUTPUTS_DOWNLOAD_ROOT'), namepath, filepath)
    download_dir = '/'.join(download_filepath.split('/')[:-1])
    check_archive_path(download_dir)
    store_manager = stores.get_outputs_store(persistence_outputs=persistence_outputs)
    outputs_filepath = os.path.join(outputs_path, filepath)
    store_manager.download_file(outputs_filepath, download_filepath)
    if store_manager.store.is_local_store:
        return outputs_filepath
    return download_filepath
