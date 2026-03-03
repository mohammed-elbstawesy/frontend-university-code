import os
import glob

output_dir = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\styles"

css_files = glob.glob(os.path.join(output_dir, "*.css"))

for css_file in css_files:
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Some comments were cut off by regex due to matching exactly the start of the next block.
    # The simplest fix is to just ensure every unclosed /* is closed by */
    
    # Let's cleanly fix it using a simpler regex closure:
    lines = content.split('\n')
    
    new_lines = []
    in_comment = False
    
    for line in lines:
        if "/*" in line and "*/" not in line:
            in_comment = True
            
        if "*/" in line:
            in_comment = False
            
        new_lines.append(line)
        
    # if it ends while still in a comment, close it.
    if in_comment:
        new_lines.append("*/")
        print(f"Fixed unclosed comment EOF in {os.path.basename(css_file)}")
        
    # Write back
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(new_lines))
    
print("Finished comment closure check.")
