from django.core.management.base import BaseCommand

from portfolio.models import Certification


class Command(BaseCommand):
    help = "Load sample certification data"

    def handle(self, *args, **options):
        Certification.objects.all().delete()

        certifications = [
            {
                "name": "Full Stack Software Engineering Bootcamp",
                "issuer": "General Assembly",
                "description": (
                    "Completed 420+ hours of immersive full-stack training covering "
                    "JavaScript, React, Node.js, Express, Django, PostgreSQL, and MongoDB."
                ),
                "completed_date": "",
                "sort_order": 1,
            },
            {
                "name": "Backend Development",
                "issuer": "boot.dev",
                "description": (
                    "Self-paced backend curriculum covering APIs, databases, authentication, "
                    "and production-ready server development."
                ),
                "credential_url": "https://boot.dev",
                "completed_date": "",
                "sort_order": 2,
            },
            {
                "name": "Learn Go",
                "issuer": "boot.dev",
                "description": (
                    "Self-paced Go course covering language fundamentals, concurrency, "
                    "and backend patterns."
                ),
                "credential_url": "https://boot.dev",
                "completed_date": "",
                "sort_order": 3,
            },
            {
                "name": "Learn Python",
                "issuer": "boot.dev",
                "description": (
                    "Self-paced Python course covering core syntax, data structures, "
                    "and practical programming exercises."
                ),
                "credential_url": "https://boot.dev",
                "completed_date": "",
                "sort_order": 4,
            },
        ]

        for cert in certifications:
            Certification.objects.create(**cert)

        self.stdout.write(self.style.SUCCESS(f"Created {len(certifications)} certifications"))
