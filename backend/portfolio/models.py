from django.db import models
from django.utils.text import slugify


class Profile(models.Model):
    name = models.CharField(max_length=200)
    headline = models.CharField(max_length=300)
    bio = models.TextField()
    about_cursor = models.TextField(
        blank=True,
        help_text="How you use Cursor to build apps.",
    )
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)

    class Meta:
        verbose_name_plural = "Profile"

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=220)
    short_description = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    tech_stack = models.JSONField(default=list, blank=True)
    github_url = models.URLField(blank=True)
    demo_url = models.URLField(blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    built_with_cursor = models.BooleanField(default=False)
    hand_coded = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
