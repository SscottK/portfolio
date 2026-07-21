from django.contrib import admin

from .models import Profile, Project


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "headline", "email")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "featured",
        "built_with_cursor",
        "hand_coded",
        "is_published",
        "sort_order",
    )
    list_filter = ("featured", "built_with_cursor", "hand_coded", "is_published")
    search_fields = ("name", "short_description", "description")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("sort_order", "-created_at")
