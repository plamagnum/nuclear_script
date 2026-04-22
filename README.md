# ⚛️ Nuclear Script — 3D-демо АЕС

Інтерактивні Three.js-візуалізації атомної електростанції та ядерного реактора, створені для навчальних цілей.

## Демо-сцени

| Файл | Назва | Опис |
|------|-------|------|
| [`plant-basic.html`](plant-basic.html) | АЕС — базова сцена | Реакторний корпус, дві градирні з анімованою парою, машинний зал, димова труба, ставок-охолоджувач, допоміжні будівлі, периметровий паркан, підписи до головних об'єктів |
| [`plant-extended.html`](plant-extended.html) | АЕС — розширена сцена | Усе з базової сцени + підстанція з трансформаторами та шинами, адмінкорпус, склад, ЛЕП, дороги, ліхтарі, додаткові підписи |
| [`reactor-cutaway.html`](reactor-cutaway.html) | Реактор — розріз | Спрощена 3D-модель PWR-реактора у розрізі: корпус реактора, теплоносій, активна зона, паливні та керуючі стрижні, CSS2D-підписи, перемикачі видимості шарів |

Відкрийте [`index.html`](index.html) для навігаційної сторінки зі списком усіх сцен.

## Керування

| Дія | Пристрій |
|-----|---------|
| Обертання | ЛКМ (drag) |
| Масштаб | Колесо миші / pinch |
| Панорама | ПКМ (drag) / два пальці |
| Показати / приховати підписи | Чекбокс `Підписи` у сценах АЕС |
| Скинути камеру | Кнопка `⟳ Скинути камеру` |

## Запуск

### Встановлення залежностей

```bash
npm install
```

### Режим розробки

```bash
npm run dev
```

Після запуску відкрийте адресу, яку покаже Vite (типово <http://localhost:5173>). Усі демо працюють як multi-page app:

- `/`
- `/plant-basic.html`
- `/plant-extended.html`
- `/reactor-cutaway.html`

### Production build

```bash
npm run build
```

Зібрані файли з'являться в директорії `dist/`.

## Технологічний стек

- [Three.js](https://threejs.org/) `0.160.0`
- [Vite](https://vitejs.dev/) — локальна збірка та dev server без CDN-імпортів
- `OrbitControls` — навігація камерою
- `CSS2DRenderer` — HTML-підписи у 3D-просторі
- Чистий HTML/CSS/JS з ES-модулями

## Структура проєкту

```text
nuclear_script/
├── index.html
├── plant-basic.html
├── plant-extended.html
├── reactor-cutaway.html
├── package.json
├── vite.config.js
├── js/
│   ├── common/
│   │   ├── instancing.js
│   │   ├── labels.js
│   │   ├── materials.js
│   │   └── setup.js
│   └── scenes/
│       ├── plant-basic.js
│       ├── plant-extended.js
│       ├── plant-shared.js
│       └── reactor-cutaway.js
└── README.md
```

## Що вже покращено

- Спільний Three.js bootstrap винесено в `js/common/setup.js`
- Матеріали централізовано в `js/common/materials.js`
- Загальні helper'и для CSS2D-підписів винесено в `js/common/labels.js`
- Повторювані об'єкти оптимізовано через `THREE.InstancedMesh`:
  - паркани
  - ліхтарі
  - структурні елементи опор ЛЕП
- CDN-імпорти прибрано; сцени працюють через локальні npm-залежності
- До базової та розширеної сцен додано підписи до ключових об'єктів

## Перевірка

Перевірено локально:

```bash
npm run build
```

Також вручну перевірено рендеринг сторінок `index.html`, `plant-basic.html`, `plant-extended.html` і `reactor-cutaway.html` через Vite dev server.

## Ліцензія

Навчальний/демонстраційний проєкт. Використання Three.js підпадає під [MIT License](https://github.com/mrdoob/three.js/blob/dev/LICENSE).
