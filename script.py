import os, re
d=r'c:\Users\Sandip\Desktop\Project\Tuhitu Elder\src'
ptn=re.compile(r'(<span class="brand-text">\s*<span>TuHiTu Club</span>\s*<span class="tagline">Adopt an Elder\. Restore Dignity\. Renew Hope\.</span>\s*</span>)')
for root, _, files in os.walk(d):
    for f in files:
        if f.endswith('.html') or f.endswith('.ts'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as f_in:
                content = f_in.read()
            new_content = ptn.sub(r'<!-- \1 -->', content)
            if new_content != content:
                with open(p, 'w', encoding='utf-8') as f_out:
                    f_out.write(new_content)
                print('Updated', p)

