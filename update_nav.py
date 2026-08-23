import os
import re

directories = ['src']

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return

    original_content = content
    
    # 1. Swap the order and add styling to "Register an Elder"
    # Find:
    # <a href="/?action=elder-registration" data-elder-registration-trigger>Register an Elder</a>
    # <a href="/care-homes">Care Homes</a>
    # Or varying whitespace. We'll use regex.
    
    pattern = r'<a href="/\?action=elder-registration"[^>]*>Register an Elder</a>\s*<a href="/care-homes">Care Homes</a>'
    
    # We want to replace it with Care Homes first, then Register an Elder button.
    # The register button should have: class="btn btn-primary btn-sm" and icon <i class="fa-solid fa-user-plus"></i><span>Register an Elder</span>
    
    replacement = '<a href="/care-homes">Care Homes</a>\n      <a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm" style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-user-plus"></i><span>Register an Elder</span></a>'
    
    content = re.sub(pattern, replacement, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx')):
                process_file(os.path.join(root, file))
