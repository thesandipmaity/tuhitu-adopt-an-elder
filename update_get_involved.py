import os
import re

directories = ['src', 'public', 'tests']

replacement = '''<h4>Get Involved</h4>
        <ul>
          <li><a href="/volunteer">Become a Companion</a></li>
          <li><a href="/sponsor">Become a Sponsor</a></li>
          <li><a href="/donate">Donate</a></li>
          <li><a href="/partner-with-us">Partner With Us</a></li>
          <li><a href="/?action=elder-registration" data-elder-registration-trigger>Register an Elder</a></li>
          <li><a href="/care-homes">Care Homes</a></li>
        </ul>'''

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx', '.js', '.mjs')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception:
                    continue
                
                original_content = content
                
                content = re.sub(r'<h4>Get\s*Involved</h4>\s*<ul.*?>.*?</ul>', replacement, content, flags=re.DOTALL | re.IGNORECASE)

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
