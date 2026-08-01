import re

from rest_framework import serializers

from .models import (
    Education,
    Experience,
    Profile,
    Project,
    ProjectGalleryItem,
    Resume,
    ResumeProject,
    SkillCategory,
    Certification,
)

YOUTUBE_PATTERN = re.compile(
    r"(?:youtube\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)([\w-]{11})"
)
VIMEO_PATTERN = re.compile(r"vimeo\.com/(?:video/)?(\d+)")
LOOM_PATTERN = re.compile(r"loom\.com/(?:share|embed)/([\w-]+)")
DIRECT_VIDEO_PATTERN = re.compile(r"\.(mp4|webm|ogg)(\?.*)?$", re.IGNORECASE)


def resolve_video_embed(url):
    if not url:
        return None

    youtube_match = YOUTUBE_PATTERN.search(url)
    if youtube_match:
        return {
            "kind": "embed",
            "src": f"https://www.youtube.com/embed/{youtube_match.group(1)}",
        }

    vimeo_match = VIMEO_PATTERN.search(url)
    if vimeo_match:
        return {
            "kind": "embed",
            "src": f"https://player.vimeo.com/video/{vimeo_match.group(1)}",
        }

    loom_match = LOOM_PATTERN.search(url)
    if loom_match:
        return {
            "kind": "embed",
            "src": f"https://www.loom.com/embed/{loom_match.group(1)}",
        }

    if DIRECT_VIDEO_PATTERN.search(url):
        return {"kind": "file", "src": url}

    return {"kind": "link", "src": url}


def get_hero_image_url(project, request=None):
    gallery_items = getattr(project, "_prefetched_objects_cache", {}).get("gallery_items")
    if gallery_items is None:
        items = project.gallery_items.all()
    else:
        items = gallery_items

    hero_item = next(
        (
            item
            for item in items
            if item.is_hero and item.media_type == ProjectGalleryItem.MediaType.IMAGE and item.image
        ),
        None,
    )
    if hero_item is None:
        hero_item = next(
            (
                item
                for item in items
                if item.media_type == ProjectGalleryItem.MediaType.IMAGE and item.image
            ),
            None,
        )

    if hero_item is None:
        return None

    if request is not None:
        return request.build_absolute_uri(hero_item.image.url)
    return hero_item.image.url


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "name",
            "headline",
            "bio",
            "about_cursor",
            "github_url",
            "linkedin_url",
            "email",
        ]


class ProjectGalleryItemSerializer(serializers.ModelSerializer):
    video_embed = serializers.SerializerMethodField()

    class Meta:
        model = ProjectGalleryItem
        fields = [
            "id",
            "media_type",
            "image",
            "video_url",
            "video_embed",
            "caption",
            "is_hero",
            "sort_order",
        ]

    def get_video_embed(self, obj):
        if obj.media_type != ProjectGalleryItem.MediaType.VIDEO:
            return None
        return resolve_video_embed(obj.video_url)


class ProjectListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "slug",
            "short_description",
            "tech_stack",
            "github_url",
            "demo_url",
            "image",
            "built_with_cursor",
            "hand_coded",
            "featured",
            "created_at",
        ]

    def get_image(self, obj):
        return get_hero_image_url(obj, self.context.get("request"))


class ProjectDetailSerializer(ProjectListSerializer):
    gallery = ProjectGalleryItemSerializer(source="gallery_items", many=True, read_only=True)

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            "description",
            "updated_at",
            "gallery",
        ]


class SkillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillCategory
        fields = ["name", "skills"]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["institution", "program", "bullets"]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["company", "location", "title", "date_range", "bullets"]


class ResumeProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeProject
        fields = [
            "name",
            "github_url",
            "demo_url",
            "built_with_cursor",
            "access_note",
            "tech_stack",
            "bullets",
        ]


class ResumeSerializer(serializers.ModelSerializer):
    skills = SkillCategorySerializer(source="skill_categories", many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    experience = ExperienceSerializer(many=True, read_only=True)
    projects = ResumeProjectSerializer(source="resume_projects", many=True, read_only=True)

    class Meta:
        model = Resume
        fields = [
            "name",
            "email",
            "phone",
            "linkedin_url",
            "github_url",
            "summary",
            "skills",
            "education",
            "experience",
            "projects",
        ]


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            "id",
            "name",
            "issuer",
            "description",
            "credential_url",
            "completed_date",
            "badge",
            "sort_order",
        ]
