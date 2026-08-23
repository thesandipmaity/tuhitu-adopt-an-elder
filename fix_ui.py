import os
import re

directories = ['src', 'public']

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.html', '.ts', '.tsx', '.jsx', '.js')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception:
                continue

            original_content = content
            
            # 1. Replace "Register Yourself" -> "Register an Elder"
            content = content.replace("Register Yourself", "Register an Elder")
            
            # 2. Comment out topbar
            # Find <!-- ============ TOP BAR ============ -->\n<div class="topbar"> ... </div>
            # We want to wrap <div class="topbar">...</div> with <!-- and -->
            # But maybe the <!-- ============ TOP BAR ============ --> is already there. Let's just wrap the div.
            topbar_pattern = r'(<div class="topbar">[\s\S]*?</div>)(\s*<!-- ============ HEADER ============ -->)'
            if '<!-- <div class="topbar">' not in content:
                content = re.sub(topbar_pattern, r'<!-- \1 -->\2', content)
            
            # 3. Fix UI of "Register an Elder" button in main-nav
            # In previous steps we added: 
            # <a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm" style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-user-plus"></i><span>Register an Elder</span></a>
            
            # Let's replace it with a wrapper div to prevent .main-nav > a CSS conflicts.
            btn_pattern = r'<a href="/\?action=elder-registration"[^>]*class="btn btn-primary btn-sm"[^>]*>.*?</a>'
            
            match = re.search(btn_pattern, content)
            if match:
                btn_html = match.group(0)
                # Ensure it's not already wrapped in <div class="nav-btn">
                if '<div class="nav-btn">' not in content.split(btn_html)[0][-30:]:
                    # Remove the inline styles from the a tag since btn classes already have flex/gap usually,
                    # but if not, we can keep them. Actually, just wrapping is enough.
                    # Wait, let's just make the button clean:
                    clean_btn = '<div class="nav-btn" style="display: flex; align-items: center;"><a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm"><i class="fa-solid fa-user-plus"></i><span>Register an Elder</span></a></div>'
                    content = content.replace(btn_html, clean_btn)

            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
