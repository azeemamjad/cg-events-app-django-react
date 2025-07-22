import django_filters
from .models import Event

import django_filters
from .models import Event

class EventFilter(django_filters.FilterSet):
    organizers = django_filters.CharFilter(method='filter_by_organizer')
    hall = django_filters.CharFilter(method='filter_by_hall')
    class Meta:
        model = Event
        fields = {
            'title': ['icontains'],
            'description': ['icontains'],
            'start_time': ['gte', 'lte'],
            'end_time': ['gte', 'lte'],
            'entry_fee': ['exact', 'gte', 'lte'],  # filter by exact fee or range
            'genre': ['icontains'],               # case-insensitive match
        }

    def filter_by_organizer(self, queryset, name, value):
        """
        Filter events by organizer ID or username.
        """
        if value.isdigit():
            return queryset.filter(organizers__id=int(value))
        return queryset.filter(organizers__username__icontains=value)

    def filter_by_hall(selfself, queryset, name, value):
        if value.isdigit():
            return queryset.filter(hall__id=int(value))
        return queryset.filter(hall__name__icontains=value)