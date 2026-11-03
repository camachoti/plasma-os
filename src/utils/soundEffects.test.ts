import test from 'node:test';
import assert from 'node:assert/strict';
import { soundEffects } from './soundEffects';

test('soundEffects initializes with defaults and toggles enabled state', () => {
  soundEffects.setEnabled(true);
  assert.equal(soundEffects.isEnabled(), true);

  soundEffects.setEnabled(false);
  assert.equal(soundEffects.isEnabled(), false);

  soundEffects.setEnabled(true);
  assert.equal(soundEffects.isEnabled(), true);
});

test('soundEffects clamps volume between 0 and 100', () => {
  soundEffects.setVolume(50);
  assert.equal(soundEffects.getVolume(), 50);

  soundEffects.setVolume(150);
  assert.equal(soundEffects.getVolume(), 100);

  soundEffects.setVolume(-20);
  assert.equal(soundEffects.getVolume(), 0);

  soundEffects.setVolume(75);
  assert.equal(soundEffects.getVolume(), 75);
});

test('soundEffects methods do not throw even when AudioContext is mocked or absent', () => {
  assert.doesNotThrow(() => {
    soundEffects.play('window-open');
    soundEffects.play('window-close');
    soundEffects.play('window-minimize');
    soundEffects.play('window-restore');
    soundEffects.play('window-snap');
    soundEffects.play('notification');
    soundEffects.play('click');
    soundEffects.play('toggle-on');
    soundEffects.play('toggle-off');
    soundEffects.play('trash');
  });
});
