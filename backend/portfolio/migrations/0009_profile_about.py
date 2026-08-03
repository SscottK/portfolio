from django.db import migrations, models


def copy_bio_to_about(apps, schema_editor):
    Profile = apps.get_model("portfolio", "Profile")
    for profile in Profile.objects.all():
        if profile.bio and not profile.about:
            profile.about = profile.bio
            profile.save(update_fields=["about"])


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0008_certification"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="about",
            field=models.TextField(
                blank=True,
                help_text=(
                    "Longer story for the About page. Same light Markdown as the home bio. "
                    "If left blank, the home bio is shown instead."
                ),
                verbose_name="About me",
            ),
        ),
        migrations.AlterField(
            model_name="profile",
            name="about_cursor",
            field=models.TextField(
                blank=True,
                help_text="How you use Cursor to build apps. Same light Markdown as bio.",
                verbose_name="Building with Cursor",
            ),
        ),
        migrations.AlterField(
            model_name="profile",
            name="bio",
            field=models.TextField(
                help_text=(
                    "Short intro for the home page. Light Markdown: blank line = new paragraph, "
                    "**bold**, *italic*, - lists, and [links](https://example.com)."
                ),
                verbose_name="Bio (home page)",
            ),
        ),
        migrations.RunPython(copy_bio_to_about, migrations.RunPython.noop),
    ]
