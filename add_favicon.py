import os

directories = ['src', 'public', 'tests']
favicon_tag = '<link rel="icon" type="image/png" href="https://res.cloudinary.com/dfb2esugz/image/upload/v1787482308/Favicon_ifn2gh.png">\n</head>'

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
                
                if 'Favicon_ifn2gh.png' not in content and '</head>' in content:
                    content = content.replace('</head>', favicon_tag)
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Added favicon to {filepath}")
