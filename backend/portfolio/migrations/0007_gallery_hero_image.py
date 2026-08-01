from django.db import migrations, models


def migrate_project_images_to_gallery(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    ProjectGalleryItem = apps.get_model("portfolio", "ProjectGalleryItem")

    for project in Project.objects.all():
        if not project.image:
            continue
        has_hero = ProjectGalleryItem.objects.filter(
            project=project,
            is_hero=True,
        ).exists()
        if has_hero:
            continue
        ProjectGalleryItem.objects.create(
            project=project,
            media_type="image",
            image=project.image,
            is_hero=True,
            sort_order=0,
        )


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0006_projectgalleryitem"),
    ]

    operations = [
        migrations.AddField(
            model_name="projectgalleryitem",
            name="is_hero",
            field=models.BooleanField(
                default=False,
                help_text="Use this gallery image as the project card thumbnail and default gallery view.",
            ),
        ),
        migrations.RunPython(migrate_project_images_to_gallery, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="project",
            name="image",
        ),
    ]
