# Onesbryne Current Schema

This folder contains the readable current-state SQL for the Onesbryne Supabase
project.

The timestamped files under `../supabase/migrations` are the deployable,
immutable migration history. Keep these current-state files aligned whenever a
new migration changes the schema.

Structure:

```text
schema/
  private/
    schema.sql
    functions/
      auth.sql
  public/
    schema.sql
    extensions.sql
    types.sql
    tables/
      profiles.sql
      categories.sql
      category_size_options.sql
      pieces.sql
      piece_images.sql
      favourites.sql
  storage/
    piece_images.sql
```
