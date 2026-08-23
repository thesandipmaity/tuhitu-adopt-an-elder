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
    
    # Check if this file hasn't been updated yet
    if '<a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm"' in content:
        return # Already updated
        
    if 'Register an Elder' in content and 'Care Homes' in content:
        # Remove old Register an Elder link completely
        content = re.sub(r'<a href="/\?action=elder-registration"[^>]*>Register an Elder</a>\s*', '', content)
        
        # And replace Care homes with Care Homes + the new Register an Elder button
        new_care_homes = '<a href="/care-homes">Care Homes</a>\n      <a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm" style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-user-plus"></i><span>Register an Elder</span></a>'
        
        content = content.replace('<a href="/care-homes">Care Homes</a>', new_care_homes)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx')):
                process_file(os.path.join(root, file))
