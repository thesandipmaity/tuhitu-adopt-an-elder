import os

target = '<p>Adopt an Elder. Restore Dignity. Renew Hope.</p>'
replacement = '<!-- <p>Adopt an Elder. Restore Dignity. Renew Hope.</p> -->'

for r, d, files in os.walk('src/app'):
    for f in files:
        if f.endswith('.html') or f.endswith('.ts'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            if target in content:
                with open(p, 'w', encoding='utf-8') as file:
                    file.write(content.replace(target, replacement))
                print(f"Updated {p}")
