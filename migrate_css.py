import os
import re

base_src = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src"
ref_dir = r"d:\Unverstiy\G_project\frontend\frontend-university-code\final-UI-vulnweb-main"

mappings = [
    ("main.css", r"styles.css", False),
    ("styles.css", r"app\user-layout\home\home.css", False),
    ("auth.css", r"app\user-layout\login\sign-in\sign-in.css", False),
    ("login.css", r"app\user-layout\login\sign-in\sign-in.css", False),
    ("auth.css", r"app\user-layout\login\sign-up\sign-up.css", False),
    ("register.css", r"app\user-layout\login\sign-up\sign-up.css", False),
    ("auth.css", r"app\user-layout\login\forgot-password\forgot-password.css", False),
    ("forgot-password.css", r"app\user-layout\login\forgot-password\forgot-password.css", False),
    ("auth.css", r"app\user-layout\login\reset-password\reset-password.css", False),
    ("auth.css", r"app\user-layout\login\verify-otp\verify-otp.css", False),
    ("dashboard.css", r"app\dashboard\dashboard.css", False),
]

for src, dest, overwrite in mappings:
    src_path = os.path.join(ref_dir, src)
    dest_path = os.path.join(base_src, dest)
    if os.path.exists(src_path):
        with open(src_path, "r", encoding="utf-8") as f:
            content = f.read()
        mode = "w" if overwrite else "a"
        if os.path.exists(dest_path):
            with open(dest_path, mode, encoding="utf-8") as f:
                f.write(f"\n/* --- Appended from {src} --- */\n" + content + "\n")
            print(f"Appended {src} to {dest}")
        else:
            with open(dest_path, "w", encoding="utf-8") as f:
                f.write(f"\n/* --- Appended from {src} --- */\n" + content + "\n")
            print(f"Created and wrote {src} to {dest}")

# Now clean up styles.css
styles_path = os.path.join(base_src, "styles.css")
with open(styles_path, "r", encoding="utf-8") as f:
    styles_content = f.read()

# remove @import statements pointing to final folder
cleaned_content = re.sub(r"@import url\('\.\./final-UI-vulnweb-main/.*?\.css'\);[ \t]*\n?", "", styles_content)

with open(styles_path, "w", encoding="utf-8") as f:
    f.write(cleaned_content)
print("Cleaned styles.css imports.")
