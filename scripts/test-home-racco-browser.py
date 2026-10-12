#!/usr/bin/env python3
"""Bounded homepage/Racco navigation E2E and reproducible layout measurements."""
import argparse
import json
import signal
import time
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout


WIDTHS = (375, 768, 1024, 1440)
HEIGHT = 900
MEASURE = r"""() => {
  const rounded = n => Math.round(n * 100) / 100;
  const rect = el => {
    const r = el.getBoundingClientRect();
    return {x:rounded(r.x), y:rounded(r.y), documentY:rounded(r.y+scrollY),
      width:rounded(r.width), height:rounded(r.height), right:rounded(r.right), bottom:rounded(r.bottom)};
  };
  const shown = el => {const r=el.getBoundingClientRect(); const s=getComputedStyle(el);
    return r.width>0 && r.height>0 && s.display!=='none' && s.visibility!=='hidden';};
  const label = el => el.id ? '#'+el.id : el.tagName.toLowerCase()+'.'+String(el.className).trim().replace(/\s+/g,'.');
  const heading = el => {
    const lines=[]; const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    let node;
    while(node=walker.nextNode()) for(let i=0;i<node.length;i++) {
      const range=document.createRange(); range.setStart(node,i); range.setEnd(node,i+1);
      const r=range.getBoundingClientRect(); if(!r.width || !r.height) continue;
      let line=lines.find(l=>Math.abs(l.y-r.y)<2);
      if(!line) {line={y:r.y,text:''};lines.push(line);} line.text+=node.textContent[i];
    }
    const s=getComputedStyle(el);
    return {selector:label(el),text:el.textContent.trim(),rect:rect(el),
      parentWidth:rounded(el.parentElement.getBoundingClientRect().width),
      fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,
      lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,
      lines:lines.sort((a,b)=>a.y-b.y).map(l=>l.text),
      localOverflow:Math.max(0,el.scrollWidth-el.clientWidth)};
  };
  return {url:location.href,viewport:{width:innerWidth,height:innerHeight},scrollY,
    fontsStatus:document.fonts.status,
    overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
    headings:[...document.querySelectorAll('main h1, main h2')].filter(shown).map(heading),
    links:[...document.querySelectorAll('main a, main button')].filter(shown).map(el=>{
      const r=rect(el); return {selector:label(el),text:el.textContent.trim(),href:el.getAttribute('href'),
        ariaLabel:el.getAttribute('aria-label'),ariaLabelledby:el.getAttribute('aria-labelledby'),rect:r,
        firstView:r.y>=0 && r.bottom<=innerHeight,touch44:r.width>=44 && r.height>=44};}),
    outOfBounds:[...document.querySelectorAll('main *')].filter(shown).filter(el=>{
      const r=el.getBoundingClientRect();return r.left < -1 || r.right>innerWidth+1;
    }).slice(0,40).map(el=>({selector:label(el),rect:rect(el)})),
    images:[...document.querySelectorAll('main img')].map(el=>({src:el.getAttribute('src'),alt:el.alt,
      complete:el.complete,naturalWidth:el.naturalWidth,rect:rect(el)})),
    paragraphs:[...document.querySelectorAll('#home-racco p')].map(el=>({text:el.textContent,
      rect:rect(el),lineHeight:getComputedStyle(el).lineHeight})),
    sections:[...document.querySelectorAll('main > section')].map(el=>({selector:label(el),rect:rect(el),
      paddingTop:getComputedStyle(el).paddingTop,paddingBottom:getComputedStyle(el).paddingBottom}))};
}"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase', choices=('before', 'after'), required=True)
    parser.add_argument('--base-url', required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--dom-only', action='store_true', help='Repeat measurements without screenshots/navigation')
    parser.add_argument('--compare-to', type=Path, help='Previous report.json for DOM stability comparison')
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    result = {'phase': args.phase, 'baseURL': args.base_url, 'height': HEIGHT,
              'domOnly': args.dom_only, 'widths': [], 'errors': [], 'consoleErrors': [],
              'pageErrors': [], 'failedRequests': [], 'httpErrors': [], 'readinessNotes': []}
    started = time.monotonic()

    def timed_out(_signum, _frame):
        raise TimeoutError('Run exceeded 180-second deadline')

    signal.signal(signal.SIGALRM, timed_out)
    signal.alarm(180)
    browser = None
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            try:
                context = browser.new_context(viewport={'width': WIDTHS[0], 'height': HEIGHT},
                    locale='ja-JP', reduced_motion='reduce', device_scale_factor=1)
                page = context.new_page()
                def attach_events():
                    page.set_default_timeout(10000)
                    page.on('console', lambda msg: result['consoleErrors'].append(msg.text) if msg.type == 'error' else None)
                    page.on('pageerror', lambda err: result['pageErrors'].append(str(err)))
                    page.on('requestfailed', lambda req: result['failedRequests'].append({'url':req.url,'failure':req.failure}))
                    page.on('response', lambda response: result['httpErrors'].append({'url':response.url,'status':response.status}) if response.status >= 400 else None)

                def home():
                    nonlocal context, page
                    viewport = page.viewport_size
                    context.close()
                    context = browser.new_context(viewport=viewport, locale='ja-JP', reduced_motion='reduce', device_scale_factor=1)
                    page = context.new_page()
                    attach_events()
                    page.goto(args.base_url.rstrip('/')+'/', wait_until='domcontentloaded', timeout=20000)
                    try:
                        page.wait_for_load_state('networkidle', timeout=3000)
                    except PlaywrightTimeout:
                        result['readinessNotes'].append('Network remained active; used visible homepage, fonts and target image readiness instead')
                    page.locator('main.poster-home').wait_for(state='visible')
                    page.evaluate('document.fonts.ready')
                    page.evaluate('window.scrollTo(0,0)')
                    page.wait_for_timeout(150)

                def check(condition, detail):
                    if not condition:
                        result['errors'].append(detail)

                for width in WIDTHS:
                    page.set_viewport_size({'width': width, 'height': HEIGHT})
                    home()
                    measurement = page.evaluate(MEASURE)
                    measurement['navigation'] = []
                    result['widths'].append(measurement)
                    if not args.dom_only:
                        page.screenshot(path=str(args.output_dir/f'{width}-first-view.png'), animations='disabled')
                    targets = [".racco-guide-link[href='/racco']"] if args.phase == 'before' else [".poster-nav a[href='/racco']", '.home-racco-link']
                    if args.phase == 'after':
                        check(measurement['overflow'] == 0, f'{width}: document overflow {measurement["overflow"]}')
                        for selector in targets:
                            locator = page.locator(selector)
                            check(locator.count() == 1, f'{width}: expected one {selector}')
                            if locator.count() != 1:
                                continue
                            check(locator.get_attribute('href') == '/racco', f'{width}: wrong href {selector}')
                            box = locator.bounding_box()
                            check(bool(box and box['width'] >= 44 and box['height'] >= 44), f'{width}: target below 44px {selector}: {box}')
                        card = page.locator('.home-racco-link')
                        if card.count() == 1:
                            check(card.get_attribute('aria-labelledby') == 'home-racco-title home-racco-cta', f'{width}: card aria-labelledby mismatch')
                            for label_id in ('home-racco-title', 'home-racco-cta'):
                                check(page.locator('#'+label_id).count() == 1, f'{width}: missing/duplicate {label_id}')
                            card.scroll_into_view_if_needed()
                            page.wait_for_function("() => [...document.querySelectorAll('.home-racco-link img')].length>0 && [...document.querySelectorAll('.home-racco-link img')].every(i=>i.complete && i.naturalWidth>0)")
                            measurement['raccoImages'] = card.locator('img').evaluate_all('(els)=>els.map(i=>({src:i.currentSrc,complete:i.complete,naturalWidth:i.naturalWidth}))')
                            if not args.dom_only:
                                card.screenshot(path=str(args.output_dir/f'{width}-racco-entry.png'), animations='disabled')
                    if not args.dom_only:
                        for selector in targets:
                            for method in (('click',) if args.phase == 'before' else ('click', 'Enter')):
                                home()
                                locator = page.locator(selector)
                                if method == 'click':
                                    locator.click()
                                else:
                                    locator.focus()
                                    locator.press('Enter')
                                page.wait_for_url('**/racco', wait_until='domcontentloaded')
                                passed = urlparse(page.url).path == '/racco'
                                measurement['navigation'].append({'selector':selector,'method':method,'url':page.url,'passed':passed})
                                check(passed, f'{width}: {selector} {method} navigation failed')
                    print(f'{args.phase}: width={width} overflow={measurement["overflow"]} raccoLinks={len([l for l in measurement["links"] if l["href"]=="/racco"])} navigations={len(measurement["navigation"])}', flush=True)
                if args.compare_to:
                    previous = json.loads(args.compare_to.read_text())
                    for old, new in zip(previous['widths'], result['widths']):
                        width = new['viewport']['width']
                        check(old['overflow'] == new['overflow'], f'{width}: unstable overflow')
                        check([(h['text'],h['lines']) for h in old['headings']] == [(h['text'],h['lines']) for h in new['headings']], f'{width}: unstable heading lines')
                        for selector in targets:
                            old_links = [l for l in old['links'] if l['href']=='/racco']
                            new_links = [l for l in new['links'] if l['href']=='/racco']
                            check(old_links == new_links, f'{width}: unstable Racco link measurements ({selector})')
                if args.phase == 'after':
                    check(not result['consoleErrors'], 'Console errors present')
                    check(not result['pageErrors'], 'Page errors present')
                    check(not result['httpErrors'], 'HTTP errors present')
            finally:
                browser.close()
                browser = None
    except Exception as exc:
        result['errors'].append(f'{type(exc).__name__}: {exc}')
    finally:
        signal.alarm(0)
        result['elapsedSeconds'] = round(time.monotonic()-started, 2)
        result['passed'] = not result['errors'] and len(result['widths']) == len(WIDTHS)
        (args.output_dir/'report.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
        print(json.dumps({'passed':result['passed'],'errors':result['errors'],'elapsedSeconds':result['elapsedSeconds'],'report':str(args.output_dir/'report.json')}, ensure_ascii=False), flush=True)
    return 0 if result['passed'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
