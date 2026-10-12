"""Bounded, read-only browser acceptance for the approved merchandise rollout.

Usage: python test-merch-browser.py BASE_URL OUTPUT_DIR
Uses one isolated headless browser; never submits the contact form.
"""
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

base = sys.argv[1].rstrip("/")
output = Path(sys.argv[2])
output.mkdir(parents=True, exist_ok=True)
marks = [
    ("Lakkan 英字ロゴ", "lakkan-wordmark", "lakkan-wordmark-only-v1"),
    ("楽観 縦書きロゴ", "rakkan-seal", "rakkan-seal-only-v1"),
    ("Racco フェイス", "racco-face", "racco-face-only-v1"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        page = browser.new_page(reduced_motion="reduce")
        page.set_default_timeout(20000)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        pending = set()
        page.on("request", lambda request: pending.add(request.url))
        page.on("requestfinished", lambda request: pending.discard(request.url))
        page.on("requestfailed", lambda request: pending.discard(request.url))

        def visit(path):
            try:
                page.goto(base + path, wait_until="networkidle", timeout=45000)
            except Exception:
                print("Pending requests:", sorted(pending), flush=True)
                print("Visible merchandise images:", page.locator('.bs-merch-grid img').evaluate_all("imgs => imgs.map(i => ({src:i.currentSrc,complete:i.complete,width:i.naturalWidth}))"), flush=True)
                raise
            page.evaluate("document.fonts.ready")

        def fits():
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), page.url + " horizontal overflow"

        for width in [375, 768, 1024, 1440]:
            if width != 375:
                # Isolate each device journey so canceled lazy-image requests
                # from a resized previous journey cannot occupy its connections.
                page.close()
                pending.clear()
                page = browser.new_page(reduced_motion="reduce")
                page.set_default_timeout(20000)
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("request", lambda request: pending.add(request.url))
                page.on("requestfinished", lambda request: pending.discard(request.url))
                page.on("requestfailed", lambda request: pending.discard(request.url))
            page.set_viewport_size({"width": width, "height": 960})
            visit("/racco#gallery-apparel")
            expect(page.locator('.bl-card[data-group="apparel"]')).to_have_count(3)
            fits()
            if width in [375, 1440]:
                page.screenshot(path=str(output / f"gallery-{width}.png"), full_page=True)
            for title, slug, image in marks:
                page.get_by_role("button", name=title + "を拡大", exact=True).click()
                modal = page.get_by_role("dialog", name=title + "のプレビュー", exact=True)
                expect(modal).to_be_visible()
                expect(modal.get_by_role("link", name="画像を保存")).to_have_attribute("href", f"/brand-book/{image}.png")
                modal.get_by_role("link", name="この絵柄のグッズを見る").click()
                expect(page).to_have_url(base + "/racco/goods/" + slug)
                expect(page.get_by_role("heading", name=title, exact=True)).to_be_visible()
                expect(page.locator(".bl-goods-label")).to_have_text("商品化準備中")
                fits()
                page.get_by_role("link", name="グッズについて問い合わせる").click()
                expect(page.locator("#message")).to_have_value(re.compile(title))
                fits()
                visit("/racco#gallery-apparel")
            page.get_by_role("button", name=re.compile(r"むちむち猫\s*2$")).click()
            expect(page.locator(".bl-card")).to_have_count(2)
            page.get_by_role("button", name=re.compile(r"ふわふわさん\s*2$")).click()
            expect(page.locator(".bl-card")).to_have_count(2)
            visit("/concept")
            expect(page.locator(".bl-merch-grid .bl-card")).to_have_count(3)
            fits()
            if width in [375, 1440]:
                page.locator(".bl-goods-home").screenshot(path=str(output / f"concept-merch-{width}.png"))
            visit("/concept#assets")
            expect(page.locator(".bl-card")).to_have_count(5)
            fits()
            visit("/racco/studio#assets-apparel")
            expect(page.locator(".bl-card")).to_have_count(3)
            expect(page.locator('.bl-card a[download]')).to_have_count(3)
            fits()
            visit("/brand-guide#visual")
            expect(page.locator(".bs-merch-grid figure")).to_have_count(3)
            fits()
            print(f"PASS {width}px: three gallery dialogs → goods → inquiry, old collections, concept, download and guide")

        page.set_viewport_size({"width": 1440, "height": 1000})
        visit("/brand-book")
        expect(page.locator(".bp-sheet")).to_have_count(12)
        expect(page.locator("#book-page-11 .bp-merch-grid figure")).to_have_count(3)
        page.emulate_media(media="print")
        overflow = page.locator(".bp-sheet").evaluate_all("""sheets => sheets.flatMap(sheet => {
          const body = sheet.querySelector('.bp-sheet-body');
          const footer = sheet.querySelector('.bp-page-foot').getBoundingClientRect();
          const bottom = Math.max(...[...body.querySelectorAll('*')].map(e => e.getBoundingClientRect().bottom));
          return bottom > footer.top + 1 ? [{page: sheet.id, overlap: bottom-footer.top}] : [];
        })""")
        assert not overflow, overflow
        page.locator("#book-page-11").screenshot(path=str(output / "brand-book-merch.png"))
        assert not errors, errors
        print("PASS print: 12 pages, 3 approved boards, no content/footer overlap; no browser runtime errors")
    finally:
        browser.close()
