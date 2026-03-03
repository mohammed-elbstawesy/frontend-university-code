import os
import re

base_dir = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\app"

def get_css_file(html_file):
    # e.g. path/to/home.html -> path/to/home.css
    return html_file[:-5] + ".css"

html_files = []
for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(root, f))

# regex to find style="..." where we need to replace it and save the content
style_regex = re.compile(r'\s*style="([^"]*)"', re.IGNORECASE)

class_counter = 1

for html_file in html_files:
    css_file = get_css_file(html_file)
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    styles = style_regex.findall(content)
    if not styles:
        continue
        
    print(f"Processing {os.path.basename(html_file)}...")
    base_name = os.path.basename(html_file).replace(".html", "")
    
    new_css_rules = []
    
    def replace_style(match):
        global class_counter
        style_content = match.group(1).strip()
        if not style_content:
            return "" # empty style
            
        class_name = f"auto-{base_name}-sys-{class_counter}"
        class_counter += 1
        
        # formatting the rule
        new_css_rules.append(f".{class_name} {{\n    {style_content}\n}}")
        
        # replace the style attribute with a class attribute addition
        return f' class="{class_name}"'

    # we need to be careful with adding a class attribute if one already exists.
    # A safer naive approach for an automated script handling Angular templates:
    # First, let's just do a simple replacement. If a double class="a" class="b" happens, 
    # the browser usually ignores the second, which is bad.
    # Better approach: 
    # Find all elements with style tags. 
    import xml.etree.ElementTree as ET
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(content, 'html.parser')
    elements_with_style = soup.find_all(style=True)
    
    if elements_with_style:
        for el in elements_with_style:
            style_content = el['style']
            class_name = f"auto-{base_name}-{class_counter}"
            class_counter += 1
            
            # format css rule safely (ensuring semicolons)
            ruled = style_content
            if not ruled.strip().endswith(';'): ruled += ';'
            ruled = ruled.replace(';', ';\n    ')
            new_css_rules.append(f".{class_name} {{\n    {ruled.strip()}\n}}")
            
            # modify element
            del el['style']
            if el.get('class'):
                el['class'].append(class_name)
            else:
                el['class'] = [class_name]
                
        # rewrite html
        # BeautifulSoup can sometimes mess up Angular structural directives like *ngIf
        # So we use regex replacement with a custom function that handles class merging
        pass

# Let's use a pure Regex approach to manually merge classes.
def process_html_file(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find elements with style attributes
    pattern = r'<([a-zA-Z0-9\-]+)([^>]*?)\s+style="([^"]*)"([^>]*)>'
    
    css_rules = []
    local_counter = 1
    base_name = os.path.basename(html_file).replace(".html", "")
    
    def replacer(match):
        nonlocal local_counter
        tag = match.group(1)
        before_style = match.group(2)
        style_val = match.group(3)
        after_style = match.group(4)
        
        if not style_val.strip():
            return f'<{tag}{before_style}{after_style}>'
            
        cls_name = f"{base_name}-style-{local_counter}"
        local_counter += 1
        
        # Format CSS
        rule = style_val.strip()
        
        css_rules.append(f".{cls_name} {{ {rule} }}")
        
        # Now we need to inject the class. 
        # Check if 'class="' exists in before_style or after_style
        full_attrs = before_style + " " + after_style
        if 'class="' in full_attrs:
            # We inject the class name into the existing class attribute
            # This regex looks for class="something" and injects cls_name at the end
            def class_injector(cls_match):
                return f'class="{cls_match.group(1)} {cls_name}"'
            new_attrs = re.sub(r'class="([^"]*)"', class_injector, full_attrs, count=1)
            return f"<{tag} {new_attrs.strip()}>"
        else:
            return f'<{tag} class="{cls_name}" {full_attrs.strip()}>'

    new_content = re.sub(pattern, replacer, content)
    
    if css_rules:
        # Write HTML
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        # Write CSS
        css_file = get_css_file(html_file)
        mode = 'a' if os.path.exists(css_file) else 'w'
        with open(css_file, mode, encoding='utf-8') as f:
            f.write("\n\n/* --- Auto-extracted inline styles --- */\n")
            f.write("\n".join(css_rules))
            f.write("\n")
        print(f"Extracted {len(css_rules)} styles from {base_name}.html")

for hf in html_files:
    process_html_file(hf)

print("\nDone extracting inline styles.")
