/**
 * Desktop Configuration and Pure Domain Logic for Debian Silk / OpenKylin OS
 * Dignified, realistic desktop environment aesthetics (anti-neon, authentic OS design)
 */

export type TaskbarPosition = 'bottom' | 'top' | 'left' | 'right';
export type TaskbarMode = 'dock' | 'panel';
export type StartMenuMode = 'conventional' | 'expanded';
export type TaskbarSize = 'compact' | 'standard' | 'large';
export type DesktopIconSize = 'small' | 'medium' | 'large';
export type FolderViewMode = 'grid' | 'list';
export type FolderIconSize = 'small' | 'medium' | 'large';
export type StartIconStyle = 'debian' | 'debian-swirl' | 'openkylin' | 'grid';
export type BlurIntensity = 'subtle' | 'medium' | 'ultra' | 'none';
export type ThemeMode = 'dark' | 'light';

export interface TaskbarSettings {
  position: TaskbarPosition;
  mode: TaskbarMode;
  startMenuMode: StartMenuMode;
  startIconStyle?: StartIconStyle;
  size: TaskbarSize;
  opacity: number; // 0 to 100
  blur: BlurIntensity;
  autoHide: boolean;
  centeredIcons: boolean;
  showDesktopButton: boolean;
  showSeconds: boolean;
  showCalendar: boolean;
  showQuickSettings: boolean;
  iconGlow: boolean;
}

export type SnapTarget = 'left' | 'right' | 'maximize';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  snappedSide?: 'left' | 'right' | null;
  prevRect?: { x: number; y: number; width: number; height: number };
  zIndex: number;
}

export interface SystemProcess {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memoryMb: number;
  status: 'running' | 'sleeping';
}

export const WALLPAPERS = [
  {
    id: 'mist-forest',
    name: 'Debian Silk Névoa (Padrão)',
    path: '/src/assets/images/wallpaper_mist_forest_1793592607835.jpg',
    category: 'Oficial Debian Silk',
    tag: 'Sereno / Paisagem Natural',
  },
  {
    id: 'debian-granite',
    name: 'Debian 13 Granito & Metal',
    path: '/src/assets/images/wallpaper_debian_granite_1793592607759.jpg',
    category: 'Oficial Debian GNU/Linux',
    tag: 'Sóbrio / Corporativo',
  },
  {
    id: 'nordic-peak',
    name: 'Lago Nórdico & Alvorada',
    path: '/src/assets/images/wallpaper_nordic_peak_1793592607556.jpg',
    category: 'Fotografia Clássica',
    tag: 'Límpido / Matinal',
  },
  {
    id: 'silk-glass',
    name: 'Ondas de Seda Acrílica',
    path: '/src/assets/images/wallpaper_silk_debian_1793591773341.jpg',
    category: 'Abstrato Silk DE',
    tag: 'Fluido / Vidro',
  },
] as const;

export const ACCENT_COLORS = [
  { id: 'silk-blue', name: 'Azul Silk Oficial', hex: '#2563eb' },
  { id: 'debian-ruby', name: 'Debian Rubro Oficial', hex: '#d70a53' },
  { id: 'openkylin-teal', name: 'Verde OpenKylin', hex: '#00a884' },
  { id: 'slate', name: 'Grafite Nórdico', hex: '#475569' },
  { id: 'indigo', name: 'Índigo Profundo', hex: '#4f46e5' },
  { id: 'amber', name: 'Âmbar Executivo', hex: '#d97706' },
] as const;

/**
 * Calculates thickness in px for taskbars based on size setting
 */
export function getTaskbarThickness(size: TaskbarSize): number {
  switch (size) {
    case 'compact':
      return 44;
    case 'large':
      return 64;
    case 'standard':
    default:
      return 52;
  }
}

/**
 * Determines CSS styling and classes for taskbar layout based on settings.
 * Authentic OS design: no neon colored glows, natural glass lighting.
 */
export function computeTaskbarLayout(settings: TaskbarSettings, isDark: boolean) {
  const isHorizontal = settings.position === 'bottom' || settings.position === 'top';
  const thickness = getTaskbarThickness(settings.size);

  let backdropFilter = 'blur(20px) saturate(140%)';
  if (settings.blur === 'subtle') backdropFilter = 'blur(10px) saturate(120%)';
  if (settings.blur === 'ultra') backdropFilter = 'blur(30px) saturate(160%)';
  if (settings.blur === 'none') backdropFilter = 'none';

  const opacityDecimal = Math.max(0.2, Math.min(1, settings.opacity / 100));
  const bgRgba = isDark
    ? `rgba(18, 24, 34, ${opacityDecimal * 0.85})`
    : `rgba(255, 255, 255, ${opacityDecimal * 0.86})`;

  const borderColor = isDark
    ? `rgba(255, 255, 255, 0.08)`
    : `rgba(148, 163, 184, 0.28)`;

  const boxShadow = isDark
    ? '0 8px 30px rgba(0, 0, 0, 0.45)'
    : '0 8px 30px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.04)';

  return {
    isHorizontal,
    thickness,
    style: {
      backdropFilter,
      WebkitBackdropFilter: backdropFilter,
      backgroundColor: bgRgba,
      borderColor,
      boxShadow,
    },
  };
}

/**
 * Computes window snap coordinates
 */
export function calculateWindowSnap(
  side: 'left' | 'right' | 'maximize',
  screenWidth: number,
  screenHeight: number,
  taskbarPos: TaskbarPosition,
  taskbarThickness: number,
  isDockMode: boolean
) {
  const reservedGap = isDockMode ? 8 : 0;
  let top = taskbarPos === 'top' ? taskbarThickness + reservedGap : reservedGap;
  let bottom = taskbarPos === 'bottom' ? taskbarThickness + reservedGap : reservedGap;
  let left = taskbarPos === 'left' ? taskbarThickness + reservedGap : reservedGap;
  let right = taskbarPos === 'right' ? taskbarThickness + reservedGap : reservedGap;

  const availableWidth = screenWidth - left - right;
  const availableHeight = screenHeight - top - bottom;

  if (side === 'maximize') {
    return {
      x: left,
      y: top,
      width: availableWidth,
      height: availableHeight,
    };
  }

  if (side === 'left') {
    return {
      x: left,
      y: top,
      width: Math.floor(availableWidth / 2) - 3,
      height: availableHeight,
    };
  }

  return {
    x: left + Math.floor(availableWidth / 2) + 3,
    y: top,
    width: Math.floor(availableWidth / 2) - 3,
    height: availableHeight,
  };
}

/**
 * Detects whether cursor position triggers Aero Snap zone (top, left, right edge)
 */
export function detectSnapTarget(
  clientX: number,
  clientY: number,
  screenWidth: number,
  _screenHeight: number,
  threshold: number = 24
): SnapTarget | null {
  if (clientY <= threshold) {
    return 'maximize';
  }
  if (clientX <= threshold) {
    return 'left';
  }
  if (clientX >= screenWidth - threshold) {
    return 'right';
  }
  return null;
}

/**
 * Real Debian Terminal Command Processor
 */
export interface TerminalResult {
  output: string;
  newDirectory?: string;
  clear?: boolean;
}

export function executeDebianCommand(
  rawInput: string,
  currentDir: string = '/home/debian',
  installedApps: string[] = ['firefox-esr', 'libreoffice', 'vlc']
): TerminalResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { output: '' };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'clear':
      return { output: '', clear: true };

    case 'help':
      return {
        output: `Debian GNU/Linux 13 (Trixie) - Shell de Ajuda
Comandos disponíveis:
  neofetch         - Exibe informações do sistema com arte oficial Debian
  uname -a         - Exibe informações do kernel Linux
  cat /etc/os-release - Exibe dados oficiais da distribuição
  apt update       - Simula atualização dos repositórios oficiais Debian
  apt list         - Lista pacotes instalados
  apt install <pkg>- Instala novos aplicativos do repositório
  ls [-la]         - Lista arquivos e diretórios
  df -h            - Mostra uso do sistema de arquivos
  free -m          - Mostra uso da memória RAM
  top              - Exibe processos em tempo real
  date             - Exibe data e hora local
  whoami           - Identifica o usuário atual
  clear            - Limpa o terminal`,
      };

    case 'whoami':
      return { output: 'debian' };

    case 'hostname':
      return { output: 'debian-trixie' };

    case 'date':
      return { output: new Date().toString() };

    case 'uname':
      if (args.includes('-a') || args.includes('-r')) {
        return {
          output: 'Linux debian-trixie 6.12.9-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.9-1 (2026) x86_64 GNU/Linux',
        };
      }
      return { output: 'Linux' };

    case 'cat':
      if (args[0] === '/etc/os-release' || args[0] === '/etc/issue') {
        return {
          output: `PRETTY_NAME="Debian GNU/Linux 13 (trixie)"
NAME="Debian GNU/Linux"
VERSION_ID="13"
VERSION="13 (trixie)"
VERSION_CODENAME=trixie
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
DESKTOP_SESSION="silk-openkylin"`,
        };
      }
      if (args[0] === 'bem-vindo.txt' || args[0] === 'welcome.txt') {
        return {
          output: `Bem-vindo ao Debian GNU/Linux 13 (Trixie) com interface Silk.
Um ambiente sóbrio, estável e elegante inspirado nas diretrizes do OpenKylin e GNOME/Deepin,
focado em produtividade real e alta fidelidade visual.`,
        };
      }
      return { output: `cat: ${args[0] || ''}: Arquivo ou diretório não encontrado` };

    case 'ls': {
      if (currentDir === '/home/debian') {
        return {
          output: `Documentos/  Downloads/  Imagens/  Música/  Vídeos/  Desktop/  bem-vindo.txt`,
        };
      }
      return { output: `bin/  boot/  dev/  etc/  home/  lib/  opt/  root/  sys/  usr/  var/` };
    }

    case 'free':
      return {
        output: `               total        used        free      shared  buff/cache   available
Mem:           15920        3420        9500         420        3000       12080
Swap:           4096           0        4096`,
      };

    case 'df':
      return {
        output: `Sist. Arq.      Tam. Usado Disp. Uso% Montado em
/dev/nvme0n1p2  460G   38G  399G   9% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
/dev/nvme0n1p1  512M   18M  494M   4% /boot/efi`,
      };

    case 'neofetch':
    case 'fastfetch':
      return {
        output: `       _,met$$$$$gg.          debian@debian-trixie
    ,g$$$$$$$$$$$$$$$P.       -------------------
  ,g$$P"        """Y$$.".     OS: Debian GNU/Linux 13 (trixie) x86_64
 ,$$P'              \`$$$.     Host: ThinkStation P-Series Workstation
',$$P       ,ggs.     \`$$b:   Kernel: 6.12.9-amd64
\`d$$'     ,$P"'   .    $$$    Uptime: 3 horas, 12 minutos
 $$P      d$'     ,    $$P    Packages: 1789 (dpkg), 6 (flatpak)
 $$:      $$.   -    ,d$$'    Shell: bash 5.2.32
 $$;      Y$b._   _,d$P'      Resolution: 2560x1440 @ 120Hz
 Y$$.    \`."Y$$$$P"'          DE: Silk Shell (UKUI 4.2 / OpenKylin Core)
 \`$$b      "-.__              WM: KWin-Wayland Compositor
  \`Y$$                        Theme: Silk Slate Frosted [GTK3/4]
   \`Y$$.                      Icons: Papirus-Silk-Clean
     \`$$b.                    Terminal: x-terminal-emulator
       \`Y$$b.                 CPU: AMD Ryzen 7 7840HS w/ Radeon 780M (16) @ 5.1GHz
          \`"Y$b._             GPU: AMD Radeon 780M Graphics
              \`"""            Memory: 3420MiB / 15920MiB (21%)`,
      };

    case 'apt':
    case 'apt-get':
      if (args[0] === 'update') {
        return {
          output: `Obtendo:1 http://deb.debian.org/debian trixie InRelease [158 kB]
Obtendo:2 http://deb.debian.org/debian-security trixie-security InRelease [48.2 kB]
Obtendo:3 http://deb.debian.org/debian trixie-updates InRelease [44.8 kB]
Baixados 251 kB em 0s (1.840 kB/s)
Lendo listas de pacotes... Pronto
Construindo árvore de dependências... Pronto
Todos os pacotes estão atualizados.`,
        };
      }
      if (args[0] === 'list') {
        return {
          output: `Listando pacotes instalados...
${installedApps.map((app) => `${app}/trixie,now 1.0.4-1 amd64 [instalado]`).join('\n')}`,
        };
      }
      if (args[0] === 'install') {
        const target = args[1] || 'software-pacote';
        return {
          output: `Lendo listas de pacotes... Pronto
Construindo árvore de dependências... Pronto
Os seguintes pacotes adicionais serão instalados:
  lib${target}-core
0 pacotes atualizados, 1 novos instalados, 0 a serem removidos.
Baixando ${target}...
Desempacotando e configurando ${target}...
[OK] ${target} foi instalado com sucesso.`,
        };
      }
      return { output: `Uso: apt [update | list | install <pacote>]` };

    default:
      return {
        output: `bash: comando não encontrado: ${command}. Digite 'help' para comandos úteis.`,
      };
  }
}
