from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Review
from .serializers import ReviewRetrieveSerializer, ReviewListSerializer, ReviewSerializer
from .permissions import IsOwnerOfReview

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOfReview]

    def get_serializer_class(self):
        if self.action == 'list':
            return ReviewListSerializer
        elif self.request.method == 'GET':
            return  ReviewRetrieveSerializer
        else:
            return ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
