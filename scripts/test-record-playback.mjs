import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = ts.transpileModule(fs.readFileSync('src/lib/records/playback.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function setup(paused = false) {
  let allowed = false, constructions = 0;
  const session = new Map(paused ? [['lakkan-sound-paused','true']] : []);
  class Engine {
    constructor(){constructions++;this.plays=0;this.hasTrack=false;this.isPlaying=false;}
    preload(){}
    play(){this.plays++;this.hasTrack=true;this.isPlaying=allowed;this.onPlaybackChange?.(allowed);}
    pause(){this.isPlaying=false;this.onPlaybackChange?.(false);}
    resume(){this.isPlaying=allowed;this.onPlaybackChange?.(allowed);}
  }
  const exports = {};
  const context = {exports, KeyboardEvent:class {},sessionStorage:{getItem:key=>session.get(key),setItem:(key,value)=>session.set(key,value)},require:name=>name==='react'?{useSyncExternalStore:(_,get)=>get()}:name.includes('engine')?{MusicEngine:Engine}:{recordDiscs:[{track:{id:0}},{track:{id:1}}]}};
  vm.runInNewContext(source,context);
  return {api:exports,allow:()=>{allowed=true},count:()=>constructions};
}
const test = setup(), p = test.api;
p.startSiteAudio();
assert.equal(p.useRecordPlayback().playing,false,'blocked autoplay must not display playing');
assert.equal(p.peekRecordEngine().plays,1);
p.unlockSiteAudio({isTrusted:false});
assert.equal(p.peekRecordEngine().plays,1,'synthetic input cannot unlock audio');
test.allow();
p.unlockSiteAudio({isTrusted:true,target:{closest:()=>null}});
assert.equal(p.useRecordPlayback().playing,true,'first real eligible gesture starts the existing track');
p.startSiteAudio();
assert.equal(test.count(),1,'navigation reuses one engine');
assert.equal(p.peekRecordEngine().plays,2,'navigation does not restart the track');
p.pauseRecord();
p.unlockSiteAudio({isTrusted:true,target:{closest:()=>null}});
p.startSiteAudio();
assert.equal(p.useRecordPlayback().playing,false,'explicit pause survives subsequent gestures and navigation');
p.playRecord(1);
assert.equal(p.useRecordPlayback().loaded,1);
p.getRecordEngine().onEnded();
assert.equal(p.useRecordPlayback().loaded,0,'end of catalogue loops to first record');
const silent = setup(true);
silent.api.startSiteAudio();
assert.equal(silent.count(),0,'saved pause is respected on reload');
console.log('PASS shared audio: blocked autoplay, genuine gesture, one engine, route continuity, pause, reload, album advance');
