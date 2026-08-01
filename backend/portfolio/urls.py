from django.urls import path

from .views import (
    CertificationListView,
    ProfileView,
    ProjectDetailView,
    ProjectListView,
    ResumeView,
)

urlpatterns = [
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<slug:slug>/", ProjectDetailView.as_view(), name="project-detail"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("resume/", ResumeView.as_view(), name="resume"),
    path("certifications/", CertificationListView.as_view(), name="certification-list"),
]
