import os
import re

directories = ['src', 'public', 'tests']
old_logo = 'https://res.cloudinary.com/dfb2esugz/image/upload/v1787480172/TuHiTu-cares-logo_tzzchk.png'
new_logo = 'https://res.cloudinary.com/dfb2esugz/image/upload/v1787482627/TuHiTu_white_logo_xuorvv.png'

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx', '.mjs')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception:
                    continue
                
                original_content = content
                
                # Replace the old logo only if it appears after class="footer-brand"
                content = re.sub(
                    r'(class="footer-brand"[^>]*>.*?)(?:' + re.escape(old_logo) + r')',
                    r'\1' + new_logo,
                    content,
                    flags=re.DOTALL | re.IGNORECASE
                )

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated footer logo in {filepath}")
