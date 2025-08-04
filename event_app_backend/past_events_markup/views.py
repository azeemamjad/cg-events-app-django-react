from django.http import JsonResponse
from django_celery_beat.schedulers import IntervalSchedule, PeriodicTask

def schedule_event_markup(request):
    interval, _ = IntervalSchedule.objects.get_or_create(
        every=2,
        period=IntervalSchedule.MINUTES
    )
    PeriodicTask.objects.get_or_create(
        interval=interval,
        name="event-markup-2",
        task="past_events_markup.tasks.event_markup"
    )

    return JsonResponse({"status": "Task Scheduled!"})