import os
import re

directories = ['src', 'public', 'tests']

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.ts', '.tsx', '.js', '.mjs', '.md', '.css')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception:
                    continue
                
                original_content = content
                
                # 1. Update phone number: replace "95996 61292" with "9218191502"
                content = content.replace("95996 61292", "9218191502")
                
                # 2. Instagram link
                # Replace any <a href="#" ...><i class="fa-brands fa-instagram"></i></a> or similar
                # Just replacing the href attribute of the <a> tag that contains fa-instagram
                content = re.sub(
                    r'(?P<start><a [^>]*?href=)["\'][^"\']*["\'](?P<mid>[^>]*?>\s*<i[^>]*?class=["\'][^"\']*?fa-instagram[^"\']*?["\'][^>]*?>)',
                    r'\g<start>"https://www.instagram.com/tuhitu.elders"\g<mid>',
                    content
                )
                
                # 3. "Register yourself" to "Register an Elder"
                content = re.sub(r'(?i)Register yourself', 'Register an Elder', content)

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
