from django.urls import path

from .views import ProfileView, ProjectDetailView, ProjectListView

urlpatterns = [
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<slug:slug>/", ProjectDetailView.as_view(), name="project-detail"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
