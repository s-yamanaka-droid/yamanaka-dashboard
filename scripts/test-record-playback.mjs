import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(path) {
  return ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}

function setup() {
  let constructions = 0;
  const events = new Map();
  const discs = [0, 1].map(id => ({ title: `Record ${id}`, src: `/disc-${id}.png`, track: { id } }));
  class KeyboardEvent {
    constructor(key) { this.key = key; this.isTrusted = true; this.target = { closest: () => null }; }
  }
  class Engine {
    constructor() { constructions++; this.plays = 0; this.hasTrack = false; this.isPlaying = false; }
    preload() {}
    play() { this.plays++; this.hasTrack = true; this.isPlaying = true; this.onPlaybackChange?.(true); }
    pause() { this.isPlaying = false; this.onPlaybackChange?.(false); }
    resume() { this.isPlaying = true; this.onPlaybackChange?.(true); }
  }
  const react = { useSyncExternalStore: (_, get) => get(), useEffect: effect => effect() };
  const playback = {};
  vm.runInNewContext(compile('src/lib/records/playback.ts'), {
    exports: playback, KeyboardEvent,
    sessionStorage: { getItem: () => null, setItem() {} },
    require: name => name === 'react' ? react : name.includes('engine') ? { MusicEngine: Engine } : { recordDiscs: discs },
  });
  function mount(pathname = '/about') {
    const component = {};
    vm.runInNewContext(compile('src/components/records/SiteSound.tsx'), {
      exports: component, navigator: {},
      document: {
        addEventListener: (name, handler) => events.set(name, handler),
        removeEventListener: name => events.delete(name),
      },
      require: name => {
        if (name === 'react') return react;
        if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
        if (name === 'next/navigation') return { usePathname: () => pathname };
        if (name.endsWith('/playback')) return playback;
        if (name.endsWith('/catalog')) return { recordDiscs: discs };
        return {};
      },
    });
    return component.SiteSound();
  }
  return {
    api: playback, mount, count: () => constructions,
    interact() {
      events.get('click')?.({ isTrusted: true, target: { closest: () => null } });
      events.get('keydown')?.(new KeyboardEvent('Enter'));
    },
  };
}

const site = setup(), p = site.api;
const player = site.mount();
assert.equal(p.useRecordPlayback().playing, false, 'opening a company page must stay silent even when the browser allows audio');
assert.equal(site.count(), 0, 'opening a company page must not create or preload an audio engine');
site.interact();
assert.equal(site.count(), 0, 'ordinary page clicks and Enter must not start audio');
assert.equal(player.props.children[0].props['aria-pressed'], false);

player.props.children[0].props.onClick();
assert.equal(p.useRecordPlayback().playing, true, 'the explicit music control can start playback');
assert.equal(p.peekRecordEngine().plays, 1);
site.mount('/services');
assert.equal(site.count(), 1, 'navigation reuses the explicit listening session');
assert.equal(p.peekRecordEngine().plays, 1, 'navigation does not restart the track');
p.pauseRecord();
site.interact();
site.mount('/about');
assert.equal(p.useRecordPlayback().playing, false, 'pause survives ordinary interaction and navigation');
p.toggleRecord();
assert.equal(p.useRecordPlayback().playing, true, 'the explicit control resumes the paused record');
assert.equal(p.peekRecordEngine().plays, 1, 'resume does not restart the track');
p.playRecord(1);
p.getRecordEngine().onEnded();
assert.equal(p.useRecordPlayback().loaded, 0, 'the album still advances and loops');

const reload = setup();
reload.mount();
assert.equal(reload.api.useRecordPlayback().playing, false, 'a new page session always starts silent');
assert.equal(reload.count(), 0);
console.log('PASS shared audio: silent opening and ordinary gestures, explicit play/resume, route continuity, pause, fresh session, album advance');
