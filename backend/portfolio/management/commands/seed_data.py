from django.core.management.base import BaseCommand

from portfolio.models import Profile, Project


class Command(BaseCommand):
    help = "Load sample profile and project data"

    def handle(self, *args, **options):
        profile, created = Profile.objects.get_or_create(
            pk=1,
            defaults={
                "name": "Scott",
                "headline": "Developer building apps with Cursor and hand-coded craft",
                "bio": (
                    "I build web applications across the stack, mixing AI-assisted "
                    "development in Cursor with traditional hand-coded work."
                ),
                "about_cursor": (
                    "Cursor helps me move faster on scaffolding, refactors, and "
                    "exploration while I stay in control of architecture and the "
                    "final implementation."
                ),
                "github_url": "https://github.com/",
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS("Created profile"))
        else:
            self.stdout.write("Profile already exists")

        sample_projects = [
            {
                "name": "Portfolio Site",
                "slug": "portfolio-site",
                "short_description": "This site — Django REST API with a Vite React frontend.",
                "description": (
                    "A full-stack portfolio built to showcase projects, with Django "
                    "Admin for content management and a React SPA for the public site."
                ),
                "tech_stack": ["Django", "DRF", "React", "Vite", "PostgreSQL"],
                "built_with_cursor": True,
                "hand_coded": False,
                "featured": True,
                "sort_order": 1,
            },
            {
                "name": "Hand-Coded CLI Tool",
                "slug": "hand-coded-cli-tool",
                "short_description": "A utility script written without AI assistance.",
                "description": (
                    "Placeholder for a project you built entirely by hand — swap this "
                    "entry in Django Admin with one of your real repos."
                ),
                "tech_stack": ["Python", "PostgreSQL"],
                "built_with_cursor": False,
                "hand_coded": True,
                "featured": True,
                "sort_order": 2,
            },
            {
                "name": "Hybrid Web App",
                "slug": "hybrid-web-app",
                "short_description": "Started in Cursor, refined by hand.",
                "description": (
                    "Example of a project that used Cursor for the initial build and "
                    "manual coding for performance tuning and edge cases."
                ),
                "tech_stack": ["React", "Node.js", "PostgreSQL"],
                "built_with_cursor": True,
                "hand_coded": True,
                "featured": False,
                "sort_order": 3,
            },
        ]

        for project_data in sample_projects:
            _, created = Project.objects.update_or_create(
                slug=project_data["slug"],
                defaults=project_data,
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created project: {project_data['name']}"))
            else:
                self.stdout.write(f"Updated project: {project_data['name']}")
