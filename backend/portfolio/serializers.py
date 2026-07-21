from rest_framework import serializers

from .models import Profile, Project


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


class ProjectListSerializer(serializers.ModelSerializer):
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


class ProjectDetailSerializer(ProjectListSerializer):
    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + ["description", "updated_at"]
