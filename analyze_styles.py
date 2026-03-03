import os
import re

base_dir = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\app"
html_files = []

for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(root, f))

# A regex to match style="..." attributes
style_regex = re.compile(r'\s*style="([^"]*)"', re.IGNORECASE)

total_styles_found = 0

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if there are styles
    styles = style_regex.findall(content)
    if not styles:
        continue
        
    print(f"Found {len(styles)} styles in {os.path.basename(html_file)}")
    total_styles_found += len(styles)
    
    # We will just print them for now to see what we're working with
    for i, s in enumerate(styles):
        print(f"  {i+1}: {s}")

print(f"\nTotal inline styles found: {total_styles_found}")
