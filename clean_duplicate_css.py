import os
import glob
import re

app_dir = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\app"

css_files = []
for root, _, files in os.walk(app_dir):
    for f in files:
        if f.endswith('.css'):
            css_files.append(os.path.join(root, f))

cleaned_count = 0

for css_file in css_files:
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()

    if "/* --- Appended from main.css --- */" in content:
        # We want to remove everything between "/* --- Appended from main.css --- */"
        # and "/* --- Auto-extracted inline styles --- */" (if it exists)
        # or just the end of the file if the inline styles block doesn't exist.
        
        start_marker = "/* --- Appended from main.css --- */"
        end_marker = "/* --- Auto-extracted inline styles --- */"
        
        start_idx = content.find(start_marker)
        
        if start_idx != -1:
            end_idx = content.find(end_marker, start_idx)
            
            if end_idx != -1:
                # Keep everything before start_marker + everything from end_marker onwards
                new_content = content[:start_idx] + "\n" + content[end_idx:]
            else:
                # No inline styles appended, just truncate at start_marker
                new_content = content[:start_idx]
                
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            print(f"Cleaned {os.path.basename(css_file)}")
            cleaned_count += 1
            
print(f"\nTotal files cleaned: {cleaned_count}")
