from collections import OrderedDict

from django.utils.functional import cached_property

from scopes.roles.spec import RoleSpec


class RoleManager(object):
    def __init__(self, config, default):
        self._roles = OrderedDict()
        role = None
        for idx, role in enumerate(config):
            role = RoleSpec(rank=idx,
                            name=role['name'],
                            desc=role.get('desc', ''),
                            scopes=role['scopes'],
                            is_global=role.get('desc', False))
            self._roles[role.id] = role

        self._default = self._roles[default] if self._roles else RoleSpec.get_dummy()
        self._top = role

    def can_manage(self, role, other):
        return self.get(role).rank >= self.get(other).rank

    def get(self, role_id):
        return self._roles[role_id]

    @cached_property
    def roles(self):
        return self._roles.values()

    @cached_property
    def choices(self):
        return tuple((r.id, r.name) for r in self.roles)

    @cached_property
    def default(self):
        return self._default

    @cached_property
    def top(self):
        return self._top

    def roles_for_scope(self, scope):
        for role in self.roles:
            if role.has_scope(scope):
                yield role
