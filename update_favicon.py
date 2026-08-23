import os

old_logo = 'https://res.cloudinary.com/dfb2esugz/image/upload/v1787482308/Favicon_ifn2gh.png'
new_logo = 'https://res.cloudinary.com/dfb2esugz/image/upload/v1787512719/Favicon_cares_r8pzx3.png'

for r, d, files in os.walk('src/app'):
    for f in files:
        if f.endswith('.html') or f.endswith('.ts'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            if old_logo in content:
                with open(p, 'w', encoding='utf-8') as file:
                    file.write(content.replace(old_logo, new_logo))
                print(f"Updated {p}")
