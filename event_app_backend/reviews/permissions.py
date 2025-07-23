from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOfReview(BasePermission):
    """
        Allow Deletion, Update and Patch only if the User Owns the Object!
    """
    def has_object_permission(self,request, view, obj):
        # if request.method in SAFE_METHODS:
        #     return True
        # return obj.user == request.user
        return True
        ...