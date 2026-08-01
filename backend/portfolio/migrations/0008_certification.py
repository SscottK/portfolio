from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0007_gallery_hero_image"),
    ]

    operations = [
        migrations.CreateModel(
            name="Certification",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                (
                    "issuer",
                    models.CharField(
                        help_text='e.g. "General Assembly" or "boot.dev"',
                        max_length=100,
                    ),
                ),
                ("description", models.TextField(blank=True)),
                (
                    "credential_url",
                    models.URLField(
                        blank=True,
                        help_text="Link to verify the certificate or your boot.dev profile.",
                    ),
                ),
                (
                    "completed_date",
                    models.CharField(
                        blank=True,
                        help_text='e.g. "2024" or "March 2024"',
                        max_length=100,
                    ),
                ),
                (
                    "badge",
                    models.ImageField(
                        blank=True,
                        null=True,
                        upload_to="certifications/",
                    ),
                ),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("is_published", models.BooleanField(default=True)),
            ],
            options={
                "ordering": ["sort_order", "name"],
            },
        ),
    ]
