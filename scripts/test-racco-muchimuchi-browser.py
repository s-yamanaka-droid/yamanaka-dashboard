"""Bounded functional E2E; one isolated browser, never a personal profile.

Usage: python scripts/test-racco-muchimuchi-browser.py BASE_URL OUTPUT_DIR
Requires Playwright in the caller's Python runtime. No forms are submitted.
"""
import hashlib
import json
from pathlib import Path
import sys

from playwright.sync_api import sync_playwright, expect

base = sys.argv[1].rstrip("/")
output = Path(sys.argv[2])
output.mkdir(parents=True, exist_ok=True)
character = "/brand-book/muchimuchi-cat-character-v1.png"
scene = "/brand-book/racco-muchimuchi-shop-v1.png"
hashes = {
    character: "7343110effc2916fe3c9ec73f254dbeef2b8b2c43a0e7f64bb216aadc11f48f5",
    scene: "6becdea6e74c1983e292e3923a11385e3dca2b29dd8bcd87c2d9417bc4974d1f",
}


def no_overflow(page):
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "horizontal overflow"


def images_ready(page, selector):
    page.wait_for_function(
        "selector => [...document.querySelectorAll(selector)].every(i => i.complete && i.naturalWidth > 0)",
        arg=selector,
    )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    try:
        for width in [375, 390, 768, 1440]:
            context = browser.new_context(viewport={"width": width, "height": 900}, accept_downloads=True)
            try:
                page = context.new_page()
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.goto(base + "/racco#members", wait_until="networkidle")
                cat = page.locator("#bl-muchimuchi")
                expect(cat.get_by_role("heading", name="むちむち猫", exact=True)).to_be_visible()
                expect(page.locator("#bl-fuwafuwa-title")).to_have_text("ふわふわさん")
                expect(page.locator(".bl-cast-roles article")).to_have_count(3)
                images_ready(page, "#bl-muchimuchi img")
                no_overflow(page)
                if width in [390, 1440]:
                    cat.screenshot(path=str(output / f"members-{width}.png"))
                portrait = cat.get_by_role("button", name="むちむち猫を拡大", exact=True)
                portrait.click()
                dialog = page.get_by_role("dialog", name="むちむち猫のプレビュー", exact=True)
                expect(dialog).to_be_visible()
                images_ready(page, "#bl-preview img")
                expect(dialog.get_by_role("link", name="画像を保存", exact=True)).to_have_attribute("href", character)
                page.keyboard.press("Escape")
                expect(dialog).not_to_be_visible()
                expect(portrait).to_be_focused()
                cat.get_by_role("button", name="みんなの風景を見る", exact=True).click()
                scene_dialog = page.get_by_role("dialog", name="今日も、ここにいる。のプレビュー", exact=True)
                expect(scene_dialog).to_be_visible()
                images_ready(page, "#bl-preview img")
                expect(scene_dialog.get_by_role("link", name="画像を保存", exact=True)).to_have_attribute("href", scene)
                scene_dialog.get_by_role("button", name="画像を閉じる", exact=True).click()
                expect(scene_dialog).not_to_be_visible()
                with page.expect_download() as download_event:
                    cat.get_by_role("link", name="むちむち猫の画像を保存", exact=True).click()
                download = download_event.value
                assert download.failure() is None
                # Vercel's Content-Disposition filename takes precedence over
                # the link's download name; both preserve the original PNG.
                assert download.suggested_filename in {"muchimuchi-cat.png", "muchimuchi-cat-character-v1.png"}, download.suggested_filename
                assert hashlib.sha256(Path(download.path()).read_bytes()).hexdigest() == hashes[character]

                page.goto(base + "/racco#gallery-muchimuchi", wait_until="networkidle")
                expect(page.locator(".bl-visual-grid .bl-card")).to_have_count(2)
                selected = page.locator('.bl-asset-filters button[aria-pressed="true"]')
                expect(selected).to_contain_text("むちむち猫")
                images_ready(page, ".bl-visual-grid img")
                page.locator(".bl-pane h1").scroll_into_view_if_needed()
                expect(page.locator(".bl-pane h1")).to_have_css("opacity", "1")
                expect(page.locator(".bl-asset-context")).to_have_css("opacity", "1")
                no_overflow(page)
                if width in [390, 1440]:
                    page.screenshot(path=str(output / f"gallery-{width}.png"), full_page=True)
                page.reload(wait_until="networkidle")
                expect(page.locator(".bl-visual-grid .bl-card")).to_have_count(2)
                page.get_by_role("button", name="素材を保存", exact=True).click()
                expect(page).to_have_url(base + "/racco/studio#assets-muchimuchi")
                expect(page.locator(".bl-visual-grid .bl-card")).to_have_count(2)
                save = page.get_by_role("link", name="むちむち猫の画像を保存", exact=True)
                expect(save).to_have_attribute("href", character)
                page.locator(".bl-asset-filters button").filter(has_text="ふわふわさん").click()
                expect(page.locator(".bl-visual-grid .bl-card")).to_have_count(2)
                page.locator(".bl-asset-filters button").filter(has_text="すべて").click()
                expect(page.locator(".bl-visual-grid .bl-card")).to_have_count(29)
                no_overflow(page)
                assert not errors, errors
                print(json.dumps({"width": width, "result": "PASS", "checks": "members, two previews, escape/focus, exact PNG download, deep link, reload, filter, preserved assets, no overflow/pageerror"}, ensure_ascii=False))
            finally:
                context.close()
        request = playwright.request.new_context()
        try:
            for path, expected_hash in hashes.items():
                response = request.get(base + path)
                assert response.status == 200
                assert "image/png" in response.headers["content-type"]
                assert hashlib.sha256(response.body()).hexdigest() == expected_hash
            print("PASS both original PNGs: HTTP200, PNG MIME, SHA-256 equality")
        finally:
            request.dispose()
    finally:
        browser.close()
