import os
import re

source_file = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\styles.css"
output_dir = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\styles"

with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()

# We know the specific sections based on CSS comments.
# We can extract them manually using regex.

sections = {
    "_variables.css": [
        r"/\* ── Variables ── \*/.*?/\* ── Light Mode Overrides ── \*/",
        r"/\* ── Light Mode Overrides ── \*/.*?/\* ── Reset ── \*/"
    ],
    "_reset.css": [
        r"/\* ── Reset ── \*/.*?/\* ── App ── \*/",
        r"/\* ── App ── \*/.*?/\* ── Pages ── \*/",
        r"/\* ── Pages ── \*/.*?/\* ============================================================\s*4-LAYER LIQUID GLASS SYSTEM.*?============================================================ \*/"
    ],
    "_glass.css": [
        r"/\* ============================================================\s*4-LAYER LIQUID GLASS SYSTEM.*?============================================================ \*/.*?/\* ============================================================\s*NAVBAR.*?============================================================ \*/"
    ],
    "_layout.css": [
        r"/\* ============================================================\s*NAVBAR.*?============================================================ \*/.*?/\* ── Buttons \(Liquid Glass\) ── \*/",
        r"/\* ============================================================\s*SECTIONS \(shared\).*?============================================================ \*/.*?/\* ============================================================\s*FOOTER.*?============================================================ \*/",
        r"/\* ============================================================\s*FOOTER.*?============================================================ \*/.*?/\* ============================================================\s*FORM LAYOUTS \(Auth / Shared\).*?============================================================ \*/",
        r"/\* ============================================================\s*ADMIN PANEL / DASHBOARD.*?============================================================ \*/.*?/\* --- Appended from register\.css --- \*/"
    ],
    "_components.css": [
        r"/\* ── Buttons \(Liquid Glass\) ── \*/.*?/\* ============================================================\s*SECTIONS \(shared\).*?============================================================ \*/",
        r"/\* ============================================================\s*FORM LAYOUTS \(Auth / Shared\).*?============================================================ \*/.*?/\* ============================================================\s*ADMIN PANEL / DASHBOARD.*?============================================================ \*/"
    ],
    "_animations.css": [
        r"/\* ============================================================\s*ANIMATED BACKGROUND BLOBS.*?============================================================ \*/(.*?)(?:/\* ---|$)",
        r"/\* ============================================================\s*3D CARD TILT.*?\*/.*?(?=(?:/\*|$))",
    ]
}

os.makedirs(output_dir, exist_ok=True)

# A more robust programmatic extraction by defining line ranges.
def extract_modules():
    lines = content.split('\n')
    
    modules = {
        "_variables.css": [],
        "_reset.css": [],
        "_glass.css": [],
        "_layout.css": [],
        "_components.css": [],
        "_animations.css": []
    }
    
    current_module = None
    
    for i, line in enumerate(lines):
        # Determine module based on comments
        if "/* ── Variables ── */" in line: current_module = "_variables.css"
        elif "/* ── Reset ── */" in line: current_module = "_reset.css"
        elif "4-LAYER LIQUID GLASS SYSTEM" in line: current_module = "_glass.css"
        elif "/* ============================================================\n   NAVBAR" in "\n".join(lines[i-1:i+1]): current_module = "_layout.css"
        elif "/* ── Buttons (Liquid Glass) ── */" in line: current_module = "_components.css"
        elif "SECTIONS (shared)" in line: current_module = "_layout.css"
        elif "FOOTER" in line: current_module = "_layout.css"
        elif "FORM LAYOUTS (Auth / Shared)" in line: current_module = "_components.css"
        elif "ADMIN PANEL / DASHBOARD" in line: current_module = "_layout.css"
        elif "3D CARD TILT" in line or "SECTION TITLES GRADIENT" in line or "ANIMATED BACKGROUND BLOBS" in line: current_module = "_animations.css"
        
        # Stop capturing if we hit appended files from old refactoring scripts
        if "/* --- Appended from" in line and "main.css" not in line and "styles.css" not in line:
            current_module = None

        if current_module:
            modules[current_module].append(line)
            
    # Write to files
    for mod_name, mod_lines in modules.items():
        if mod_lines:
            path = os.path.join(output_dir, mod_name)
            with open(path, 'w', encoding='utf-8') as f:
                f.write("\n".join(mod_lines))
            print(f"Created {mod_name} with {len(mod_lines)} lines.")

extract_modules()
