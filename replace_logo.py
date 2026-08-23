import os
def replace_in_files(directory):
    for dp, dn, filenames in os.walk(directory):
        for f in filenames:
            if f.endswith(('.html', '.ts', '.tsx', '.css')):
                filepath = os.path.join(dp, f)
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                # Let's use regex to replace the span.mark and the logo inside it with just a responsive img
                import re
                
                # Pattern to match <span class="mark"><img src="https://res.cloudinary.com/dfb2esugz/image/upload/v1787478843/Tuhitu-cares_new5bd.jpg" alt="TuHiTu Cares logo" width="42" height="42" loading="eager" decoding="async"></span>
                # Or any similar variation
                
                pattern = r'<span class="mark">\s*<img[^>]*src="[^"]*res\.cloudinary\.com[^"]*Tuhitu-cares_new5bd\.jpg"[^>]*>\s*</span>'
                new_logo_html = '<img src="https://res.cloudinary.com/dfb2esugz/image/upload/v1787478843/Tuhitu-cares_new5bd.jpg" alt="TuHiTu Cares logo" class="header-logo" style="width: 100%; height: auto; max-width: 250px; display: block;" loading="eager" decoding="async">'
                
                new_content = re.sub(pattern, new_logo_html, content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as file:
                        file.write(new_content)

replace_in_files('src')
replace_in_files('public')
