from django.contrib import admin

from .models import (
    Education,
    Experience,
    Profile,
    Project,
    ProjectGalleryItem,
    Resume,
    ResumeProject,
    SkillCategory,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "headline", "email")


class ProjectGalleryItemInline(admin.TabularInline):
    model = ProjectGalleryItem
    extra = 1
    fields = ("media_type", "image", "video_url", "caption", "is_hero", "sort_order")
    ordering = ("sort_order",)

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.form.base_fields["is_hero"].help_text = (
            "Check one image to use as the project card thumbnail and default gallery view."
        )
        return formset


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
    inlines = [ProjectGalleryItemInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "slug",
                    "short_description",
                    "description",
                    "tech_stack",
                )
            },
        ),
        (
            "Links & flags",
            {
                "fields": (
                    "github_url",
                    "demo_url",
                    "built_with_cursor",
                    "hand_coded",
                    "featured",
                    "sort_order",
                    "is_published",
                )
            },
        ),
    )


class SkillCategoryInline(admin.TabularInline):
    model = SkillCategory
    extra = 0


class EducationInline(admin.StackedInline):
    model = Education
    extra = 0


class ExperienceInline(admin.StackedInline):
    model = Experience
    extra = 0


class ResumeProjectInline(admin.StackedInline):
    model = ResumeProject
    extra = 0


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone")
    inlines = [
        SkillCategoryInline,
        EducationInline,
        ExperienceInline,
        ResumeProjectInline,
    ]
