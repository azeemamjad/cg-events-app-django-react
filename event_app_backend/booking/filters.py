from django_filters import filterset
from .models import Booking

class BookingFilterSet(filterset.FilterSet):
    class Meta:
        model = Booking
        fields = ['id', 'event']