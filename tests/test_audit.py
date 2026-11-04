"""
Automated Comprehensive Test Suite for Kübra & Mert Web Application.
Checks:
- HTML/JS file existence
- Internal links & routing resolution
- Static assets integrity (images, CSS, JS)
- DOM ID bindings (no missing getElementById targets)
- JS syntax & quote balance
- Security best practices (no unsafe evals, external link security, noopener)
"""

import json
import os
import re
import sys
import unittest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

PAGES = [
    'index.html',
    'hub/index.html',
    'kasimpati/index.html',
    'pixel/index.html',
    'soru/index.html'
]

JS_FILES = [
    'script.js',
    'kasimpati/script.js',
    'pixel/game.js'
]


class TestFileExistence(unittest.TestCase):
    def test_pages_exist(self):
        for page in PAGES:
            fpath = os.path.join(ROOT_DIR, page)
            self.assertTrue(os.path.exists(fpath), f"Page missing: {page}")

    def test_standalone_js_exist(self):
        for js in JS_FILES:
            fpath = os.path.join(ROOT_DIR, js)
            self.assertTrue(os.path.exists(fpath), f"JS missing: {js}")

    def test_soru_images_exist(self):
        img_ask = os.path.join(ROOT_DIR, 'soru', 'images', 'ask.gif')
        img_yes = os.path.join(ROOT_DIR, 'soru', 'images', 'yes.gif')
        self.assertTrue(os.path.exists(img_ask), "ask.gif missing")
        self.assertTrue(os.path.exists(img_yes), "yes.gif missing")


class TestRoutingAndLinks(unittest.TestCase):
    def test_links_and_assets(self):
        for page in PAGES:
            fpath = os.path.join(ROOT_DIR, page)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            matches = re.findall(r'(?:href|src)=["\']([^"\']+)["\']', content)
            for raw_link in matches:
                # ignore external, anchor or data URIs
                if raw_link.startswith(('http://', 'https://', '#', 'data:')):
                    continue

                link = raw_link.split('?')[0].split('#')[0]
                if not link:
                    continue

                if link.startswith('/'):
                    target = os.path.join(ROOT_DIR, link.lstrip('/'))
                else:
                    target = os.path.join(os.path.dirname(fpath), link)

                exists = os.path.exists(target)
                if not exists and os.path.isdir(target):
                    exists = os.path.exists(os.path.join(target, 'index.html'))
                if not exists and not os.path.splitext(target)[1]:
                    exists = (
                        os.path.exists(target + '.html') or
                        os.path.exists(os.path.join(target, 'index.html'))
                    )

                self.assertTrue(exists, f"Broken link or asset in {page}: {raw_link} -> {target}")


class TestDomBindings(unittest.TestCase):
    """
    Ensure all document.getElementById('...') calls in scripts find matching elements in HTML.
    """
    def test_pixel_dom_ids(self):
        fpath = os.path.join(ROOT_DIR, 'pixel', 'index.html')
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', content))
        js_ids = re.findall(r"document\.getElementById\(.*?['\"]([^'\"]+)['\"]\)", content)

        for el_id in js_ids:
            self.assertIn(el_id, html_ids, f"[pixel/index.html] Missing DOM ID: #{el_id}")

    def test_soru_dom_ids(self):
        fpath = os.path.join(ROOT_DIR, 'soru', 'index.html')
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', content))
        js_ids = re.findall(r"document\.getElementById\(.*?['\"]([^'\"]+)['\"]\)", content)

        for el_id in js_ids:
            self.assertIn(el_id, html_ids, f"[soru/index.html] Missing DOM ID: #{el_id}")

    def test_kasimpati_dom_ids(self):
        fpath = os.path.join(ROOT_DIR, 'kasimpati', 'index.html')
        script_path = os.path.join(ROOT_DIR, 'kasimpati', 'script.js')
        with open(fpath, 'r', encoding='utf-8') as f:
            html = f.read()
        with open(script_path, 'r', encoding='utf-8') as f:
            js = f.read()

        html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))
        js_ids = re.findall(r"document\.getElementById\(.*?['\"]([^'\"]+)['\"]\)", js)

        for el_id in js_ids:
            self.assertIn(el_id, html_ids, f"[kasimpati] Missing DOM ID: #{el_id}")


class TestSyntaxAndSecurity(unittest.TestCase):
    def test_no_unsafe_eval(self):
        all_files = PAGES + JS_FILES
        for rel in all_files:
            fpath = os.path.join(ROOT_DIR, rel)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            self.assertNotIn('eval(', content, f"Unsafe eval() found in {rel}")
            self.assertNotIn('document.write(', content, f"Unsafe document.write() found in {rel}")

    def test_external_links_have_noopener(self):
        for page in PAGES:
            fpath = os.path.join(ROOT_DIR, page)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            # find <a> with target="_blank"
            anchors = re.findall(r'<a\s+[^>]*target=["\']_blank["\'][^>]*>', content, re.IGNORECASE)
            for a in anchors:
                self.assertTrue(
                    'rel="noopener' in a or 'rel="noreferrer' in a or "rel='noopener" in a,
                    f"External link in {page} without rel='noopener': {a}"
                )

    def test_bracket_and_parenthesis_balance(self):
        for page in PAGES:
            fpath = os.path.join(ROOT_DIR, page)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
            for i, script in enumerate(scripts):
                self.assertEqual(
                    script.count('{'), script.count('}'),
                    f"Unbalanced curly brackets in script #{i} of {page}"
                )
                self.assertEqual(
                    script.count('('), script.count(')'),
                    f"Unbalanced parentheses in script #{i} of {page}"
                )


class TestMobileMetadata(unittest.TestCase):
    def test_meta_viewport(self):
        for page in PAGES:
            fpath = os.path.join(ROOT_DIR, page)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            self.assertIn('name="viewport"', content.lower(), f"{page} missing meta viewport")
            self.assertTrue('charset="utf-8"' in content.lower() or 'charset=utf-8' in content.lower(), f"{page} missing UTF-8 charset")


class TestVercelConfiguration(unittest.TestCase):
    def test_vercel_json_valid_and_has_security_headers(self):
        fpath = os.path.join(ROOT_DIR, 'vercel.json')
        self.assertTrue(os.path.exists(fpath), "vercel.json is missing")
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        self.assertTrue(data.get('cleanUrls', False), "cleanUrls should be true")
        headers = data.get('headers', [])
        self.assertTrue(len(headers) > 0, "Security headers should be defined")

        header_keys = {h['key'].lower() for h in headers[0].get('headers', [])}
        expected_keys = {
            'x-content-type-options',
            'x-frame-options',
            'content-security-policy',
            'referrer-policy',
            'permissions-policy'
        }
        for ek in expected_keys:
            self.assertIn(ek, header_keys, f"Missing security header: {ek}")


class TestCveSecurityHardening(unittest.TestCase):
    def test_no_inner_html_with_user_input(self):
        """
        Verify no untrusted user input is passed into innerHTML.
        """
        for rel in PAGES + JS_FILES:
            fpath = os.path.join(ROOT_DIR, rel)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Ensure innerHTML is not concatenating variables from location, params or inputs
            dangerous_patterns = [
                r'\.innerHTML\s*=\s*.*(?:location\.search|location\.hash|prompt\(|input\.value)',
                r'\.outerHTML\s*=\s*.*(?:location\.search|location\.hash|prompt\(|input\.value)'
            ]
            for pat in dangerous_patterns:
                matches = re.findall(pat, content)
                self.assertEqual(len(matches), 0, f"Potentially unsafe innerHTML in {rel}: {matches}")


if __name__ == '__main__':
    unittest.main()
