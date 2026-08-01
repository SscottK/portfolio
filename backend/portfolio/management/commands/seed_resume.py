from django.core.management.base import BaseCommand

from portfolio.models import Education, Experience, Resume, ResumeProject, SkillCategory


class Command(BaseCommand):
    help = "Load placeholder resume data"

    def handle(self, *args, **options):
        resume, created = Resume.objects.update_or_create(
            pk=1,
            defaults={
                "name": "Scott Kinnear",
                "email": "scott.kinnear19@gmail.com",
                "phone": "(503) 522-4381",
                "linkedin_url": "https://www.linkedin.com/",
                "github_url": "https://github.com/SscottK",
                "summary": (
                    "Detail-oriented and process-driven full-stack developer with "
                    "background in logistics and operations. Skilled in optimizing "
                    "workflows and building scalable applications using Django, "
                    "React, and PostgreSQL. Seeking software engineering role where "
                    "I can apply my problem-solving abilities to develop impactful "
                    "solutions."
                ),
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS("Created resume"))
        else:
            self.stdout.write("Updated resume")

        SkillCategory.objects.filter(resume=resume).delete()
        skill_categories = [
            {
                "name": "Languages",
                "skills": ["JavaScript", "Python"],
                "sort_order": 1,
            },
            {
                "name": "Frameworks & Libraries",
                "skills": ["React", "Node.js", "Express", "Django"],
                "sort_order": 2,
            },
            {
                "name": "Databases",
                "skills": ["PostgreSQL", "MongoDB"],
                "sort_order": 3,
            },
            {
                "name": "Tools",
                "skills": ["Git", "Postman", "Agile methodologies"],
                "sort_order": 4,
            },
        ]
        for category in skill_categories:
            SkillCategory.objects.create(resume=resume, **category)

        Education.objects.filter(resume=resume).delete()
        Education.objects.create(
            resume=resume,
            institution="General Assembly",
            program="Full Stack Software Engineering Bootcamp",
            bullets=[
                (
                    "Completed 420+ hours of training in variety of technologies "
                    "including JavaScript, EJS, React, Node.js, Express, Django, "
                    "PostgreSQL, and MongoDB."
                ),
                (
                    "Gained hands-on experience through collaborative projects, "
                    "coding challenges, and developing full-stack applications."
                ),
            ],
            sort_order=1,
        )

        ResumeProject.objects.filter(resume=resume).delete()
        resume_projects = [
            {
                "name": "Esports Team Tracker v3",
                "github_url": "https://github.com/SscottK/esports-team-tracker-v3",
                "demo_url": "https://esports-team-tracker.vercel.app/",
                "built_with_cursor": True,
                "tech_stack": [
                    "React",
                    "Vite",
                    "Django REST Framework",
                    "PostgreSQL",
                    "Simple JWT",
                    "Bootstrap",
                ],
                "bullets": [
                    (
                        "Built and deployed a full-stack esports team management app "
                        "for organizations to track rosters, times, and benchmarks "
                        "across teams."
                    ),
                    (
                        "Implemented org and team workflows with join codes, head-coach "
                        "invites, role-based permissions, and a requests inbox for "
                        "pending, sent, and reviewed actions."
                    ),
                    (
                        "Designed times grid, leaderboard, compare views, coach "
                        "benchmarks, and CSV bulk upload for Mario Kart-style time "
                        "tracking with org-wide coach rollup."
                    ),
                    (
                        "Rewrote v2 from Django/Alpine.js to React + DRF + PostgreSQL "
                        "with JWT auth, multi-org membership, and team migration "
                        "between organizations."
                    ),
                    (
                        "Deployed frontend and API to Vercel and Render with PostgreSQL; "
                        "added health-check polling and cold-start UX for production "
                        "reliability."
                    ),
                ],
                "sort_order": 1,
            },
            {
                "name": "Quest Terminal",
                "github_url": "https://github.com/SscottK/dnd-ai-app",
                "demo_url": "https://dnd-ai-app.vercel.app/login",
                "built_with_cursor": True,
                "access_note": (
                    "Live demo available by request only. Access is limited to a "
                    "private group of friends in accordance with the Wizards of the "
                    "Coast Fan Content Policy for unofficial Dungeons & Dragons tools."
                ),
                "tech_stack": [
                    "React",
                    "Vite",
                    "FastAPI",
                    "PostgreSQL",
                    "Google Gemini API",
                    "Tailwind CSS",
                ],
                "bullets": [
                    (
                        "Built a full-stack Dungeons & Dragons 5.5e companion app for "
                        "remote play: digital character sheets, live sessions, combat "
                        "tracking, and searchable rules content."
                    ),
                    (
                        "Implemented D&D Beyond PDF import and resync using Gemini "
                        "vision parsing, with editable sheets, click-to-roll, resource "
                        "tracking, and long-rest automation."
                    ),
                    (
                        "Designed combat and initiative tooling with turn actions, "
                        "HP/AC/conditions, death saves, encounter templates, and a "
                        "shared combat log synced across players."
                    ),
                    (
                        "Integrated a Gemini-backed rules assistant grounded in "
                        "catalog SRD data and an optional 2024 rules overlay."
                    ),
                    (
                        "Deployed frontend and API to Vercel and Render with "
                        "PostgreSQL; maintained as a private repository with "
                        "admin-approved access due to licensed game content."
                    ),
                ],
                "sort_order": 2,
            },
        ]
        for project in resume_projects:
            ResumeProject.objects.create(resume=resume, **project)

        Experience.objects.filter(resume=resume).delete()
        experience_entries = [
            {
                "company": "Enterprise Rent-A-Car",
                "location": "Redmond, OR",
                "title": "Auto Detailer",
                "date_range": "05/2021 - Present",
                "bullets": [
                    (
                        "Managed high-volume operations while maintaining quality "
                        "standards under tight deadlines."
                    ),
                    (
                        "Developed attention to detail and quality assurance, "
                        "relevant for debugging and software testing."
                    ),
                    (
                        "Implemented efficiency strategies to streamline operations, "
                        "reflecting process optimization skills used in software "
                        "engineering."
                    ),
                ],
                "sort_order": 1,
            },
            {
                "company": "Quality Custom Distribution",
                "location": "Tigard, OR",
                "title": "Warehouse Associate",
                "date_range": "08/2018 - 03/2020",
                "bullets": [
                    (
                        "Optimized organization to maximize shipping efficiency, "
                        "akin to algorithmic problem-solving in software engineering."
                    ),
                    (
                        "Collaborated with teams to ensure smooth distribution, "
                        "highlighting communication skills applicable in tech teams."
                    ),
                ],
                "sort_order": 2,
            },
            {
                "company": "Evans Metal Fabricators and Forming",
                "location": "Portland, OR",
                "title": "Parts Manager",
                "date_range": "11/2017 - 04/2018",
                "bullets": [
                    (
                        "Designed and maintained internal inventory, packaging, and "
                        "distribution systems."
                    ),
                    "Optimized processes to improve efficiency and reduce errors.",
                    (
                        "Developed systematic workflows that improved operations, "
                        "similar to managing database structures in software "
                        "development."
                    ),
                ],
                "sort_order": 3,
            },
        ]
        for entry in experience_entries:
            Experience.objects.create(resume=resume, **entry)

        self.stdout.write(self.style.SUCCESS("Resume seed data loaded."))
