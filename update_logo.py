import os

directories = ['src', 'public']
old_logo = 'https://res.cloudinary.com/dfb2esugz/image/upload/v1787478843/Tuhitu-cares_new5bd.jpg'
new_logo = 'https://res.cloudinary.com/dfb2esugz/image/upload/v1787480172/TuHiTu-cares-logo_tzzchk.png'

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx', '.css', '.js', '.mjs')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception:
                    continue
                
                if old_logo in content:
                    content = content.replace(old_logo, new_logo)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
