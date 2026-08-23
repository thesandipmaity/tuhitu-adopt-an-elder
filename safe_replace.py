import os
import re

directories = ['src', 'public']

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return

    original_content = content
    
    # 1. Replace text globally
    content = content.replace('TuHiTu Club', 'TuHiTu Cares')

    # 2. Replace the inner content of a.brand which contains the logo
    # Match the start of <a class="brand"> and everything inside it up to </a>
    pattern = r'(<a[^>]*class="brand"[^>]*>)\s*<span class="mark">[\s\S]*?(?=</a>)'
    
    new_logo = r'\1\n      <img src="https://res.cloudinary.com/dfb2esugz/image/upload/v1787478843/Tuhitu-cares_new5bd.jpg" alt="TuHiTu Cares logo" class="header-logo" style="width: 100%; max-width: 250px; height: auto; display: block; border-radius: 4px;" loading="eager" decoding="async">\n    '
    
    content = re.sub(pattern, new_logo, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx', '.css', '.js', '.mjs')):
                process_file(os.path.join(root, file))
