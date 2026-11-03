import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTaskbarThickness,
  computeTaskbarLayout,
  calculateWindowSnap,
  detectSnapTarget,
  executeDebianCommand,
  TaskbarSettings,
} from './desktopConfig';

test('getTaskbarThickness returns correct heights for compact, standard, large', () => {
  assert.equal(getTaskbarThickness('compact'), 44);
  assert.equal(getTaskbarThickness('standard'), 52);
  assert.equal(getTaskbarThickness('large'), 64);
});

test('computeTaskbarLayout applies proper blur, opacity and orientation', () => {
  const defaultSettings: TaskbarSettings = {
    position: 'bottom',
    mode: 'dock',
    startMenuMode: 'conventional',
    size: 'standard',
    opacity: 80,
    blur: 'ultra',
    autoHide: false,
    centeredIcons: true,
    showDesktopButton: true,
    showSeconds: false,
    showCalendar: true,
    showQuickSettings: true,
    iconGlow: false,
  };

  const layoutDark = computeTaskbarLayout(defaultSettings, true);
  assert.equal(layoutDark.isHorizontal, true);
  assert.equal(layoutDark.thickness, 52);
  assert.ok(layoutDark.style.backdropFilter.includes('30px'));
  assert.ok(layoutDark.style.backgroundColor.includes('rgba(18, 24, 34'));

  const verticalSettings: TaskbarSettings = {
    ...defaultSettings,
    position: 'left',
    blur: 'subtle',
  };
  const layoutLight = computeTaskbarLayout(verticalSettings, false);
  assert.equal(layoutLight.isHorizontal, false);
  assert.ok(layoutLight.style.backdropFilter.includes('10px'));
  assert.ok(layoutLight.style.backgroundColor.includes('rgba(255, 255, 255'));
});

test('calculateWindowSnap correctly divides screen for left, right, and maximize', () => {
  const snapLeft = calculateWindowSnap('left', 1440, 900, 'bottom', 52, false);
  assert.equal(snapLeft.x, 0);
  assert.equal(snapLeft.y, 0);
  assert.equal(snapLeft.height, 900 - 52);
  assert.equal(snapLeft.width, Math.floor(1440 / 2) - 3);

  const snapRight = calculateWindowSnap('right', 1440, 900, 'bottom', 52, false);
  assert.equal(snapRight.x, Math.floor(1440 / 2) + 3);
  assert.equal(snapRight.width, Math.floor(1440 / 2) - 3);

  const snapMaximize = calculateWindowSnap('maximize', 1440, 900, 'top', 52, false);
  assert.equal(snapMaximize.x, 0);
  assert.equal(snapMaximize.y, 52);
  assert.equal(snapMaximize.height, 900 - 52);
  assert.equal(snapMaximize.width, 1440);
});

test('executeDebianCommand processes Debian commands correctly', () => {
  const neofetchRes = executeDebianCommand('neofetch');
  assert.ok(neofetchRes.output.includes('Debian GNU/Linux 13 (trixie)'));
  assert.ok(neofetchRes.output.includes('Kernel: 6.12.9-amd64'));

  const unameRes = executeDebianCommand('uname -a');
  assert.ok(unameRes.output.includes('Linux debian-trixie 6.12.9-amd64'));

  const osReleaseRes = executeDebianCommand('cat /etc/os-release');
  assert.ok(osReleaseRes.output.includes('Debian GNU/Linux 13'));

  const aptUpdateRes = executeDebianCommand('apt update');
  assert.ok(aptUpdateRes.output.includes('deb.debian.org/debian'));

  const aptInstallRes = executeDebianCommand('apt install gimp');
  assert.ok(aptInstallRes.output.includes('gimp foi instalado com sucesso'));

  const clearRes = executeDebianCommand('clear');
  assert.equal(clearRes.clear, true);
});

test('detectSnapTarget triggers maximize at top and left/right at screen boundaries', () => {
  // Top edge triggers maximize
  assert.equal(detectSnapTarget(500, 10, 1440, 900), 'maximize');
  assert.equal(detectSnapTarget(1000, 24, 1440, 900), 'maximize');

  // Left edge triggers left snap
  assert.equal(detectSnapTarget(10, 300, 1440, 900), 'left');
  assert.equal(detectSnapTarget(24, 500, 1440, 900), 'left');

  // Right edge triggers right snap
  assert.equal(detectSnapTarget(1430, 300, 1440, 900), 'right');
  assert.equal(detectSnapTarget(1440 - 24, 400, 1440, 900), 'right');

  // Middle of screen triggers nothing
  assert.equal(detectSnapTarget(500, 300, 1440, 900), null);
});
