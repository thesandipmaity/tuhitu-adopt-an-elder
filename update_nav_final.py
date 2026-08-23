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
    
    if 'elder-registration' in content and 'care-homes' in content:
        # Check if already updated
        if '<a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm"' in content:
            return
            
        # First, remove the elder-registration link entirely.
        content = re.sub(r'<a href="/\?action=elder-registration"[^>]*>.*?</a>\s*', '', content)
        
        # Now find the care-homes link and append the new button
        match = re.search(r'(<a href="/care-homes"[^>]*>Care Homes</a>)', content)
        if match:
            care_homes_tag = match.group(1)
            new_btn = '<a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm" style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-user-plus"></i><span>Register an Elder</span></a>'
            new_btns = care_homes_tag + '\n      ' + new_btn
            
            content = content.replace(care_homes_tag, new_btns)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx')):
                process_file(os.path.join(root, file))
