from rest_framework import generics
from rest_framework.exceptions import NotFound

from .models import Profile, Project, Resume, Certification
from .serializers import (
    CertificationSerializer,
    ProfileSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    ResumeSerializer,
)


class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        queryset = Project.objects.filter(is_published=True)
        params = self.request.query_params

        if params.get("featured") == "true":
            queryset = queryset.filter(featured=True)
        if params.get("built_with_cursor") == "true":
            queryset = queryset.filter(built_with_cursor=True)
        if params.get("hand_coded") == "true":
            queryset = queryset.filter(hand_coded=True)

        return queryset.prefetch_related("gallery_items")


class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Project.objects.filter(is_published=True).prefetch_related("gallery_items")


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        profile = Profile.objects.first()
        if profile is None:
            raise NotFound("Profile has not been created yet.")
        return profile


class ResumeView(generics.RetrieveAPIView):
    serializer_class = ResumeSerializer

    def get_object(self):
        resume = (
            Resume.objects.prefetch_related(
                "skill_categories",
                "education",
                "experience",
                "resume_projects",
            )
            .first()
        )
        if resume is None:
            raise NotFound("Resume has not been created yet.")
        return resume


class CertificationListView(generics.ListAPIView):
    serializer_class = CertificationSerializer

    def get_queryset(self):
        return Certification.objects.filter(is_published=True)
