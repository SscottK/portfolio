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


class ProjectGalleryItem(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="gallery_items",
    )
    media_type = models.CharField(max_length=10, choices=MediaType.choices)
    image = models.ImageField(
        upload_to="projects/gallery/",
        blank=True,
        null=True,
        help_text="Upload for image items.",
    )
    video_url = models.URLField(
        blank=True,
        help_text="YouTube, Vimeo, Loom, or a direct .mp4/.webm link for video items.",
    )
    caption = models.CharField(max_length=200, blank=True)
    is_hero = models.BooleanField(
        default=False,
        help_text="Use this gallery image as the project card thumbnail and default gallery view.",
    )
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "Gallery item"
        verbose_name_plural = "Gallery items"

    def __str__(self):
        label = self.caption or self.get_media_type_display()
        suffix = " (hero)" if self.is_hero else ""
        return f"{self.project.name} — {label}{suffix}"

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.is_hero and self.media_type != self.MediaType.IMAGE:
            raise ValidationError({"is_hero": "Only image gallery items can be used as the hero image."})
        if self.is_hero and not self.image:
            raise ValidationError({"is_hero": "Upload an image before marking it as the hero."})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_hero:
            ProjectGalleryItem.objects.filter(
                project=self.project,
                is_hero=True,
            ).exclude(pk=self.pk).update(is_hero=False)


class Resume(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    summary = models.TextField()

    class Meta:
        verbose_name_plural = "Resume"

    def __str__(self):
        return self.name


class SkillCategory(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="skill_categories",
    )
    name = models.CharField(max_length=100)
    skills = models.JSONField(default=list, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "Skill categories"

    def __str__(self):
        return self.name


class Education(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="education",
    )
    institution = models.CharField(max_length=200)
    program = models.CharField(max_length=200)
    bullets = models.JSONField(default=list, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]
        verbose_name_plural = "Education"

    def __str__(self):
        return f"{self.institution} — {self.program}"


class Experience(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="experience",
    )
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    title = models.CharField(max_length=200)
    date_range = models.CharField(max_length=100)
    bullets = models.JSONField(default=list, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]
        verbose_name_plural = "Experience"

    def __str__(self):
        return f"{self.title} at {self.company}"


class ResumeProject(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="resume_projects",
    )
    name = models.CharField(max_length=200)
    github_url = models.URLField(blank=True)
    demo_url = models.URLField(blank=True)
    built_with_cursor = models.BooleanField(default=False)
    access_note = models.CharField(
        max_length=300,
        blank=True,
        help_text="Optional note about demo access (shown with an asterisk on the resume).",
    )
    tech_stack = models.JSONField(default=list, blank=True)
    bullets = models.JSONField(default=list, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]
        verbose_name = "Resume project"
        verbose_name_plural = "Resume projects"

    def __str__(self):
        return self.name


class Certification(models.Model):
    name = models.CharField(max_length=200)
    issuer = models.CharField(
        max_length=100,
        help_text='e.g. "General Assembly" or "boot.dev"',
    )
    description = models.TextField(blank=True)
    credential_url = models.URLField(
        blank=True,
        help_text="Link to verify the certificate or your boot.dev profile.",
    )
    completed_date = models.CharField(
        max_length=100,
        blank=True,
        help_text='e.g. "2024" or "March 2024"',
    )
    badge = models.ImageField(upload_to="certifications/", blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return f"{self.name} ({self.issuer})"
