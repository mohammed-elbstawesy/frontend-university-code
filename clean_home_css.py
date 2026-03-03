import os

css_file = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\app\user-layout\home\home.css"

with open(css_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "/* --- Appended from styles.css --- */"
end_marker = "/* --- Auto-extracted inline styles --- */"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + "\n" + content[end_idx:]
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Successfully cleaned home.css. Removed {end_idx - start_idx} bytes.")
else:
    print("Markers not found.")
