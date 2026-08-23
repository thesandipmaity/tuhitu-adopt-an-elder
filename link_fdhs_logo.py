import os
import re

pattern = re.compile(r'<div class="initiative-block">(.*?)</div>', re.DOTALL)
replacement = r'<a href="https://fdhs.in/" target="_blank" rel="noopener noreferrer" class="initiative-block" style="text-decoration: none;">\1</a>'

for r, d, files in os.walk('src/app'):
    for f in files:
        if f.endswith('.html') or f.endswith('.ts'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = pattern.sub(replacement, content)
            
            if new_content != content:
                with open(p, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated {p}")
