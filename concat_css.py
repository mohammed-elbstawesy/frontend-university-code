import os

ref_dir = r'd:\Unverstiy\G_project\frontend\frontend-university-code\final-UI-vulnweb-main'
output = r'd:\Unverstiy\G_project\frontend\frontend-university-code\src\styles.css'

css_files = [
    'main.css',
    'styles.css',
    'index.css',
    'auth.css',
    'register.css',
    'login.css',
    'forgot-password.css',
    'edit-profile.css',
    'checkout.css',
    'dashboard.css',
    'success.css',
]

combined = ''
for fname in css_files:
    path = os.path.join(ref_dir, fname)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        combined += f'\n/* ======= Source: {fname} ======= */\n\n'
        combined += content + '\n'
        print(f'Added {fname} ({len(content)} bytes)')
    else:
        print(f'MISSING: {fname}')

with open(output, 'w', encoding='utf-8') as f:
    f.write(combined)

print(f'\nDone: {len(combined)} chars written to styles.css')
