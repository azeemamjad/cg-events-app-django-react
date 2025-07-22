from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOfBooking(BasePermission):
    """
    Allow if user owns the booking!
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user == obj.user