from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated

class IsOwnerOfHall(BasePermission):
    """
    Custom permission to only allow owners of a Hall to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user

class IsOwnerOfEvent(BasePermission):
    """
    Only allow organizers to edit the event.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user in obj.organizers.all()

