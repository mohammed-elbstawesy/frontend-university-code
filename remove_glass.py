import os
import re

file_path = r"d:\Unverstiy\G_project\frontend\frontend-university-code\src\app\user-layout\user-urls\user-urls.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace explicit card backgrounds
content = content.replace("bg-slate-800/30 backdrop-blur-sm", "bg-[#1c1c2e]")
# Remove any remaining backdrop-blur-sm
content = content.replace(" backdrop-blur-sm", "")
# Make remaining translucent backgrounds solid
content = content.replace("bg-red-500/5", "bg-red-950/40")
content = content.replace("bg-yellow-500/5", "bg-yellow-950/40")
content = content.replace("bg-emerald-500/5", "bg-emerald-950/40")
content = content.replace("bg-purple-500/5", "bg-purple-950/40")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Glass UI removed from user-urls.html")
